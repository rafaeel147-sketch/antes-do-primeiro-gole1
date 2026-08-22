// Módulo "Meus direitos" — navegação temática.
// Conteúdo educativo baseado em fontes oficiais. Não substitui orientação jurídica individual.

const rightsSources = {
  constituicao: ['Constituição Federal — arts. 196 a 198','https://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm'],
  sus: ['Lei nº 8.080/1990 — Lei Orgânica da Saúde','https://www.planalto.gov.br/ccivil_03/leis/l8080.htm'],
  carta: ['Resolução CNS nº 553/2017 — Carta dos Direitos e Deveres da Pessoa Usuária da Saúde','https://bvsms.saude.gov.br/bvs/saudelegis/cns/2018/res0553_15_01_2018.html'],
  cartao: ['Portaria GM/MS nº 940/2011 — Cartão Nacional de Saúde, art. 13','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2011/prt0940_28_04_2011.html'],
  mental: ['Lei nº 10.216/2001 — direitos em saúde mental','https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm'],
  lgpd: ['Lei nº 13.709/2018 — LGPD','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm'],
  prontuario: ['Lei nº 13.787/2018 — prontuário de paciente','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13787.htm'],
  mulher: ['Lei nº 14.737/2023 — acompanhante da mulher em serviços de saúde','https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14737.htm'],
  pcd: ['Lei nº 13.146/2015 — Lei Brasileira de Inclusão','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm'],
  idoso: ['Lei nº 10.741/2003 — Estatuto da Pessoa Idosa','https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741compilado.htm'],
  eca: ['Lei nº 8.069/1990 — Estatuto da Criança e do Adolescente','https://www.planalto.gov.br/ccivil_03/leis/l8069compilado.htm'],
  usuario: ['Lei nº 13.460/2017 — direitos do usuário de serviços públicos','https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm']
};

sources.direitos = Object.values(rightsSources);

const rightsTopics = [
  ['direitos-atendimento','🏥','Atendimento e documentos','Acesso ao SUS, acolhimento, urgência, território, Cartão SUS e cadastro.'],
  ['direitos-prontuario','📄','Informação, prontuário e sigilo','Explicação do cuidado, consentimento, prontuário, laudo, dados e privacidade.'],
  ['direitos-saude-mental','🧠','Direitos em saúde mental','Lei 10.216, cuidado comunitário, internação, informação, respeito e continuidade.'],
  ['direitos-acompanhante','👥','Direito a acompanhante','Mulheres, pessoa idosa, pessoa com deficiência, criança e adolescente.'],
  ['direitos-protecoes','♿','Proteções e prioridades','Pessoa com deficiência, pessoa idosa, criança/adolescente e atendimento sem discriminação.'],
  ['direitos-reclamar','📣','Como exigir e reclamar','Como pedir cumprimento, registrar negativa, usar OuvSUS e guardar protocolo.']
];

function rightsBreadcrumb(title){
  return `<div class="breadcrumb">${link('inicio','Início')} <span>›</span> ${link('direitos','Meus direitos')} <span>›</span> <span>${title}</span></div>`;
}

function rightsPageHead(title, summary){
  return `<section class="page-head">${rightsBreadcrumb(title)}<div class="eyebrow">Direitos da pessoa usuária da saúde</div><h1>${title}</h1><p class="summary">${summary}</p></section>`;
}

function rightsSourcesList(keys){
  return sourceList(keys.map(k=>rightsSources[k]).filter(Boolean));
}

function rightsBack(){
  return `<div class="hero-actions">${link('direitos','← Voltar para Meus direitos','btn secondary')}</div>`;
}

