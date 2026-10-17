# Diagnóstico de Dificuldades — Engenharia Econômica

Aplicação web (HTML, CSS e JavaScript puro) para coletar, de forma anônima em relação à
identidade do aluno, quais conteúdos de Engenharia Econômica estão gerando mais
dificuldade em uma turma, e transformar essas respostas em um dashboard que ajuda o
professor a priorizar a produção de material de apoio (listas de exercícios, vídeos,
resumos, aulas de revisão).

## Estrutura dos arquivos

```
.
├── index.html          # Formulário do aluno
├── dashboard.html       # Dashboard do professor
├── sobre.html            # Página "Sobre o projeto"
├── css/
│   └── style.css         # Estilos compartilhados por todas as páginas
├── js/
│   ├── data.js            # Camada de dados (constantes de domínio + repositório de respostas)
│   ├── app.js              # Lógica do formulário (index.html)
│   ├── dashboard.js         # Lógica do dashboard (dashboard.html)
│   ├── nav.js                # Comportamento do menu (mobile toggle + link ativo)
│   └── vendor/
│       └── chart.umd.min.js   # Chart.js 4.5.1, vendorizado localmente
└── README.md
```

**Decisão de estrutura:** o enunciado sugeria uma pasta `engenharia-economica/` na raiz.
Como este repositório é dedicado inteiramente a este projeto, os arquivos foram colocados
diretamente na raiz do repositório (sem uma pasta-wrapper redundante). O restante da
organização (`css/`, `js/`) segue exatamente o que foi pedido.

## Como executar

Não é necessário instalar nada. Basta abrir `index.html` diretamente no navegador
(duplo clique ou `Arquivo > Abrir`), ou servir a pasta com qualquer servidor estático,
por exemplo:

```bash
python3 -m http.server 8000
# depois acesse http://localhost:8000/index.html
```

Todas as dependências (Chart.js) estão vendorizadas em `js/vendor/`, então o dashboard
funciona **sem conexão com a internet**. A única dependência externa opcional é a fonte
Google Fonts "Inter" (carregada via `<link>`); se não houver internet, o navegador usa
automaticamente a pilha de fontes de fallback definida no CSS, sem quebrar o layout.

## Funcionalidades implementadas

### Formulário do aluno (`index.html`)
- Campo de matrícula (único identificador coletado; sem nome, CPF, e-mail, etc.).
- Seleção de um ou mais dos 11 temas da disciplina, exibidos como cards clicáveis;
  o tema "Desconto" exibe explicitamente que contempla desconto por dentro, por fora e
  desconto bancário.
- Nível de dificuldade geral (🟢 pouca / 🟡 moderada / 🟠 bastante / 🔴 muita), como cards
  de seleção única.
- Campo de comentário livre e opcional.
- Validação client-side: bloqueia envio sem matrícula, sem nenhum tema selecionado ou
  sem nível de dificuldade, com mensagens de erro específicas por campo.
- Mensagem de sucesso (toast) e limpeza do formulário após o envio.
- Persistência da resposta via `EEData.addResponse(...)` (ver "Camada de dados" abaixo).

### Dashboard do professor (`dashboard.html`)
- Cards de indicadores: total de respostas, alunos únicos (matrículas distintas), tema
  com maior dificuldade e nível de dificuldade predominante — todos recalculados a cada
  atualização e a cada filtro aplicado.
- Gráfico de barras horizontais (Chart.js) com a quantidade de alunos por tema, ordenado
  do maior para o menor, com o percentual da turma exibido no tooltip; as barras usam a
  cor da prioridade (vermelho/amarelo/verde) do respectivo tema.
- Gráfico de rosca (doughnut) com a distribuição por nível de dificuldade.
- Tabela de ranking de dificuldades (posição, tema, alunos, % da turma), 100% calculada
  dinamicamente a partir dos dados filtrados — nenhum valor fixo.
- Seção "Prioridades para produção de material", com classificação automática em Alta /
  Média / Baixa prioridade a partir do percentual de alunos que indicaram cada tema (ver
  "Regras de priorização" abaixo).
- Seção de comentários dos alunos, com a matrícula parcialmente mascarada
  (ex.: `2024****23`) para preservar a privacidade.
- Filtros por tema, nível de dificuldade e período (data inicial/final), que recalculam
  KPIs, gráficos, ranking, prioridades e comentários em tempo real.
- Exportação das respostas filtradas para CSV (separador `;`, compatível com Excel
  pt-BR), contendo matrícula, temas, nível de dificuldade, comentário e data — sem nome.
- Botão "Limpar dados", com modal de confirmação antes de apagar tudo do `localStorage`.
- Botões "Carregar dados de demonstração" (gera entre 35 e 50 respostas fictícias, com
  distribuição realista entre os temas) e "Remover dados de demonstração" (remove apenas
  as respostas marcadas como fictícias, preservando respostas reais). Um aviso amarelo
  fica visível no topo do dashboard sempre que houver dados de demonstração carregados.
- Estado vazio (empty state) amigável quando não há nenhuma resposta ainda.

### Navegação e página "Sobre" (`sobre.html`)
- Menu superior fixo com Formulário / Dashboard / Sobre o projeto, responsivo (vira menu
  hambúrguer em telas pequenas).
- Página "Sobre o projeto" explicando o objetivo do sistema e como a privacidade dos
  alunos é preservada.

## Camada de dados e persistência

