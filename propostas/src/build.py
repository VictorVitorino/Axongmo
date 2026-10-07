#!/usr/bin/env python3
"""Monta as apresentações em HTML único (CSS, JS e imagens embutidos)."""
import base64, pathlib, re, sys
SRC = pathlib.Path(__file__).parent
OUT = SRC.parent

DECKS = {
    "gm": ("AXON_Proposta_Gestao_de_Mudancas.html", "AXON · Gestão de Mudanças",
           "Proposta de método e plano de trabalho de gestão de mudanças para a adoção da plataforma AXON em cinco gerências (PE, PR, PL, OS e PD), em seis meses. Alvarez & Marsal · Digital & Technology Services."),
    "tmo": ("AXON_Proposta_TMO.html", "AXON · TMO",
            "Proposta de método e plano de trabalho de Transformation Management Office (PMO + Gestão de Mudanças) para escalar a plataforma AXON em cinco gerências, em seis meses. Alvarez & Marsal · Digital & Technology Services."),
}

def datauri(name):
    p = SRC / "assets" / name
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode()

def build(key):
    out, title, desc = DECKS[key]
    css = (SRC / "shell_base.css").read_text() + "\n" + (SRC / "shell_add.css").read_text()
    slides = (SRC / f"{key}_slides.html").read_text()
    slides = re.sub(r"\{\{([\w.]+\.png)\}\}", lambda m: datauri(m.group(1)), slides)
    js = "\n".join((SRC / f).read_text() for f in ("lib.js", f"{key}.js", "shell.js"))
    html = f"""<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
