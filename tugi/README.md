# LUNA | TUGI — 0.1.12 TEST · atualização 4

Integração TUG-50–57, em particular TUG-51. Branch independente da auditoria/PR #21. Não fazer merge automático, alterar main/SAFE nem publicar as outras aplicações.

## Base aprovada e módulos

Recuperados o HTML visual TEST 0.1.7, PWA 0.1.8–0.1.10 e fonte MVP 0.1.2. CSS, fotografias originais, iconografia e cores preservam a base aprovada; TUG-59 reorganiza o acesso rápido em três ações e a navegação em quatro áreas. PNGs e manifest vêm da 0.1.10 (`id/start_url/scope: ./`). `tugi.webmanifest` e `tugi-icon.svg` são scaffolding antigo não utilizado nem publicado. O armazenamento antigo não é alterado.

Dashboard; perfis; 29 comandos históricos relatados e 17 sugestões, passos/pré-requisitos, medições por contexto e comandos próprios; treinos e plano editável de 28 dias; ABC; saúde/cuidados; passeios; calendário interno; estatísticas e cronologia; anexos; backup/recuperação, lixo e histórico. Só existe Tugi inicialmente. Ares recebe quatro secções ao ser criado; Jessa não recebe secções presumidas. Só o nome é obrigatório. IDs e dados por cão; desativar secções não apaga registos. Sem datas clínicas, doses ou métricas inventadas.

## Simplificação TUG-59

Avatar abre todos os cães reais e as suas miniaturas. A escolha é local/persistente, com fallback Tugi e confirmação antes de abandonar uma edição; Perfil / foto usa anexos validados existentes. Fotografia recente/selecionada é individual e as anteriores continuam no histórico. Adicionar cão rejeita nomes duplicados dentro da transação, incluindo duas tabs.

Início, Treinos, Comandos, Mais; todos os módulos continuam acessíveis conforme as secções ativas. Registo rápido mantém tipo, comandos/objetivo, duração e nota; detalhes opcionais usam contexto Não registado, tentativas 0 e medições null quando ausentes. Repetir prepara novo ID/data, sem copiar resultados medidos, notas ou outros participantes. Estados Aprendidos/Em treino/Por aprender, mais Todos, com alteração rápida que preserva fiabilidade por contexto. Estatísticas apenas sobre medições efetivas.

## Persistência e sincronização

Schema 2, IndexedDB `luna-tugi-v2`, transação de estado + três snapshots. Cada escrita relê o estado na transação. Dados inválidos não são substituídos; falhas de gravação não alteram o estado visível. JSON com SHA-256 inclui anexos/histórico; importação validada junta os dados. Protótipos content:// ou HTML local devem exportar JSON e importar explicitamente nesta origem HTTPS. Registos antigos sem cão passam para Tugi apenas após confirmação.

Anexos JPEG/PNG/WebP/PDF até 2 MiB, assinatura verificada. HTML/SVG ativo recusado. Nenhum dado clínico real está neste repositório.

Contrato em [DATA_CONTRACT.md](DATA_CONTRACT.md): apenas `Tugi_Operations_v2`/`Tugi_Metadata_v2` na LUNA Data. Log imutável, revisão por pais, tombstones, UUID, SHA-256 e appendCells atómico por operação. ACK exige read-back exato. Conflitos preservam todas as versões e exigem resolução explícita. Nunca clear/rewrite. Tokens Google só em memória; scope spreadsheets, sem mudar permissões das outras apps.

## Alojamento e OAuth

Endereço individual reservado: `https://luna-tugi-test.tugapt892.chatgpt.site`. Confirmar a publicação no último checkpoint Linear. A pasta é servida na raiz estática deste Site privado do proprietário; não substitui o GitHub Pages das outras apps. Manter este endereço e a identidade manifest nas próximas versões.

O administrador Google precisa de autorizar **esse origin exato** no cliente OAuth Web existente, ou fornecer cliente próprio TUGI com o origin autorizado (Mais → Dados → Configuração Google). As ferramentas atuais não permitem inspecionar/administrar origins do Google Cloud; autorização e OAuth real não são presumidos. Não alterar a autenticação das restantes apps.

Android Chrome: abrir HTTPS, autenticar com a conta proprietária ChatGPT se solicitado, menu → Instalar aplicação/Adicionar ao ecrã principal. Fechar/reabrir pelo mesmo ícone e testar modo avião. Instalação, reabertura e leitura offline foram reportadas pelo utilizador para a 0.1.11; a 0.1.12 precisa de nova validação Android.

Worker de âmbito próprio com whitelist estática; não interceta Google/API/auth/query nem cacheia respostas clínicas. Erros HTTP não substituem assets funcionais. Sem ativação automática sobre editor aberto. Mais → Procurar atualização abre /update/?r=tug59-r4 no mesmo origin: o clique explícito verifica e ativa apenas a revisão esperada, sem apagar dados ou recarregar outros editores. O comportamento real PWA/Sites privado requer validação no dispositivo.

## Testes

Nesta pasta: `npm ci --ignore-scripts` e `npm test` (Node >=22). 49 testes: 20 core/IndexedDB/sync, 20 jsdom/UI, 4 worker/VM, 4 updater/DOM e 1 invariantes da release. Dependências apenas de desenvolvimento; runtime sem npm. Evidências e limitações em [TEST_RESULTS.md](TEST_RESULTS.md).

Teste real Google Sheets em fixture isolada passou pelo conector autenticado, não pelo OAuth da aplicação. Node/DOM/VM não substituem browser/Android. Controlador de browser de preview indisponível neste ambiente. Sem notificações garantidas em segundo plano ou calendário externo. Sem aprovação SAFE.
