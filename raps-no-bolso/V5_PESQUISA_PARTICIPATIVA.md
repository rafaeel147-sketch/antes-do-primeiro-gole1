# RAPS no Bolso — V5 Pesquisa Participativa

**Branch:** `feat/raps-pesquisa-participativa-v5`  
**Base auditada:** `main@c3bdd8c13842cf6036258b62fe03a850bb195bc9`  
**Status:** contrato técnico inicial — implementação incremental  
**Princípio:** precisão antes de velocidade; não transformar o PWA em prontuário ou ferramenta clínica.

## 1. Objetivo

Evoluir o RAPS no Bolso de guia educativo/funcional para também funcionar como objeto de pesquisa aplicada, avaliação de usabilidade e participação social, sem exigir identificação pessoal e sem condicionar o acesso ao app à participação em pesquisa ou avaliação.

## 2. Escopo funcional da V5

### Pesquisa e participação
- explicar em linguagem simples o que é o RAPS no Bolso;
- informar que o protótipo pode ser avaliado com usuários, familiares, trabalhadores e pesquisadores;
- exigir manifestação voluntária antes de salvar qualquer resposta de avaliação/pesquisa no aparelho;
- permitir usar todo o conteúdo do app sem responder instrumentos;
- deixar explícito que coleta institucional ou uso científico depende de desenho, governança e requisitos éticos próprios.

### Avaliação do aplicativo
- utilidade percebida;
- conclusão da busca/tarefa;
- clareza da linguagem;
- facilidade de navegação/localização de serviços;
- acessibilidade;
- próximo passo compreendido;
- sugestão opcional;
- teste guiado de usabilidade;
- indicadores agregados e exportação local.

### Escuta comunitária estruturada
- demandas percebidas na RAPS;
- dificuldades de acesso;
- informação ausente;
- experiência de usuários, familiares e trabalhadores;
- sugestões e propostas;
- sem diagnóstico automático, perfilamento clínico ou interpretação clínica.

### Apresentação científica
Página própria com:
- problema;
- objetivo;
- público;
- metodologia possível;
- estágio do protótipo;
- funcionalidades existentes;
- indicadores avaliáveis;
- limites e governança;
- preparação para demonstração a IFG/UFG sem logotipos, endosso ou alegação de parceria não formalizada.

## 3. Inventário confirmado na base atual

A V5 **não começa do zero**.

### `evaluation-addon.js`
Já implementa:
- banco local IndexedDB `raps-no-bolso-avaliacao`;
- feedback rápido;
- resposta curta por página (pulse);
- teste guiado de usabilidade;
- código aleatório de sessão;
- tempo, conclusão, ajuda, obstáculos, barreira, clareza, facilidade e próximo passo;
- painel local;
- exportação CSV/JSON;
- exclusão local.

### `participation-addon.js`
Já implementa:
- banco local IndexedDB `raps-no-bolso-participacao`;
- sugestão de melhoria;
- registro antes/depois;
- proposta para controle social/Conselho;
- fotos opcionais locais;
- exportação JSON;
- exclusão local.

### `participation-status-addon.js`
Já implementa acompanhamento local de status, deixando explícito que o status não constitui decisão oficial de serviço, gestão ou Conselho.

### `evaluation-privacy-addon.js`
Já declara:
- ausência de login/cadastro clínico;
- ausência de coleta automática de nome/CPF/diagnóstico/prontuário;
- GPS opcional e mantido em memória;
- registros de avaliação e participação locais;
- necessidade de governança/ética antes de coleta institucional ou sincronização futura.

### `PLANO_MONITORAMENTO_AVALIACAO_PET.md`
Já define indicadores, ciclos de avaliação, tarefas essenciais e produtos de monitoramento.

## 4. Lacunas confirmadas

