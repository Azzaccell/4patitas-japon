"""Ícono de la app a partir del logotipo "Cuatro Patitas" (tarjeta de lino con círculo y huella).
La huella pasa de verde a rojo bermellón, como un sello hanko. Uso: python icono.py logo.webp"""
import os, sys, colorsys
from PIL import Image, ImageDraw, ImageFilter
src = Image.open(sys.argv[1]).convert("RGB")
CX, CY, HALF = 535, 515, 380
art = src.crop((CX - HALF, CY - HALF, CX + HALF, CY + HALF))
# huella verde → bermellón, conservando la luz y la textura del pigmento
px = art.load()
for y in range(art.height):
    for x in range(art.width):
        r, g, b = px[x, y]
        h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if 0.2 < h < 0.45 and s > 0.15 and g > r + 12:
            nr, ng, nb = colorsys.hls_to_rgb(0.018, min(.62, l * 1.02), min(1, s * 1.25 + .1))
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255))
# la "tinta" del logo (líneas, letras, huella) se imprime en multiplicar sobre un lino nuevo y limpio
import random
lin = (238, 228, 206)
PAPER = src.crop((CX - 60, CY + 250, CX + 60, CY + 300)).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
ink = Image.new("RGB", art.size, (255, 255, 255)); pi = ink.load(); pa = art.load()
for y in range(art.height):
    for x in range(art.width):
        c = pa[x, y]
        if sum(PAPER) - sum(c) < 45: continue  # papel y su trama: fuera
        if (x - HALF) ** 2 + (y - HALF) ** 2 > 500 ** 2: continue  # esquinas: madera de la foto
        pi[x, y] = tuple(min(255, round(255 * c[i] / PAPER[i])) for i in range(3))
S = 1100
random.seed(4)
canvas = Image.new("RGB", (S, S), lin); pc = canvas.load()
for y in range(S):  # trama de lino: hilos finos horizontales y verticales + grano
    for x in range(S):
        v = random.randint(-5, 5) + (-4 if y % 7 == 0 else 0) + (-3 if x % 9 == 0 else 0)
        pc[x, y] = tuple(max(0, min(255, lin[i] + v)) for i in range(3))
SC = .76
ink = ink.resize((round(art.width * SC),) * 2, Image.LANCZOS)
layer = Image.new("RGB", (S, S), (255, 255, 255)); layer.paste(ink, ((S - ink.width) // 2, (S - ink.height) // 2))
from PIL import ImageChops
canvas = ImageChops.multiply(canvas, layer)
canvas.save("icono-completo.png")
dens = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
for d, k in dens.items():
    os.makedirs(f"res/mipmap-{d}", exist_ok=True)
    canvas.resize((round(108 * k),) * 2, Image.LANCZOS).save(f"res/mipmap-{d}/ic_launcher_bg.png")
    n = round(48 * k); big = canvas.crop((150, 150, S - 150, S - 150)).resize((n, n), Image.LANCZOS)
    m = Image.new("L", (n, n), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, n - 1, n - 1), radius=round(n * .22), fill=255)
    out = Image.new("RGBA", (n, n), (0, 0, 0, 0)); out.paste(big, (0, 0), m); out.save(f"res/mipmap-{d}/ic_launcher.png")
    fg = f"res/mipmap-{d}/ic_launcher_fg.png"
    if os.path.exists(fg): os.remove(fg)
os.makedirs("res/drawable", exist_ok=True)
open("res/drawable/transparente.xml", "w").write('<?xml version="1.0" encoding="utf-8"?>\n<color xmlns:android="http://schemas.android.com/apk/res/android" android:color="#00000000" />\n')
open("res/mipmap-anydpi-v26/ic_launcher.xml", "w").write('''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_bg" />
    <foreground android:drawable="@drawable/transparente" />
</adaptive-icon>
''')
# para la web: favicon e ícono al agregar a la pantalla de inicio
web = canvas.crop((150, 150, S - 150, S - 150)).resize((192, 192), Image.LANCZOS)
m = Image.new("L", (192, 192), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 191, 191), radius=42, fill=255)
fav = Image.new("RGBA", (192, 192), (0, 0, 0, 0)); fav.paste(web, (0, 0), m); fav.save("../assets/icono.png", optimize=True)
print("ok", lin)
