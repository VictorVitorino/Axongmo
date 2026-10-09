#!/usr/bin/env python3
"""Monta as apresentações em HTML único (CSS, JS e imagens embutidos)."""
import base64, pathlib, re, sys
SRC = pathlib.Path(__file__).parent
OUT = SRC.parent

DECKS = {
    "tmo": ("AXON_Proposta_1_TMO.html", "AXON · Proposta 1 · TMO",
            "Proposta 1: Transformation Office (PMO + Gestão de Mudanças) para escalar a plataforma AXON nas cinco gerências do ONS. Contexto, método e plano de trabalho de 6 meses. Alvarez & Marsal · Digital & Technology Services."),
    "gm": ("AXON_Proposta_2_GMO.html", "AXON · Proposta 2 · GMO",
           "Proposta 2: Gestão de Mudanças (método ADKAR) para a adoção da plataforma AXON nas cinco gerências do ONS. Contexto, método e plano de trabalho de 6 meses. Alvarez & Marsal · Digital & Technology Services."),
}

def datauri(name):
    p = SRC / "assets" / name
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode()

def build(key):
    out, title, desc = DECKS[key]
    fxdir = SRC / "fx"
    css = (SRC / "shell_base.css").read_text() + "\n" + "\n".join(p.read_text() for p in sorted(fxdir.glob("*.css"))) + "\n" + (SRC / "shell_add.css").read_text()
    slides = (SRC / f"{key}_slides.html").read_text()
    slides = re.sub(r"\{\{([\w.]+\.png)\}\}", lambda m: datauri(m.group(1)), slides)
    used = (SRC / "shell.js").read_text() + (SRC / f"{key}.js").read_text()
    assets = "const ASSET={" + ",".join(f'"{p.stem}":"{datauri(p.name)}"' for p in sorted((SRC / "assets").glob("*.png")) if f"ASSET.{p.stem}" in used) + "};"
    fxjs = "\n".join(p.read_text() for p in sorted(fxdir.glob("*.js")))
    js = assets + "\n" + (SRC / "lib.js").read_text() + "\n" + fxjs + "\n" + (SRC / f"{key}.js").read_text() + "\n" + (SRC / "shell.js").read_text()
    html = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
{css}
</style>
</head>
<body>
<div id="progress"></div>
<div id="viewport"><div id="stage">
{slides}
<div id="wipe"><i></i><i></i><i></i></div><div id="chap"></div>
</div></div>
<div id="controls"><button class="g" id="bPrev"><span style="transform:rotate(180deg);display:inline-block">➜</span><span class="lb">Voltar</span></button><span class="c" id="cnt">1 / 1</span><button class="p" id="bNext"><span class="lb">Avançar</span>➜</button></div>
<div id="dots"></div>
<div id="tip"><b></b><span></span></div>
<script>
{js}
</script>
</body>
</html>
"""
    (OUT / out).write_text(html)
    print(f"{out}: {len(html)/1024:.0f} KB")

for k in (sys.argv[1:] or DECKS):
    if (SRC / f"{k}_slides.html").exists():
        build(k)
