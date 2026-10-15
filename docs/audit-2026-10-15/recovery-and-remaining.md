# Intervenções restantes, contrato real e recuperação

## Exigem autorização específica antes de executar

| Intervenção | Preparação concreta e condição de paragem |
|---|---|
| TUG-38: recuperar Finance operacional | Criar snapshot consistente autorizado das tabelas Finance/History/Delete Queue e relações; comparar IDs/variantes sem tratar posição da linha como revisão. Reconciliar os oito IDs individualmente, em especial o grupo com três variantes (1+1+46) e os dois sem histórico no intervalo consultado. Produzir dry-run com IDs/campos num anexo privado, checksums antes/depois, operações exatas por célula/linha e plano de rollback. Parar antes de qualquer escrita. A leitura de 13 OUT confirmou 230 linhas/8 IDs e não é snapshot transacional; causa append continua hipótese. Não voltar a escrever grupos com `Deleted=false` sem reconciliação. |
| TUG-45: dados financeiros no código | Inventariar referências sem repetir valores publicamente; confirmar autenticidade com proprietário e definir destino protegido para os valores iniciais. Simular preservação integral de saldos e reversão antes de migrar. Não remover constantes, mudar visibilidade, reescrever histórico Git ou alterar saldos reais nesta missão. |
| TUG-46: cabeçalhos Notes | O contrato atual escreve JSON noteMeta em O, P/Q vazios e conteúdo em R, apesar dos nomes históricos O:Q. Não editar dados guiado por esses cabeçalhos. Alterar cabeçalhos/contrato apenas com snapshot e matriz de compatibilidade/validação entre clientes. A divergência documental está aqui descrita, não corrigida na folha. |
| TUG-48: downgrade para SAFE histórica | Não publicar Notes SAFE20 sobre dados modernos. O round-trip histórico perde dossierId, sectionId, parentNoteId, dossierSections e dossierItems. Desenvolver estratégia versionada que preserve campos desconhecidos ou restaure um snapshot coerente; comparar objetos integralmente antes de autorizar rollback. A SAFE original permanece intacta. |
| Histórico Shopping: exclusão cloud | A tabela de 16 colunas não suporta tombstones. Candidato bloqueia a exclusão cloud sem limpar linhas. Escolher contrato compatível ou operação controlada de exclusão com revisão/snapshot, testar clientes antigos e obter aprovação antes de alargar modelo/migrar dados. |
| Publicação, merge, SAFE | Exigem autorização posterior explícita. Manter IDs/start_url/scope/OAuth e baselines. Rever cumulativamente PR19/20 e esta continuação; PR17 é piloto antigo, não integrar cegamente. |

## TUG-49: inventário de recuperação

`test-v074.html` é um arquivo TEST histórico com JavaScript sintaticamente inválido. Está **excluído dos candidatos a rollback**. Não é a entrada Shopping atual nem a SAFE0.7.33. Não foi apagado ou reescrito; não executar como baseline funcional. Um artefacto histórico só entra no plano de recuperação após compilação, arranque e compatibilidade com o modelo de dados que será usado.

Notes SAFE20 tem incompatibilidade demonstrada com metadados modernos; Finance SAFE56 histórico teve falha de relógio no smoke da auditoria. Manter SAFE intacta não significa autorizar o seu deploy automático. Os hashes/reproduções originais estão na evidência da auditoria de 13 OUT.

## TUG-47: testes ainda necessários

1. O ensaio de contrato numa spreadsheet nova e separada confirmou duas escritas appendCells em A3/A4 com R2 preservada, campos tipados e texto semelhante a fórmula mantido literal. Falta executar com OAuth da aplicação: clientes realmente simultâneos, mesmo ID, resposta perdida após commit, replay, duplicados e edição concorrente. Testar que clientes antigos não podem sobrescrever registos novos; definir controlo de rollout/coordenador se necessário.
2. Browser real: boot completo das seis entradas, botões/CRUD, navegação/privacidade, import/export e recuperação de journal com disco cheio, interrupção em cada passo, tabs simultâneos e reload. Comparar antes/depois todos os campos; ensaiar recuperação de before/after isoladamente antes de permitir recovery operacional.
3. PWA real Android/tablet/PC: instalação limpa e já existente, manter o mesmo ícone, app comum/Training isolado, cold/warm offline, update com duas apps abertas, resposta HTTP de erro, quota de cache e rollback compatível. Não pedir limpeza de dados ou reinstalação como solução de cache.
4. Finance: EUR/UAH, arredondamento, taxas por data/cutoff, Goals/cartões/transferências, conta não existente, dados inválidos em todas as tabelas auxiliares, cálculos históricos e par não suportado. Os cenários desta branch não certificam saldos operacionais.
5. OAuth/ACL e dependências externas: testar autorização com contas de teste autorizadas, expiração, scopes efetivos, permissões da folha e acesso indevido. Não testar serviços externos de terceiros ou modificar autenticação sem autorização adequada.

Critério de aceitação: casos reproduzíveis e resultados guardados, ausência de perda/ACK falso nos cenários aprovados, recuperação integral demonstrada e validação do utilizador no dispositivo. Falta de bugs encontrados não certifica segurança. Estes gates impedem publicação/SAFE automática, mas não justificam deixar de implementar outras correções locais independentes.
