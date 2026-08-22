// Ampliação do módulo "Meus direitos" — fontes oficiais verificadas em 21/08/2026.
// Este conteúdo é educativo e não substitui orientação jurídica individual.

const rightsSources = [
  ['Constituição Federal — arts. 196 a 198','https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm'],
  ['Lei nº 8.080/1990 — Lei Orgânica da Saúde','https://www.planalto.gov.br/ccivil_03/leis/l8080.htm'],
  ['Resolução CNS nº 553/2017 — Carta dos Direitos e Deveres da Pessoa Usuária da Saúde','https://bvsms.saude.gov.br/bvs/saudelegis/cns/2018/res0553_15_01_2018.html'],
  ['Portaria GM/MS nº 940/2011 — Cartão Nacional de Saúde, art. 13','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2011/prt0940_28_04_2011.html'],
  ['Lei nº 10.216/2001 — direitos em saúde mental','https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm'],
  ['Lei nº 13.709/2018 — LGPD','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm'],
  ['Lei nº 13.787/2018 — prontuário de paciente','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13787.htm'],
  ['Lei nº 14.737/2023 — acompanhante da mulher em serviços de saúde','https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14737.htm'],
  ['Lei nº 13.146/2015 — Lei Brasileira de Inclusão','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm'],
  ['Lei nº 10.741/2003 — Estatuto da Pessoa Idosa','https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741compilado.htm'],
  ['Lei nº 8.069/1990 — Estatuto da Criança e do Adolescente','https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm']
];

sources.direitos = rightsSources;

