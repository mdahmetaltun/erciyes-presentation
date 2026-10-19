#!/usr/bin/env python3
"""Sunum için vektörel (SVG) illüstrasyon üretici.

Tüm görseller aynı palet ve aynı görsel dilde (koyu lacivert zemin, camsı kartlar,
neon cyan / mavi / turkuaz vurgu) çizilir; SVG olduğu için her ekranda ve
projeksiyonda keskin kalır. Çalıştır:  python3 tools/gen_illustrations.py
"""
import math, os, random

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'web', 'assets', 'img')

CY, BL, TL, AM, CO, VI, WH = '#3de8f5', '#4d8dff', '#2fd3c0', '#f4c542', '#ff4d6d', '#7952ff', '#eaf4ff'
COLS = {'cy': CY, 'bl': BL, 'tl': TL, 'am': AM, 'co': CO, 'vi': VI}

SQ, WIDE, TALL = (1000, 1000), (1600, 700), (800, 1000)


def f(n):
    return f'{n:.1f}'.rstrip('0').rstrip('.')


def defs(c1, c2):
    g = ''.join(
        f'<radialGradient id="rg_{k}"><stop offset="0" stop-color="{v}" stop-opacity=".55"/><stop offset="1" stop-color="{v}" stop-opacity="0"/></radialGradient>'
        for k, v in COLS.items())
    g += ''.join(
        f'<linearGradient id="lg_{k}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{v}"/><stop offset="1" stop-color="{COLS["bl"] if k != "bl" else COLS["vi"]}"/></linearGradient>'
        for k, v in COLS.items())
    return f'''<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".13"/><stop offset="1" stop-color="#fff" stop-opacity=".03"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b19" stop-opacity="0"/><stop offset="1" stop-color="#050b19" stop-opacity=".3"/></linearGradient>
<pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.6" fill="#8fc2ff" fill-opacity=".22"/></pattern>
<filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
{g}</defs>'''


