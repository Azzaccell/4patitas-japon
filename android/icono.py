"""Genera el ícono de la app con el gato y el perro del título (adaptativo + PNG clásicos)."""
import os, sys
from PIL import Image, ImageDraw
src = sys.argv[1]
im = Image.open(src).convert("RGB")
# borrar la "s" final del título, que queda delante del gato: su relleno encerrado por la tinta + 5 px de contorno
from collections import deque
W, H = im.size; p0 = im.load()
lum = lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2]
seen = set(); S = set()
for y0 in range(H):
    for x0 in range(660, 745):
        c = p0[x0, y0]
        if (x0, y0) in seen or lum(c) < 165 or min(c) >= 236: continue
        comp = []; q = deque([(x0, y0)]); seen.add((x0, y0))
        while q:
            x, y = q.popleft(); comp.append((x, y))
            for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
                if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in seen:
                    c2 = p0[nx, ny]
                    if lum(c2) >= 165 and min(c2) < 236: seen.add((nx, ny)); q.append((nx, ny))
        xs = [x for x, _ in comp]
        if len(comp) > 400 and min(xs) >= 650 and max(xs) <= 748: S.update(comp)
for x, y in list(S):
    for dx in range(-5, 6):
        for dy in range(-5, 6):
            if 0 <= x+dx < W and 0 <= y+dy < H: p0[x+dx, y+dy] = (255, 255, 255)
print("s borrada:", len(S), "px")
im = im.crop((712, 14, 1000, 246))  # solo los animales
px = im.load(); fg = Image.new("RGBA", im.size); po = fg.load()
for y in range(im.height):
    for x in range(im.width):
        r, g, b = px[x, y]; a = 255 - min(r, g, b)
        if a < 10: continue
        f = a / 255; un = lambda c: max(0, min(255, round((c - 255 * (1 - f)) / f)))
        po[x, y] = (un(r), un(g), un(b), a)
fg = fg.crop(fg.getbbox())
PAPER = (250, 248, 243, 255)
def place(size, frac):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    s = frac * size / max(fg.size); art = fg.resize((round(fg.width * s), round(fg.height * s)), Image.LANCZOS)
    canvas.alpha_composite(art, ((size - art.width) // 2, (size - art.height) // 2 + round(size * .02)))
    return canvas
dens = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
for d, k in dens.items():
    os.makedirs(f"res/mipmap-{d}", exist_ok=True)
    place(round(108 * k), .62).save(f"res/mipmap-{d}/ic_launcher_fg.png")  # zona segura del ícono adaptativo
    n = round(48 * k); legacy = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    ImageDraw.Draw(legacy).ellipse((1, 1, n - 2, n - 2), fill=PAPER, outline=(202, 215, 198, 255), width=max(1, round(k)))
    legacy.alpha_composite(place(n, .78)); legacy.save(f"res/mipmap-{d}/ic_launcher.png")
os.makedirs("res/mipmap-anydpi-v26", exist_ok=True)
open("res/mipmap-anydpi-v26/ic_launcher.xml", "w").write('''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/paper" />
    <foreground android:drawable="@mipmap/ic_launcher_fg" />
</adaptive-icon>
''')
os.makedirs("res/values", exist_ok=True)
open("res/values/colors.xml", "w").write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="paper">#FAF8F3</color>\n</resources>\n')
place(512, .7).save("icono-preview.png")
print("ok", fg.size)
