# LUNA TUGI — contrato de apresentação TUG-60

## Arquitetura e compatibilidade

`theme.js`, `analytics.js` e `charts.js` são módulos locais sem dependências runtime externas. O worker inclui-os na whitelist offline. `sync.js`, armazenamento, modelo cloud e autenticação não mudam. Core só muda a constante VERSION. Não existe migração, alteração de schema ou nova tabela. A projeção de leitura da UI é reutilizada enquanto a referência imutável de operações não muda e invalidada após escrita/releitura.

Temas seguem `data-theme` e `luna.visual.theme.v01` com `light`, `dark`, `outdoor`, encontrados nas aplicações irmãs. Claro reutiliza superfícies Shopping e verde Training, Escuro os tokens Notes, Outdoor branco/preto e âmbar Notes. Preferência só é gravada após escolha explícita; leitura inválida/bloqueada não apaga nada. Quota mantém o tema na sessão com aviso. Não mexe em IndexedDB.

## Escopo e fórmulas

A fonte é `C.active(state, 'session', dogId)`; sessões partilhadas contam uma vez para cada cão participante e não se duplicam no mesmo relatório. Revisões em conflito são excluídas com aviso, sem resolver nem eliminar operações. As estatísticas nunca gravam operações.

Períodos 7/30/90 incluem hoje e os N-1 dias anteriores. Datas civis ISO são comparadas sem depender de duração de dias locais/DST; sessões futuras são excluídas e contadas num aviso. Todo o histórico termina hoje. Semanas começam segunda-feira; meses seguem calendário. Intervalos vazios na frequência têm zero sessões. Sem registos há estado vazio.

O modelo atual guarda objetivo textual da sessão, sem commandId. Associação ao comando usa igualdade NFKC, espaços normalizados e minúsculas PT. Não faz substring nem separa objetivos compostos. Renomear um comando não reescreve sessões antigas; estas continuam disponíveis pelo objetivo histórico no filtro. Este limite é preferível a atribuir treinos ao comando errado.

Uma sessão medida exige tentativas e acertos inteiros válidos, tentativas >0 e 0<=acertos<=tentativas. Taxa agregada = 100×soma(acertos)/soma(tentativas), não média simples das taxas de cada sessão. Sem medição a taxa é null, não zero. Evolução mostra apenas sessões medidas e não calcula percentagem de aprendizagem. Distribuição usa acertos e tentativas sem acerto; sessões não medidas ficam à parte. Não há novas categorias de resultado.

Tempo soma durações positivas efetivamente indicadas; número de sessões com duração é divulgado. Comandos trabalhados significa objetivos distintos normalizados. Comparação usa dois períodos iguais consecutivos de N dias; em todo o histórico usa últimos 30 vs 30 anteriores, explicitamente. Variação percentual só existe se o período anterior tiver sessões. Frequência semanal agrupa as sessões por semanas de calendário, sem previsão.

## Representação e limites

SVG usa tokens do tema e posições temporais proporcionais às datas. Seletor acessível, valores exatos e tabela acompanham o gráfico. Uma única medição não é apresentada como tendência. Taxas arredondam visualmente a uma casa decimal e mantêm fração acertos/tentativas. Durações fracionárias permanecem consultáveis. Sem dados não há dados ilustrativos.

Para históricos extensos a frequência desenha os últimos 84 intervalos e a evolução os últimos 120 pontos, com aviso visível. Os totais e tabelas de resumo referem-se ao período filtrado completo. Peso respeita cão/período e é mostrado separadamente dos filtros tipo/comando; não se atribui significado clínico.

O estado de sincronização é global a todos os cães e identificado como tal. Apenas informação real do engine/queue/read-back alimenta os indicadores. Gravação local não implica sincronização. A publicação TEST requer read-back dos 17 assets no origin existente; validação Android/Google real é separada.
