# Publicação gratuita no GitHub Pages

Destino: **https://hotfoxboy.github.io/la-umrah-travel/**.

## O que foi adaptado

- Next.js 16: `output: 'export'`, `basePath` e `assetPrefix` `/la-umrah-travel`, `trailingSlash: true`, sem `distDir: 'out'`. O compilador usa `.next` e exporta o resultado final para `out`.
- `next/image` conserva os componentes e o aspecto, mas usa `unoptimized: true`, pois não existe optimizador de imagens num servidor GitHub Pages.
- `lib/paths.ts` centraliza o domínio e o prefixo. `next/link` aplica o prefixo automaticamente; ficheiros públicos, metadados e APIs do navegador usam `assetPath`. O estado activo da navegação normaliza o prefixo e a barra final.
- `sitemap.xml`, `robots.txt` e `manifest.webmanifest` são gerados no build, com `dynamic = 'force-static'`. A imagem Open Graph é um PNG estático idêntico à saída do gerador original, preservado em `server/assets`.
- As rotas dinâmicas já possuíam `generateStaticParams`. `dynamicParams = false` impede depender de geração de novas páginas no servidor. As fórmulas não comercializadas continuam sem páginas exportadas.
- O service worker regista-se apenas no subdirectório deste projecto. O seu cache inclui apenas a página offline e ícones, é identificado pelo scope e não apaga caches de outros projectos no mesmo domínio GitHub.
- CSS, estrutura visual, textos das páginas e catálogo não foram redesenhados. As mensagens do formulário foram adaptadas apenas para explicar correctamente o modo de transmissão disponível.

## Compilar e verificar localmente

Requer **Node.js 22.18 ou superior** para os scripts de verificação TypeScript nativos, sem novas dependências.

```sh
npm ci
npm run build
npm run test:export
npm run test:pwa
npm run test:quote
npm run lint
npm start
```

Abrir **http://localhost:3000/la-umrah-travel/**. O comando `start` serve apenas os ficheiros de `out`, sem Next.js em execução, e reproduz o subdirectório, as barras finais e respostas 404. Para outra porta, definir `PORT` antes de executar o comando. Em PowerShell com scripts desactivados, usar `npm.cmd`.

`npm run dev` também usa o prefixo; abrir o mesmo caminho. Não usar `next start`: não é compatível com esta exportação estática. O preview local tem cabeçalhos sem cache para facilitar a verificação; isso não configura os cabeçalhos da hospedagem GitHub Pages.

`npm run test:export` verifica todos os HTML, caminhos de recursos, imagens responsivas, CSS/JS, ícones, metadados, manifesto, sitemap, ficheiros de página, ausência da API e respostas HTTP. O teste não publica nem envia emails. `npm run test:quote` usa respostas simuladas em memória; não contacta serviços externos.

Para o teste opcional em Chrome:

```sh
npm run test:mobile
```

Definir `TEST_BASE_URL=http://localhost:3000/la-umrah-travel` e `CHROME_PATH` se necessário. Os testes visuais anteriores foram ajustados ao prefixo. A emulação não substitui testes em Safari/iOS e dispositivos físicos.

## Funcionalidades sem servidor

| Funcionalidade original | Limitação no GitHub Pages | Alternativa preparada |
| --- | --- | --- |
| `POST /api/devis` e envio automático via Resend | Não executa Node.js, POST Route Handlers nem chaves secretas | Código original preservado em `server/quote/route.ts`. Por defeito, o formulário validado abre um email preenchido no programa do visitante. |
| Confirmação de envio de orçamento | Abrir um programa de correio não prova envio ou recepção | Não é apresentada confirmação de transmissão nesse modo. O visitante revê e envia o email. É necessário um programa/serviço de correio configurado; alguns clientes podem limitar mensagens longas. |
| Validação e antispam no servidor | Não existe servidor da aplicação | Validação Zod e honeypot continuam no cliente; protecções fortes e limitação de pedidos pertencem ao backend opcional. |
| Optimização de imagens em tempo real | Não existe `/_next/image` | Ficheiros locais e variantes AVIF/WebP já existentes, mantendo `next/image` sem optimizador em runtime. |
| Novas páginas geradas a pedido ou alterações imediatas ao catálogo | A hospedagem serve ficheiros já gerados | Alterar a configuração e gerar um novo build; Actions fará isso após um push autorizado para `main`. |
| Cabeçalhos, rewrites e redirecionamentos Next no servidor | Não são executados na hospedagem estática | Rotas com `trailingSlash` e ficheiros `index.html`; cabeçalhos de produção são geridos pela plataforma. |