pages.direitos = () => `
  <div class="page">
    ${emergencyStrip()}
    ${pageHead('Meus direitos','Direitos da pessoa usuária do SUS explicados em linguagem simples: o que a regra garante, em que situação vale e como pedir que ela seja respeitada.','Direitos no SUS')}

    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <div class="callout"><span class="callout-icon">⚖</span><div>
            <h2>O ponto de partida</h2>
            <p><strong>A saúde é direito de todos.</strong> A Constituição e a Lei nº 8.080/1990 estabelecem acesso universal e igualitário, atendimento integral, preservação da autonomia, igualdade sem preconceitos e direito à informação sobre a própria saúde.</p>
          </div></div>
        </section>

        <section class="panel">
          <h2>1. Cheguei ao serviço: tenho direito a ser acolhido?</h2>
          <ul class="law-list">
            <li><strong>Acolhimento sem barreira burocrática.</strong> A Carta dos Direitos diz que a pessoa deve ser acolhida quando chega ao serviço, conforme sua necessidade, independentemente de senhas ou procedimentos burocráticos, respeitadas as prioridades legais.</li>
            <li><strong>Urgência e emergência.</strong> Nessas situações, qualquer serviço de saúde deve receber e cuidar da pessoa e, se necessário, encaminhá-la para serviço capaz de resolver o problema.</li>
            <li><strong>Se houver risco de vida ou lesão grave.</strong> Deve ser assegurada remoção em tempo hábil e em condições seguras para serviço com capacidade adequada.</li>
            <li><strong>Se o serviço estiver temporariamente sem condições de resolver.</strong> A direção e a equipe continuam responsáveis por acolher, informar claramente e encaminhar sem discriminação ou privilégio.</li>
          </ul>
          <div class="panel warning" style="margin-top:14px">
            <h3>“Moro em outro bairro.”</h3>
            <p>A rede pode organizar o cuidado habitual por território e unidade de referência. <strong>Isso não autoriza abandono em urgência ou emergência.</strong> Nessas situações, o dever é receber, cuidar e encaminhar quando necessário.</p>
          </div>
        </section>

        <section class="panel">
          <h2>2. Estou sem Cartão SUS ou sem cadastro</h2>
          <ul class="law-list">
            <li><strong>Sem Cartão SUS:</strong> a Portaria GM/MS nº 940/2011, art. 13, afirma expressamente que inexistência, ausência ou desconhecimento do número do Cartão Nacional de Saúde <strong>não impedem o atendimento solicitado</strong>.</li>
            <li><strong>Cadastro pode vir depois:</strong> a própria Portaria permite que as atividades de identificação e cadastramento sejam feitas posteriormente ao atendimento.</li>
            <li><strong>Outros documentos:</strong> em urgência e emergência, exigência cadastral não pode virar barreira para receber e cuidar. Fora dessas situações, o serviço pode solicitar dados/documentos necessários para organizar cadastro e continuidade do cuidado.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Estou sem o Cartão SUS agora. A Portaria nº 940/2011, art. 13, diz que isso não impede o atendimento. O cadastro pode ser regularizado depois.”</div>
        </section>

        <section class="panel">
          <h2>3. Informação, explicação e participação nas decisões</h2>
          <ul class="law-list">
            <li><strong>Informação clara.</strong> Você tem direito a entender seu estado de saúde, hipóteses, exames, procedimentos, benefícios, riscos, alternativas, duração e encaminhamentos.</li>
            <li><strong>Confirmação de compreensão.</strong> A Carta determina que o atendimento considere se a pessoa compreendeu as informações e os possíveis encaminhamentos.</li>
            <li><strong>Consentimento livre e esclarecido.</strong> Procedimentos diagnósticos, preventivos e terapêuticos exigem consentimento, ressalvadas hipóteses legais como risco à saúde pública e emergências específicas.</li>
            <li><strong>Direito de recusa.</strong> A Carta reconhece o direito de conhecer diferentes possibilidades terapêuticas e de recusar tratamento, observadas as exceções previstas em lei.</li>
            <li><strong>Autonomia.</strong> A Lei nº 8.080/1990 determina a preservação da autonomia das pessoas na defesa de sua integridade física e moral.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Antes de decidir, quero que me expliquem em linguagem simples o objetivo, os riscos, as alternativas e o que acontece se eu não fizer esse procedimento.”</div>
        </section>

        <section class="panel">
          <h2>4. Prontuário, laudo, relatório e atestado</h2>
          <ul class="law-list">
            <li><strong>Acesso ao prontuário.</strong> A Carta garante acesso da própria pessoa ao conteúdo do prontuário ou de pessoa por ela autorizada, além do fornecimento de cópia quando necessário.</li>
            <li><strong>Registro legível e atualizado.</strong> O prontuário deve registrar motivo do atendimento, evolução, prescrições, avaliações, procedimentos, identificação do profissional, data e local.</li>
            <li><strong>Laudo, relatório e atestado.</strong> A Carta prevê a obtenção desses documentos quando justificados pela situação de saúde.</li>
            <li><strong>Integridade e confidencialidade.</strong> A Lei nº 13.787/2018 exige proteção da integridade, autenticidade e confidencialidade dos prontuários digitalizados.</li>
            <li><strong>Seus dados de saúde são dados pessoais sensíveis.</strong> Pela LGPD, a pessoa pode pedir confirmação de tratamento de dados, acesso e correção de dados incompletos, inexatos ou desatualizados, observadas as regras legais.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Quero acesso/cópia do meu prontuário e dos documentos referentes ao meu atendimento. Por favor, informem o procedimento e o protocolo do pedido.”</div>
        </section>

        <section class="panel">
          <h2>5. Privacidade, sigilo e identificação</h2>
          <ul class="law-list">
            <li><strong>Sigilo:</strong> informações pessoais e de saúde são confidenciais, inclusive após a morte, ressalvadas as hipóteses legais.</li>
            <li><strong>Privacidade e integridade:</strong> consultas, exames, internações e procedimentos devem respeitar integridade física, privacidade, conforto e individualidade.</li>
            <li><strong>Quem pode saber?</strong> A Carta reconhece o direito de a pessoa decidir se familiares e acompanhantes deverão ser informados sobre seu estado de saúde, salvo hipóteses legais específicas.</li>
            <li><strong>Identificação do profissional:</strong> profissionais devem ser identificáveis por crachá visível e legível ou outra forma de fácil percepção.</li>
            <li><strong>Nome social e tratamento respeitoso:</strong> a Carta garante campo para nome social e uso do nome de preferência, sem identificação por doença, número ou forma humilhante.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>6. Acompanhante: quando existe esse direito?</h2>
          <ul class="law-list">
            <li><strong>Consultas e exames:</strong> a Carta dos Direitos prevê acompanhante de livre escolha da pessoa usuária.</li>
            <li><strong>Mulheres:</strong> a Lei nº 14.737/2023 garante a toda mulher acompanhante maior de idade, de sua livre indicação, durante consultas, exames e procedimentos em serviços públicos ou privados, sem necessidade de aviso prévio, com regras específicas para sedação, centro cirúrgico e UTI.</li>
            <li><strong>Pessoa com deficiência:</strong> a Lei nº 13.146/2015 assegura acompanhante ou atendente pessoal durante internação ou observação; se a permanência for impossibilitada, a justificativa deve ser feita por escrito e a instituição deve adotar providências para suprir a ausência.</li>
            <li><strong>Pessoa idosa:</strong> o Estatuto da Pessoa Idosa assegura acompanhante à pessoa internada ou em observação; se houver impossibilidade, deve haver justificativa por escrito.</li>
            <li><strong>Criança ou adolescente internado:</strong> o ECA determina condições para permanência em tempo integral de um dos pais ou responsável, inclusive em unidades neonatais, UTI e cuidados intermediários.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>7. Direitos específicos em saúde mental — Lei nº 10.216/2001</h2>
          <ul class="law-list">
            <li><strong>Sem discriminação:</strong> os direitos e a proteção independem de raça, cor, sexo, orientação sexual, religião, opção política, nacionalidade, idade, família, recursos econômicos, gravidade ou tempo de evolução do transtorno.</li>
            <li><strong>Melhor tratamento disponível no sistema</strong> de acordo com as necessidades da pessoa.</li>
            <li><strong>Humanidade e respeito,</strong> com tratamento voltado ao benefício da saúde e à reinserção na família, trabalho e comunidade.</li>
            <li><strong>Proteção contra abuso e exploração.</strong></li>
            <li><strong>Sigilo das informações.</strong></li>
            <li><strong>Informação sobre a doença e o tratamento.</strong></li>
            <li><strong>Meios menos invasivos possíveis.</strong></li>
            <li><strong>Preferência por serviços comunitários de saúde mental.</strong></li>
            <li><strong>Internação apenas quando recursos extra-hospitalares forem insuficientes,</strong> com assistência integral e finalidade permanente de reinserção social.</li>
            <li><strong>Alta planejada e continuidade:</strong> para pessoas em longa hospitalização ou grave dependência institucional, a lei prevê política específica de alta planejada e reabilitação psicossocial assistida, com continuidade do tratamento quando necessária.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Quero que me expliquem meu plano de cuidado, as alternativas comunitárias e por que esta conduta é necessária. A Lei 10.216 garante informação, respeito, sigilo e meios menos invasivos.”</div>
        </section>

        <section class="panel">
          <h2>8. Pessoa com deficiência: acessibilidade também é direito de saúde</h2>
          <ul class="law-list">
            <li><strong>Atenção integral pelo SUS</strong> em todos os níveis, com acesso universal e igualitário.</li>
            <li><strong>Dignidade e autonomia</strong> devem ser consideradas no atendimento.</li>
            <li><strong>Informação acessível:</strong> o serviço deve disponibilizar recursos de comunicação e tecnologia assistiva adequados.</li>
            <li><strong>Acessibilidade física e comunicacional:</strong> serviços públicos e privados de saúde devem remover barreiras e atender às especificidades da pessoa.</li>
            <li><strong>Atendimento sem consentimento</strong> somente nas hipóteses legais, como risco de morte e emergência em saúde, preservando o melhor interesse e as salvaguardas cabíveis.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>9. Pessoa idosa: direitos adicionais</h2>
          <ul class="law-list">
            <li><strong>Dignidade e proteção contra tratamento desumano, violento, vexatório ou constrangedor.</strong></li>
            <li><strong>Acompanhante em internação ou observação,</strong> com permanência em tempo integral segundo o critério médico; eventual impossibilidade deve ser justificada por escrito.</li>
            <li><strong>Escolha do tratamento:</strong> a pessoa idosa que esteja no domínio de suas faculdades mentais pode optar pelo tratamento que considere mais favorável.</li>
            <li><strong>Maiores de 80 anos:</strong> preferência especial sobre as demais pessoas idosas no atendimento de saúde, salvo situação de emergência.</li>
          </ul>
        </section>

        <section class="panel warning">
          <h2>10. Quando o direito não é respeitado</h2>
          <div class="steps">
            <div class="step"><div><strong>Peça a regra e a justificativa</strong><p>Pergunte qual norma está sendo aplicada, qual é o motivo da negativa e qual solução ou encaminhamento será oferecido.</p></div></div>
            <div class="step"><div><strong>Quando couber, peça por escrito</strong><p>Algumas leis exigem justificativa escrita expressamente, como certas limitações ao acompanhante de pessoa idosa ou com deficiência.</p></div></div>
            <div class="step"><div><strong>Registre os fatos</strong><p>Data, horário, unidade, setor, nomes/cargos quando identificáveis, pedido feito e resposta recebida.</p></div></div>
            <div class="step"><div><strong>Use a ouvidoria</strong><p>Reclamação para insatisfação com serviço; solicitação para pedir providência/acesso; denúncia quando houver possível irregularidade.</p></div></div>
            <div class="step"><div><strong>Em risco imediato, priorize assistência</strong><p>Ouvidoria não substitui urgência. Em emergência, procure UPA/pronto-socorro ou ligue 192.</p></div></div>
          </div>
          <div class="hero-actions">${link('ouvsus','Como usar a OuvSUS','btn')}${link('onde-ajuda','Onde buscar ajuda','btn secondary')}</div>
        </section>
      </div>

      <div class="side-stack">
        ${sideBox('Atalhos rápidos','Abra diretamente a parte mais útil para a situação.',[['onde-ajuda','Onde buscar ajuda'],['ouvsus','OuvSUS'],['raps','Entender a RAPS']])}
        <section class="panel"><h3>Fontes oficiais</h3><p>As referências abaixo são as bases legais desta versão.</p>${sourceList(rightsSources)}</section>
        <section class="panel soft"><h3>Importante</h3><p>Este módulo explica direitos gerais. Casos concretos podem depender de fatos, normas locais e exceções legais. O aplicativo não substitui orientação jurídica individual.</p></section>
      </div>
    </div>
  </div>`;

if (currentRoute() === 'direitos') render('direitos', false);
