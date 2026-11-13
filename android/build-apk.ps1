# Construye 4Patitas.apk: WebView + index.html de un solo archivo en assets.
# Uso: node build.js (en la raíz)  y luego  powershell -File android\build-apk.ps1
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$proj = Split-Path $root
$sdk  = "$env:LOCALAPPDATA\Android\Sdk"
$bt   = "$sdk\build-tools\36.0.0"
$jar  = "$sdk\platforms\android-35\android.jar"
$jbr  = "C:\Program Files\Android\Android Studio\jbr"
$env:JAVA_HOME = $jbr
$version = '2.3'; $code = 8
$out  = "$root\build"
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Force "$out\obj","$out\dex","$out\assets" | Out-Null

# 1) assets = la app completa en un archivo
Copy-Item "$proj\index.html" "$out\assets\index.html" -Force

# 2) Java -> dex
$srcs = Get-ChildItem "$root\src" -Recurse -Filter *.java | ForEach-Object FullName
& "$jbr\bin\javac.exe" --release 8 -Xlint:-options -cp $jar -d "$out\obj" $srcs
if ($LASTEXITCODE) { throw 'javac falló' }
$classes = Get-ChildItem "$out\obj" -Recurse -Filter *.class | ForEach-Object FullName
& "$bt\d8.bat" --min-api 24 --lib $jar --output "$out\dex" $classes
if ($LASTEXITCODE) { throw 'd8 falló' }

# 3) recursos + manifiesto + assets
& "$bt\aapt2.exe" compile --dir "$root\res" -o "$out\res.zip"
if ($LASTEXITCODE) { throw 'aapt2 compile falló' }
& "$bt\aapt2.exe" link -o "$out\base.apk" -I $jar --manifest "$root\AndroidManifest.xml" -R "$out\res.zip" --auto-add-overlay -A "$out\assets" --min-sdk-version 24 --target-sdk-version 34 --version-code $code --version-name $version
if ($LASTEXITCODE) { throw 'aapt2 link falló' }

# 4) reempaquetar (rutas '/', resources.arsc sin comprimir) y agregar classes.dex
python "$root\fixzip.py" "$out\base.apk" "$out\dex\classes.dex" "$out\fixed.apk"
if ($LASTEXITCODE) { throw 'fixzip falló' }

# 5) alinear y firmar (la llave queda solo en esta PC: sin ella no se pueden publicar actualizaciones)
# La contraseña de la llave no se guarda en el repositorio: se toma de PATITAS_KS_PASS o se pide al firmar.
$ks = "$root\4patitas.jks"
$pass = $env:PATITAS_KS_PASS
if (-not $pass) {
  $sec = Read-Host -AsSecureString 'Contraseña de la llave de firma (4patitas.jks)'
  $pass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}
if ($pass.Length -lt 6) { throw 'La contraseña de la llave debe tener al menos 6 caracteres' }
$env:PATITAS_KS_PASS = $pass
if (-not (Test-Path $ks)) {
  & "$jbr\bin\keytool.exe" -genkeypair -keystore $ks -storepass:env PATITAS_KS_PASS -keypass:env PATITAS_KS_PASS -alias patitas -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=4 Patitas, O=4 Patitas, L=Santa Cruz de la Sierra, C=BO"
  if ($LASTEXITCODE) { throw 'keytool falló' }
}
& "$bt\zipalign.exe" -f -p 4 "$out\fixed.apk" "$out\aligned.apk"
if ($LASTEXITCODE) { throw 'zipalign falló' }
$final = "$proj\4Patitas.apk"
& "$bt\apksigner.bat" sign --ks $ks --ks-pass env:PATITAS_KS_PASS --key-pass env:PATITAS_KS_PASS --ks-key-alias patitas --out $final "$out\aligned.apk"
if ($LASTEXITCODE) { throw 'apksigner falló' }
& "$bt\apksigner.bat" verify $final
if ($LASTEXITCODE) { throw 'la firma no es válida' }
"APK listo: $final ($([math]::Round((Get-Item $final).Length/1KB)) KB)"
