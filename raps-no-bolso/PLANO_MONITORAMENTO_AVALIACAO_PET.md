# RAPS no Bolso — Plano de Monitoramento e Avaliação

**Status:** versão de trabalho para pactuação com Instituto Federal e Secretaria de Saúde  
**Produto:** PWA RAPS no Bolso  
**Finalidade:** apoiar melhoria contínua, cocriação com usuários e avaliação do uso da solução digital no SUS.

## 1. Princípio

A avaliação não deve se limitar a satisfação. O projeto deve verificar se a pessoa:

1. encontra a informação ou função necessária;
2. compreende o conteúdo apresentado;
3. identifica um próximo passo adequado;
4. consegue concluir tarefas sem ajuda excessiva;
5. encontra barreiras de navegação, acessibilidade ou conteúdo;
6. percebe melhorias entre ciclos sucessivos do produto.

Os resultados devem gerar decisões de produto documentadas: problema observado → mudança proposta → versão implementada → novo teste.

## 2. Instrumentos previstos

### A. Feedback rápido por página
Pergunta curta após o uso de uma página: “Esta página ajudou você a saber o que fazer?”.

Resultados possíveis: Sim / Mais ou menos / Não.

**Uso:** localizar páginas que precisam de revisão prioritária.

### B. Feedback detalhado
Registra:
- área utilizada;
- conclusão do objetivo;
- clareza (1 a 5);
- facilidade (1 a 5);
- entendimento do próximo passo;
- observação opcional sobre barreira encontrada.

**Uso:** identificar problemas de linguagem, arquitetura da informação e navegação.

### C. Teste guiado de usabilidade
Em oficina ou sessão estruturada, uma tarefa é definida e o sistema registra:
- código aleatório da sessão, sem nome;
- tarefa;
- tempo de conclusão;
- sucesso, sucesso parcial ou não conclusão;
- necessidade de ajuda;
- número de obstáculos observados;
- principal barreira;
- clareza;
- facilidade;
- entendimento do próximo passo;
- observação opcional.

**Uso:** comparar versões e verificar se mudanças realmente melhoram o desempenho.

## 3. Indicadores principais

| Indicador | Definição / cálculo | Fonte | Periodicidade sugerida | Uso para decisão |
|---|---|---|---|---|
| Taxa de conclusão de tarefa | sessões concluídas com sucesso ÷ sessões válidas × 100 | teste guiado | por ciclo de teste | rever rotas com baixa conclusão |
| Próximo passo compreendido | respostas “sim” ÷ respostas válidas × 100 | feedback + teste | mensal / por ciclo | revisar conteúdo e chamadas para ação |
| Clareza média | média das notas de 1 a 5 | feedback + teste | mensal | priorizar textos abaixo da referência pactuada |
| Facilidade média | média das notas de 1 a 5 | feedback + teste | mensal | rever arquitetura, botões e nomenclatura |
| Tempo médio por tarefa | soma dos tempos ÷ testes concluídos | teste guiado | por ciclo | comparar versões da mesma tarefa |
| Obstáculos por sessão | total de obstáculos ÷ sessões | teste guiado | por ciclo | localizar pontos de fricção |
| Tipo de barreira mais frequente | frequência por categoria | teste guiado | por ciclo | definir backlog de melhoria |
| Utilidade percebida da página | “sim” ÷ respostas rápidas válidas × 100 | feedback rápido | mensal | localizar páginas prioritárias |
| Melhorias originadas da participação social | mudanças implementadas com origem documentada em usuário/oficina/conselho ÷ total de mudanças | backlog/registro do projeto | trimestral | demonstrar cocriação |
| Demandas comunitárias acompanhadas | registros com atualização de andamento ÷ registros criados | Participe do SUS | trimestral | avaliar uso do módulo de controle social |

## 4. Metas iniciais sugeridas para pactuação

Estas metas não são resultados já alcançados. Devem ser validadas pelas instituições proponentes após o piloto e podem ser ajustadas conforme a linha de base.

- atingir pelo menos **80% de conclusão** nas tarefas essenciais após ciclos de melhoria;
- atingir pelo menos **80% de respostas “sim”** para entendimento do próximo passo nas rotas essenciais;
- buscar média de **4,0/5 ou superior** em clareza e facilidade após revisão iterativa;
- manter **zero conteúdo intencionalmente publicado sem fonte definida** nos módulos normativos e de saúde;
- tratar **100% dos problemas críticos de segurança de navegação/conteúdo** antes de uma versão ser considerada estável;
- documentar a origem comunitária das melhorias incorporadas durante as oficinas de cocriação.

## 5. Ciclo de avaliação

### Ciclo 0 — linha de base
- selecionar tarefas essenciais;
- executar teste inicial com a versão existente;
- registrar taxa de conclusão, tempo, clareza, facilidade e barreiras;
- criar backlog priorizado.

### Ciclo 1 — correção
- implementar as mudanças de maior impacto;
- repetir as mesmas tarefas;
- comparar com a linha de base;
- documentar ganhos e problemas persistentes.

### Ciclos seguintes — melhoria contínua
- repetir avaliação em versões relevantes;
- incluir novas tarefas apenas quando necessário;
- revisar indicadores mensalmente;
- realizar síntese trimestral para equipe do projeto e espaços de participação social definidos na governança.

## 6. Tarefas essenciais sugeridas

1. descobrir qual tipo de porta do SUS procurar para uma situação apresentada no roteiro de teste;
2. localizar um direito e identificar como agir quando ele não é respeitado;
3. encontrar orientação segura sobre recaída ou abstinência;
4. registrar uma sugestão de melhoria no módulo Participe do SUS;
5. localizar como utilizar a OuvSUS;
6. utilizar recursos de acessibilidade e concluir uma tarefa com fonte ampliada/alto contraste;
7. localizar a fonte oficial de uma informação normativa.

Os roteiros de cenário não devem exigir que a pessoa revele sua própria condição de saúde. Preferir casos fictícios padronizados.

## 7. Privacidade, ética e governança

A versão atual mantém avaliações somente no dispositivo e não exige nome, CPF, prontuário, diagnóstico ou localização.

Antes de coleta institucional ou sincronização em servidor, o projeto deve definir:
- responsável pelo tratamento dos dados;
- finalidade e base legal aplicável;
- minimização e prazo de retenção;
- controle de acesso;
- processo de anonimização/pseudonimização quando pertinente;
- informação/consentimento dos participantes conforme desenho da atividade;
- avaliação das exigências éticas aplicáveis a pesquisa com participantes, incluindo submissão ao sistema CEP/Conep quando couber.

## 8. Produtos de monitoramento

- painel local da versão de teste;
- exportação CSV e JSON;
- relatório de linha de base;
- registro de problemas e decisões de produto;
- relatório comparativo entre ciclos;
- síntese trimestral de indicadores;
- registro de mudanças originadas da participação social;
- documentação de versões do PWA vinculada aos ciclos de avaliação.

## 9. Relação com o PET Saúde Informação e Saúde Digital 2026

O plano foi estruturado para apoiar a coerência entre objetivos, atividades e resultados, o componente de pesquisa/inovação em saúde digital e, especialmente, uma estratégia de monitoramento e avaliação capaz de subsidiar decisões e mudanças durante a implementação. A redação final e as metas devem ser pactuadas com o Instituto Federal e a Secretaria de Saúde proponentes.
