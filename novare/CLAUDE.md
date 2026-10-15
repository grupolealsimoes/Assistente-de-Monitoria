# CLAUDE.md — Sistema Novare Contabilidade

> Regras permanentes deste projeto. Leia antes de qualquer tarefa. O plano detalhado está em `PLANO.md`.
> (Hoje este arquivo está em `novare/` dentro do repositório Assistente-de-Monitoria. Quando o
> repositório `novare-sistema` existir, ele vai para a raiz de lá.)

## Quem é o usuário e como trabalhar com ele
- Dona/dono do escritório Novare Contabilidade. **Não é programador.**
- Escreva sempre em **português do Brasil**, em linguagem simples. Explique decisões técnicas com analogias curtas, sem jargão solto.
- Trabalhe **por fases** (ver `PLANO.md`). Ao fim de cada fase: publique num endereço de teste, passe uma
  lista do que conferir e **aguarde aprovação** antes de seguir.
- Não amplie o escopo por conta própria. Quando houver uma decisão de negócio, pergunte.

## Arquitetura (resumo)
- **Astro + Tailwind CSS** (com a configuração versionada; nunca editar CSS compilado à mão).
- Hospedagem: **Cloudflare Pages**. Login: **Cloudflare Access** na rota `/sistema/*`, mais
  **`functions/sistema/_middleware.ts`**, que valida no servidor o JWT `Cf-Access-Jwt-Assertion`
  (assinatura, `aud` e expiração). Se a validação falhar, responda 403.
- Banco de dados (**Cloudflare D1**) só quando um módulo realmente precisar guardar dados, com aprovação do usuário.
- Área pública = site institucional. Área restrita = `/sistema`, com ferramentas internas em módulos.

## Padrão de módulo (obrigatório)
Cada ferramenta interna é **uma pasta** em `src/modulos/<nome-do-modulo>/` (minúsculas, com hífen):

```
src/modulos/<nome>/
├── modulo.ts      # ficha: { id, nome, descricao, icone, ordem, permissao: 'todos'|'socios', ativo }
├── Pagina.astro   # tela do módulo, usando componentes de src/componentes e tokens de src/marca
├── logica/        # código próprio do módulo
├── testes/        # testes com dados FICTÍCIOS
└── LEIAME.md      # o que faz, como usar, como testar
```

Regras:
1. Para criar um módulo, **copie `src/modulos/_modelo/`**. O menu do painel descobre os módulos sozinho,
   lendo os arquivos `modulo.ts`. **Nunca** registre um módulo à mão no menu nem nas rotas.
2. Um módulo **só altera arquivos da própria pasta**. Ele pode *importar* `src/componentes` e
   `src/marca`, mas não pode editá-los nem importar código de outro módulo. Mudanças compartilhadas
   são uma tarefa separada, aprovada à parte.
3. Desligar um módulo = `ativo: false`. Não apague a pasta sem pedido explícito.
4. A permissão declarada em `modulo.ts` vale **também no servidor** (o middleware bloqueia),
   não só para esconder o item do menu.
5. Todo módulo novo precisa de testes e de um `LEIAME.md` antes de ser entregue.

### Gerador de contratos de moto (módulo `contrato-moto`)
- É o módulo 1, e **já funciona**. Preserve a lógica dele. Antes de qualquer alteração, crie
  **testes de referência**: com dados fictícios fixos, gere os contratos na versão original e guarde
  o resultado. Toda mudança precisa gerar contratos **idênticos**. Se aparecer diferença, pare e pergunte.
- Não "melhore" o texto jurídico do contrato sem pedido explícito.

## Identidade visual
- Cores (tokens em `src/marca`; não use cores hexadecimais soltas no código dos módulos):
  - Verde Novare (principal): `#0F5A38`. Variações: `#0B4A2E` (escuro), `#17663F`, `#3F7644`, `#4E8447`
  - Oliva (destaque): `#6E8F4A`. Fundos claros: `#EDF1E9` (mist), `#EEF3E7`, bordas `#CBD8C0` / `#D9E3CE`
  - Texto (quase preto): `#1B2620`. Fundo: branco `#FFFFFF`
  - Degradê de marca: `linear-gradient(135deg, #0F5A38, #6E8F4A)`
- Fontes (salvas no próprio site, sem Google Fonts nem CDN): **Inter** (texto, 400–700) e
  **Cormorant Garamond** (títulos, 500–600).
- Visual: cantos arredondados, sombras suaves, bastante espaço em branco, ícones de traço (stroke).
- **Responsivo sempre:** teste em 360px (celular) e 1280px (computador). Sem rolagem lateral.
- Respeite `prefers-reduced-motion`. O painel `/sistema` deve ser sóbrio, sem animações decorativas.
- Acessibilidade: contraste AA, `alt` nas imagens, foco visível, rótulos nos campos de formulário.

## LGPD e segurança (inegociável)
- **Nunca** coloque senha, token ou chave no código da página ou no repositório. Segredos ficam nas
  variáveis de ambiente da Cloudflare.
- **Nunca** coloque dados pessoais reais (nome, CPF, RG, endereço, telefone, placa/chassi vinculados a uma
  pessoa) no repositório, em commits, testes, logs, mensagens de erro, URLs ou query strings. Testes usam
  dados fictícios (ex.: CPF gerado para teste).
- Por padrão, os módulos processam os dados **no navegador** e **não guardam nada no servidor**. Persistir
  dados pessoais exige aprovação do usuário, com finalidade e prazo de retenção definidos e documentados no `LEIAME.md` do módulo.
- Não use `localStorage`/`sessionStorage` para dados pessoais. Rascunhos, se existirem, são apagados ao sair.
- `/sistema` não carrega **nenhum script ou recurso de terceiros** (analytics, widgets, CDNs, fontes externas).
- `/sistema` sempre com `noindex` e bloqueado no `robots.txt`. Cabeçalhos de segurança configurados
  (CSP, `X-Frame-Options: DENY`, `Referrer-Policy`, HSTS).
- Logs registram **quem acessou e quando**, nunca o conteúdo dos contratos.
- Repositório do sistema: **privado**.
- Todo recurso de terceiros no site público (ex.: Featurable, Google Maps) deve constar na política de privacidade.

## Antes de entregar qualquer fase
- Rode o build e os testes. Todos precisam passar.
- Confira em largura de celular e de computador.
- Para mudanças em `/sistema`: confirme que um usuário não autorizado recebe 403.
- Escreva para o usuário: o que mudou, como testar (passo a passo) e o que ainda falta.
