# Plano: Sistema Novare (site público + área restrita modular)

> Etapa de planejamento, sem código. Nada aqui foi construído ainda.
> Versão 2, de 15/10/2026: inclui o gerador (`Sistema.html`), o `CRITICAS.md` e a logo.
> Status: **aguardando sua aprovação e as respostas da seção 8.**
>
> **Respostas já recebidas (15/10/2026):**
> - P1: era erro de digitação. O módulo 1 é o gerador de **propostas e contratos de serviços contábeis**.
> - P2: criação do repositório privado `novare-sistema` **autorizada**.
> - P3: a equipe usa **e-mail com domínio próprio** (`@novarecontabilidade.com`). Login por **código de 6 dígitos enviado ao e-mail**
>   (o "Entrar com Google" só valeria se esse e-mail fosse Google Workspace; ver a pergunta 11). Falta a lista de e-mails.
> - P4: o formulário de novos clientes é um **Google Forms que alimenta uma planilha**. Aguardando o envio.

---

## 0. Material analisado

| Item | Arquivo | Situação |
|---|---|---|
| Site atual | `index.html` enviado + repositório `grupolealsimoes/novare-site` | ✅ Os dois são **idênticos**: a versão do GitHub é a mais atual |
| Política de privacidade e demais arquivos do site | repositório `novare-site` | ✅ |
| Link da bio | repositório `grupolealsimoes/novare-link-bio` | ✅ |
| Gerador ("Produção de contratos") | `Sistema.html` | ✅ Ver a seção 2.3. ⚠️ **Gera propostas e contratos de serviços contábeis, não contratos de moto** (pergunta 1) |
| Críticas | `CRITICAS.md` | ✅ Ver a seção 3 |
| Logo | `novare_logo_fundo_transparente.svg` | ⚠️ É uma **imagem PNG "embrulhada" num arquivo SVG**, não um desenho vetorial de verdade (ver a seção 2.4) |
| Formulário de novos clientes | Google Forms → planilha | ⏳ Aguardando as perguntas do formulário e o modelo da planilha (sem dados reais) |

---

## 1. Resumo em linguagem simples

- **Hoje** o site é um conjunto de arquivos fixos no GitHub Pages, e o gerador é **um arquivo que você abre
  no computador**. Nenhum dos dois tem login, e o GitHub Pages não consegue fazer login de verdade.
- **A proposta** é juntar tudo num projeto só, hospedado na **Cloudflare** (gratuita). Lá, um "porteiro" chamado
  **Cloudflare Access** protege a área `/sistema`: quem não está na lista de e-mails autorizados **nem recebe a página**.
  Não existe senha no código, e o acesso é por código enviado ao e-mail ou pela conta Google.
- O site é refeito com o **Astro**, uma ferramenta que monta o site a partir de peças reutilizáveis e **descobre
  os módulos sozinha**: cada ferramenta interna fica numa pasta própria e aparece no menu do painel.
- O gerador entra como **módulo 1, praticamente sem mexer na lógica**. Ele já foi bem feito para isso.
- **Custo: R$ 0 por mês** com até 50 usuários (mais o domínio, que você já paga, e o `.com.br`, se comprar).

---

## 2. O que cada projeto usa e o que dá para reaproveitar

### 2.1 Site institucional (`novare-site`)
**Tecnologia:** uma página HTML grande (cerca de 1.000 linhas) + política de privacidade. Visual com **Tailwind CSS**, mas só na
versão "compilada": o arquivo de configuração original não está no projeto, então classes novas não funcionam
quando alguém edita. Animações com GSAP/ScrollTrigger/AOS, salvas no próprio site. Formulário que abre o WhatsApp.
Widget **Featurable** (avaliações do Google) e mapa do Google. Hospedado no GitHub Pages, com DNS na Secrel.

**Reaproveitamos:** textos, seções, perguntas frequentes, depoimentos, imagens, fontes (Inter + Cormorant Garamond),
cores, SEO (título, Open Graph, Schema.org, sitemap) e o comportamento do `main.js`.
**Refazemos:** só o CSS, que será gerado de novo a partir do Tailwind de verdade. O visual fica igual, mas editável.

### 2.2 Link da bio (`novare-link-bio`)
Página única de 1,9 MB (imagens embutidas), com a fonte Raleway (o site usa Inter). Sugestão opcional: trazer
para `novarecontabilidade.com/links` usando as mesmas peças do site (pergunta 9).

