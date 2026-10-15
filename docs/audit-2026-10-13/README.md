# LUNA — correções isoladas da auditoria · 13 OUT 2026

Base: b669cb5b85acf2c5709cdbb258b4ffda987ba40d, correção TUG-28 já existente na draft PR #19. Main observado: c8ea15823778e510e8f0a23184e1d7cbaefaedf2. Este conjunto é candidato TEST em branch isolada, sem publicação, merge ou promoção SAFE. Os números de versão visíveis permanecem os publicados na base; não são designação de uma nova release aprovada.

## Correções preparadas

| Issue | Alteração | Limite |
|---|---|---|
| TUG-28 | Correção de separador herdada da PR19; quatro scripts Finance compilados | PR19 não merged; aceite operacional ainda pendente |
| TUG-30 | Notes49/Finance98 só confirmam escrita quando o read-back reproduz o payload enviado; divergência/ausência lança erro antes de substituir o estado local; edição durante a escrita fica dirty; estado final não diz Sincronizado se há alterações pendentes | Não fornece CAS, revisão autoritativa, coordenação cloud ou garantia de convergência; Finance91 conserva o seu algoritmo de sync antigo |
| TUG-32 | renderViewSource aceita apenas HTTP(S), incluindo rotas relativas normalizadas; outros esquemas aparecem só como origem em texto | Proteção do sink conhecido; não é auditoria XSS global |
| TUG-33 | Relógio suporta ausência dos IDs heroDate/heroTime nas duas entradas Finance | Bootstrap DOM sem exceção não valida browser/PIN/sync reais |
| TUG-36 | Valor ativo Finance vazio/inválido conserva estado inválido até o guard rejeitar, em vez de se tornar zero; zero legítimo passa | Comportamento anterior dos tombstones preservado; não repara montantes ou dados reais |
| TUG-37 | IDs nas interpolacões HTML Training são escapados; import valida top-level, coleções, IDs únicos/sintaticamente seguros e estrutura exercícios/attempts antes da confirmação/substituição; favoriteWeapons em nomes legacy continua permitido | Não cifra dados, não resolve corrupção da fonte local nem substitui recuperação transacional |
| TUG-40 | Decoder de tags preserva texto malformado sem lançar URIError; UTF-8 válido mantém interpretação | Tag preservada pode continuar semanticamente inválida; não se inventa categoria |
| TUG-42 | response.ok antes de cache.put, waitUntil registado no callback, fallback só para cache válida; falta de cache devolve Response.error; falha da escrita cache não rejeita a promessa de lifetime; mantém luna-suite-v14 | Evita eliminar páginas aquecidas na migração v14→v15 do anexo; não garante cold-start offline de apps (TUG-43) |
| TUG-44 | Confirmação de concluir nota conta checklists inline além dos checks clássicos | Preserva o modelo/conteúdo existentes; precisa UX Android |

Notes permanente e versionada mantêm bytes iguais. Manifests/id/start_url, luna-core.js, OAuth/scopes/SID, nomes de folhas/colunas, chaves de armazenamento, Shopping e dados operacionais não foram alterados. Não há alteração retroativa de artefactos SAFE.

## Reprodução e resultados

Node24.19.0/jsdom30.1.2. Origem sintética, rede bloqueada/mock, sem sessão Google, tokens reais ou dados operacionais. Timers desativados no harness. VM usa mocks de Service Worker/CacheStorage; não é worker real.

```bash
npm install --prefix /tmp/luna-audit-deps jsdom@30.1.2
NODE_PATH=/tmp/luna-audit-deps/node_modules node tests/audit-safe-candidates.cjs
node tests/audit-cache-candidates.cjs sw.js
NODE_PATH=/tmp/luna-audit-deps/node_modules node tests/notes-roundtrip.cjs notes-v013.html
```

- Base b669cb5: 26 cenários, 9 passam/17 falham. Inclui as reproduções conhecidas e um controlo novo que requer helper inexistente na base; não equivale a 17 bugs distintos.
- Candidato: 26/26 passam. Cobre bootstrap/sintaxe de seis entradas, echo/mismatch/ausência/edição concorrente com timestamp igual, estado Notes, URLs, confirmação inline, montantes, tags, saldo/transferência/breakdown sintéticos, import/render Training e igualdade das entradas Notes.
- Anexo TUG42 original: bateria inicial14/15; bateria final com gates adicionais13/17. Não passou preservação offline na migração de cache, registo síncrono de waitUntil, exclusão de cache antiga inválida e contenção da rejeição de escrita cache. Os últimos gates não são provas de quatro falhas operacionais em browser real; em particular não se demonstrou que uma rejeição de cache.put impediria a resposta HTTP original.
- SW corrigido: 17/17 passam, incluindo404/500/502 em quatro rotas, cold fallback, migração sem perda da cache aquecida, cache antiga inválida, quota e lifetime.
- Editor Notes:99 assertions aprovadas. As falhas históricas deliberadas do baseline no teste existente não são regressões do candidato.
- git diff --check aprovado; campos de identidade e ficheiros acima comparados sem alterações.

Resultados JSON anexos contêm exclusivamente fixtures sintéticas. Leituras reais TUG38 foram registadas apenas no Linear, sem exportar registos/IDs/valores para este repositório.

Referência do ciclo de vida: https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil — adotou-se registo de waitUntil dentro do callback do evento. Nenhuma validação Android/Service Worker real decorre desta referência ou dos mocks.

## Intervenções paradas e plano

- TUG-29/34: não copiar cegamente PR17. Preparar upsert/tombstones/read-back por linha e garantir idempotência/alocação concorrente em folha de teste. O main ainda usa clear/rewrite; remoção segura exige revisão do protocolo completo e integração com o piloto.
- TUG-35: PUT em nextRow calculado por cliente não fornece exclusão mútua. Requer alocação coordenada/atómica demonstrada. Não voltar cegamente a append; TUG38 exige investigação de tableRange/updatedRange. Nenhuma mudança de modelo cloud nesta sessão.
- TUG-31/41: preparar armazenamento com quarentena da fonte inválida, snapshot coerente/journal ou transação, recuperação e aviso acionável. Validar espaço/quota/falha em cada etapa e todas as escritas das apps antes de migrar chaves. A proteção de import Training não resolve esses issues.
- TUG-39: mapear propagação de câmbio indisponível até todos os saldos/analytics; não basta return null, pois aritmética/formatters podem reconvertê-lo em zero. Preparar estado indisponível e fixtures multimoeda antes de alterar cálculos.
- TUG-38: reconciliação/snapshot e recuperação exigem autorização operacional específica. Sem escrita ou escolha automática de cópia.
- TUG-43/45/46/48: prontidão offline completa, configuração financeira privada, schema cloud e downgrade/restore continuam pendentes; não houve migração, alteração de cabeçalhos nem modificação SAFE. TUG49 permanece arquivo inválido, sem necessidade de publicar patch.

## Antes de qualquer integração/publicação

Revisão do diff e read-back do commit; testar browser/Android/tablet/PC reais, PWA instalada, PIN/arranque, payloads/API reais em cloud de teste, conflito/rollback/imports antigos e preservação de dados. Avaliar blockers de integridade acima antes de aplicar o conjunto. Não fazer merge automático de PR17/19 ou deste candidato. Publicação nas apps instaladas, mudança operacional de dados/contratos e promoção SAFE requerem autorização explícita.
