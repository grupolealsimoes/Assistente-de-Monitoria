# Plano: Sistema Novare (site público + área restrita modular)

> Etapa 1: só planejamento, sem código. Nada aqui foi construído ainda.
> Data: 15/10/2026. Status: **aguardando sua aprovação e as respostas da seção 7.**

---

## 0. Antes de tudo: o que eu consegui (e não consegui) ler

Os arquivos do print estão no **seu computador**, e eu trabalho numa máquina na nuvem.
Daqui eu só enxergo o que está no GitHub. Comparando:

| Item do pedido | Pasta no seu PC | Situação |
|---|---|---|
| Site atual | `novare-site` | ✅ Li a versão do GitHub (`grupolealsimoes/novare-site`, enviada em 27/07/2026) |
| Link da bio | `Link da bio` | ✅ Li a versão do GitHub (`grupolealsimoes/novare-link-bio`) |
| Gerador de contratos de moto | `PRODUÇÃO DE CONTRATOS` | ❌ **Não está no GitHub.** Não consegui ler |
| Críticas do programador | `CRITICAS.md` | ❌ **Não está no GitHub.** Não consegui ler |
| Marca | `/marca` | ⚠️ Não existe como pasta. Peguei a logo, as cores e as fontes do próprio site e do link da bio |

Por isso este plano está **completo para o site, para a arquitetura e para as fases**, mas tem
**duas lacunas marcadas com ⏳**: a análise do gerador (seção 2.3) e a classificação das
críticas (seção 3). Na seção 3 incluí a minha própria revisão do site, para adiantar o
trabalho. Assim que você me enviar os dois arquivos (instruções na pergunta 1), eu completo as lacunas.

---

## 1. Resumo em linguagem simples

- **Hoje** o site é um conjunto de arquivos fixos hospedados de graça no GitHub Pages. Ele
  funciona bem, mas o GitHub Pages **não consegue fazer login de verdade**: qualquer
  "senha" colocada nesse tipo de site fica visível para quem souber olhar o código da página.
- **A proposta** é mudar a hospedagem para a **Cloudflare** (também gratuita) e usar um
  serviço dela chamado **Cloudflare Access** como "porteiro" da área `/sistema`. O porteiro fica
  no servidor da Cloudflare: quem não estiver na lista de e-mails autorizados **nem recebe a
  página**. A senha não fica no código e não há senha para vazar: a pessoa digita o e-mail e
  recebe um código, ou entra com a conta Google.
- O site é refeito com uma ferramenta chamada **Astro**. Ela monta o site a partir de peças
  reutilizáveis (cabeçalho, rodapé, cores) e, principalmente, **descobre os módulos sozinha**:
  cada ferramenta interna fica numa pasta própria e aparece no menu do painel
  automaticamente.
- **Custo estimado: R$ 0 por mês** com até 50 usuários. Você só continua pagando o domínio, como já faz hoje.

---

## 2. O que cada projeto usa e o que dá para reaproveitar

### 2.1 Site institucional (`novare-site`)

**Tecnologia**
- Uma única página HTML grande (`index.html`, cerca de 1.000 linhas) mais a página de política de privacidade.
- Visual feito com **Tailwind CSS**, mas só a **versão já "compilada"** (`styles.css`) está no projeto.
  O arquivo de configuração original **não está lá**. Isso traz um problema prático: quem
  editar o HTML e usar uma classe que ainda não foi usada no site vai ver que ela **não
  funciona**, sem entender o motivo.
- Animações: GSAP + ScrollTrigger + AOS (todas salvas dentro do próprio site, sem CDN).
- JavaScript simples (`main.js`) para o menu do celular, os contadores, as abas, as perguntas frequentes e o formulário.
- O formulário **não usa servidor**: ele abre o WhatsApp com a mensagem já preenchida.
- Recursos de terceiros: o widget **Featurable** (avaliações do Google) e o **mapa do Google** no rodapé.
- Hospedagem: GitHub Pages, com o domínio `www.novarecontabilidade.com` apontado pelo DNS da Secrel.

**Reaproveitamos (quase tudo do conteúdo)**
- Textos, seções e a ordem delas, as perguntas frequentes, os depoimentos e os serviços.
- Imagens: logos, logos de clientes e as 4 fotos de porte de empresa.
- Fontes (Inter + Cormorant Garamond, salvas no próprio site) e a paleta de cores.
- O SEO já pronto: título, descrição, Open Graph, Schema.org, sitemap e robots.
- O comportamento do `main.js` (será dividido em partes menores).
- A política de privacidade (com ajustes).