### 2.3 Gerador de propostas e contratos (`Sistema.html`)

**O que ele faz:** formulário à esquerda e documento ao vivo à direita. Gera a **Proposta de Serviços Contábeis** e o
**Contrato de Prestação de Serviços Contábeis** (PJ, PF e MEI), com serviços avulsos, descontos com aprovação,
13º honorário, reajuste, valor por extenso, validação de CPF e CNPJ e lista de pendências.

**Tecnologia:** um único arquivo HTML com JavaScript puro, **sem servidor**. Isso é ótimo: os dados do cliente ficam
no navegador de quem está usando.

| Recurso | Como funciona hoje | O que muda no sistema |
|---|---|---|
| Gerar PDF | Usa a impressão do navegador ("Salvar como PDF") | Igual |
| Fichas (salvar e abrir clientes) | Arquivos `.json` gravados direto na pasta **FICHAS do Google Drive** (só no Chrome e no Edge). O navegador lembra a pasta | **Igual.** Só será preciso escolher a pasta FICHAS **uma vez de novo** no endereço novo (o navegador guarda essa permissão por site) |
| Buscar dados pelo CNPJ | Consulta a BrasilAPI e, se falhar, o CNPJ.ws | Igual. São dados públicos de empresa, então não há problema de LGPD |
| Importar Cartão CNPJ (PDF) | Baixa a biblioteca **pdf.js de um site externo (cdnjs)** na hora | A biblioteca passa a ficar **dentro do sistema**: sem código de terceiros na área restrita |
| Fontes | Google Fonts (Inter, Montserrat) | Fontes salvas no próprio sistema |
| Logo do papel timbrado | Imagem embutida no arquivo | Arquivo de logo da marca (o mesmo de todo o sistema) |

**Pontos de atenção encontrados (nada urgente, nada quebrado):**
- **Cores diferentes do site:** o gerador usa `#073D2C`, `#315D3B` e `#78945A`, enquanto o site usa `#0F5A38` e `#6E8F4A`.
  Sugiro alinhar a tela do sistema com a marca, mas **sem mexer no visual do documento impresso sem a sua aprovação**
  (os clientes já recebem esse modelo).
- O campo **"Aprovado por"** é texto livre: qualquer pessoa pode digitar um nome e liberar o desconto. Com o login, isso
  pode virar uma aprovação de verdade, registrando quem aprovou. Fica como **melhoria futura**, fora da migração.
- **"Responsável comercial"** tem a lista fixa "Raira / Comercial 2 / Comercial 3". No futuro, pode vir da lista de usuários.
- **CRC:** o gerador escreve `CRC-CE 030650/O` (letra **O**) e o CRITICAS.md escreve `030650/0` (número **zero**).
  O registro de **organização** contábil costuma terminar com a letra O, mas preciso que você confirme (pergunta 6).
- As fichas `.json` têm **CPF, RG, data de nascimento e endereço**. Elas ficam no Google Drive, fora do sistema. A segurança
  delas depende de **quem tem acesso a essa pasta do Drive** (ver a seção 6).

**Plano de migração (fase 5):**
1. Antes de tudo, crio **fichas de teste com dados fictícios** (PJ, PF, MEI, com e sem desconto, com avulsos) e guardo os
   documentos que a versão atual gera com elas: a **"foto de referência"**.
2. Coloco o gerador como módulo, trocando **só** o que vem de fora (pdf.js, fontes, logo).
3. Um teste automático abre cada ficha nas duas versões e compara o documento **letra por letra**. Qualquer diferença bloqueia a entrega.
4. Você testa com uma ficha real sua, no seu computador, e confere o PDF.

### 2.4 Marca
- O "SVG" da logo é, na verdade, uma **foto (PNG) dentro de um SVG**. Funciona, mas pesa 350 KB e perde nitidez quando
  ampliado. Se o designer tiver o **arquivo vetorial original** (AI, PDF ou SVG de verdade), ele é o ideal (pergunta 7).
- **Paleta oficial proposta** (a do site, que é a mais recente): verde Novare `#0F5A38`, oliva `#6E8F4A`, quase preto `#1B2620` e branco.
- Fontes: **Inter** (texto) + **Cormorant Garamond** (títulos). O gerador usa Montserrat nos títulos do documento, o que
  fica como está até você decidir.