Favoritos locais, galeria, acordeões, navegação, telefone, email, WhatsApp configurado, mapa a pedido e PWA continuam disponíveis. As páginas offline não guardam dados pessoais nem apresentam preços antigos.

O ficheiro `robots.txt` do projecto funciona em `/la-umrah-travel/robots.txt`, mas os motores de busca consultam normalmente o `robots.txt` na **raiz do domínio**. Este repositório não controla `https://hotfoxboy.github.io/robots.txt`. O sitemap publicado pode ser submetido manualmente a uma ferramenta de pesquisa; se necessário, gerir o robots da raiz no repositório do site principal.

## Endpoint de orçamento opcional

Não é obrigatório contratar ou criar nenhum serviço. Com `NEXT_PUBLIC_QUOTE_ENDPOINT` vazio, o formulário prepara o email e informa que ainda não houve transmissão. Os dados não são guardados em localStorage nem no service worker.

Se disponibilizar um backend próprio, definir a **URL HTTPS pública** em `NEXT_PUBLIC_QUOTE_ENDPOINT` antes do build. Deve aceitar POST JSON, validar todos os dados, implementar antispam, autorizar CORS/OPTIONS para `https://hotfoxboy.github.io` e devolver `{"ok":true}` apenas após transmissão ou registo efectivo. O frontend não confirma sucesso em respostas HTTP inválidas, ausência desse reconhecimento ou falhas de rede. Ver `server/quote/README.md`: a versão original recusa origens diferentes e exige adaptação para uso entre domínios.

**Nunca** colocar `RESEND_API_KEY`, senhas SMTP ou outros segredos em variáveis `NEXT_PUBLIC_*`, ficheiros públicos ou no código exportado. Os segredos pertencem exclusivamente ao backend. Os exemplos para esse backend estão em `server/quote/.env.example`.

## GitHub Actions — preparado, não executado

O ficheiro `.github/workflows/deploy-pages.yml` instala as dependências, verifica lint, executa o build e testes estáticos/PWA/orçamento, envia apenas `out` como artefacto e publica no ambiente `github-pages`.

Dispara em alterações na branch `main` ou manualmente por `workflow_dispatch`. O job de build tem apenas leitura; o de publicação recebe `pages: write` e `id-token: write`. Não cria commits nem altera o repositório através do workflow.

**Nenhum commit, push, workflow remoto ou publicação foi realizado nesta preparação.** Quando autorizar a publicação:

1. Confirmar o repositório `hotfoxboy/la-umrah-travel` e a sua estrutura: `package.json`, `package-lock.json`, `app`, `public` e `.github` na raiz. Para GitHub Free, usar um repositório público.
2. Em **Settings → Pages → Build and deployment → Source**, seleccionar **GitHub Actions**.
3. Opcionalmente, em **Settings → Secrets and variables → Actions → Variables**, definir `NEXT_PUBLIC_WHATSAPP_NUMBER` (número confirmado) e `NEXT_PUBLIC_QUOTE_ENDPOINT`. Valores vazios mantêm telefone e modo de email local.
4. Após autorização, enviar as alterações para `main` ou executar o workflow manualmente. A execução publicará o site; não a iniciar antes de autorizar.
5. Verificar o resultado em Actions, o URL final, as imagens e os contactos. Só um endpoint real permite testar entrega efectiva do formulário.

Não enviar `.env.local`, chaves, `node_modules`, `.next`, `.next-redesign`, `.audit-tools` ou perfis/capturas de teste. `out` é gerado pelo workflow e não precisa de ser guardado no Git.

## Referências oficiais

- [Next.js: exportação estática](https://nextjs.org/docs/app/guides/static-exports)
- [GitHub Pages: workflows personalizados](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages: seleccionar a origem de publicação](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
