# Propostas AXON · Gestão de Mudanças e TMO

Duas apresentações em HTML (arquivo único, abrem direto no navegador) com **método e plano de trabalho de 6 meses**, sem valores:

| Arquivo | Proposta | Telas |
| --- | --- | --- |
| `AXON_Proposta_Gestao_de_Mudancas.html` | Gestão de Mudanças: adoção, impactos, transição das pessoas, desnutrição dos legados, capacitação, marca, funil de adoção | 17 |
| `AXON_Proposta_TMO.html` | TMO (PMO + Gestão de Mudanças + valor): governança, plano integrado, portfólio de ondas, backlog, RAID, adoção, benefícios | 16 |

Navegação: setas ←/→ (ou toque), `G` abre o índice, `I` abre "Sobre este slide", `F` tela cheia, duplo clique amplia gráficos. Para imprimir/PDF use o comando de impressão do navegador (cada tela vira uma página 1600×900).

## Contexto registrado

- **AXON** (axonomia): plataforma low code em que cada modelo, empacotado em container com documentação de entradas e saídas, vira um bloco ("caixinha") no catálogo de jobs. Os jobs são arrastados para montar pipelines; cada estudo ganha uma interface de parâmetros própria (faixa, número, seleção, multisseleção, data, texto e tabela), salva e duplicável. A execução roda na nuvem com custo previsto por rodada e orçamento por time; as saídas vão para o catálogo corporativo, para download ou para o Axon Drive. Tem conexão MCP (IA configura parâmetros), "reportar bug" com contexto e correção assistida, e a Caixa de entrada (loop automático com agentes).
- **Cliente e escopo**: ONS, gerências PE, PR, PL, OS e PD. O AXON substitui diversos legados e sistemas satélites mantidos por várias pessoas, o que tira trabalho operacional de muita gente. Por isso o foco é adoção e transição das pessoas, com o menor impacto possível no quadro.
- **Situação atual (informada pelo time)**: MVP em uso por 2 times; público potencial de cerca de 150 usuários; teste de backtest com cerca de 176 mil casos em cerca de 2h, contra estimativa anterior de cerca de 3 dias; produto com time enxuto.
- **Método**: ADKAR (Prosci) como espinha dorsal, transição de Bridges, curva de difusão (Rogers), adoção por ondas com rodada paralela e desnutrição gradual dos legados. No TMO, entram também PMI/PMBOK, práticas ágeis, RAID e gestão de benefícios.
- **Identidade visual**: paleta e chrome A&M (modelo HTML de apresentação), efeitos do Guia de Design DTS, logos A&M Performance e DTS anexados.
- O PPT anexado foi usado apenas como exemplo; nenhum conteúdo ou estrutura dele foi reaproveitado.

Números marcados como **ilustrativos** (intensidades, funil, vitrine, painel e candidatos de onda) servem só para demonstrar a leitura. Os números reais saem do raio-x ou da mobilização do mês 1.

## Como editar

O código-fonte fica em `src/` e o build gera os dois HTML com CSS, JS e imagens embutidos:

```
python3 src/build.py          # gera as duas apresentações
python3 src/build.py gm       # só Gestão de Mudanças
python3 src/build.py tmo      # só TMO
```

- `src/shell_base.css`, `src/shell_add.css`: tokens A&M, chrome e componentes
- `src/lib.js`: utilitários, ícones, chevrons, Gantt e canvas
- `src/shell.js`: navegação, cabeçalho, faixas, rodapé, índice e efeitos
- `src/gm_slides.html` + `src/gm.js`: proposta de Gestão de Mudanças
- `src/tmo_slides.html` + `src/tmo.js`: proposta de TMO
- `src/assets/`: imagens anexadas (logo A&M Performance, DTS e linhas)
