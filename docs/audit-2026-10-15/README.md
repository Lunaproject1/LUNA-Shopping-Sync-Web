# LUNA — continuação de correções isoladas, 15 OUT 2026

Este candidato prolonga a PR20 (`70fcbdd8d58fcddd34a400a8be42f1f8cf737921`) e herda a correção de sintaxe da PR19. Não é uma release, não foi publicado nas aplicações instaladas e não altera main, SAFE ou LUNA Data. Os números de versão existentes foram mantidos: não identificam uma nova versão aceite. Verificar o commit da branch para identificar este candidato.

## Alterações e critérios verificados

| Issue | Alteração candidata | Evidência e limite |
|---|---|---|
| TUG-29 | Shopping deixa de limpar/recriar tabelas: atualiza exclusivamente linhas de IDs dirty, acrescenta novos registos e confirma o payload antes de reconciliar. | Falha de escrita, resposta divergente, edição em curso e inserção independente não apagam linhas alheias. Não é CAS nem transação entre tabelas. Eliminações do histórico param com `SYNC_HISTORY_DELETE_REQUIRES_REVIEW`, pois o contrato de 16 colunas não tem tombstone. Nenhuma nova coluna criada. |
| TUG-34 | Separadores conservam tombstones; a UI filtra apenas na apresentação. Edição/eliminação local tem dirty/timestamp explícitos. Cópia legada sem timestamp não adquire revisão mais recente por sincronizar. | Tombstone remoto prevalece sobre cópia antiga e não reaparece na navegação. Eliminar separador e mover itens é uma gravação local conjunta. |
| TUG-35 | Novas linhas Notes usam `spreadsheets.batchUpdate/appendCells`, com sheetId obtido por título exato, células tipadas e coluna A implícita. | Dois clientes simulados, após lerem o mesmo snapshot, conservam ambas as criações. Linhas anómalas fora de A não desviam a coluna inicial. Não usa `values.append`, não cria tabelas, não muda schema/scopes. IDs duplicados ou read-back divergente bloqueiam ACK. Clientes antigos continuam perigosos; Contrato appendCells confirmado também em Google Sheets separada, com payload do helper enviado pelo connector e read-back tipado; OAuth/app e clientes antigos continuam por validar antes de deploy. |
| TUG-31 | Guarda local incorporada nas seis entradas: preflight JSON/tipo, bloqueio antes dos scripts da aplicação, preservação do bruto e export de recuperação. | JSON truncado e forma incompatível bloqueiam sem sobrescrever os originais. Chaves existentes mantidas. Não é um reparador universal de schemas/campos nem encriptação. |
| TUG-41 | Journal before/after antes de gravar grupos de chaves; confirmação de leitura antes de remover o journal. Falha/interrupção pausa a aplicação e conserva recuperação. | Persist Notes/Finance; Finance recorrências, cartões/contas e metadados/parcelas; Shopping compra/histórico, fecho, eliminação/movimento de separadores e import. Falha de quota em cada passo principal e reabertura com journal testadas. Não restaura automaticamente nem promete transação entre tabs antigas ou cloud/local. |
| TUG-30 | Estende ACK por payload à entrada Finance legada e aos syncs de contas, cartões e parcelas de ambas as entradas. Preserva diferenças locais dirty, mesmo com timestamp igual/mais antigo, até resolver conflito. | Eco exato, divergência, falha, edição durante pedido e remoto mais recente testados; sem sucesso final se existe dirty. Rotinas não têm CAS; reconciliação cloud continua apenas leitura. |
| TUG-36/39 | Montantes inválidos não são formatados como zero. Conversão sem taxa válida/par suportado propaga indisponibilidade; saldos/totais mostram `Indisponível`. Operações Goals/retirada e formulários rejeitam valores não finitos. | EUR↔UAH, taxa ausente/zero/negativa/infinita, valor inválido, zero legítimo, saldo/UI e bloqueio de criação financeira testados. Histórico deixa de substituir taxa ausente por taxa corrente. Cache da última taxa válida existente é preservada; não se inventaram taxas nem se alteraram movimentos. |
| TUG-37 | Mantém a proteção de IDs/HTML da PR20 e aceita attempts omitido em backup Training legado. | Omissão opcional aceita; attempts explicitamente inválido continua rejeitado. Compatibilidade de todos os backups históricos não demonstrada. |
| TUG-42/43 | Conserva a proteção cache da PR20. Install prepara páginas APPS em falta sem substituir páginas válidas já aquecidas; Training passa a registar o worker comum existente e a página/manifest entram na preparação offline. | 21 cenários VM/CacheStorage, incluindo cold install seguido de offline para quatro apps. Registo Training observado em DOM mock. Mantém cache v14, manifest/id/start_url/scope e worker comum. Não equivale a instalação PWA real. |

## Protocolo local proposto

`src/luna-storage-guard.js` é incorporado por `scripts/embed-storage-guard.cjs`; não acrescenta dependência externa ao arranque offline. O gerador é idempotente e as seis cópias são comparadas no teste. Os dados continuam nas chaves antigas. A única nova chave é `luna.integrity.<app>.pending.v1`, exclusivamente um registo de recuperação contendo before/after das escritas agrupadas.

