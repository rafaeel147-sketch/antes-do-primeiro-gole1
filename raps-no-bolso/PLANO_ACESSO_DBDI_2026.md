# RAPS no Bolso — recorte e validação para o DBDI 2026

Status: proposta de trabalho; nenhum resultado de teste é presumido. Data: 27/09/2026.

## Desafio escolhido

Trilha Tecnologia — “Como o Brasil pode modernizar o acesso a serviços por meio da tecnologia, garantindo acessibilidade a diferentes demografias?”

Fonte: Guia das Trilhas recebido por e-mail em 26/09/2026:
https://drive.google.com/file/d/1XCm5D5kk4suUsIvJHykPbfzbpjZXT7i8/view?usp=drive_link

Formulação inicial: pessoas que precisam de cuidado em saúde mental ou relacionado a álcool e outras drogas enfrentam informação fragmentada sobre portas de entrada, território, horários e direitos. O protótipo organiza essas informações em linguagem simples e permite consultar serviços locais com fonte e data de verificação. A pergunta a testar é se pessoas com diferentes necessidades de acesso conseguem encontrar um serviço e compreender o próximo passo com menos dificuldade.

O projeto é independente e educativo. Não faz diagnóstico, triagem clínica, agendamento, encaminhamento automático nem representa oficialmente o SUS ou a Prefeitura.

## Recorte de produto

1. Entrada por tarefa: entender portas de cuidado, encontrar serviço em Goiânia e consultar UBS.
2. Busca sem GPS por nome, bairro ou tipo; GPS somente após escolha explícita.
3. Em cada serviço: nome, público, contato, endereço, horário, rota, fonte responsável e data de verificação.
4. Fonte ampliada, alto contraste, navegação por teclado e linguagem clara, a testar com pessoas reais. A existência do controle não comprova acessibilidade.
5. Fallback quando localização ou base externa não responder: buscar por texto e abrir rota por endereço; não apresentar distância não verificada.

## Comparação a realizar

Comparar a versão inicial e a versão revista nas mesmas tarefas, com roteiros fictícios padronizados e sem pedir diagnóstico ou relato pessoal. Registrar também como a pessoa resolve a tarefa usando o caminho atual que ela já conhece (busca comum, lista oficial ou orientação presencial), sem impedir o acesso normal ao cuidado. Documentar limites dessa comparação.

### Tarefas de teste

- T1: encontrar qual porta procurar em uma situação não urgente descrita no roteiro.
- T2: localizar uma unidade em Goiânia sem habilitar GPS e identificar telefone, horário, endereço e fonte.
- T3: repetir T2 com fonte ampliada e alto contraste; observar navegação por teclado ou leitor de tela quando pertinente.
- T4: localizar orientação de urgência em um cenário fictício e identificar o próximo passo, sem tratar o PWA como serviço de emergência.

### Públicos e condições a contemplar

Recrutar voluntários com diferentes níveis de familiaridade digital, necessidades visuais, faixas etárias e acesso a celular/internet. Não inferir capacidade a partir da idade ou escolaridade. Pactuar amostra e autorização da atividade antes do teste. Não registrar nomes, diagnósticos ou histórias clínicas na planilha de usabilidade.

### Indicadores

- Conclusão correta da tarefa, sem ajuda, com ajuda ou não concluída.
- Tempo, obstáculos, facilidade e compreensão do próximo passo.
- Uso efetivo do modo sem GPS, fonte ampliada e alto contraste.
- Exatidão e atualidade da ficha do serviço na fonte oficial.
- Mudanças implementadas a partir de barreiras observadas e resultado da repetição do teste.

Linha de base, número de participantes, valores observados e efeito da versão revista: **NÃO DETERMINADOS**. Metas do plano PET são sugestões, não resultados do DBDI.

## Evidências necessárias para a Proposta de Impacto

- Problema e população: dados públicos sobre acesso, letramento e barreiras digitais em saúde; recorte Goiânia como piloto, sem prometer efeito nacional já medido.
- Abordagens atuais: comparar páginas oficiais, busca geral e caminhos de orientação existentes; registrar o que cada um resolve e limita.
- Pelo menos 3 artigos acadêmicos revisados por pares pertinentes ao problema e à solução, identificados e verificados. Ainda **PENDENTE**.
- Versão do código, capturas da interface, catálogo de serviços com URL oficial e data de verificação.
- Relatório de testes reais, se autorizados e realizados, com método, amostra, resultados e limitações. Ainda **PENDENTE**.
- Plano operacional: responsável por atualizar dados, frequência de revisão, retirada de fichas desatualizadas, atendimento a relato de erro e manutenção do PWA.
- Custos e atores para um piloto; parceria institucional só pode ser descrita se confirmada.

A Fase 1 do DBDI avalia exclusivamente os campos do formulário; protótipo e anexos ajudam a construir a análise, mas não substituem a explicação escrita. O trabalho submetido deve refletir as decisões e a autoria do participante; declarar apoio de IA conforme o regulamento. A elegibilidade escolar do autor está **NÃO DETERMINADA** até verificar a data de conclusão do Ensino Médio/EJA.

Regulamento: https://www.dbdi.com.br/_files/ugd/a2005d_6c9979a966234d4ab810eb52afd6337c.pdf
Critérios: https://www.dbdi.com.br/crit%C3%A9rios-de-avalia%C3%A7%C3%A3o
