# Propostas AXON · TMO e Gestão de Mudanças

Duas apresentações em HTML (arquivo único, abrem direto no navegador) com **contexto, método e plano de trabalho de 6 meses**, sem valores e sem data de início (roadmap em meses relativos):

| Arquivo | Proposta | Páginas |
| --- | --- | --- |
| `AXON_Proposta_1_TMO.html` | **Proposta 1 · Transformation Office (PMO + GMO)**, pelo método A&M de TMO: arquitetura do AXON e desafio de escala, sete atividades e quatro pilares do TO, governança em três níveis, riscos e ferramentas, plano de 6 meses em sete frentes, resultados e entregáveis | 6 |
| `AXON_Proposta_2_GMO.html` | **Proposta 2 · Gestão de Mudanças (GMO)**, pelo método ADKAR: o que muda com o AXON, quem é impactado e os riscos, ADKAR + Bridges + adoção por ondas, cinco movimentos, roadmap e resultados | 6 |

Estrutura de cada proposta: Capa (Particle System do Guia DTS, com logos A&M e ONS) → Contexto → Método → Plano de trabalho.

Efeitos do Guia de Design DTS usados: Particle System (capa), Shimmer / Holographic Sweep, Animated Typography, Connector / Flow Line, Spotlight / Focus, Reveal / Mask Reveal, Progress Motion (Gantt com cursor de meses), Glow / Light Sweep, Data Highlight (painel do TMO) e Motion Graphics (pulsos percorrendo fluxos e fios condutores).

Navegação: setas ←/→ (ou toque), `G` abre o índice, `I` abre "Sobre este slide", `F` tela cheia, duplo clique amplia gráficos. Para imprimir/PDF use o comando de impressão do navegador (cada tela vira uma página 1600×900).

## Contexto registrado

- **AXON** (axonomia): plataforma low code em que cada modelo, empacotado em container com documentação de entradas e saídas, vira um bloco ("caixinha") no catálogo de jobs. Os jobs são arrastados para montar pipelines; cada estudo ganha uma interface de parâmetros própria (faixa, número, seleção, multisseleção, data, texto e tabela), salva e duplicável. A execução roda na nuvem com custo previsto por rodada e orçamento por time; as saídas vão para o catálogo corporativo, para download ou para o Axon Drive. Tem conexão MCP (IA configura parâmetros), "reportar bug" com contexto e correção assistida, e a Caixa de entrada (loop automático com agentes).
- **Cliente e escopo**: ONS, gerências PE, PR, PL, OS e PD. O AXON substitui diversos legados e sistemas satélites mantidos por várias pessoas, o que tira trabalho operacional de muita gente. Por isso o foco é adoção e transição das pessoas, com o menor impacto possível no quadro.
- **Situação atual (informada pelo time)**: MVP em uso por 2 times; público potencial de cerca de 150 usuários; teste de backtest com cerca de 176 mil casos em cerca de 2h, contra estimativa anterior de cerca de 3 dias; produto com time enxuto.
- **Método**: no TMO, a abordagem A&M de Transformation Office (sete atividades; pilares Estratégia e Metodologia, Governança e Estrutura, Ferramentas e Indicadores, Gestão da Mudança; governança em três níveis; riscos em cinco passos; mapa de marcos, plano integrado, dashboard e plataforma digital). Na GMO, ADKAR (Prosci) como espinha dorsal, transição de Bridges, curva de difusão (Rogers), adoção por ondas com rodada paralela e desnutrição gradual dos legados.
- **Identidade visual**: paleta e chrome A&M (modelo HTML de apresentação), efeitos do Guia de Design DTS, logos A&M e ONS.
- O PPT anexado foi usado apenas como exemplo; nenhum conteúdo ou estrutura dele foi reaproveitado.

Números marcados como **ilustrativos** (intensidades, distribuição do tempo, riscos e painel do TMO) servem só para demonstrar a leitura. Os números reais saem do raio-x ou da mobilização do mês 1.

## Como editar

O código-fonte fica em `src/` e o build gera os dois HTML com CSS, JS e imagens embutidos:

```
python3 src/build.py          # gera as duas apresentações
python3 src/build.py tmo      # só a Proposta 1 (TMO)
python3 src/build.py gm       # só a Proposta 2 (GMO)
```

- `src/shell_base.css`, `src/shell_add.css`: tokens A&M, chrome e componentes
- `src/lib.js`: utilitários, ícones, chevrons, Gantt com cursor e capa em partículas
- `src/fx/`: efeitos extraídos do Guia de Design DTS
- `src/shell.js`: navegação, cabeçalho, faixas, rodapé, índice e efeitos
- `src/tmo_slides.html` + `src/tmo.js`: Proposta 1 (TMO)
- `src/gm_slides.html` + `src/gm.js`: Proposta 2 (GMO)
- `src/assets/`: logos A&M e ONS (o build embute só as imagens usadas)
