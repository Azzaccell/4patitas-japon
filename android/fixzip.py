import sys, zipfile
src, dex, dst = sys.argv[1:4]
with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w") as zout:
    for info in zin.infolist():
        name = info.filename.replace("\\", "/")
        data = zin.read(info.filename)
        # resources.arsc debe ir SIN comprimir (obligatorio desde Android 11)
        method = zipfile.ZIP_STORED if name == "resources.arsc" else zipfile.ZIP_DEFLATED
        zout.writestr(zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0)), data, compress_type=method)
    with open(dex, "rb") as f:
        zout.writestr(zipfile.ZipInfo("classes.dex", date_time=(2026, 1, 1, 0, 0, 0)), f.read(), compress_type=zipfile.ZIP_DEFLATED)