Toda leitura/escrita de respostas passa por um objeto único, `EEData`
(`js/data.js`), com uma API baseada em `Promise`:

```js
EEData.getResponses()        // -> Promise<Array<Resposta>>
EEData.addResponse(payload)  // -> Promise<Resposta>
EEData.clearAll()            // -> Promise<void>
EEData.removeDemoData()      // -> Promise<void>
EEData.hasDemoData()         // -> Promise<boolean>
EEData.loadDemoData()        // -> Promise<number>
```

A implementação atual guarda tudo em `localStorage`, mas como a API já é assíncrona,
trocar por uma API/backend real no futuro exige apenas reescrever o corpo desses métodos
(por exemplo, usando `fetch`) — nenhuma outra parte do código (`app.js`, `dashboard.js`)
precisa mudar.

Cada resposta segue esta estrutura:

```json
{
  "id": "identificador-gerado",
  "matricula": "202400123",
  "temas": ["juros-compostos", "taxas"],
  "nivelDificuldade": "muita",
  "comentario": "Tenho dificuldade para identificar qual fórmula utilizar.",
  "data": "2026-09-04T10:30:00.000Z",
  "demo": false
}
```

`temas` e `nivelDificuldade` usam os `id`s estáveis definidos em `EEData.THEMES` e
`EEData.DIFFICULTY_LEVELS` (em vez do texto exibido), o que facilita futuras traduções,
alterações de rótulo ou integração com um backend. O campo `demo` marca respostas
fictícias geradas pelo botão "Carregar dados de demonstração", permitindo removê-las
seletivamente sem afetar respostas reais.

## Decisões de implementação

- **Nível de dificuldade por tema (opcional no enunciado):** optou-se por manter apenas
  o nível de dificuldade **geral** (uma escolha única por resposta), em vez de um nível
  por tema selecionado. Um nível por tema tornaria o modelo de dados e os cálculos do
  dashboard (que são, em sua essência, uma contagem por tema) significativamente mais
  complexos, e o próprio enunciado tratava esse recurso como opcional ("se for simples de
  implementar"). Fica registrado como melhoria futura.
- **Regras de priorização:** um tema é classificado como Alta prioridade se ≥ 40% dos
  respondentes filtrados o indicaram, Média prioridade entre 20% e 39%, e Baixa
  prioridade abaixo de 20% (apenas temas com pelo menos 1 indicação aparecem em alguma
  categoria). Os limites são constantes (`PRIORITY_THRESHOLDS`) no topo de
  `js/dashboard.js` e podem ser ajustados facilmente conforme o tamanho real da turma.
- **Base de cálculo do percentual:** o "% da turma" no ranking e nas prioridades é
  calculado sobre o **total de respostas filtradas** (não sobre alunos únicos), pois é o
  que o exemplo do enunciado (`32 alunos · 64%`) sugere e é a métrica mais direta de
  "quantos formulários indicaram esse tema".
- **Chart.js vendorizado localmente** (`js/vendor/chart.umd.min.js`) em vez de carregado
  via CDN, para garantir que os gráficos funcionem mesmo sem acesso à internet, conforme
  o requisito de a aplicação funcionar "abrindo o HTML localmente sempre que possível".
- **Mascaramento de matrícula:** exibida como 4 primeiros caracteres + asteriscos + 2
  últimos caracteres (ex.: `2024****23`), suficiente para diferenciar respondentes sem
  expor a matrícula completa.
- **CSV com separador `;`** e BOM UTF-8, por ser o formato que o Excel em português
  reconhece corretamente por padrão (evita que acentos e a vírgula decimal quebrem as
  colunas).

## Verificações realizadas

Antes da entrega, a aplicação foi testada de ponta a ponta com um navegador automatizado
(Chromium via Playwright), cobrindo:

- Preenchimento e envio do formulário, incluindo os casos de erro (matrícula vazia,
  nenhum tema selecionado, nenhum nível selecionado) e o caminho de sucesso (toast,
  reset do formulário, gravação no `localStorage`).
- Atualização do dashboard após uma nova resposta real.
- Carregamento e remoção de dados de demonstração, com o aviso de dados fictícios
  aparecendo/desaparecendo corretamente.
- Renderização dos dois gráficos (barras e rosca) e recontagem do ranking e das
  prioridades.
- Filtros por tema, nível e período, com recomputo dos KPIs.
- Exportação para CSV (conteúdo, separador e acentuação verificados).
- Limpeza de dados com modal de confirmação (cancelar mantém os dados; confirmar limpa e
  mostra o estado vazio).
- Responsividade em viewport desktop (1440px) e mobile (390px), incluindo o menu
  hambúrguer.
- Ausência de erros de JavaScript no console durante todo o fluxo (após corrigir um bug
  de seleção de temas — ver histórico de commits).

## Melhorias futuras

- Nível de dificuldade individual por tema selecionado.
- Backend real (API + banco de dados) substituindo o `localStorage`, aproveitando a
  camada `EEData` já isolada para essa troca.
- Autenticação simples para a área do professor.
- Exportação também em Excel (.xlsx) ou PDF.
- Histórico/comparação entre diferentes turmas ou semestres.
- Internacionalização (hoje os textos estão fixos em português).

---

## Outro projeto neste repositório: LesteShop

A pasta [`lesteshop/`](lesteshop/README.md) contém a Fase 1 do **LesteShop** (Pesquisa
Operacional II): a base de ofertas de Ciudad del Este, em Python. Veja o
[README do LesteShop](lesteshop/README.md).