---

## 3. Críticas do programador: classificação e fase

O CRITICAS.md usa "Grave / Importante / Evolução". Abaixo está a **minha** classificação, no formato que você pediu
(grave / importante / cosmética), com a fase em que cada item é resolvido. Quando discordo do programador, explico.

| # | Crítica | Programador | **Minha classe** | Por quê | Fase | Depende de você? |
|---|---|---|---|---|---|---|
| 1.1 | HTTPS obrigatório + redirecionar `http→https` e com/sem `www` | Grave | **Grave** | Segurança básica. *Não consegui testar daqui, porque a minha rede bloqueia o seu domínio.* No GitHub Pages isso é uma caixinha ("Enforce HTTPS"); na Cloudflare, uma regra | **Agora** (você confere a caixinha) e de vez na fase 3 | Conferir 1 configuração |
| 1.2 | Registrar o `.com.br` | Importante | **Importante** | Protege a marca. Custa cerca de R$ 40/ano no Registro.br | Compra quando quiser; redirecionamento na fase 3 | Sim (compra no CNPJ) |
| 2.1 | Google Analytics, Search Console, Pixel da Meta, eventos | Importante | **Importante**, com ressalva | Medir é útil, mas Analytics e Pixel **exigem um aviso de cookies (LGPD)**. Proposta: **Search Console** já (não usa cookies; o site já tem um arquivo de verificação do Google, então talvez já esteja ativo); **GA4 + eventos** com aviso de consentimento; **Pixel só quando for anunciar**. **Nunca** na área `/sistema` | 6 | Criar as contas e me passar os IDs |
| 3.1 | Mostrar a equipe fundadora | Importante | **Importante** | Dá rosto ao escritório. O link da bio já cita Sylvio Mateus e Maria Luiza Leal | 6 (quando tiver fotos e bios) | Fotos + minibiografias |
| 3.2 | Exibir o CRC em destaque | Importante | **Importante** | Credibilidade, e é simples. Entra no rodapé e na seção "Sobre" | **2** | Confirmar O ou 0 |
| 3.3 | "9 avaliações" no topo × 11 no widget | Grave | **Grave** | Erro visível que fere a confiança. Solução: tirar o número escrito à mão e deixar uma única fonte (o widget) | **2** | — |
| 4.1 | Página 404 personalizada | Importante | **Importante** | O Astro facilita: sai junto com a reconstrução | **2** | — |
| 4.2 | Horário de atendimento visível | Grave | **Grave** | Informação básica. Curiosidade: o código "invisível" para o Google **já diz** seg–sex, 8h–18h, mas a página não mostra | **2** | Confirmar o horário |
| 5.1 | Uma página para cada serviço | Importante | **Importante** | Ajuda no Google e na conversão. É trabalho de conteúdo: eu rascunho, você revisa | 7 | Revisar os textos |
| 5.2 | Casos reais com números | Evolução | **Cosmética / evolução** | Bom, mas depende de autorização dos clientes ou de anonimização (LGPD) | Depois da fase 8 | Reunir os casos |
| 5.3 | Blog | Evolução | **Cosmética / evolução** | O Astro tem isso pronto. Cada artigo vira um arquivo de texto | Depois da fase 8 | Temas e textos |

**Itens que eu achei e que não estavam no CRITICAS.md:**

| # | Problema | Classe | Fase |
|---|---|---|---|
| R1 | **Telefone divergente:** site (85) 99677-8884 × perfil do Google (85) 99980-0899 (número da Maria Luiza no link da bio) | **Grave** | 2 |
| R2 | E-mail `contato@novarecontabilidade.com` marcado no código como "EDITAR: confirmar e-mail oficial" | **Grave** | 2 |
| R3 | CSS só na versão compilada (mudanças de visual "não pegam") | Importante | 1 |
| R4 | O widget Featurable (código de terceiro) não aparece na política de privacidade | Importante (LGPD) | 2 |
| R6 | Logo da Cacau Show: a Novare atende franqueados, não a marca. Trocar por "Franqueados Cacau Show" | Importante (risco jurídico) | 2 |
| R7 | "+12 anos" fixo no texto. Calcular a partir de 2014 | Cosmética | 6 |
| R8 | Imagem de compartilhamento (WhatsApp/LinkedIn) é a logo, e fica cortada | Cosmética | 6 |
| R10 | O GitHub Pages não permite cabeçalhos de segurança; a Cloudflare permite | Importante | 3 |
| R11 | Ano fixo "© 2026" na política de privacidade | Cosmética | 6 |
| R12 | Fonte e peso do link da bio diferentes do site | Cosmética | 6 (se incorporar) |