**Não reaproveitamos como está**
- O `styles.css` compilado. Ele será **gerado de novo** a partir do Tailwind de verdade, com as
  mesmas cores e medidas. O visual fica igual, mas passa a ser editável.

### 2.2 Link da bio (`novare-link-bio`)
- Uma página HTML de 1,9 MB, porque as imagens estão "embutidas" dentro do arquivo.
- Usa a fonte **Raleway** (puxada do Google Fonts), enquanto o site usa a **Inter**. É uma pequena inconsistência de marca.
- **Sugestão (opcional):** trazer essa página para o mesmo projeto, em `novarecontabilidade.com/links`,
  usando as mesmas peças do site. Assim tudo fica num lugar só (ver pergunta 8).

### 2.3 Gerador de contratos de moto ⏳
**Ainda não analisado**, porque não tive acesso. Quando eu receber a pasta, preencho aqui:
- a linguagem e as bibliotecas que ele usa (ex.: HTML/JavaScript no navegador, Python, planilha com macro…);
- se ele **guarda** dados de clientes em algum lugar ou só gera o documento;
- o formato de saída (Word, PDF, impressão);
- o que entra no módulo **sem nenhuma alteração** e o que precisa de adaptação.

**Princípio já decidido:** o gerador entra no sistema **com a mesma lógica de hoje**. Antes de mexer
em qualquer coisa, eu gero alguns contratos de teste (com dados fictícios) na versão atual e
guardo o resultado. Depois de cada mudança, gero os mesmos contratos de novo e comparo.
Se der qualquer diferença, a fase não é entregue.

---

## 3. Críticas: classificação e fase

### 3.1 Críticas do programador (CRITICAS.md) ⏳
Não consegui ler o arquivo. Quando eu receber, cada crítica entra nesta tabela:

| # | Crítica | Classe | Por quê | Fase |
|---|---|---|---|---|
| … | (a preencher) | grave / importante / cosmética | … | … |

Regra de classificação que vou usar:
- **Grave:** segurança, exposição de dados pessoais, algo quebrado ou informação errada para o cliente
  (ex.: telefone errado). Resolvido **antes** de o novo site entrar no ar (fase 2).
- **Importante:** manutenção, desempenho, acessibilidade, SEO e conformidade com a LGPD. Resolvido na fase 6.
- **Cosmética:** aparência e textos sem impacto funcional. Resolvido na fase 6, em lote, com a sua aprovação visual.

### 3.2 Minha própria revisão do site (para adiantar)
Encontrei os pontos abaixo lendo o código. Se coincidirem com as críticas do programador, eu junto as duas listas.

| # | Problema encontrado | Classe | Fase |
|---|---|---|---|
| R1 | **Telefone divergente:** o site usa (85) 99677-8884 e o perfil do Google mostra (85) 99980-0899, que no link da bio é o número da Maria Luiza. Cliente pode ligar para o lugar errado | **Grave** | 2 |
| R2 | **E-mail não confirmado:** o código tem um aviso "EDITAR: confirmar e-mail oficial" em `contato@novarecontabilidade.com` | **Grave** (contato pode não chegar) | 2 |
| R3 | O CSS está só na versão compilada, sem o arquivo de origem. Mudanças futuras no visual "não pegam" | **Importante** | 1 (a reconstrução resolve) |
| R4 | O **widget Featurable** carrega código de terceiro no site e **não aparece na política de privacidade** (LGPD: transparência) | **Importante** | 2 |
| R5 | "9 avaliações" está escrito à mão e fica desatualizado, repetindo o que o widget já mostra | Importante | 6 |
| R6 | **Logo da Cacau Show:** a Novare atende franqueados, não a marca. O próprio README recomenda trocar por "Franqueados Cacau Show" (risco de uso de marca) | **Importante** (risco jurídico) | 2 |
| R7 | "+12 anos" está fixo no texto. O número pode ser calculado a partir da fundação (2014) para nunca ficar desatualizado | Cosmética | 6 |
| R8 | Imagem de compartilhamento (Open Graph) é a própria logo, e não uma imagem 1200×630. Fica cortada no WhatsApp e no LinkedIn | Cosmética | 6 |
| R9 | Não existe página 404 ("página não encontrada") | Cosmética | 6 |
| R10 | O GitHub Pages não permite configurar **cabeçalhos de segurança** (proteções que o servidor envia ao navegador). A Cloudflare permite | Importante | 3 |
| R11 | Ano fixo "© 2026" na política de privacidade | Cosmética | 6 |
| R12 | O link da bio usa outra fonte (Raleway) e tem 1,9 MB (carrega devagar no 4G) | Cosmética | 6 (se incorporarmos) |
| R13 | A foto da fundadora está pendente na seção "Sobre" | Cosmética (conteúdo) | quando você enviar |

