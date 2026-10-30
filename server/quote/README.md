# API de orçamento preservada

`route.ts` é a implementação Node.js original de `app/api/devis/route.ts`, movida sem eliminar a lógica. GitHub Pages não executa POST Route Handlers, validação de servidor ou envio Resend. Este ficheiro não faz parte das rotas estáticas nem de `out`.

Para reutilizar num backend Next.js separado, copiar para `app/api/devis/route.ts` desse backend e disponibilizar `lib/quote.ts`. Configurar os segredos Resend apenas nesse servidor. Se o domínio for diferente, adaptar explicitamente o controlo de origem e CORS/OPTIONS para `https://hotfoxboy.github.io`, manter a validação, antispam e limitação de pedidos. O controlo de origem actual recusa pedidos entre domínios: requer essa adaptação antes de ligar o frontend.

O frontend aceita `NEXT_PUBLIC_QUOTE_ENDPOINT` com a URL HTTPS desse endpoint; requer uma resposta JSON `{"ok":true}` apenas depois de o pedido ser transmitido ou guardado realmente. O endpoint é opcional. Nenhum serviço externo é criado ou contratado.

Sem endpoint, o formulário prepara um email no programa de correio do visitante e informa que ainda não houve transmissão. Não há confirmação de envio nem armazenamento local de dados pessoais.