Se guardar o journal falhar, nenhuma chave do grupo é alterada. Se uma escrita seguinte falhar ou a sessão interromper, o journal e as versões originais/candidatas permitem investigar; no arranque seguinte a aplicação pausa. Não apaga o journal nem escolhe uma versão automaticamente. Uma gravação bloqueada não significa que os últimos dados foram guardados integralmente. O export contém dados privados e deve ficar sob controlo do proprietário.

Uma alteração do armazenamento por outro tab bloqueia a instância candidata; a comparação antes de escrever também deteta uma cópia persistida diferente. Isto é proteção conservadora, não um bloqueio transacional entre processos: Web Storage não oferece CAS e clientes antigos não respeitam o protocolo. Exige teste real de tabs, quota e recuperação antes de publicação; política de atualização de todos os clientes e espaço extra para before/after são gates.

## Escrita cloud proposta

Para novas linhas Notes/Shopping, `appendCells` usa sheetId e RowData com `userEnteredValue`, sem `formulaValue` nem deteção de tabela lógica. Referências primárias consultadas: [AppendCellsRequest](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AppendCellsRequest), [batchUpdate](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/batchUpdate). O servidor escolhe a linha final; o código relê o intervalo e exige identidade única/payload exato antes do ACK. A inferência de que isto elimina a corrida de reserva de linha de clientes candidatos está demonstrada no modelo sintético, complementada por um ensaio numa spreadsheet Google separada: duas escritas sequenciais com metadados iniciais iguais foram alocadas em A3/A4 e preservaram R2. O transporte usado foi o connector autenticado, não o OAuth da aplicação; concorrência simultânea no Google e clientes mistos continuam por testar.

Não repetir automaticamente uma operação não idempotente após resposta ambígua. Shopping desativa retry automático apenas no batchUpdate usado por appendCells; a próxima sincronização procura primeiro o ID existente. Notes já não repetia automaticamente. Corridas do mesmo ID geram conflito/duplicado detetado; não são resolvidas apagando linhas. Escritas por linha existentes continuam expostas a alterações estruturais concorrentes da folha e à política last writer wins. Nenhuma promessa de serialização global.

Finance mantém o mecanismo append anterior nesta sessão. Não foi atribuída causa ao incidente TUG-38 nem executada reconciliação. ACK mais rigoroso deteta divergência; não garante que uma escrita cloud incorreta anterior seja automaticamente revertida.

## Testes reproduzíveis

Node 24.19.0; jsdom 30.1.2; acorn 8.19.0 (harness/inspeção, não dependências da aplicação).

```sh
npm install --prefix /tmp/luna-audit-deps jsdom@30.1.2 acorn@8.19.0
export NODE_PATH=/tmp/luna-audit-deps/node_modules
node tests/audit-safe-candidates.cjs
node tests/audit-integrity-continuation.cjs
node tests/audit-finance-unavailable.cjs
node tests/audit-auxiliary-sync.cjs
node tests/audit-release-boundaries.cjs
node tests/audit-cache-candidates.cjs sw.js
node tests/notes-roundtrip.cjs notes-v013.html
git diff --check
```

Resultado final: **148/148 cenários aprovados** (26 anteriores + 42 integridade + 22 Finance + 33 auxiliares + 4 limites + 21 cache), mais **99 assertions Notes** e um **ensaio de contrato real Google Sheets isolado**, com read-back integral de duas linhas e verificação dos tipos, texto literal e linha anómala preservada. `git diff --check` aprovado. As baselines dos testes novos têm helpers/garantias ausentes; estes totais não representam bugs independentes. Os JSON deste diretório contêm resultados sintéticos, sem registos operacionais. `baseline-*` executam os testes novos contra a PR20; falhas por helper inexistente e requisitos novos não são contagens de bugs independentes. Os cenários de falha e corrupção da auditoria de 13 OUT constituem também reprodução prévia. Mantêm-se os 99 assertions Notes e a diferença entre testes técnicos e aceitação Android.

Durante o desenvolvimento, a primeira ronda FX falhou em quatro casos: o fixture tinha privacidade ativa e data anterior ao cutoff contabilístico; foi corrigido. A ampliação aos syncs legados detetou nove falhas por estado `written` não declarado; as rotinas foram alinhadas com a implementação corrigida. Um teste direto de syncAccounts concorria com a hidratação inicial do harness; passou a aguardar load antes de injetar dados. A suite final reexecuta os casos afetados. Não se ocultam esses resultados iniciais como sucesso.

Tentou-se instalar Chromium via Playwright 1.58.2. O download Chrome for Testing 145 devolveu arquivo vazio/truncado e falhou; não houve execução em browser real. Nenhuma simulação contou como teste em Android, tablet, PWA instalada, OAuth ou Google Sheets via OAuth da aplicação. O ensaio real isolado registado em cloud-contract-results.json usou o connector, sem tocar na LUNA Data.

## Pendências e critérios de publicação

Ver [recovery-and-remaining.md](recovery-and-remaining.md). A missão de desenvolvimento seguro fica entregue como candidato verificável; a auditoria integral, a recuperação operacional e a aceitação continuam abertas. Nenhum finding corrigido em branch deve ser considerado aceite apenas pelos testes locais. Não fazer merge automático das PR17/19/20 nem desta continuação.
