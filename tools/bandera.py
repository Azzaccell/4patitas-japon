"""Pinta las letras huecas del título con la bandera de Santa Cruz (verde/blanco/verde)."""
# Uso: python tools/bandera.py titulo-color.png salida.png 745   (745 = x donde terminan las letras)
import sys
from collections import deque
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGB"); W, H = im.size; px = im.load()
lum = lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2]
L = [[lum(px[x, y]) for x in range(W)] for y in range(H)]
wall = lambda x, y: L[y][x] < 165
# fondo: blanco alcanzable desde el borde
bg = [[False]*W for _ in range(H)]
q = deque((x, y) for x in range(W) for y in (0, H-1)); q.extend((x, y) for y in range(H) for x in (0, W-1))
while q:
    x, y = q.popleft()
    if bg[y][x] or wall(x, y) or min(px[x, y]) < 236: continue
    bg[y][x] = True
    for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if 0 <= nx < W and 0 <= ny < H and not bg[ny][nx]: q.append((nx, ny))
# componentes de relleno (encerrados por la tinta)
lab = [[0]*W for _ in range(H)]; comps = []
for y in range(H):
    for x in range(W):
        if lab[y][x] or bg[y][x] or wall(x, y): continue
        n = len(comps) + 1; pts = []; q = deque([(x, y)]); lab[y][x] = n
        while q:
            cx, cy = q.popleft(); pts.append((cx, cy))
            for nx, ny in ((cx+1,cy),(cx-1,cy),(cx,cy+1),(cx,cy-1)):
                if 0 <= nx < W and 0 <= ny < H and not lab[ny][nx] and not bg[ny][nx] and not wall(nx, ny):
                    lab[ny][nx] = n; q.append((nx, ny))
        comps.append(pts)
XMAX = int(sys.argv[3])
letters = [p for p in comps if len(p) > 400 and max(x for x, _ in p) < XMAX]
for p in sorted(comps, key=len, reverse=True)[:14]:
    xs=[x for x,_ in p]; print(len(p), min(xs), max(xs), p in letters)
ys = [y for p in letters for _, y in p]; top, bot = min(ys), max(ys); h = bot - top
GREEN, WHITE = (86, 158, 98), (253, 252, 246)
stripe = lambda y: GREEN if (y - top) < h/3 or (y - top) > 2*h/3 else WHITE
mark = set()
for p in letters:
    for x, y in p: px[x, y] = stripe(y); mark.add((x, y))
# borde suave: los píxeles de transición junto a la tinta toman el color de la franja mezclado con la tinta
INK = 45; FILL = 225
for x, y in list(mark):
    for dx in (-2,-1,0,1,2):
        for dy in (-2,-1,0,1,2):
            nx, ny = x+dx, y+dy
            if 0 <= nx < W and 0 <= ny < H and (nx, ny) not in mark and not bg[ny][nx] and wall(nx, ny) and L[ny][nx] > INK:
                k = max(0, min(1, (FILL - L[ny][nx]) / (FILL - INK))); c = stripe(ny)
                px[nx, ny] = tuple(round(c[i]*(1-k) + 30*k) for i in range(3)); mark.add((nx, ny))
im.save(dst); print("ok", top, bot)