---

## 4. Arquitetura proposta

### 4.1 Repositório: a minha recomendação (você perguntou)
**Criar um repositório novo e privado, `grupolealsimoes/novare-sistema`**, e deixar o `novare-site` atual intocado até a virada.
- **Privado** porque o sistema terá regras internas (política de descontos, nomes da equipe, caminho da pasta do Drive) e,
  no futuro, módulos com dados. O `novare-site` hoje é **público**.
- **Novo** porque o site atual continua no ar, sem risco, enquanto construímos. Se algo der errado na virada, voltamos
  para ele em minutos. Depois que tudo estiver estável, o `novare-site` é arquivado (não apagado).
- Eu mesmo posso criar o repositório, se você autorizar (pergunta 2).

### 4.2 Tecnologia escolhida e por quê

| Peça | Escolha | Em linguagem simples |
|---|---|---|
| Montagem do site | **Astro** + **Tailwind CSS** | Peças reutilizáveis (cabeçalho, rodapé, botões). A área pública continua estática e rápida |
| Hospedagem | **Cloudflare Pages** | Como o GitHub Pages: cada envio ao GitHub atualiza o site. Gratuita, e permite login e funções no servidor |
| Login | **Cloudflare Access** + verificação no nosso código | Ver 4.4 |
| Banco de dados | **Cloudflare D1**, só quando necessário | O gerador **não precisa**. O formulário de novos clientes provavelmente vai precisar (seção 5) |

**Descartados:** "senha no JavaScript" (não é segurança); Next.js + Vercel + Supabase (≈ US$ 45/mês, porque o plano grátis da
Vercel não permite uso comercial, e tem mais peças para manter); WordPress (atualizações constantes, alvo de ataques).

### 4.3 Hospedagem e domínio
- Público: `www.novarecontabilidade.com`. Restrito: `www.novarecontabilidade.com/sistema`.
- O **DNS** (a "lista telefônica" do domínio) sai da Secrel e passa para a Cloudflare (grátis). O domínio continua registrado
  onde está. Os **registros de e-mail (MX) são copiados exatamente**. É uma fase própria (3), com teste de e-mail e plano de volta.
- Se você comprar o `.com.br`, ele também vai para a Cloudflare e **redireciona** para o `.com` (ou o contrário, pergunta 10).

### 4.4 Como funciona o login
1. Alguém abre `/sistema`. **Antes** de qualquer arquivo ser enviado, a Cloudflare pede o e-mail.
2. Se o e-mail estiver na lista, a pessoa recebe um **código de 6 dígitos** (ou entra com a conta Google). Se não estiver, não vê nada.
3. A entrada vale por um tempo definido (sugestão: 12 horas), e a Cloudflare **registra quem entrou e quando**.
4. **Segunda tranca:** o nosso código no servidor confere a credencial assinada pela Cloudflare. Quem tentar outro caminho
   (como o endereço técnico `*.pages.dev`) é barrado mesmo assim.
5. **Equipe:** você adiciona ou remove e-mails no painel da Cloudflare, sem mexer em código. É grátis até 50 pessoas.
6. **Permissões por módulo (futuro):** um módulo pode ser "só sócios". O servidor bloqueia, não só o menu.

### 4.5 Estrutura de pastas (planejada)

```
novare-sistema/                       ← repositório privado
├── CLAUDE.md · PLANO.md
├── src/
│   ├── marca/                        ← cores, fontes e logo: UMA fonte da verdade
│   ├── componentes/                  ← peças reutilizáveis
│   ├── layouts/  SitePublico.astro · Painel.astro (menu automático)
│   ├── pages/
│   │   ├── index.astro · politica-de-privacidade.astro · 404.astro
│   │   ├── servicos/…                ← (fase 7) uma página por serviço
│   │   └── sistema/  index.astro · [modulo]/…
│   └── modulos/                      ← ★ cada ferramenta interna mora aqui ★
│       ├── _modelo/                  ← módulo exemplo para copiar
│       └── propostas-contratos/      ← módulo 1 (o Sistema.html)
│           ├── modulo.ts             ← ficha: nome, ícone, ordem, quem pode ver
│           ├── Pagina.astro          ← a tela
│           ├── logica/               ← o código atual do gerador
│           ├── testes/               ← fichas fictícias + documentos de referência
│           └── LEIAME.md
├── functions/sistema/_middleware.ts  ← segunda tranca (servidor)
└── public/                           ← fontes, imagens, pdf.js
```

