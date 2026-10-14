# Prepara una ilustración de Gemini: recorta, pasa el blanco a transparente y guarda WebP.
# Uso: python tools/recortar.py imagen.png assets/head-x.webp [alto=150]
import sys
from PIL import Image, ImageChops
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB")
w, h = im.size
im = im.crop((4, 4, w - 4, h - 4))  # descarta bordes del escaneo
# recorte al contenido
diff = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 18 else 0)
x0, y0, x1, y1 = diff.getbbox()
pad = 6
im = im.crop((max(0, x0 - pad), max(0, y0 - pad), min(im.width, x1 + pad), min(im.height, y1 + pad)))
# blanco → transparente (color-to-alpha)
px = im.load(); out = Image.new("RGBA", im.size); po = out.load()
for y in range(im.height):
    for x in range(im.width):
        r, g, b = px[x, y]
        a = 255 - min(r, g, b)
        if a < 10: po[x, y] = (0, 0, 0, 0); continue
        f = a / 255
        un = lambda c: max(0, min(255, round((c - 255 * (1 - f)) / f)))
        po[x, y] = (un(r), un(g), un(b), a)
H = int(sys.argv[3]) if len(sys.argv) > 3 else 150
out = out.resize((round(out.width * H / out.height), H), Image.LANCZOS)
out.save(dst, "WEBP", quality=88, method=6)
print(out.size)