pages.direitos = () => `
  <div class="page">
    ${emergencyStrip()}
    ${pageHead('Meus direitos','Escolha o assunto. Em vez de uma lista enorme de leis, cada tema abre uma página própria com a regra, a base legal e uma forma simples de pedir o cumprimento.','Direitos no SUS')}

    <section class="panel success" style="margin-bottom:18px">
      <div class="callout"><span class="callout-icon">⚖</span><div>
        <h2>Direito não deve virar juridiquês</h2>
        <p>A Constituição estabelece que a saúde é direito de todos. A Lei nº 8.080/1990 organiza o SUS com acesso universal e igualitário, integralidade, preservação da autonomia e direito à informação. A Carta dos Direitos traduz esses princípios para situações concretas de atendimento.</p>
      </div></div>
    </section>

    <section class="nav-grid" aria-label="Categorias de direitos">
      ${rightsTopics.map(([r,i,t,d])=>`<a class="nav-card" href="?p=${r}" data-route="${r}"><span class="icon-square" aria-hidden="true">${i}</span><span><strong>${t}</strong><p>${d}</p></span><span class="go">›</span></a>`).join('')}
    </section>

    <section class="panel soft" style="margin-top:18px">
      <h2>Atalhos rápidos</h2>
      <div class="quick-links">
        ${link('direitos-atendimento','Estou sem Cartão SUS ou documentos <span>→</span>')}
        ${link('direitos-prontuario','Quero meu prontuário ou relatório <span>→</span>')}
        ${link('direitos-saude-mental','Quero entender meus direitos em saúde mental <span>→</span>')}
        ${link('direitos-reclamar','Negaram ou dificultaram um direito <span>→</span>')}
      </div>
    </section>
  </div>`;