### 4.6 O "padrão de módulo": como criar um módulo novo
1. **Copie** `src/modulos/_modelo` e dê um nome (ex.: `contrato-locacao`).
2. **Preencha a ficha** `modulo.ts`: nome no menu, descrição, ícone, posição, quem pode ver (`todos`/`socios`), `ativo`.
3. **Monte a tela** em `Pagina.astro` com os componentes da marca.
4. **Crie testes** em `testes/` só com dados **fictícios**.
5. Envie ao GitHub. O módulo **aparece sozinho** no menu, num endereço de teste. Você aprova e ele vai ao ar.

**Isolamento:** um módulo só mexe na própria pasta. Pode *usar* `componentes/` e `marca/`, mas não pode alterá-los. Para desligar, use `ativo: false`.

### 4.7 Custo mensal estimado

| Item | Custo |
|---|---|
| Cloudflare Pages + Access (até 50 usuários) + DNS + D1 | R$ 0 |
| GitHub (repositório privado) | R$ 0 |
| Domínio `.com` | o que você já paga |
| Domínio `.com.br` (opcional, crítica 1.2) | ≈ R$ 40 por **ano** |
| **Total mensal novo** | **R$ 0** |
| *Só se um dia passar dos limites gratuitos* | *≈ US$ 5/mês* |

---

## 5. Formulário de novos clientes (avaliação preliminar)

Ainda não vi o formulário (pergunta 4). Sem ele, já dá para adiantar as duas formas de integrar:

| Opção | Como fica | Prós | Contras |
|---|---|---|---|
| **A. Manter o Google Forms atual** e só colocar um link no site | Nada muda | Zero trabalho | Dados ficam espalhados; é preciso redigitar tudo no gerador |
| **B. Formulário próprio no site** (ex.: `/cadastro`) → os dados caem num **módulo "Novos clientes"** no `/sistema` → botão **"Gerar proposta"** já preenche o gerador | Fluxo único: o cliente preenche, você revisa e gera a proposta em 1 clique | Exige guardar dados pessoais no servidor (Cloudflare D1), com aviso de privacidade, consentimento e prazo de exclusão. É o primeiro módulo "com banco de dados" |

**Recomendação inicial:** **B**, como **módulo 2**, depois do gerador estar estável. Ele reaproveita o formato das "fichas" que o
gerador já usa. Vou confirmar a recomendação depois de ver o formulário e saber quais dados ele pede.

---

## 6. Cuidados com a LGPD (resumo; regras completas no CLAUDE.md)
- Login no servidor, com registro de acessos. Nenhuma senha no código.
- **Nenhum dado pessoal real no GitHub:** testes só com dados fictícios.
- O gerador continua processando tudo **no navegador**. As fichas continuam no **Google Drive**. Recomendo revisar
  **quem tem acesso à pasta FICHAS** e ativar a verificação em duas etapas nas contas Google da equipe.
- A área `/sistema` não carrega scripts de terceiros, não aparece no Google e tem cabeçalhos de segurança.
- Analytics e Pixel (crítica 2.1), só no site público e com aviso de consentimento de cookies.
- O formulário de novos clientes (se for a opção B) terá finalidade, consentimento e prazo de retenção definidos com você.

---

## 7. Fases (cada uma testável por você antes da próxima)

Toda fase vai primeiro para um **endereço de teste**. O site oficial só muda com a sua aprovação.