def svg(size, body, accent='cy', c1='#0c2350', c2='#050b19', glow2='bl'):
    w, h = size
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">
{defs(c1, c2)}
<rect width="{w}" height="{h}" fill="url(#bg)"/>
<rect width="{w}" height="{h}" fill="url(#dots)"/>
<circle cx="{w*.22}" cy="{h*.2}" r="{min(w,h)*.55}" fill="url(#rg_{accent})"/>
<circle cx="{w*.82}" cy="{h*.88}" r="{min(w,h)*.5}" fill="url(#rg_{glow2})"/>
{body}
<rect width="{w}" height="{h}" fill="url(#fade)"/>
</svg>'''


# ---------- temel parçalar ----------
def glass(x, y, w, h, r=30, col=CY, op=.55, sw=3):
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{r}" fill="url(#glass)" stroke="{col}" stroke-opacity="{op}" stroke-width="{sw}"/>'


def circ(x, y, r, fill='none', stroke=None, sw=4, op=1, glow=False):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{fill}"{s} opacity="{op}"' + (' filter="url(#glow)"' if glow else '') + '/>'


def path(d, stroke=CY, sw=6, fill='none', op=1, dash=None, glow=False):
    ds = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"'
            f' opacity="{op}"{ds}' + (' filter="url(#glow)"' if glow else '') + '/>')


def line(x1, y1, x2, y2, stroke=CY, sw=5, op=1, dash=None):
    return path(f'M{f(x1)} {f(y1)} L{f(x2)} {f(y2)}', stroke, sw, op=op, dash=dash)


def rect(x, y, w, h, r=10, fill=CY, op=1, stroke=None, sw=3):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{r}" fill="{fill}" opacity="{op}"{s}/>'


def text(x, y, s, size=40, fill=WH, weight=700, anchor='middle', op=1):
    return (f'<text x="{f(x)}" y="{f(y)}" font-family="Outfit,Plus Jakarta Sans,Arial,sans-serif" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" opacity="{op}" letter-spacing="2">{s}</text>')


def halo(x, y, r, k='cy'):
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="url(#rg_{k})"/>'


def check(x, y, s=1, col=TL, sw=9):
    return path(f'M{f(x-22*s)} {f(y)} L{f(x-6*s)} {f(y+18*s)} L{f(x+24*s)} {f(y-20*s)}', col, sw, glow=True)


def heart(x, y, s=1, fill=CO, op=1):
    return (f'<path transform="translate({f(x)} {f(y)}) scale({s})" opacity="{op}" fill="{fill}" '
            f'd="M0 40 C-60 -5 -50 -50 -22 -50 C-8 -50 0 -38 0 -32 C0 -38 8 -50 22 -50 C50 -50 60 -5 0 40Z"/>')


def ecg(x, y, w, amp=60, col=TL, sw=6):
    u = w / 10
    d = (f'M{f(x)} {f(y)} L{f(x+u*2)} {f(y)} L{f(x+u*2.6)} {f(y-amp*.3)} L{f(x+u*3.2)} {f(y)} L{f(x+u*4)} {f(y)} '
         f'L{f(x+u*4.4)} {f(y+amp*.4)} L{f(x+u*5)} {f(y-amp)} L{f(x+u*5.6)} {f(y+amp*.8)} L{f(x+u*6)} {f(y)} '
         f'L{f(x+u*7.2)} {f(y)} L{f(x+u*7.8)} {f(y-amp*.35)} L{f(x+u*8.4)} {f(y)} L{f(x+w)} {f(y)}')
    return path(d, col, sw, glow=True)


def pill(x, y, w, h, c1=CO, c2=WH, rot=0):
    r = h / 2
    return (f'<g transform="rotate({rot} {f(x+w/2)} {f(y+h/2)})">'
            f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{f(r)}" fill="{c2}"/>'
            f'<path d="M{f(x+w/2)} {f(y)} H{f(x+r)} A{f(r)} {f(r)} 0 0 0 {f(x+r)} {f(y+h)} H{f(x+w/2)}Z" fill="{c1}"/></g>')


def nurse_cross(x, y, s=1, col=WH):
    return (f'<g transform="translate({f(x)} {f(y)}) scale({s})"><rect x="-14" y="-40" width="28" height="80" rx="9" fill="{col}"/>'
            f'<rect x="-40" y="-14" width="80" height="28" rx="9" fill="{col}"/></g>')


def person(x, y, s=1, col=WH, op=.9):
    return (f'<g transform="translate({f(x)} {f(y)}) scale({s})" opacity="{op}"><circle cx="0" cy="-70" r="34" fill="{col}"/>'
            f'<path d="M-62 40 C-62 -22 62 -22 62 40 L62 70 L-62 70Z" fill="{col}"/></g>')


def sub(x, s, y, size=26):
    return text(x, y, s, size, '#9fd3ff', 500)


# ---------- sahneler: kare (1000x1000) ----------
def s_brain_chip():
    b = '<clipPath id="bc"><path id="bp" d="M500 200 C405 170 305 215 285 305 C225 325 195 400 225 460 C195 520 225 590 285 610 C305 690 405 725 470 685 L470 745 L530 745 L530 685 C595 725 695 690 715 610 C775 590 805 520 775 460 C805 400 775 325 715 305 C695 215 595 170 500 200Z"/></clipPath>'
    b += halo(500, 450, 420)
    b += '<use href="#bp" fill="url(#lg_cy)" opacity=".16"/><use href="#bp" fill="none" stroke="#3de8f5" stroke-width="7" filter="url(#glow)"/>'
    random.seed(4)
    pts = [(330 + (i % 5) * 85 + random.randint(-18, 18), 270 + (i // 5) * 65 + random.randint(-14, 14)) for i in range(25)]
    g = '<g clip-path="url(#bc)">'
    for i, (x, y) in enumerate(pts):
        if i % 5 < 4:
            g += line(x, y, *pts[i + 1], stroke=CY, sw=2.5, op=.55)
        if i + 5 < 25:
            g += line(x, y, *pts[i + 5], stroke=CY, sw=2.5, op=.55)
        if i % 5 < 4 and i + 6 < 25:
            g += line(x, y, *pts[i + 6], stroke=CY, sw=2, op=.3)
    for i, (x, y) in enumerate(pts):
        g += circ(x, y, 8 if i % 3 else 12, CY if i % 3 else WH, op=.95)
    b += g + '</g>' + path('M500 205 C480 300 520 380 500 470 C485 540 515 610 500 690', CY, 3, op=.5, dash='2 12')
    b += halo(500, 830, 170) + glass(390, 760, 220, 140, 24, CY, .8, 4)
    for i in range(6):
        b += line(415 + i * 34, 760, 415 + i * 34, 735, CY, 5) + line(415 + i * 34, 900, 415 + i * 34, 925, CY, 5)
    b += text(500, 850, 'AI', 64, CY)
    return svg(SQ, b)


def s_neural():
    layers, xs = [3, 5, 6, 5, 3], [170, 340, 500, 660, 830]
    pos = [[(x, 500 + (i - (n - 1) / 2) * 100) for i in range(n)] for n, x in zip(layers, xs)]
    b = halo(500, 500, 460)
    random.seed(9)
    for a, c in zip(pos, pos[1:]):
        for (x1, y1) in a:
            for (x2, y2) in c:
                b += line(x1, y1, x2, y2, CY, 1.8, random.choice([.18, .25, .35]))
    hot = [pos[0][1], pos[1][2], pos[2][3], pos[3][1], pos[4][1]]
    b += path('M' + ' L'.join(f'{x} {y}' for x, y in hot), AM, 6, glow=True)
    for L, col in zip(pos, [BL, CY, TL, CY, AM]):
        for (x, y) in L:
            b += circ(x, y, 26, '#08183a', col, 5) + circ(x, y, 9, col)
    b += text(170, 840, 'GİRDİ', 26, '#9fd3ff') + text(500, 840, 'GİZLİ KATMANLAR', 26, '#9fd3ff') + text(830, 840, 'ÇIKTI', 26, '#9fd3ff')
    return svg(SQ, b)


def s_data_lake():
    b = halo(500, 600, 420, 'bl')
    for x, h in [(300, 330), (500, 420), (700, 330)]:
        top = 700 - h
        b += f'<path d="M{x-90} {top} v{h-60} a90 34 0 0 0 180 0 v{-(h-60)}" fill="url(#glass)" stroke="{CY}" stroke-opacity=".7" stroke-width="4"/>'
        b += f'<ellipse cx="{x}" cy="{top}" rx="90" ry="34" fill="#0d2a5c" stroke="{CY}" stroke-width="4"/>'
        for k in range(1, 4):
            yy = top + k * (h - 60) / 4
            b += f'<path d="M{x-90} {f(yy)} a90 34 0 0 0 180 0" fill="none" stroke="{CY}" stroke-opacity=".35" stroke-width="3"/>'
    random.seed(2)
    for i in range(16):
        x = 120 + i * 50 + random.randint(-14, 14); y = 120 + (i * 53) % 220 + random.randint(-10, 10)
        s = random.choice([16, 22, 28]); col = random.choice([CY, BL, TL, AM, VI])
        b += rect(x, y, s, s, 6, col, .9) + line(x + s / 2, y + s, x + s / 2, y + s + random.randint(40, 90), col, 2.5, .35)
    b += text(500, 790, 'BÜYÜK VERİ', 44, CY) + sub(500, 'etiketli · etiketsiz · sürekli akan', 835)
    return svg(SQ, b, 'bl', glow2='cy')


def s_pattern():
    random.seed(11)
    b = halo(500, 480, 430) + glass(130, 170, 740, 560, 36)
    for i in range(7):
        b += line(170, 230 + i * 70, 830, 230 + i * 70, WH, 1.5, .08) + line(210 + i * 100, 200, 210 + i * 100, 700, WH, 1.5, .08)
    for i in range(46):
        b += circ(random.uniform(190, 810), random.uniform(240, 660), random.uniform(5, 9), WH, op=.35)
    for i in range(20):
        t = i / 19
        b += circ(230 + t * 540 + random.uniform(-26, 26), 620 - t * 330 + random.uniform(-40, 40), random.uniform(8, 13), CY, op=.95, glow=True)
    b += path('M215 640 L790 285', AM, 5, dash='16 12', glow=True)
    b += circ(640, 400, 118, 'none', CY, 6) + line(722, 484, 800, 570, CY, 14)
    b += text(500, 810, 'KORELASYON  ·  ÖRÜNTÜ', 38, CY) + sub(500, 'insan gözünün göremediği ilişkiler', 855)
    return svg(SQ, b)


def s_forecast():
    b = halo(560, 440, 440, 'bl') + glass(100, 180, 800, 560, 36)
    for i in range(5):
        b += line(150, 260 + i * 90, 850, 260 + i * 90, WH, 1.5, .08)
    past = [(150, 620), (230, 560), (310, 590), (390, 500), (470, 520), (550, 430)]
    b += path('M' + ' L'.join(f'{x} {y}' for x, y in past), CY, 8, glow=True)
    b += f'<path d="M550 430 L650 380 L760 300 L850 250 L850 440 L760 470 L650 480 Z" fill="{AM}" opacity=".2"/>'
    b += path('M550 430 C640 400 740 340 850 290', AM, 7, dash='4 14', glow=True)
    b += line(550, 200, 550, 700, WH, 2.5, .5, '8 10') + text(550, 175, 'ŞİMDİ', 24)
    for x, y in past:
        b += circ(x, y, 9, '#08183a', CY, 5)
    b += circ(850, 290, 16, AM, glow=True) + text(800, 235, 'TAHMİN', 28, AM)
    b += text(500, 820, 'GELECEĞİ ÖNGÖRÜR', 44, CY) + sub(500, 'geçmiş veriden yarına', 862)
    return svg(SQ, b, 'bl', glow2='am')


def s_diagnosis():
    b = halo(500, 480, 430) + glass(150, 140, 700, 640, 36, CY, .7)
    lung = lambda s: (f'<path d="M{500+s*40} 300 C{500+s*190} 280 {500+s*270} 420 {500+s*250} 560 C{500+s*235} 650 {500+s*130} 680 {500+s*60} 640 '
                      f'C{500+s*30} 560 {500+s*35} 420 {500+s*40} 300Z" fill="{BL}" fill-opacity=".22" stroke="{CY}" stroke-width="5" filter="url(#glow)"/>')
    b += lung(-1) + lung(1) + line(500, 200, 500, 640, CY, 6, .8)
    for k in range(5):
        b += path(f'M455 {350+k*50} C350 {340+k*50} 285 {380+k*50} 265 {420+k*50}', CY, 2.5, op=.45)
        b += path(f'M545 {350+k*50} C650 {340+k*50} 715 {380+k*50} 735 {420+k*50}', CY, 2.5, op=.45)
    b += heart(500, 520, .55, CO, .9)
    bx, by, bw, bh = 575, 380, 150, 130
    for (x, y, dx, dy) in [(bx, by, 1, 1), (bx + bw, by, -1, 1), (bx, by + bh, 1, -1), (bx + bw, by + bh, -1, -1)]:
        b += path(f'M{x} {y+dy*34} L{x} {y} L{x+dx*34} {y}', AM, 7, glow=True)
    b += circ(650, 445, 20, AM, op=.35) + circ(650, 445, 8, AM, glow=True)
    b += rect(560, 530, 190, 52, 14, '#2a1a05', .95, AM, 3) + text(655, 566, 'ŞÜPHELİ · %94', 24, AM)
    b += f'<rect x="170" y="600" width="660" height="40" fill="url(#lg_cy)" opacity=".18"/>' + rect(170, 640, 660, 5, 3, CY, .9)
    b += text(500, 850, 'GÖRÜNTÜ ANALİZİ', 42, CY) + sub(500, 'radyoloji · patoloji · laboratuvar', 892)
    return svg(SQ, b)


def s_treatment():
    b = halo(500, 460, 440, 'vi')
    for i in range(14):
        t = i / 13; y = 170 + t * 460; dx = math.sin(t * math.pi * 3) * 110
        b += line(330 - dx, y, 330 + dx, y, WH, 3, .25)
        b += circ(330 - dx, y, 11, CY, op=.5 + .5 * math.cos(t * math.pi * 3) ** 2) + circ(330 + dx, y, 11, CO, op=.5 + .5 * math.sin(t * math.pi * 3) ** 2)
    b += path('M' + ' L'.join(f'{330-math.sin(i/40*math.pi*3)*110:.1f} {170+i/40*460:.1f}' for i in range(41)), CY, 5, op=.7)
    b += path('M' + ' L'.join(f'{330+math.sin(i/40*math.pi*3)*110:.1f} {170+i/40*460:.1f}' for i in range(41)), CO, 5, op=.7)
    b += glass(520, 190, 360, 470, 30, CY, .7) + text(700, 250, 'KİŞİSEL PLAN', 30, CY)
    for i, col in enumerate([TL, BL, AM, CO]):
        y = 310 + i * 85
        b += circ(565, y, 22, 'none', col, 5) + check(565, y, .55, col, 6)
        b += rect(605, y - 14, 220 - i * 20, 12, 6, WH, .55) + rect(605, y + 8, 150 - i * 12, 10, 5, WH, .25)
    b += pill(570, 700, 150, 56, CO, WH, -18) + pill(740, 690, 120, 46, TL, WH, 14)
    b += text(500, 850, 'KİŞİYE ÖZEL TEDAVİ', 42, CY) + sub(500, 'veriden kişiselleştirilmiş plana', 892)
    return svg(SQ, b, 'vi', glow2='cy')


def s_admin():
    b = halo(500, 480, 430, 'bl') + glass(130, 170, 740, 560, 34) + rect(130, 170, 740, 90, 34, BL, .35)
    b += text(180, 230, 'HAFTA 42', 30, WH, 700, 'start')
    for i, d in enumerate('PSÇPC'):
        b += text(215 + i * 130, 310, d, 26, '#9fd3ff')
    random.seed(5)
    for r in range(4):
        for c in range(5):
            on = random.random() > .35
            b += rect(160 + c * 130, 335 + r * 90, 110, 70, 14, random.choice([CY, TL, BL, AM]) if on else WH, .75 if on else .08)
    teeth = ''.join(f'<rect x="-12" y="-96" width="24" height="34" rx="6" fill="{CY}" transform="rotate({a})"/>' for a in range(0, 360, 45))
    b += halo(780, 690, 140) + f'<g transform="translate(780 690)">{teeth}<circle r="72" fill="#08183a" stroke="{CY}" stroke-width="10"/><circle r="26" fill="none" stroke="{CY}" stroke-width="8"/></g>'
    b += text(500, 830, 'PLANLAMA · KAYNAK · FATURA', 38, CY) + sub(500, 'yönetsel süreçler otomatikleşir', 872)
    return svg(SQ, b, 'bl', glow2='cy')


def s_workflow():
    b = halo(500, 460, 430)
    nodes = [(200, 300, 'Evrak', CY), (500, 220, 'Plan', BL), (800, 300, 'Stok', TL), (350, 620, 'Hasta', AM), (700, 620, 'Bakım', CO)]
    for a, c in [(0, 1), (1, 2), (0, 3), (1, 3), (1, 4), (2, 4), (3, 4)]:
        b += line(nodes[a][0], nodes[a][1], nodes[c][0], nodes[c][1], WH, 3, .22, '4 10')
    b += path('M200 300 L500 220 L350 620 L700 620', CY, 6, glow=True, op=.9)
    for x, y, t, col in nodes:
        b += halo(x, y, 130) + circ(x, y, 74, '#08183a', col, 6) + text(x, y + 11, t, 30)
    b += circ(500, 800, 56, 'none', CY, 6) + line(500, 800, 500, 765, CY, 6) + line(500, 800, 528, 815, CY, 6)
    b += text(500, 920, 'RUTİN İŞ → OTOMASYON', 36, CY)
    return svg(SQ, b)


def s_pharmacy():
    b = halo(500, 480, 430, 'tl') + glass(120, 160, 760, 600, 36)
    b += rect(220, 300, 190, 330, 26, '#0d2a5c', 1, CY, 5) + rect(235, 245, 160, 70, 18, CY, .9)
    b += rect(245, 400, 140, 130, 14, WH, .9) + nurse_cross(315, 465, .8, CO)
    b += pill(480, 330, 190, 70, CO, WH, -14) + pill(520, 470, 160, 60, TL, WH, 18) + pill(650, 340, 120, 50, AM, WH, 28) + pill(500, 590, 170, 62, BL, WH, -6)
    b += rect(690, 520, 130, 90, 12, WH, .9)
    for i in range(12):
        b += rect(700 + i * 9.5, 530, 4 + (i % 3) * 2, 70, 1, '#050b19')
    b += rect(670, 560, 170, 5, 3, CO)
    b += halo(770, 215, 120, 'tl') + circ(770, 215, 58, '#06281f', TL, 7) + check(770, 217, 1.05, TL, 10)
    b += text(500, 830, 'DOĞRU İLAÇ · DOĞRU DOZ', 40, CY) + sub(500, 'hasta güvenliğinin dört doğrusu', 872)
    return svg(SQ, b, 'tl', glow2='cy')


def s_risk():
    b = halo(500, 460, 440, 'co') + path('M200 560 A300 300 0 0 1 800 560', WH, 44, op=.1)
    b += f'<path d="M200 560 A300 300 0 0 1 800 560" fill="none" stroke="url(#lg_tl)" stroke-width="44" stroke-linecap="round" stroke-dasharray="940" stroke-dashoffset="330" filter="url(#glow)"/>'
    b += path('M500 560 L650 340', AM, 10) + circ(500, 560, 28, '#08183a', AM, 8)
    b += text(500, 690, '%62', 110, AM) + text(500, 745, 'DÜŞME RİSKİ · ORTA', 28, '#9fd3ff')
    b += rect(260, 790, 480, 34, 12, WH, .85) + rect(240, 760, 40, 110, 8, WH, .85) + rect(720, 780, 40, 90, 8, WH, .85) + rect(305, 765, 120, 24, 12, CY)
    b += f'<path transform="translate(800 230)" d="M0 -62 L66 56 L-66 56Z" fill="#2a1a05" stroke="{AM}" stroke-width="8" stroke-linejoin="round" filter="url(#glow)"/>'
    b += rect(794, 210, 12, 40, 6, AM) + circ(800, 268, 7, AM)
    for i, t in enumerate(['+ ileri yaş', '+ sedatif ilaç', '+ önceki düşme']):
        b += text(170, 240 + i * 48, t, 28, WH, 600, 'start', .75)
    return svg(SQ, b, 'co', glow2='am')


def s_monitor():
    b = halo(500, 480, 430, 'tl') + rect(405, 130, 190, 130, 30, WH, .22) + rect(405, 720, 190, 140, 30, WH, .22)
    b += rect(340, 230, 320, 520, 80, '#071834', 1, CY, 7) + rect(365, 255, 270, 470, 62, '#040e22')
    b += text(500, 340, '72', 112, TL) + text(500, 385, 'bpm', 28, '#9fd3ff') + heart(500, 455, .75, CO)
    b += ecg(375, 560, 250, 55, TL, 5) + text(500, 665, 'SpO₂ %98', 30, CY)
    for i, r in enumerate((130, 190, 250)):
        b += path(f'M{500+r} {480-r*.6} A{r} {r} 0 0 1 {500+r} {480+r*.6}', CY, 6, op=.7 - i * .2)
    b += f'<path transform="translate(190 300)" d="M0 -64 C-46 -4 -50 30 -26 52 C-6 70 26 66 40 40 C54 14 34 -22 0 -64Z" fill="{CO}" filter="url(#glow)"/>' + text(190, 335, 'mg/dL', 22)
    b += text(500, 940, 'SÜREKLİ · UZAKTAN · ANLIK', 34, CY)
    return svg(SQ, b, 'tl', glow2='cy')


def s_assist():
    b = halo(500, 460, 430, 'cy')
    b += rect(150, 190, 520, 140, 40, WH, .12, CY, 4) + text(410, 275, 'Ağrım arttı, ne yapmalıyım?', 30, WH, 600)
    b += rect(330, 380, 520, 170, 40, CY, .2, CY, 4) + text(590, 455, 'Hemşireniz bilgilendirildi.', 30, WH, 600) + sub(590, 'Ortalama yanıt: 2 dk', 500)
    b += halo(780, 640, 150) + circ(780, 640, 78, '#08183a', CY, 7) + nurse_cross(780, 640, .8, CY)
    b += person(240, 670, 1.2, WH, .85) + heart(235, 775, .5, CO, .95)
    for i in range(3):
        b += circ(430 + i * 40, 690, 9, CY, op=.4 + i * .3)
    b += text(500, 900, '7/24 HASTA YANINDA', 40, CY)
    return svg(SQ, b)


def s_ckds():
    b = halo(500, 460, 440, 'bl') + glass(140, 160, 720, 520, 36)
    root, mid, leaf = (500, 250), [(330, 400), (670, 400)], [(240, 580), (420, 580), (580, 580), (760, 580)]
    for m in mid:
        b += line(*root, *m, CY, 4, .8)
    for i, l in enumerate(leaf):
        b += line(*mid[i // 2], *l, CY, 4, .8)
    b += path('M500 250 L670 400 L580 580', AM, 6, glow=True) + circ(*root, 36, '#08183a', CY, 6)
    for m in mid:
        b += circ(*m, 30, '#08183a', BL, 6)
    for i, l in enumerate(leaf):
        col = AM if i == 2 else TL
        b += rect(l[0] - 56, l[1] - 30, 112, 60, 16, col, .22, col, 4)
        if i == 2:
            b += check(l[0], l[1] + 2, .55, col, 6)
    b += circ(*root, 12, CY)
    b += f'<g transform="translate(830 790)" filter="url(#glow)"><path d="M0 -92 C-44 -92 -68 -58 -68 -24 C-68 8 -46 18 -46 52 L46 52 C46 18 68 8 68 -24 C68 -58 44 -92 0 -92Z" fill="{AM}"/><rect x="-28" y="62" width="56" height="14" rx="6" fill="{WH}"/></g>'
    b += text(420, 830, 'KANITA DAYALI ÖNERİ', 40, CY) + sub(420, 'veri + klinik bilgi → karar', 872)
    return svg(SQ, b, 'bl', glow2='am')


def s_safety():
    b = halo(500, 470, 440, 'tl')
    b += f'<path d="M500 220 L800 320 L800 560 C800 700 660 790 500 850 C340 790 200 700 200 560 L200 320Z" fill="url(#glass)" stroke="{TL}" stroke-width="8" filter="url(#glow)"/>'
    b += f'<path d="M500 270 L750 350 L750 555 C750 665 635 740 500 790 C365 740 250 665 250 555 L250 350Z" fill="{TL}" opacity=".12"/>'
    b += check(500, 540, 3.2, TL, 22)
    b += pill(215, 100, 130, 50, CO, WH, -12) + pill(345, 80, 130, 50, AM, WH, 14)
    b += rect(620, 110, 190, 56, 28, '#2a0a12', .95, CO, 4) + text(715, 148, 'ETKİLEŞİM!', 26, CO)
    b += text(500, 925, 'HATA ÖNLENİR', 40, CY)
    return svg(SQ, b, 'tl', glow2='cy')


def s_ehr():
    b = halo(500, 470, 430, 'bl')
    for x, y, rot, col in [(170, 230, -9, BL), (300, 190, -3, CY), (440, 170, 4, TL), (570, 195, 10, AM)]:
        b += f'<g transform="rotate({rot} {x+110} {y+140})">' + glass(x, y, 220, 280, 22, col, .75) + rect(x + 24, y + 30, 120, 14, 7, col, .9)
        for k in range(5):
            b += rect(x + 24, y + 70 + k * 30, 172 - (k % 3) * 28, 9, 4, WH, .35)
        b += '</g>'
    b += path('M280 540 C360 640 440 640 500 700 M410 520 C440 620 480 650 500 700 M550 520 C540 620 510 650 500 700 M690 520 C650 620 560 650 500 700', CY, 3.5, op=.65, dash='3 10')
    b += glass(330, 700, 340, 170, 28, CY, .9, 4) + heart(430, 784, .6, CO) + ecg(470, 790, 160, 40, CY, 4)
    b += text(500, 940, 'TEK, BÜTÜNLEŞİK HASTA KAYDI', 32, CY)
    return svg(SQ, b, 'bl', glow2='cy')


def s_kpi():
    b = halo(500, 470, 430) + circ(500, 460, 250, 'none', CY, 4, .35) + circ(500, 460, 180, 'none', CY, 4, .55) + circ(500, 460, 110, 'none', CY, 4, .8) + circ(500, 460, 36, CO, glow=True)
    b += line(500, 460, 760, 210, AM, 10) + path('M735 205 L775 195 L765 235', AM, 10)
    for x, h, col in [(200, 130, BL), (265, 200, CY), (330, 270, TL), (395, 340, AM)]:
        b += rect(x, 800 - h, 46, h, 12, col, .9)
    b += path('M205 650 L290 580 L350 560 L420 470', WH, 4, op=.6, dash='6 10')
    b += glass(580, 640, 250, 160, 28, CY, .7) + text(705, 735, '%96', 70, CY) + sub(705, 'hedef karşılandı', 780, 24)
    b += text(500, 900, 'ÖLÇ · İZLE · HEDEFE ULAŞ', 34, CY)
    return svg(SQ, b)


def s_quality():
    b = halo(500, 470, 430, 'tl')
    for i, c in enumerate([CY, TL, AM, BL]):
        a0, a1, r = math.radians(i * 90 + 12), math.radians(i * 90 + 78), 270
        x0, y0, x1, y1 = 500 + r * math.cos(a0), 470 + r * math.sin(a0), 500 + r * math.cos(a1), 470 + r * math.sin(a1)
        b += path(f'M{x0:.1f} {y0:.1f} A{r} {r} 0 0 1 {x1:.1f} {y1:.1f}', c, 30, glow=True) + f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="22" fill="{c}"/>'
    b += circ(500, 470, 150, '#08183a', CY, 6) + check(500, 470, 2.3, TL, 16)
    for i, t in enumerate(['PLANLA', 'UYGULA', 'DEĞERLENDİR', 'İYİLEŞTİR']):
        a = math.radians(i * 90 + 45)
        b += text(500 + 335 * math.cos(a), 470 + 335 * math.sin(a) + 10, t, 24, '#9fd3ff')
    b += text(500, 940, 'SÜREKLİ KALİTE DÖNGÜSÜ', 34, CY)
    return svg(SQ, b, 'tl', glow2='cy')


def s_benchmark():
    b = halo(500, 470, 430, 'am')
    for x, h, col, n in [(160, 260, BL, 'A'), (300, 380, CY, 'B'), (440, 470, AM, 'SİZ'), (580, 330, TL, 'D'), (720, 420, VI, 'E')]:
        b += rect(x, 760 - h, 100, h, 16, col, 1 if n == 'SİZ' else .8) + text(x + 50, 810, n, 26)
    b += line(130, 330, 870, 330, CO, 5, 1, '14 10') + text(860, 305, 'REFERANS', 24, CO, 700, 'end')
    b += circ(490, 262, 34, AM, glow=True) + path('M474 262 L486 275 L508 250', '#050b19', 7)
    b += text(500, 910, 'STANDARTLA KIYASLA', 36, CY)
    return svg(SQ, b, 'am', glow2='cy')


def s_learn():
    """Geri bildirimle öğrenme döngüsü."""
    b = halo(500, 470, 430, 'vi')
    for i in range(3):
        b += circ(500, 470, 130 + i * 70, 'none', VI if i % 2 else CY, 3, .5 - i * .12)
    b += path('M760 470 A260 260 0 1 1 640 250', CY, 14, glow=True) + path('M640 250 L700 230 M640 250 L650 312', CY, 14)
    for x, h in [(380, 90), (450, 150), (520, 215), (590, 290)]:
        b += rect(x, 640 - h, 50, h, 12, [BL, CY, TL, AM][(x - 380) // 70], .9)
    b += path('M385 520 L455 460 L525 410 L600 330', WH, 4, op=.6, dash='6 10') + circ(600, 330, 14, AM, glow=True)
    b += text(500, 840, 'HER VERİYLE DAHA İYİ', 40, CY) + sub(500, 'öğrenir · uyarlanır · gelişir', 882)
    return svg(SQ, b, 'vi', glow2='cy')


# ---------- sahneler: geniş (1600x700) ----------
def w_hospital():
    b = halo(800, 380, 700, 'bl')
    random.seed(3)
    x = 140
    for w, h in [(180, 260), (240, 380), (200, 300), (300, 470), (200, 320), (230, 360), (160, 240)]:
        y = 620 - h
        b += halo(x + w / 2, y + 40, 150) + rect(x, y, w, h, 14, '#0d2a5c', .95, CY, 3)
        for r in range(int(h // 60) - 1):
            for c in range(int(w // 55)):
                on = random.random() > .4
                b += rect(x + 22 + c * 55, y + 30 + r * 60, 28, 30, 5, AM if on else CY, .75 if on else .25)
        x += w + 20
    b += circ(650, 190, 78, '#08183a', CO, 6) + nurse_cross(650, 190, .9, CO)
    for i in range(6):
        b += path(f'M{200+i*230} 170 Q{320+i*230} 90 {430+i*230} 170', CY, 3, op=.55, dash='4 10') + circ(200 + i * 230, 170, 9, CY, glow=True)
    b += rect(100, 620, 1400, 14, 7, CY, .35)
    return svg(WIDE, b)


def w_hologram_poster():
    b = halo(800, 350, 760, 'cy') + halo(1250, 520, 500, 'vi')
    for r in (110, 190, 270, 350):
        b += circ(800, 350, r, 'none', CY, 3, .35 - r / 2000)
    random.seed(1)
    for i in range(80):
        a, r = random.uniform(0, 6.28), random.uniform(60, 420)
        b += circ(800 + r * math.cos(a), 350 + r * math.sin(a) * .7, random.uniform(2, 5), random.choice([CY, BL, WH]), op=.6)
    b += heart(800, 380, 2.2, CO, .85) + ecg(380, 500, 840, 80, CY, 6)
    return svg(WIDE, b, c1='#08183a')


def w_surgery(ai):
    if not ai:
        b = halo(800, 120, 520, 'bl')
        for lx in (520, 1080):
            b += halo(lx, 250, 200, 'bl') + f'<path d="M{lx-80} 90 L{lx+80} 90 L{lx+130} 230 L{lx-130} 230Z" fill="#0d2250" stroke="{BL}" stroke-width="4"/>'
        b += rect(330, 470, 940, 60, 24, '#122a5a', 1, BL, 3) + rect(380, 530, 40, 130, 8, '#122a5a') + rect(1180, 530, 40, 130, 8, '#122a5a')
        b += f'<ellipse cx="800" cy="440" rx="330" ry="46" fill="#1b3a78" stroke="{BL}" stroke-width="3"/>'
        for x in (420, 560, 1040, 1180):
            b += person(x, 330, 1.35, '#7ea6e0', .85)
        b += text(800, 650, 'EL BECERİSİ · DENEYİM', 40, '#8fb4ee', 600, 'middle', .8)
        return svg(WIDE, b, 'bl', '#0a1735', '#04080f', 'bl')
    b = halo(800, 240, 620, 'cy')
    b += rect(260, 480, 1080, 60, 24, '#0c2c5e', 1, CY, 4) + f'<ellipse cx="800" cy="450" rx="360" ry="46" fill="#123b73" stroke="{CY}" stroke-width="4"/>'
    for sx in (-1, 1):
        x0 = 800 + sx * 420
        b += path(f'M{x0} 60 L{x0} 160 L{800+sx*190} 290 L{800+sx*70} 430', CY, 18, glow=True) + circ(x0, 160, 22, '#08183a', CY, 6) + circ(800 + sx * 190, 290, 20, '#08183a', CY, 6)
    b += glass(960, 90, 250, 150, 20, CY, .8) + ecg(985, 175, 200, 36, TL, 4) + text(1085, 125, 'VİTAL STABİL', 22, TL)
    b += glass(390, 90, 250, 150, 20, CY, .8) + text(515, 150, 'HASSASİYET', 22, CY) + text(515, 205, '0,1 mm', 46, AM)
    b += circ(800, 440, 80, 'none', AM, 5) + line(800, 340, 800, 380, AM, 5) + line(800, 500, 800, 540, AM, 5) + line(700, 440, 740, 440, AM, 5) + line(860, 440, 900, 440, AM, 5)
    b += person(420, 360, 1.15, '#bfe6ff', .75) + person(1180, 360, 1.15, '#bfe6ff', .75)
    b += text(800, 650, 'GÖRSELLEŞTİRME · HASSASİYET', 40, CY)
    return svg(WIDE, b, 'cy')


def w_analytics():
    b = halo(800, 350, 700, 'cy')
    random.seed(6)
    b += glass(160, 130, 520, 440, 30) + glass(720, 130, 720, 200, 30) + glass(720, 360, 340, 210, 30) + glass(1100, 360, 340, 210, 30)
    pts = [(200, 480), (280, 400), (350, 440), (430, 330), (510, 360), (590, 250), (650, 230)]
    b += path('M' + ' L'.join(f'{x} {y}' for x, y in pts), CY, 7, glow=True)
    for x, y in pts:
        b += circ(x, y, 9, '#08183a', CY, 4)
    for i in range(24):
        h = random.randint(30, 150)
        b += rect(750 + i * 28, 305 - h, 18, h, 5, [CY, BL, TL][i % 3], .85)
    for r in range(4):
        for c in range(8):
            b += rect(745 + c * 38, 385 + r * 46, 30, 36, 6, random.choice([TL, AM, CO, BL]), random.choice([.25, .45, .8]))
    b += circ(1270, 465, 70, 'none', WH, 14, .1) + path('M1270 395 A70 70 0 1 1 1200 465', TL, 14, glow=True) + text(1270, 480, '82', 44)
    return svg(WIDE, b)


def w_chatbot():
    b = halo(430, 350, 600, 'cy')
    b += rect(230, 170, 280, 260, 70, '#0d2a5c', 1, CY, 7) + line(370, 170, 370, 120, CY, 7) + circ(370, 110, 16, CO, glow=True)
    b += circ(310, 290, 30, CY, glow=True) + circ(430, 290, 30, CY, glow=True) + path('M320 370 Q370 400 420 370', CY, 7)
    b += rect(200, 260, 30, 70, 14, CY, .8) + rect(510, 260, 30, 70, 14, CY, .8)
    b += rect(560, 160, 600, 110, 44, WH, .12, CY, 4) + text(860, 230, 'Size nasıl yardımcı olabilirim?', 36, WH, 600)
    b += rect(700, 300, 600, 110, 44, CY, .22, CY, 4) + text(1000, 370, 'Ziyaret saatleri nedir?', 36, WH, 600)
    b += rect(560, 440, 400, 90, 40, WH, .12, CY, 4)
    for i in range(3):
        b += circ(660 + i * 60, 485, 12, CY, op=.45 + i * .25)
    b += circ(1320, 220, 56, '#06281f', TL, 6) + text(1320, 232, '7/24', 32, TL)
    return svg(WIDE, b)


def w_tablet():
    b = halo(800, 340, 640, 'bl') + rect(420, 100, 760, 500, 40, '#0b2250', 1, CY, 7) + rect(450, 130, 700, 440, 22, '#06142f')
    b += text(490, 190, 'GÜNÜN PLANI', 26, CY, 700, 'start')
    for i, (t, col) in enumerate([('08:00  Vital bulgular', CY), ('09:30  İlaç uygulaması', AM), ('11:00  Pansuman', TL), ('13:00  Taburculuk eğitimi', BL)]):
        y = 250 + i * 75
        b += rect(480, y - 30, 640, 58, 16, col, .16, col, 3) + circ(515, y, 12, col) + text(550, y + 10, t, 28, WH, 600, 'start')
    b += circ(1140, 130, 30, CO, glow=True) + text(1140, 141, '3', 26)
    b += halo(1300, 480, 140) + circ(1300, 480, 70, '#08183a', CY, 6) + path('M1300 440 L1300 485 L1330 500', CY, 7)
    b += circ(300, 300, 54, '#08183a', TL, 6) + check(300, 300, 1.1, TL, 9)
    return svg(WIDE, b, 'bl')


def w_robot_lift():
    b = halo(800, 340, 640, 'cy')
    b += f'<ellipse cx="560" cy="520" rx="170" ry="130" fill="#eaf4ff"/><circle cx="560" cy="300" r="130" fill="#eaf4ff"/><circle cx="465" cy="195" r="46" fill="#eaf4ff"/><circle cx="655" cy="195" r="46" fill="#eaf4ff"/>'
    b += circ(520, 300, 16, '#050b19') + circ(600, 300, 16, '#050b19') + f'<ellipse cx="560" cy="338" rx="30" ry="20" fill="#0d2a5c"/>'
    b += rect(440, 440, 240, 56, 28, CY, .35) + circ(560, 468, 12, CY, glow=True)
    b += rect(650, 470, 330, 60, 30, '#eaf4ff') + rect(650, 540, 330, 56, 28, '#cfe3f8')
    b += f'<ellipse cx="900" cy="440" rx="130" ry="40" fill="{CY}" opacity=".35"/>' + person(900, 330, 1.2, CY, .9)
    b += circ(1180, 200, 60, '#2a0a12', CO, 6) + heart(1180, 212, .8, CO) + text(1180, 330, 'RIBA · ROBEAR', 28, CY)
    b += rect(200, 620, 1200, 14, 7, CY, .3)
    return svg(WIDE, b)


def w_telepresence():
    b = halo(1000, 340, 640, 'tl')
    b += rect(430, 120, 340, 250, 30, '#0d2a5c', 1, CY, 6) + rect(450, 140, 300, 210, 18, '#06142f')
    b += person(600, 250, 1.0, WH, .9) + rect(590, 370, 20, 180, 8, '#cfe3f8') + f'<ellipse cx="600" cy="570" rx="120" ry="34" fill="#cfe3f8"/>'
    for r in (60, 110, 160):
        b += path(f'M{770+r*.2} {250-r} A{r} {r} 0 0 1 {770+r*.2} {250+r}', CY, 5, op=.8 - r / 260)
    b += rect(1000, 470, 420, 40, 14, WH, .85) + rect(980, 430, 30, 150, 8, WH, .85) + rect(1410, 450, 30, 130, 8, WH, .85)
    b += rect(1040, 410, 180, 70, 30, CY, .6) + circ(1020, 405, 34, '#cfe3f8')
    b += circ(1230, 200, 60, '#06281f', TL, 6) + text(1230, 211, 'CANLI', 24, TL) + line(770, 300, 1170, 240, CY, 3, .5, '6 12')
    return svg(WIDE, b, 'tl')


def t_command():
    b = halo(400, 420, 520, 'cy') + glass(110, 130, 580, 740, 40, CY, .7)
    b += halo(400, 360, 240, 'co') + heart(400, 360, 2.6, CO, .92) + circ(400, 360, 210, 'none', CY, 3, .5)
    b += ecg(150, 600, 500, 80, CY, 7)
    for i, (t, v, col) in enumerate([('NABIZ', '74', TL), ('SpO₂', '98', CY), ('RİSK', 'DÜŞÜK', AM)]):
        x = 150 + i * 175
        b += rect(x, 680, 150, 130, 22, col, .14, col, 3) + text(x + 75, 725, t, 20, '#9fd3ff') + text(x + 75, 785, v, 46 if len(v) < 4 else 30, col)
    return svg(TALL, b)


ASSETS = {
    'brain': s_brain_chip, 'neural': s_neural, 'selfimprove': s_learn,
    'warehouse': s_data_lake, 'xray': s_pattern, 'server': s_forecast,
    'diagnosis': s_diagnosis, 'lab': s_treatment, 'clinic': s_admin,
    'workflow': s_workflow, 'pharmacy': s_pharmacy, 'risk': s_risk,
    'wearable': s_monitor, 'nursepatient': s_assist, 'ckds1': s_ckds,
    'safety': s_safety, 'ehr': s_ehr, 'kpi': s_kpi, 'quality': s_quality,
    'benchmark': s_benchmark,
    'hosp_a': w_hospital, 'holo': w_hologram_poster, 'analytics': w_analytics,
    'chatrobot': w_chatbot, 'tablet': w_tablet, 'robotbear': w_robot_lift, 'robotcare': w_telepresence,
    'classicsurg': lambda: w_surgery(False), 'aisurg': lambda: w_surgery(True),
    'hosp_b': t_command,
}

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in ASSETS.items():
        with open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8') as fh:
            fh.write(fn())
    print(len(ASSETS), 'SVG üretildi')