pages['direitos-atendimento'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${rightsPageHead('Atendimento e documentos','O que vale quando você chega ao serviço: acolhimento, urgência, território, Cartão SUS, cadastro e barreiras burocráticas.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel">
          <h2>1. Acesso ao SUS</h2>
          <ul class="law-list">
            <li><strong>Saúde é direito de todos.</strong> A Constituição determina acesso universal e igualitário às ações e serviços de promoção, proteção e recuperação da saúde.</li>
            <li><strong>O SUS deve trabalhar com universalidade, integralidade e igualdade.</strong> A Lei nº 8.080/1990 também protege autonomia e direito à informação.</li>
            <li><strong>Atendimento não pode ser discriminatório.</strong> A Carta dos Direitos exige cuidado acolhedor, adequado, inclusivo e respeitoso.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>2. Urgência e emergência</h2>
          <ul class="law-list">
            <li><strong>Qualquer serviço de saúde deve receber e cuidar</strong> da pessoa em situação de urgência ou emergência e, quando necessário, encaminhá-la para outro serviço com capacidade adequada.</li>
            <li><strong>Se houver risco de vida ou lesão grave,</strong> a remoção deve ocorrer em tempo hábil e em condições seguras.</li>
            <li><strong>Burocracia não vem antes do socorro.</strong> Cadastro, senha ou território não justificam deixar uma pessoa sem acolhimento quando há urgência ou emergência.</li>
          </ul>
          <div class="panel danger" style="margin-top:14px"><strong>Risco imediato?</strong> Este aplicativo não substitui avaliação. Ligue 192 ou procure uma porta de urgência.</div>
        </section>

        <section class="panel warning">
          <h2>3. “Moro em outro bairro. Podem negar?”</h2>
          <p>A atenção básica e outros serviços podem organizar o acompanhamento habitual por território e unidade de referência. <strong>Territorialização não elimina o dever de acolher uma urgência ou emergência.</strong> Fora da urgência, se o serviço não for a referência adequada, a pessoa deve receber informação clara sobre o caminho e o encaminhamento compatível com a rede local.</p>
        </section>

        <section class="panel">
          <h2>4. Sem Cartão SUS</h2>
          <ul class="law-list">
            <li><strong>Não ter, não portar ou não saber o número do Cartão SUS não impede o atendimento solicitado.</strong> Essa regra está expressa no art. 13 da Portaria GM/MS nº 940/2011.</li>
            <li><strong>O cadastro pode ser regularizado depois.</strong> A própria norma permite que identificação e cadastramento sejam realizados posteriormente ao atendimento.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Estou sem o Cartão SUS agora. A Portaria nº 940/2011, art. 13, diz que isso não impede o atendimento. Posso regularizar o cadastro depois.”</div>
        </section>

        <section class="panel">
          <h2>5. Sem documento civil</h2>
          <p>A regra específica acima fala do Cartão SUS. Ela não significa que todo documento civil seja irrelevante em qualquer situação. O serviço pode precisar de dados para cadastro, identificação e continuidade do cuidado. <strong>Em urgência e emergência, porém, a ausência documental não deve virar barreira para receber e cuidar da pessoa.</strong></p>
        </section>

        <section class="panel success">
          <h2>Se houver dificuldade</h2>
          <div class="steps">
            <div class="step"><div><strong>Explique a necessidade</strong><p>Diga objetivamente por que precisa do atendimento naquele momento.</p></div></div>
            <div class="step"><div><strong>Peça a regra aplicada</strong><p>Se houver negativa, pergunte qual é o motivo e qual encaminhamento será oferecido.</p></div></div>
            <div class="step"><div><strong>Registre os fatos</strong><p>Anote data, horário, serviço, setor e resposta recebida.</p></div></div>
          </div>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Se a dificuldade virou negativa formal, veja como registrar e reclamar.',[['direitos-reclamar','Como exigir e reclamar'],['onde-ajuda','Onde buscar ajuda']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['constituicao','sus','carta','cartao'])}</section>
      </div>
    </div>
  </div>`;

pages['direitos-prontuario'] = () => `
  <div class="page">
    ${rightsPageHead('Informação, prontuário e sigilo','Você tem direito a compreender o cuidado, participar das decisões e proteger suas informações de saúde.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel">
          <h2>1. Informação clara</h2>
          <ul class="law-list">
            <li><strong>Você pode pedir explicações</strong> sobre seu estado de saúde, exames, procedimentos, benefícios, riscos, alternativas e encaminhamentos.</li>
            <li><strong>Informação deve ser compreensível.</strong> Não basta entregar um termo ou usar linguagem técnica sem verificar se a pessoa entendeu.</li>
            <li><strong>Você pode perguntar quem é o profissional</strong> e qual sua função no atendimento.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Quero que expliquem em linguagem simples qual é o objetivo, os riscos, as alternativas e o que acontece se eu não fizer esse procedimento.”</div>
        </section>

        <section class="panel">
          <h2>2. Consentimento e recusa</h2>
          <ul class="law-list">
            <li><strong>Procedimentos diagnósticos e terapêuticos devem respeitar consentimento livre e esclarecido,</strong> salvo exceções legais e situações específicas de emergência.</li>
            <li><strong>Autonomia é princípio do SUS.</strong> A Lei nº 8.080/1990 manda preservar a autonomia das pessoas na defesa de sua integridade física e moral.</li>
            <li><strong>Recusar não significa ficar sem explicação.</strong> A pessoa deve conhecer as possibilidades e consequências para decidir de forma informada, observadas as exceções previstas em lei.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>3. Prontuário e cópia</h2>
          <ul class="law-list">
            <li><strong>A Carta dos Direitos prevê acesso ao conteúdo do prontuário</strong> pela própria pessoa ou por pessoa por ela autorizada.</li>
            <li><strong>O prontuário deve registrar o cuidado.</strong> Evolução, condutas, procedimentos, identificação profissional, data e local precisam compor o registro clínico conforme as regras aplicáveis.</li>
            <li><strong>Prontuário digital deve preservar integridade, autenticidade e confidencialidade.</strong> Isso está na Lei nº 13.787/2018.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Quero acesso/cópia do meu prontuário e dos documentos referentes ao meu atendimento. Por favor, informem o procedimento e forneçam protocolo do pedido.”</div>
        </section>

        <section class="panel">
          <h2>4. Laudo, relatório e atestado</h2>
          <p>A Carta dos Direitos prevê obtenção de laudo, relatório e atestado quando a situação de saúde justificar. O conteúdo e o tipo de documento dependem do que efetivamente foi avaliado e registrado pelo profissional ou serviço.</p>
        </section>

        <section class="panel">
          <h2>5. Sigilo e proteção dos dados</h2>
          <ul class="law-list">
            <li><strong>Informações de saúde são confidenciais.</strong> O atendimento deve preservar privacidade e individualidade.</li>
            <li><strong>Dados de saúde são dados pessoais sensíveis na LGPD.</strong> O tratamento desses dados exige base legal e medidas de proteção.</li>
            <li><strong>Você pode pedir acesso e correção de dados</strong> pessoais incompletos, inexatos ou desatualizados, respeitadas as regras legais aplicáveis.</li>
            <li><strong>Familiares não recebem automaticamente toda informação.</strong> A vontade da pessoa, capacidade, representação legal e situações previstas em lei precisam ser consideradas.</li>
          </ul>
        </section>

        <section class="panel warning">
          <h2>Sigilo não é esconder informação de você</h2>
          <p>Confidencialidade serve para proteger a pessoa usuária. Ela não deve ser usada como justificativa genérica para impedir que a própria pessoa acesse informações e documentos aos quais tem direito.</p>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Em saúde mental existem garantias adicionais de informação, sigilo e cuidado menos invasivo.',[['direitos-saude-mental','Direitos em saúde mental'],['direitos-reclamar','Como reclamar']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['sus','carta','prontuario','lgpd'])}</section>
      </div>
    </div>
  </div>`;

pages['direitos-saude-mental'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${rightsPageHead('Direitos em saúde mental','A Lei nº 10.216/2001 protege a pessoa atendida em saúde mental e direciona o cuidado para respeito, informação, comunidade e meios menos invasivos.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <h2>Direitos expressos na Lei 10.216</h2>
          <ul class="law-list">
            <li><strong>Acesso ao melhor tratamento disponível no sistema</strong> de acordo com as necessidades da pessoa.</li>
            <li><strong>Humanidade e respeito,</strong> com cuidado voltado à recuperação e à inserção na família, no trabalho e na comunidade.</li>
            <li><strong>Proteção contra abuso e exploração.</strong></li>
            <li><strong>Sigilo das informações prestadas.</strong></li>
            <li><strong>Presença médica para esclarecer a necessidade ou não de hospitalização involuntária.</strong></li>
            <li><strong>Livre acesso aos meios de comunicação disponíveis.</strong></li>
            <li><strong>Receber o maior número de informações</strong> sobre doença e tratamento.</li>
            <li><strong>Ser tratado pelos meios menos invasivos possíveis.</strong></li>
            <li><strong>Preferência por serviços comunitários de saúde mental.</strong></li>
          </ul>
        </section>

        <section class="panel">
          <h2>Internação não é a primeira resposta automática</h2>
          <p>A Lei 10.216 determina que a internação, em qualquer modalidade, <strong>só deve ser indicada quando os recursos extra-hospitalares forem insuficientes</strong>. Se houver internação, o tratamento deve oferecer assistência integral e manter como finalidade permanente a reinserção social.</p>
        </section>

        <section class="panel">
          <h2>Tipos de internação psiquiátrica</h2>
          <ul class="law-list">
            <li><strong>Voluntária:</strong> ocorre com consentimento da pessoa.</li>
            <li><strong>Involuntária:</strong> ocorre sem consentimento da pessoa e a pedido de terceiro.</li>
            <li><strong>Compulsória:</strong> é determinada pela Justiça.</li>
          </ul>
          <p style="margin-top:14px">A internação psiquiátrica exige <strong>laudo médico circunstanciado que caracterize seus motivos</strong>.</p>
        </section>

        <section class="panel warning">
          <h2>Internação involuntária: controles legais</h2>
          <ul class="law-list">
            <li>Deve ser autorizada por médico devidamente registrado no CRM do Estado onde está o estabelecimento.</li>
            <li>O responsável técnico do estabelecimento deve comunicar a internação involuntária ao Ministério Público Estadual <strong>em até 72 horas</strong>, e o mesmo procedimento deve ocorrer na alta.</li>
            <li>O término pode ocorrer por solicitação escrita do familiar ou responsável legal, ou quando estabelecido pelo especialista responsável pelo tratamento.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Internação voluntária</h2>
          <p>A pessoa que solicita ou consente com a internação voluntária deve assinar declaração de opção por esse regime. O término ocorre por solicitação escrita do paciente ou por determinação do médico assistente.</p>
        </section>

        <section class="panel">
          <h2>Continuidade do cuidado</h2>
          <p>Para pessoas há longo tempo hospitalizadas ou em situação de grave dependência institucional, a Lei 10.216 prevê política específica de <strong>alta planejada e reabilitação psicossocial assistida</strong>, assegurando continuidade do tratamento quando necessária.</p>
        </section>

        <section class="panel soft">
          <h2>Como pedir explicação</h2>
          <p>“Quero que me expliquem meu plano de cuidado, as alternativas comunitárias, os motivos desta conduta e quais opções menos invasivas foram consideradas. A Lei 10.216 garante informação, respeito, sigilo e preferência por serviços comunitários.”</p>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Se você precisa de cópia de registros ou quer formalizar uma reclamação, use os atalhos.',[['direitos-prontuario','Prontuário e sigilo'],['direitos-reclamar','Como exigir e reclamar'],['raps','Entender a RAPS']])}
        <section class="panel"><h3>Fonte oficial</h3>${rightsSourcesList(['mental','carta'])}</section>
      </div>
    </div>
  </div>`;

pages['direitos-acompanhante'] = () => `
  <div class="page">
    ${rightsPageHead('Direito a acompanhante','O direito existe em situações diferentes e muda conforme a pessoa e o tipo de atendimento. Aqui estão as regras mais importantes.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel">
          <h2>Mulheres — consultas, exames e procedimentos</h2>
          <p>A Lei nº 14.737/2023 alterou a Lei nº 8.080/1990 para garantir a toda mulher o direito de estar acompanhada por <strong>pessoa maior de idade de sua livre indicação</strong> durante consultas, exames e procedimentos em unidades públicas ou privadas, independentemente de aviso prévio.</p>
          <ul class="law-list">
            <li>Se a paciente não puder manifestar vontade, o representante legal pode indicar.</li>
            <li>Em atendimento com sedação ou rebaixamento de consciência, existem regras adicionais para assegurar acompanhamento.</li>
            <li>Em centro cirúrgico ou UTI, restrições de segurança ou saúde devidamente justificadas podem limitar quem pode acompanhar.</li>
            <li>Em urgência ou emergência, a equipe pode agir para proteger saúde e vida mesmo sem a presença do acompanhante solicitado.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Pessoa idosa</h2>
          <p>O Estatuto da Pessoa Idosa assegura acompanhante à pessoa idosa <strong>internada ou em observação</strong>, devendo o órgão de saúde proporcionar condições adequadas para permanência em tempo integral segundo critério médico. Se houver impossibilidade, ela deve ser justificada por escrito pelo profissional responsável.</p>
        </section>

        <section class="panel">
          <h2>Pessoa com deficiência</h2>
          <p>A Lei Brasileira de Inclusão assegura, nas hipóteses previstas em lei, direito a acompanhante ou atendente pessoal em internação ou observação. Se a permanência não puder ocorrer, a situação deve ser justificada e o serviço deve adotar as providências cabíveis para suprir a ausência.</p>
        </section>

        <section class="panel">
          <h2>Criança ou adolescente</h2>
          <p>O ECA assegura condições para permanência em tempo integral de um dos pais ou responsável durante internação de criança ou adolescente, observadas as regras aplicáveis ao serviço.</p>
        </section>

        <section class="panel warning">
          <h2>Nem todo direito a acompanhante funciona do mesmo jeito</h2>
          <p>O motivo da presença, o ambiente assistencial e regras de segurança podem alterar a forma de exercício do direito. Se houver impedimento, peça que expliquem <strong>qual regra concreta está sendo aplicada naquele caso</strong>, em vez de aceitar apenas “não pode acompanhante”.</p>
        </section>

        <section class="panel soft">
          <h2>Como pedir</h2>
          <p>“Quero exercer meu direito a acompanhante. Se houver alguma restrição específica neste setor, por favor expliquem a base e registrem a justificativa aplicável.”</p>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Veja também proteções por idade, deficiência e outras condições.',[['direitos-protecoes','Proteções e prioridades'],['direitos-reclamar','Como reclamar']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['mulher','idoso','pcd','eca','carta'])}</section>
      </div>
    </div>
  </div>`;

pages['direitos-protecoes'] = () => `
  <div class="page">
    ${rightsPageHead('Proteções e prioridades','Alguns grupos possuem garantias adicionais de acessibilidade, acompanhamento, prioridade e proteção contra discriminação.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel">
          <h2>Pessoa com deficiência</h2>
          <ul class="law-list">
            <li><strong>Atenção integral à saúde</strong> em todos os níveis de complexidade, por intermédio do SUS, com acesso universal e igualitário.</li>
            <li><strong>Respeito à dignidade, autonomia e especificidades.</strong></li>
            <li><strong>Acessibilidade física, comunicacional e informacional.</strong> Barreiras não devem impedir o acesso ao serviço e à informação.</li>
            <li><strong>Tecnologia assistiva e recursos de comunicação</strong> devem ser considerados quando necessários para tornar a informação compreensível.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Pessoa idosa</h2>
          <ul class="law-list">
            <li><strong>Proteção integral e dignidade.</strong></li>
            <li><strong>Acompanhante</strong> em internação ou observação, nos termos do Estatuto.</li>
            <li><strong>Escolha do tratamento:</strong> a pessoa idosa no domínio de suas faculdades mentais pode optar pelo tratamento que considerar mais favorável.</li>
            <li><strong>Maiores de 80 anos:</strong> têm preferência especial sobre as demais pessoas idosas no atendimento de saúde, exceto em caso de emergência.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Criança e adolescente</h2>
          <p>Crianças e adolescentes possuem proteção integral prevista no ECA, inclusive garantias próprias em atendimento e internação. A idade e a capacidade de compreensão devem ser consideradas na comunicação, sem apagar o papel dos responsáveis e as salvaguardas legais.</p>
        </section>

        <section class="panel success">
          <h2>Atendimento sem discriminação</h2>
          <p>A Carta dos Direitos e a legislação do SUS exigem respeito, dignidade e igualdade. Condição social, raça, cor, identidade, orientação sexual, religião, deficiência, diagnóstico, uso de álcool ou outras drogas e outras características pessoais não devem ser usadas para humilhar, punir ou negar cuidado devido.</p>
        </section>

        <section class="panel warning">
          <h2>Prioridade não elimina classificação de risco</h2>
          <p>Em urgência e emergência, a gravidade clínica pode definir a ordem do atendimento. Por isso, prioridade legal e classificação de risco precisam ser compreendidas em conjunto.</p>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Acompanhante e acessibilidade têm regras próprias.',[['direitos-acompanhante','Direito a acompanhante'],['direitos-reclamar','Como exigir e reclamar']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['pcd','idoso','eca','carta','sus'])}</section>
      </div>
    </div>
  </div>`;

pages['direitos-reclamar'] = () => `
  <div class="page">
    ${rightsPageHead('Como exigir e reclamar','Quando um direito é dificultado, transforme a situação em fatos verificáveis: o que você pediu, qual foi a resposta, qual providência espera e qual protocolo recebeu.')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <h2>Primeiro: tente resolver no próprio serviço</h2>
          <div class="steps">
            <div class="step"><div><strong>Explique objetivamente</strong><p>Diga o que precisa e qual problema está impedindo o atendimento ou acesso.</p></div></div>
            <div class="step"><div><strong>Peça o motivo da decisão</strong><p>Pergunte qual regra, fluxo ou orientação fundamenta a negativa ou restrição.</p></div></div>
            <div class="step"><div><strong>Peça encaminhamento concreto</strong><p>Se aquele ponto da rede não resolver, pergunte qual serviço deve assumir e como chegar até ele.</p></div></div>
            <div class="step"><div><strong>Registre</strong><p>Anote data, horário, unidade, setor, nomes ou funções dos envolvidos e resposta recebida.</p></div></div>
          </div>
        </section>

        <section class="panel">
          <h2>Depois: escolha o tipo certo de manifestação</h2>
          <ul class="law-list">
            <li><strong>Reclamação:</strong> quando existe insatisfação com atendimento, serviço ou conduta.</li>
            <li><strong>Solicitação:</strong> quando você precisa pedir uma providência, acesso, informação, consulta, exame, medicamento ou outro serviço.</li>
            <li><strong>Denúncia:</strong> quando há comunicação de irregularidade ou indício de irregularidade.</li>
            <li><strong>Sugestão:</strong> proposta de melhoria.</li>
            <li><strong>Elogio:</strong> reconhecimento de atendimento ou serviço.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Como escrever uma manifestação forte</h2>
          <ul class="tip-list">
            <li>Comece pelo fato principal: o que aconteceu.</li>
            <li>Informe data, local e unidade.</li>
            <li>Explique o que você pediu e qual resposta recebeu.</li>
            <li>Se souber, cite a regra ou direito relacionado, mas não é obrigatório escrever como advogado.</li>
            <li>Diga o que espera: resposta, correção, acesso, apuração, encaminhamento ou registro.</li>
            <li>Guarde o protocolo e acompanhe o prazo informado.</li>
          </ul>
        </section>

        <section class="panel warning">
          <h2>Peça registro da negativa quando possível</h2>
          <p>Se um pedido importante for recusado, tente obter protocolo, comprovante do requerimento ou resposta formal. Quando isso não for possível, faça seu próprio registro contemporâneo com data, hora, local e o que foi dito.</p>
        </section>

        <section class="panel">
          <h2>OuvSUS</h2>
          <p>A Ouvidoria-Geral do SUS recebe manifestações sobre o SUS. O telefone 136 e os canais digitais oficiais permitem registrar e acompanhar demandas.</p>
          <div class="hero-actions">${link('ouvsus','Abrir guia da OuvSUS','btn')}<a class="btn secondary" href="tel:136">Ligar 136</a></div>
        </section>

        <section class="panel danger">
          <h2>Ouvidoria não substitui emergência</h2>
          <p>Se existe risco imediato à vida ou necessidade de socorro, procure a rede assistencial. Não espere resposta de protocolo de ouvidoria para uma situação urgente.</p>
        </section>
        ${rightsBack()}
      </div>
      <div class="side-stack">
        ${sideBox('Antes de reclamar','Pode ser útil abrir a página do direito específico e conferir a fonte legal.',[['direitos-atendimento','Atendimento e documentos'],['direitos-prontuario','Prontuário e sigilo'],['direitos-saude-mental','Saúde mental']])}
        <section class="panel"><h3>Fontes oficiais</h3>${rightsSourcesList(['carta','usuario','sus','mental'])}</section>
      </div>
    </div>
  </div>`;

// Se a URL abriu diretamente uma das novas subpáginas, renderiza novamente
// depois que este arquivo registra as rotas.
render(currentRoute(), false);