| Fase | Entrega | Como **você** testa | Pronto quando |
|---|---|---|---|
| **0. Preparação** | Repositório privado criado; respostas da seção 8; este plano aprovado | Você lê e aprova | Plano aprovado |
| **1. Site reconstruído, idêntico** | Site em Astro, igual ao atual | Compara os dois lado a lado (celular e computador) | Nenhuma diferença |
| **2. Correções graves e rápidas** | 3.3 avaliações · 4.2 horário · 3.2 CRC · 4.1 página 404 · R1 telefone · R2 e-mail · R4 política · R6 Cacau Show | Lista de conferência item a item | Você aprovar |
| **3. Troca de hospedagem e DNS** | Domínio na Cloudflare; HTTPS obrigatório; `www` padronizado; `.com.br` redirecionando (se comprado); cabeçalhos de segurança; e-mail preservado | Envia e recebe um e-mail antes e depois; testa `http://`, sem `www` e `.com.br`. Plano de volta pronto | Site no ar e e-mail ok |
| **4. Área /sistema com login** | Porteiro + segunda tranca + painel com menu automático + módulo `_modelo` | (a) entra com o seu e-mail; (b) e-mail não autorizado é **barrado**; (c) adiciona alguém da equipe | Os três testes passam |
| **5. Gerador como módulo 1** | `Sistema.html` dentro do painel, com a mesma lógica e testes comparativos | Gera proposta e contrato com uma ficha sua e compara com o arquivo antigo; abre e salva fichas no Drive | Documentos idênticos |
| **6. Medição e acabamento** | Search Console, GA4 + eventos + aviso de cookies, R7, R8, R11, R12, equipe fundadora (se houver fotos) | Confere o aviso de cookies e os relatórios | Você aprovar |
| **7. Páginas de serviço** | Uma página por serviço (crítica 5.1) | Revisa os textos | Você aprovar |
| **8. Manual do módulo** | Guia "como criar um módulo" + verificação automática do padrão | Criamos um módulo de teste seguindo o guia | Aparece no menu sem tocar em mais nada |
| **Depois** | Módulo 2 "Novos clientes" (seção 5), blog, casos reais, outros contratos… | Cada um é uma mini-fase com o mesmo ciclo | — |

> **Faça já, sem esperar o projeto:** no GitHub, `novare-site` → Settings → Pages → confira se **"Enforce HTTPS"** está marcado (crítica 1.1).

---

## 8. Perguntas que preciso que você responda

**Essenciais**
1. ⚠️ **Contrato de moto:** o `Sistema.html` gera **propostas e contratos de serviços contábeis**. Não existe nada de compra
   e venda de moto nele. Existe **outra ferramenta** para moto (que eu ainda não vi), ou foi só um engano no pedido e o
   módulo 1 é este gerador?
2. **Repositório:** posso **criar** o repositório privado `grupolealsimoes/novare-sistema` para você? (Recomendação na seção 4.1.)
3. **Quem acessa o `/sistema`?** Liste os e-mails (pode começar só com o seu). Vocês usam Gmail ou Google Workspace? Se sim,
   dá para entrar com o botão "Entrar com Google".
4. **Formulário de novos clientes:** onde ele está hoje (Google Forms, papel, outro)? Pode me enviar o link ou uma cópia
   das perguntas? Quem preenche: o cliente ou a equipe?

**Dados do escritório (resolvem as críticas graves)**

5. **Horário de atendimento:** seg–sex, 8h–18h (é o que está no código "invisível" do site)? Fecha para almoço? Sábado?
6. **CRC:** o correto é `CRC-CE 030650/O` (letra O, como no gerador) ou `030650/0` (zero, como no CRITICAS.md)?
7. **Logo:** existe o arquivo **vetorial original** (AI, PDF ou SVG feito pelo designer)?
8. **Telefone oficial** do escritório: (85) 99677-8884 ou (85) 99980-0899? E o e-mail `contato@novarecontabilidade.com`
   está recebendo mensagens?

**Decisões que podem esperar**

9. Trazer o **link da bio** para o projeto (`/links`)?
10. `.com.br`: vai comprar? Qual endereço será o **principal**, o `.com` ou o `.com.br`?
11. **DNS:** quem tem acesso ao painel da Secrel? Qual é o serviço de e-mail do `@novarecontabilidade.com` (Google, Microsoft, Secrel)?
12. Posso trocar a logo da **Cacau Show** por um cartão "Franqueados Cacau Show"? Mantemos o **widget Featurable**?
13. No gerador: posso alinhar **a tela** (não o documento impresso) com as cores do site?

---

**Próximo passo:** com a sua aprovação e as respostas 1 a 4, começo a fase 0. Nenhum código será escrito antes disso.