---

## 4. Arquitetura proposta

### 4.1 Tecnologia escolhida e por quê

| Peça | Escolha | Em linguagem simples |
|---|---|---|
| Montagem do site | **Astro** + **Tailwind CSS** (com a configuração de verdade) | Pega peças reutilizáveis (cabeçalho, rodapé, botões) e gera o site final. A área pública continua sendo arquivo estático, rápida como hoje |
| Hospedagem | **Cloudflare Pages** | Faz o mesmo papel do GitHub Pages: cada vez que algo é enviado ao GitHub, o site se atualiza sozinho. Também é gratuita, e permite login e funções no servidor |
| Login | **Cloudflare Access** (porteiro) + **verificação no nosso código** (segunda tranca) | Explicado em 4.3 |
| Dados (futuro) | **Cloudflare D1** (banco de dados), só quando um módulo precisar guardar algo (ex.: controle de clientes) | O gerador de contratos provavelmente **não precisa** de banco |
| Código | Um repositório **privado** no GitHub | Os módulos internos não ficam públicos |

**Alternativas que descartei:**
- *Continuar no GitHub Pages com "senha no JavaScript":* não é segurança de verdade. Proibido pelos seus requisitos (LGPD).
- *Next.js + Vercel + Supabase:* funciona, mas custa cerca de **US$ 45/mês** (o plano gratuito da Vercel não permite uso comercial) e tem mais peças para manter.
- *WordPress:* exige atualizações constantes, é alvo comum de ataques, e o gerador não se encaixa bem nele.

### 4.2 Hospedagem e domínio
- Site público: `www.novarecontabilidade.com` (igual a hoje).
- Área restrita: `www.novarecontabilidade.com/sistema`.
- Para o porteiro funcionar no seu domínio, o **DNS** (a "lista telefônica" que diz para onde o
  domínio aponta) sai da Secrel e passa a ser gerenciado pela Cloudflare (gratuito). O domínio
  continua registrado onde está. Os **registros de e-mail (MX) são copiados exatamente** para o
  e-mail não parar. Essa mudança é uma fase separada (fase 3), com teste de e-mail antes e depois e
  plano de volta.

### 4.3 Como funciona o login
1. Alguém acessa `novarecontabilidade.com/sistema`.
2. **Antes** de qualquer arquivo ser enviado, a Cloudflare pergunta: "qual é o seu e-mail?"
3. Se o e-mail **estiver na lista autorizada**, a pessoa recebe um **código de 6 dígitos** no e-mail
   (ou entra com a conta Google, se preferir). Se não estiver, não recebe nada e não vê nada.
4. Com o código certo, a Cloudflare libera a entrada por um tempo (sugestão: 12 horas) e
   **registra quem entrou e quando** (útil para a LGPD).
5. **Segunda tranca:** o nosso próprio código, no servidor, confere a "credencial" assinada que a Cloudflare
   entrega. Se alguém achar outro caminho até os arquivos (ex.: o endereço técnico `*.pages.dev`), é bloqueado mesmo assim.

**Adicionar ou remover alguém da equipe:** você entra no painel da Cloudflare e coloca ou tira o e-mail da lista.
Não precisa mexer em código. É gratuito até **50 usuários**.

**Permissões por módulo (futuro):** cada módulo pode declarar "só sócios" ou "toda a equipe".
O painel lê o e-mail de quem entrou e esconde o que a pessoa não pode ver. O servidor
também bloqueia o acesso, não só o menu.

### 4.4 Estrutura de pastas (planejada)

