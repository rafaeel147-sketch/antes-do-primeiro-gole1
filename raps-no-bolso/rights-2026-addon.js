// Atualização legislativa de 2026 — fontes oficiais verificadas em 21/08/2026.
// Conteúdo educativo. A Lei 15.390/2026 tem vigência futura e não é apresentada como direito já exigível hoje.

rightsSources.estatuto2026 = ['Lei nº 15.378/2026 — Estatuto dos Direitos do Paciente','https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15378.htm'];
rightsSources.tfd2026 = ['Lei nº 15.390/2026 — ajuda de custo para tratamento fora do município','https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15390.htm'];
sources.direitos = Object.values(rightsSources);

if (!rightsTopics.some(([r]) => r === 'direitos-2026')) {
  rightsTopics.unshift(['direitos-2026','🆕','Novos direitos de 2026','Estatuto dos Direitos do Paciente e tratamento fora do município.']);
}

pages['direitos-2026'] = () => `
  <div class="page">
    ${rightsPageHead('Novos direitos de 2026','Duas leis federais recentes que precisam aparecer com destaque no RAPS no Bolso: o Estatuto dos Direitos do Paciente, já em vigor, e a nova regra de ajuda de custo para tratamento fora do município, com vigência futura.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <div class="callout"><span class="callout-icon">⚖</span><div>
            <h2>Lei nº 15.378/2026 — Estatuto dos Direitos do Paciente</h2>
            <p><strong>Em vigor desde abril de 2026.</strong> Aplica-se a profissionais e serviços de saúde públicos ou privados e também a operadoras de planos de saúde. Os direitos do Estatuto se somam às demais garantias já existentes.</p>
          </div></div>
        </section>

        <section class="panel">
          <h2>Direitos que o novo Estatuto tornou expressos</h2>
          <ul class="law-list">
            <li><strong>Representante escolhido pelo paciente.</strong> O paciente pode indicar livremente uma pessoa para representá-lo nos cuidados de saúde, com registro no prontuário.</li>
            <li><strong>Acompanhante em consultas e internações.</strong> A regra geral agora está expressa no Estatuto; a presença pode ser limitada quando o profissional responsável justificar risco à saúde, intimidade ou segurança do paciente ou de terceiros.</li>
            <li><strong>Cuidado de qualidade e em tempo oportuno.</strong> Inclui instalações adequadas, profissionais capacitados e, quando clinicamente possível e regulado, transferência segura com envio dos registros do atendimento.</li>
            <li><strong>Segurança do paciente.</strong> A pessoa pode fazer perguntas sobre higiene, procedimento, profissional responsável, medicamentos, dosagem, origem de insumos e efeitos adversos.</li>
            <li><strong>Não discriminação e nome de preferência.</strong> O Estatuto proíbe restrições discriminatórias e determina respeito às particularidades culturais, religiosas e de grupos vulneráveis.</li>
            <li><strong>Participação no plano terapêutico.</strong> O paciente tem direito de participar ativamente das decisões sobre seus cuidados.</li>
            <li><strong>Informação acessível.</strong> Deve receber informação suficiente e atualizada sobre condição de saúde, tratamento, alternativas, riscos, benefícios e efeitos adversos; há direito a intérprete ou recursos de acessibilidade quando necessários.</li>
            <li><strong>Consentimento informado e direito de retirar o consentimento.</strong> O consentimento deve ser livre de coerção ou influência indevida e pode ser retirado sem represália, ressalvadas as situações legais específicas.</li>
            <li><strong>Confidencialidade e privacidade.</strong> O paciente decide sobre a revelação de informações a terceiros, inclusive familiares, salvo determinação legal; pode recusar visitas e a presença de estudantes ou profissionais estranhos ao cuidado.</li>
            <li><strong>Segunda opinião.</strong> Pode buscar parecer de outro profissional ou serviço e ter tempo para decidir, salvo emergência.</li>
            <li><strong>Prontuário sem justificativa e cópia sem custo.</strong> O Estatuto garante acesso ao prontuário sem necessidade de explicar o motivo, cópia sem ônus, pedido de retificação e segurança do registro.</li>
            <li><strong>Diretivas antecipadas de vontade.</strong> Devem ser respeitadas pela família e pelos profissionais quando aplicáveis.</li>
            <li><strong>Cuidados paliativos.</strong> A lei reconhece direito aos cuidados paliativos e apoio à família, observados os regramentos do SUS ou do plano de saúde.</li>
          </ul>
        </section>

        <section class="panel warning">
          <h2>Como usar o Estatuto na prática</h2>
          <div class="steps">
            <div class="step"><div><strong>Peça o direito de forma objetiva</strong><p>Ex.: “Quero acesso ao meu prontuário e cópia sem custo, conforme a Lei 15.378/2026.”</p></div></div>
            <div class="step"><div><strong>Se houver negativa, peça a justificativa</strong><p>Anote serviço, data, horário, setor e a resposta recebida. Quando possível, peça protocolo ou resposta por escrito.</p></div></div>
            <div class="step"><div><strong>Registre reclamação</strong><p>O próprio Estatuto prevê mecanismos públicos para acolher reclamações sobre descumprimento dos direitos dos pacientes.</p></div></div>
          </div>
        </section>

        <section class="panel">
          <h2>Lei nº 15.390/2026 — tratamento fora do município</h2>
          <div class="panel warning" style="margin-bottom:14px"><strong>Atenção: vigência futura.</strong> A lei foi publicada em 16/04/2026 e estabelece que entra em vigor após 1 ano. Portanto, em agosto de 2026, ela ainda não deve ser apresentada como direito já exigível.</div>
          <p>A lei altera a Lei nº 8.080/1990 para permitir ajuda de custo ao usuário do SUS que precise se deslocar para outro município para tratamento, mediante regulamentação e condições legais.</p>
          <ul class="law-list">
            <li><strong>Despesas previstas:</strong> transporte aéreo, terrestre ou fluvial, alimentação e pernoite.</li>
            <li><strong>Possibilidade de acompanhante:</strong> a ajuda poderá cobrir também 1 acompanhante, quando solicitado, durante o período necessário ao tratamento.</li>
            <li><strong>Requisitos:</strong> indicação por médico de unidade vinculada ao SUS; autorização e encaminhamento pelo gestor municipal ou estadual; garantia de atendimento no município de referência; e esgotamento dos meios de tratamento no município de residência.</li>
            <li><strong>Não é pagamento automático.</strong> A concessão depende das regras da lei, regulamentação e disponibilidade orçamentária e financeira do ente concedente.</li>
          </ul>
        </section>

        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Veja também','O novo Estatuto reforça temas já detalhados no aplicativo.',[['direitos-prontuario','Prontuário e sigilo'],['direitos-acompanhante','Acompanhante'],['direitos-reclamar','Como exigir e reclamar']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['estatuto2026','tfd2026'])}</section>
      </div>
    </div>
  </div>`;

// Re-renderiza após carregar este complemento para permitir acesso direto por ?p=direitos-2026.
if (typeof render === 'function' && typeof currentRoute === 'function') {
  render(currentRoute(), false);
}