1. **Consentimento/manifestação voluntária:** hoje os instrumentos avisam sobre privacidade, porém não existe gate explícito antes de salvar feedback, pulse, teste ou registro de participação.
2. **Escuta comunitária:** o módulo de participação cobre sugestões/propostas, mas ainda não há instrumento estruturado específico para dificuldades de acesso, informação faltante e experiência por papel da pessoa.
3. **Exportação agregada:** existem exportações de registros locais; falta uma exportação resumida/agregada preparada para análise sem expor texto livre por padrão.
4. **Apresentação científica:** falta uma página única e auditável com problema, método possível, estágio, indicadores e limites.
5. **Rastreabilidade de consentimento:** registros atuais não carregam uma versão explícita de manifestação voluntária.
6. **Testes V5:** faltam testes automáticos específicos para consentimento, separação de dados, ausência de identificadores obrigatórios e regressão mobile.

## 5. Arquitetura de dados

### Separação lógica
- navegação normal do app: **sem telemetria de navegação própria nesta V5**;
- avaliação: IndexedDB `raps-no-bolso-avaliacao`;
- participação/escuta: IndexedDB `raps-no-bolso-participacao`;
- GPS: memória da página, sem persistência pelo RAPS no Bolso;
- consentimento V5: metadado mínimo associado ao registro ou à sessão de coleta; não deve conter identidade.

### Minimização
Não adicionar como campos de pesquisa:
- nome;
- CPF;
- CNS;
- prontuário;
- diagnóstico;
- medicação;
- endereço residencial;
- coordenada GPS da pessoa;
- perfil clínico;
- inferência diagnóstica.

Campos de texto livre devem alertar para não registrar dados clínicos ou identificadores pessoais.

## 6. Regra de consentimento

O gate da V5 deve informar, antes da gravação local:
- finalidade do registro;
- que a participação é voluntária;
- que o app pode ser usado sem responder;
- o que será salvo;
- que o dado permanece local nesta versão;
- como apagar/exportar;
- que aceitar o registro local **não equivale** por si só a consentimento para uma pesquisa institucional futura.

Cada registro V5 deve carregar apenas metadados técnicos mínimos, por exemplo:
- `consentVersion`;
- `consentAt`;
- `collectionMode: "local-voluntary"`.

## 7. Ordem de implementação

1. contrato e inventário real;
2. estrutura/páginas da V5;
3. consentimento e privacidade;
4. escuta comunitária estruturada;
5. exportação agregada/análise;
6. apresentação científica;
7. testes funcionais, privacidade e mobile;
8. PR V5 separada para revisão.

## 8. Critérios de aceite

A V5 só fica apta a merge quando:
- todo conteúdo principal continua acessível sem responder pesquisa;
- nenhum instrumento salva resposta sem manifestação voluntária explícita;
- nenhum campo obrigatório pede identificador pessoal ou dado clínico;
- avaliação e participação continuam em bancos locais separados;
- GPS não é persistido nos bancos de pesquisa/participação;
- exportação agregada não inclui texto livre por padrão;
- página científica não usa logotipos nem afirma parceria IFG/UFG não formalizada;
- não há diagnóstico, prescrição, recomendação médica automática ou perfilamento clínico;
- smoke tests antigos permanecem verdes;
- novos testes V5 ficam verdes;
- teste mobile confirma que consentimento, formulários e exclusão/exportação funcionam sem quebrar navegação.

## 9. Fora de escopo

- prontuário;
- prescrição;
- diagnóstico;
- classificação clínica automática;
- coleta de CPF/CNS para pesquisa;
- autenticação obrigatória;
- servidor de dados de pesquisa;
- sincronização automática;
- adaptação artificial para aparentar aderência a edital específico.

## 10. Itens não determinados

- protocolo institucional de pesquisa;
- responsável formal pelo tratamento de dados em eventual fase com servidor;
- base legal e retenção em eventual coleta institucional;
- necessidade concreta de submissão CEP/Conep para um desenho de estudo específico;
- eventual parceria formal com IFG/UFG.

Esses itens não devem ser inferidos pelo código nem apresentados como já formalizados.