```
novare-sistema/                    ← repositório privado no GitHub
├── CLAUDE.md                      ← regras do projeto (este pacote)
├── PLANO.md
├── src/
│   ├── marca/                     ← cores, fontes, logo: UMA fonte da verdade
│   ├── componentes/               ← peças reutilizáveis (botão, cartão, cabeçalho…)
│   ├── layouts/
│   │   ├── SitePublico.astro      ← moldura do site institucional
│   │   └── Painel.astro           ← moldura da área restrita (menu lateral automático)
│   ├── pages/
│   │   ├── index.astro            ← home do site
│   │   ├── politica-de-privacidade.astro
│   │   ├── links.astro            ← (opcional) link da bio
│   │   └── sistema/
│   │       ├── index.astro        ← painel inicial (lista os módulos)
│   │       └── [modulo]/…         ← rota genérica: abre o módulo certo
│   └── modulos/                   ← ★ CADA FERRAMENTA INTERNA MORA AQUI ★
│       ├── _modelo/               ← módulo de exemplo para copiar
│       └── contrato-moto/         ← módulo 1
│           ├── modulo.ts          ← "ficha" do módulo (nome, ícone, ordem, quem pode ver)
│           ├── Pagina.astro       ← a tela do módulo
│           ├── logica/            ← código do módulo (gerador atual entra aqui)
│           ├── testes/            ← contratos de teste com dados fictícios
│           └── LEIAME.md          ← o que o módulo faz e como testar
├── functions/
│   └── sistema/_middleware.ts     ← segunda tranca: confere o login no servidor
└── public/                        ← fontes, imagens e arquivos fixos
```

### 4.5 O "padrão de módulo": como criar um módulo novo
1. **Copie** a pasta `src/modulos/_modelo` e dê um nome em letras minúsculas com hífen
   (ex.: `contrato-locacao`).
2. **Preencha a ficha** `modulo.ts`: nome que aparece no menu, descrição curta, ícone,
   posição no menu, quem pode ver (`todos` ou `socios`) e se está ativo.
3. **Construa a tela** em `Pagina.astro` usando os componentes da marca (nada de cores "soltas").
4. **Crie os testes** em `testes/` só com dados **fictícios**.
5. Envie ao GitHub. O módulo aparece **sozinho** no menu do painel, num endereço de teste.
   Você aprova e ele vai para o ar.

**Regras de isolamento:** um módulo **só mexe na própria pasta**. Ele pode *usar* `componentes/` e
`marca/`, mas não altera os dois nem outros módulos. Se precisar de algo novo e compartilhado, isso
vira uma mudança separada, aprovada à parte. Para desligar um módulo, basta marcar `ativo: false`.

### 4.6 Custo mensal estimado

| Item | Custo |
|---|---|
| Cloudflare Pages (hospedagem) | R$ 0 |
| Cloudflare Access (login, até 50 usuários) | R$ 0 |
| Cloudflare DNS | R$ 0 |
| Cloudflare D1 (banco, quando houver módulo de dados) | R$ 0 no volume de um escritório |
| GitHub (repositório privado) | R$ 0 |
| Domínio `novarecontabilidade.com` | o que você já paga hoje (anual) |
| **Total mensal novo** | **R$ 0** |
| *Se um dia passar dos limites gratuitos* | *Cloudflare Workers Paid ≈ US$ 5/mês (~R$ 28)* |

---

## 5. Fases (cada uma testável por você antes da próxima)

Toda fase é publicada primeiro num **endereço de teste**. O site oficial só muda quando você aprovar.

| Fase | O que entrega | Como **você** testa | Pronto quando |
|---|---|---|---|
| **0. Preparação** | Recebo o gerador, as críticas e as respostas da seção 7. Crio o repositório privado. Completo as seções 2.3 e 3.1 deste plano | Você lê o plano atualizado | Você aprovar o plano final |
| **1. Site reconstruído, igual ao atual** | Site refeito em Astro, **visualmente idêntico** ao de hoje, num endereço de teste | Abre o site atual e o novo lado a lado, no celular e no computador. Não deve haver diferença | Você não achar diferença |
| **2. Correções graves** | Críticas graves + R1, R2, R4, R6 | Confere telefone, e-mail, política de privacidade e logo de clientes | Você aprovar |
| **3. Troca de hospedagem e DNS** | Domínio passa a apontar para a Cloudflare. E-mail preservado. Cabeçalhos de segurança | Antes e depois: manda e recebe um e-mail; abre o site pelo domínio. **Plano de volta** pronto | Site no ar pela Cloudflare e e-mail funcionando |
| **4. Área /sistema com login** | Porteiro + segunda tranca + painel vazio com menu automático e um módulo `_modelo` de demonstração | (a) Entra com o seu e-mail; (b) tenta entrar por uma janela anônima com um e-mail não autorizado e **é barrado**; (c) adiciona alguém da equipe pelo painel da Cloudflare | Os três testes passarem |
| **5. Gerador de moto como módulo 1** | Gerador dentro do painel, com a mesma lógica de hoje e testes comparativos | Gera os mesmos contratos de teste na ferramenta antiga e na nova e compara. Testa também pelo celular | Contratos idênticos |
| **6. Melhorias importantes e cosméticas** | Restante do CRITICAS.md + R5, R7–R12 | Revisão visual guiada (lista de itens para conferir) | Você aprovar |
| **7. Manual do módulo** | Guia "como criar um módulo" em linguagem simples + verificação automática de que os módulos seguem o padrão | Você (ou eu, numa sessão futura) cria um módulo de teste seguindo o guia | O módulo aparece no menu sem alterar nada fora da própria pasta |

