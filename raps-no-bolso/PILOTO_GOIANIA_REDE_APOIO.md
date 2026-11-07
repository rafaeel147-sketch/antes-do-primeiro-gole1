# RAPS no Bolso — piloto Goiânia: rede de apoio

**Estado:** protótipo funcional local e demonstrável; não é um sistema de despacho de emergência, mensageria automática, prontuário eletrônico ou integração SUS.

## O que funciona no piloto

- Acesso às portas de cuidado de Goiânia sem cadastro, CPF, GPS obrigatório ou contatos pessoais.
- Entrada separada de urgência psiquiátrica 24h e ligação gratuita ao SAMU 192.
- Busca por UBS, CAPS, UPA e informações de urgência; o endereço da unidade selecionada preenche o aviso.
- Primeiro acesso com escolha de usar sem cadastro ou configurar rede de apoio.
- Até quatro contatos no navegador, com autorização expressa para salvar e declaração de que os destinatários foram informados.
- Aviso com serviço, destino, endereço, data/hora e posição pontual **somente após escolha expressa e permissão de GPS**.
- Links reais de WhatsApp, SMS, e-mail e telefone que abrem os respectivos aplicativos; o usuário precisa confirmar o envio. O link de rota usa mapas externos.
- Relógio configurável de 1, 3, 5, 10 ou 15 minutos que **prepara o próximo contato nesta tela** caso o usuário não tenha registrado resposta. Pode recuperar o prazo quando a aba volta ao primeiro plano, mas não dispara mensagens sozinho.
- Demonstração com quatro contatos fictícios, sem links externos ou envios.
- Botão para registrar manualmente que houve resposta; isso não prova entrega, leitura ou acompanhamento.
- Exclusão local imediata dos contatos.

## Limites e pendências externas — não apenas SUS

1. **Mensageria autônoma:** um backend seguro, domínio e provedor de WhatsApp Business autorizado, serviço de e-mail transacional e eventualmente gateway de SMS. Exigem credenciais, consentimento/opt-in do destinatário, templates quando aplicáveis, custo, políticas de privacidade e observabilidade.
2. **Escalonamento de entrega:** orquestrador no servidor, fila de tentativas, callbacks de entrega, canal de confirmação autenticado pelo destinatário, horários/prazos, deduplicação e cancelamento; não depender de navegador aberto.
3. **Localização ao vivo:** compartilhamento temporário e revogável com autorização, infraestrutura apropriada ou recurso manual no app de mensagens; não disponível na PWA atual.
4. **Integração SUS:** acordo institucional, base legal, gestão de acesso, segurança e eventual interoperabilidade via RNDS/FHIR.
5. **Qualidade cadastral:** conferir periodicamente os dados de serviços; há páginas oficiais da Prefeitura e SMS com endereços/telefones conflitantes para o Wassily Chuc.

Nenhum endereço de e-mail nem número de contato real foi cadastrado ou utilizado para testes automatizados. Os testes do GitHub utilizam contatos fictícios dentro do navegador descartável.

## Segurança e inclusão

- **Uso em aparelho compartilhado:** não cadastrar contatos; dados salvos no navegador não são criptografados com chave pessoal. Apagar registros ao terminar.
- **Sem comunicação automática de dados de saúde**: o usuário escolhe o canal e autoriza o aviso por solicitação. Mensagens sugeridas não trazem diagnóstico, medicação ou histórico clínico.
- **GPS é opcional:** negar permissão não impede busca por texto, rota por endereço ou ligação para o SAMU.
- **Sem contatos:** o aplicativo continua funcional para encontrar unidade e buscar atendimento. A arquitetura nacional futura deve contemplar Consultório na Rua e modalidades de uso assistido.
- A interface não faz avaliação de gravidade, despacho do SAMU ou promessa de disponibilidade da unidade.

## Goiânia — fonte municipal do pronto-socorro psiquiátrico

- https://saude.goiania.go.gov.br/sobre-a-secretaria/consultas-sus/centros-de-atencao-psicossocial-caps/
- https://saude.goiania.go.gov.br/escalas-de-profissional/escalas-unidades-de-saude-mental-3/
- https://www.goiania.go.gov.br/urgenciaemergencia/

O atendimento 24h consta nas fontes; divergências de numeração do imóvel e telefones devem ser resolvidas antes de tratar endereço e contato como cadastros auditados.

## Gates antes de publicar como piloto de uso público

1. Testes automatizados de navegador, V5 consentimento, GPS negado, offline e escalonamento temporizado.
2. Validação presencial no Android real, com WhatsApp/SMS/e-mail instalados e sem eles.
3. Testes de acessibilidade (teclado, leitor de telas) e revisão do modal de consentimento V5.
4. Revisão de privacidade para o armazenamento local de nomes e contatos, inclusive em dispositivos compartilhados.
5. Revisão clínica/editorial da hierarquia de acesso, especialmente urgência psiquiátrica.
6. Aprovação humana do merge/publicação.

**Expansão nacional:** não ativada. Não há acesso a históricos clínicos reais ou integração com prontuários do SUS.