Depois da fase 7, cada módulo novo (outros contratos, clientes, honorários, documentos) vira
uma mini-fase própria, com o mesmo ciclo: endereço de teste → sua aprovação → no ar.

---

## 6. Cuidados com a LGPD (resumo; regras completas no CLAUDE.md)
- **Sem senha no código da página.** O login é feito no servidor (Cloudflare Access), com registro de acessos.
- **Dados pessoais não vão para o GitHub:** nada de contratos reais, CPFs ou planilhas de clientes no repositório.
  Os testes usam só dados fictícios.
- Por padrão, o gerador **processa os dados no navegador e não guarda nada no servidor**. Se um módulo
  precisar guardar dados, isso será decidido com você, com prazo de retenção definido.
- A área `/sistema` **não carrega nenhum script de terceiros** (sem widgets, sem analytics) e não aparece no Google.
- Repositório **privado**. (O `novare-site` atual é público. Para o site isso é aceitável, mas não para o sistema.)

---

## 7. Perguntas que preciso que você responda

**Para destravar (essenciais)**
1. **Envio dos arquivos que faltam.** Pode criar um repositório **privado** no GitHub chamado
   `novare-sistema` e subir nele (pelo "Add files via upload", como você já fez) a pasta
   `PRODUÇÃO DE CONTRATOS` e o `CRITICAS.md`? Se tiver uma pasta de marca (logo em alta resolução,
   manual), suba também. ⚠️ **Não suba contratos já preenchidos com dados de clientes**, só a ferramenta.
2. **Onde fica o projeto final?** Recomendo esse repositório privado novo (`novare-sistema`).
   Concorda? Observação: esta sessão foi aberta no repositório *Assistente-de-Monitoria*, que é
   outro projeto. Salvei este plano temporariamente na pasta `novare/` dele, e ele será movido.
3. **A versão do site no GitHub (27/07/2026) é a mais atual?** Ou a pasta `novare-site` do seu PC tem mudanças mais novas?
4. **Como o gerador é usado hoje?** Abre no navegador? Gera Word ou PDF? Precisa guardar um histórico
   dos contratos gerados ou basta gerar e baixar?

**Login e equipe**

5. **Quem vai acessar o `/sistema`?** Liste os e-mails (pode ser só o seu por enquanto). Vocês usam
   Gmail ou Google Workspace? Se sim, dá para entrar com o botão "Entrar com Google". Se não, o acesso é por código enviado ao e-mail.
6. Vai existir diferença de permissão (ex.: só sócios veem honorários)? Pode responder "ainda não sei".

**Domínio e e-mail**

7. **Quem tem acesso ao painel da Secrel** (onde está o DNS hoje)? Posso planejar a mudança do DNS para a
   Cloudflare (gratuita, mantendo o e-mail)? Qual serviço de e-mail vocês usam no `@novarecontabilidade.com`?

**Conteúdo do site (pendências que já estavam no README)**

8. Quer trazer o **link da bio** para dentro do projeto (`/links`)?
9. **Telefone oficial:** (85) 99677-8884 ou (85) 99980-0899?
10. **E-mail oficial:** `contato@novarecontabilidade.com` está correto e recebendo mensagens?
11. **Cacau Show:** posso trocar a logo por um cartão "Franqueados Cacau Show"?
12. Mantemos o **widget de avaliações (Featurable)**? Se sim, eu o incluo na política de privacidade.

**Orçamento**

13. Está de acordo com custo **R$ 0/mês**, com a possibilidade de ~US$ 5/mês só se um dia passarmos dos limites gratuitos?

---

**Próximo passo:** aguardo sua aprovação deste plano e as respostas acima. Nenhum código será escrito antes disso.
