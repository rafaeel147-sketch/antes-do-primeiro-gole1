// Álcool e outras drogas — navegação por necessidade.
// Conteúdo educativo baseado em pesquisa normativa do projeto e fontes oficiais do SUS.
// Não realiza diagnóstico, prescrição ou plano individual de desintoxicação.

const adSources = {
  drogas: ['Lei nº 11.343/2006 — atenção e redução de riscos e danos','https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm'],
  rd: ['Portaria MS nº 1.028/2005 — redução de danos','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2005/prt1028_01_07_2005.html'],
  capsad3: ['Portaria GM/MS nº 130/2012 — CAPS AD III','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2012/prt0130_26_01_2012.html'],
  raps: ['Ministério da Saúde — SUS e Saúde Mental / RAPS','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/sus-e-a-saude-mental'],
  samu: ['Ministério da Saúde — SAMU 192','https://www.gov.br/saude/pt-br/composicao/saes/samu-192']
};

const adTopics = [
  ['ad-parar','⏹','Quero parar','Como organizar uma tentativa com segurança e buscar apoio.'],
  ['ad-reduzir','↘','Quero reduzir','Estratégias práticas para diminuir exposição e riscos.'],
  ['ad-recaida','↺','Tive uma recaída','O que fazer agora e como retomar o cuidado sem transformar recaída em desistência.'],
  ['ad-abstinencia','⚠','Estou com abstinência','Sinais de alerta e quando procurar avaliação urgente.'],
  ['ad-riscos','＋','Como diminuir riscos','Redução de danos para proteger a vida e a saúde.'],
  ['ad-ajuda','⌖','Onde procurar ajuda','UBS, CAPS AD, urgência, SAMU e outros pontos da rede.']
];

function adBreadcrumb(title){
  return `<div class="breadcrumb">${link('inicio','Início')} <span>›</span> ${link('alcool-drogas','Álcool e outras drogas')} <span>›</span> <span>${title}</span></div>`;
}
function adPageHead(title,summary){
  return `<section class="page-head">${adBreadcrumb(title)}<div class="eyebrow">Álcool e outras drogas</div><h1>${title}</h1><p class="summary">${summary}</p></section>`;
}
function adSourcesList(keys){return sourceList(keys.map(k=>adSources[k]).filter(Boolean));}
function adBack(){return `<div class="hero-actions">${link('alcool-drogas','← Voltar para Álcool e outras drogas','btn secondary')}</div>`;}

pages['alcool-drogas'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${pageHead('Álcool e outras drogas','Escolha o que você precisa agora. O cuidado pode começar pela abstinência, pela redução do consumo, pela redução de danos ou simplesmente pela busca de ajuda — sem julgamento.','Álcool e outras drogas')}

    <section class="panel success" style="margin-bottom:18px">
      <div class="callout"><span class="callout-icon">♡</span><div>
        <h2>Você não precisa estar abstinente para procurar cuidado</h2>
        <p>A redução de danos faz parte das políticas de atenção a pessoas que usam álcool e outras drogas. O objetivo é proteger a vida, reduzir riscos e construir cuidado possível para cada situação.</p>
      </div></div>
    </section>

    <section class="nav-grid" aria-label="Escolhas sobre álcool e outras drogas">
      ${adTopics.map(([r,i,t,d])=>`<a class="nav-card" href="?p=${r}" data-route="${r}"><span class="icon-square" aria-hidden="true">${i}</span><span><strong>${t}</strong><p>${d}</p></span><span class="go">›</span></a>`).join('')}
    </section>

    <section class="panel soft" style="margin-top:18px">
      <h2>Atalhos rápidos</h2>
      <div class="quick-links">
        ${link('ad-abstinencia','Estou tremendo ou passando mal depois de reduzir/parar <span>→</span>')}
        ${link('ad-recaida','Voltei a usar depois de um período sem usar <span>→</span>')}
        ${link('ad-ajuda','Quero saber onde procurar ajuda <span>→</span>')}
      </div>
    </section>
  </div>`;

pages['ad-parar'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${adPageHead('Quero parar','Parar pode ser um objetivo importante, mas a segurança vem primeiro. Algumas abstinências exigem avaliação profissional e não devem ser manejadas sozinho em casa.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel danger">
        <h2>Antes de interromper de repente</h2>
        <p><strong>Se você usa álcool em grande quantidade todos os dias, precisa beber para aliviar tremor ou mal-estar, já teve convulsão, confusão, alucinação ou abstinência importante, procure avaliação de saúde antes de tentar parar sozinho.</strong> A abstinência alcoólica pode ser grave.</p>
        <p>O mesmo cuidado vale para uso regular de sedativos, inclusive benzodiazepínicos: interrupção abrupta pode exigir avaliação médica.</p>
      </section>
      <section class="panel">
        <h2>Se a meta é parar, organize o ambiente</h2>
        <ul class="tip-list">
          <li><strong>Escolha um primeiro passo concreto.</strong> Pode ser procurar um serviço, conversar com alguém de confiança ou tirar do ambiente aquilo que funciona como gatilho.</li>
          <li><strong>Mapeie horários e situações de maior risco.</strong> Solidão, dinheiro disponível, bares, festas, conflitos, determinados amigos ou emoções podem exigir um plano alternativo.</li>
          <li><strong>Não faça da força de vontade o único recurso.</strong> Combine apoio de pessoas e serviços antes dos momentos em que costuma ficar mais vulnerável.</li>
          <li><strong>Planeje o que fazer quando a vontade vier.</strong> Sair do local, caminhar, comer, beber água, ligar para alguém ou ir a um serviço pode interromper o automatismo.</li>
          <li><strong>Se houver tratamento em andamento, não abandone porque decidiu parar.</strong> A continuidade do cuidado ajuda a atravessar mudanças de rotina e possíveis sintomas.</li>
        </ul>
      </section>
      <section class="panel warning">
        <h2>Parar não precisa significar fazer tudo sozinho</h2>
        <p>UBS, CAPS/CAPS AD e outros pontos da RAPS podem participar do cuidado. Dependendo do quadro, urgência e hospital também podem ser necessários. O aplicativo não define qual modalidade é indicada para você.</p>
      </section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Se estiver passando mal','Sintomas após redução ou interrupção merecem atenção específica.',[['ad-abstinencia','Estou com abstinência'],['ad-ajuda','Onde procurar ajuda']])}
      <section class="panel"><h3>Fontes</h3>${adSourcesList(['drogas','raps','capsad3'])}</section>
    </div></div>
  </div>`;

pages['ad-reduzir'] = () => `
  <div class="page">
    ${adPageHead('Quero reduzir','Reduzir pode ser uma etapa de cuidado e redução de danos. O objetivo aqui é criar decisões menos automáticas e diminuir exposição a situações de maior risco.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel success"><h2>Estratégias práticas</h2><ul class="tip-list">
        <li><strong>Observe antes de mudar.</strong> Anote mentalmente ou em papel em quais horários, lugares e situações você mais usa.</li>
        <li><strong>Defina uma mudança específica para hoje.</strong> Por exemplo: não comprar quantidade extra, evitar um local-gatilho ou adiar uma situação de consumo.</li>
        <li><strong>Reduza a disponibilidade.</strong> Ter grande quantidade ao alcance pode facilitar uso automático ou impulsivo.</li>
        <li><strong>Faça pausas e cuide de necessidades básicas.</strong> Alimentação, água e descanso não anulam o risco da substância, mas ajudam a evitar que fome, desidratação e exaustão agravem a situação.</li>
        <li><strong>Evite combinar álcool com outras drogas ou medicamentos por conta própria.</strong> Misturas podem aumentar imprevisibilidade e risco.</li>
        <li><strong>Não dirija nem opere máquinas após usar.</strong></li>
      </ul></section>
      <section class="panel warning"><h2>Reduzir não é sempre seguro sem avaliação</h2><p>Se existe uso diário intenso, sintomas quando fica sem usar, histórico de convulsão, alucinação ou abstinência grave, não transforme esta página em um plano de desintoxicação. Procure avaliação de saúde.</p></section>
      <section class="panel"><h2>Se a redução não saiu como planejado</h2><p>Isso é informação, não prova de fracasso. Observe em que ponto o plano quebrou e ajuste o ambiente, os apoios e o cuidado. Se estiver difícil controlar o uso, procurar um serviço pode ser parte do plano de redução.</p></section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Redução de danos','Você pode combinar a meta de reduzir com medidas concretas de proteção.',[['ad-riscos','Como diminuir riscos'],['ad-ajuda','Onde procurar ajuda']])}
      <section class="panel"><h3>Fontes</h3>${adSourcesList(['drogas','rd'])}</section>
    </div></div>
  </div>`;

pages['ad-recaida'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${adPageHead('Tive uma recaída','Recaída não precisa virar abandono do cuidado. Primeiro vem a segurança; depois, entender o que aconteceu e retomar apoio.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel danger"><h2>Se você está sob efeito agora</h2><ul class="check-list">
        <li>Não dirija, não opere máquinas e evite situações de queda, água, altura ou violência.</li>
        <li>Evite acrescentar outras substâncias ou medicamentos por conta própria.</li>
        <li>Se houver perda de consciência, convulsão, dificuldade respiratória, dor intensa, confusão importante ou outro sinal grave, procure urgência ou ligue 192.</li>
      </ul></section>
      <section class="panel success"><h2>Depois que a situação imediata passar</h2><div class="steps">
        <div class="step"><div><strong>Retome o contato</strong><p>Voltar ao serviço, grupo ou pessoa de apoio pode ser mais útil do que se isolar por vergonha.</p></div></div>
        <div class="step"><div><strong>Reconstrua a sequência</strong><p>O que aconteceu nas horas ou dias anteriores? Mudança de rotina, conflito, dinheiro, contato, lugar, pensamento ou afastamento do cuidado?</p></div></div>
        <div class="step"><div><strong>Escolha uma barreira nova</strong><p>Ajuste algo concreto para o próximo episódio de vontade: ambiente, contato, deslocamento, dinheiro, companhia ou acesso ao serviço.</p></div></div>
        <div class="step"><div><strong>Não descarte o período anterior</strong><p>O que funcionou antes da recaída continua sendo informação útil para o próximo plano.</p></div></div>
      </div></section>
      <section class="panel warning"><h2>Se a recaída veio após período de abstinência</h2><p>A tolerância pode mudar ao longo do tempo. Voltar ao padrão antigo pode aumentar risco de intoxicação. Trate a situação como algo que merece cautela e, se possível, apoio.</p></section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Próximo passo','Você pode voltar ao cuidado mesmo depois de usar novamente.',[['ad-ajuda','Onde procurar ajuda'],['ad-riscos','Como diminuir riscos']])}
      <section class="panel"><h3>Base do projeto</h3><p>O material do projeto usa a recaída como oportunidade para reconhecer sinais precoces e compartilhar esses sinais mais cedo com familiares, pares ou profissionais.</p></section>
    </div></div>
  </div>`;

pages['ad-abstinencia'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${adPageHead('Estou com abstinência','Sintomas depois de reduzir ou interromper uma substância podem variar muito. Esta página serve para reconhecer risco e procurar ajuda — não para ensinar desintoxicação em casa.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel warning"><h2>Álcool</h2><p>Tremor, suor, ansiedade intensa, náusea, insônia, agitação ou piora importante após reduzir/parar podem ser compatíveis com abstinência e merecem avaliação, especialmente quando o uso era frequente ou intenso.</p></section>
      <section class="panel danger"><h2>Procure urgência imediatamente se houver</h2><ul class="check-list">
        <li>convulsão;</li>
        <li>confusão importante ou desorientação;</li>
        <li>alucinações ou alteração intensa da percepção;</li>
        <li>agitação extrema ou comportamento com risco;</li>
        <li>alteração importante da consciência;</li>
        <li>dificuldade respiratória, desmaio ou outro sinal de gravidade.</li>
      </ul><div class="hero-actions"><a class="btn danger" href="tel:192">Ligar 192</a></div></section>
      <section class="panel"><h2>Outras substâncias</h2><p>O risco depende da substância, frequência, quantidade, mistura com outras drogas, condições clínicas e tempo de uso. <strong>Abstinência de álcool e de sedativos/benzodiazepínicos pode ser particularmente perigosa.</strong> Não use este aplicativo para decidir sozinho como reduzir doses ou substituir substâncias.</p></section>
      <section class="panel soft"><h2>O que fazer agora, sem prescrição</h2><ul class="tip-list">
        <li>Se os sintomas forem novos ou importantes, procure avaliação de saúde.</li>
        <li>Se possível, não fique sozinho quando estiver piorando ou houver risco de convulsão/confusão.</li>
        <li>Leve ou informe quais substâncias e medicamentos usa, quando foi o último uso e se já teve abstinência grave antes.</li>
      </ul></section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Não é hora de testar força de vontade','Abstinência grave é uma situação clínica, não uma falha moral.',[['ad-ajuda','Onde procurar ajuda']])}
      <section class="panel"><h3>Fontes</h3>${adSourcesList(['raps','samu'])}</section>
    </div></div>
  </div>`;

pages['ad-riscos'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${adPageHead('Como diminuir riscos','Redução de danos busca diminuir consequências negativas e aproximar a pessoa do cuidado, mesmo quando parar não é o objetivo possível agora.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel success"><h2>Medidas de proteção</h2><ul class="tip-list">
        <li><strong>Evite misturar substâncias.</strong> Combinações podem produzir efeitos mais intensos e imprevisíveis.</li>
        <li><strong>Evite usar sozinho</strong> quando houver risco de perda de consciência ou intoxicação.</li>
        <li><strong>Não compartilhe seringas, cachimbos, canudos ou outros instrumentos de consumo.</strong></li>
        <li><strong>Cuide de alimentação, água e descanso.</strong> Isso não torna o uso seguro, mas reduz fatores adicionais de vulnerabilidade.</li>
        <li><strong>Não dirija, nade, suba em altura ou realize atividades que exijam reflexos e julgamento após usar.</strong></li>
        <li><strong>Use preservativos e procure testagem/prevenção no SUS</strong> quando houver risco de infecções sexualmente transmissíveis.</li>
        <li><strong>Tenha um caminho de ajuda definido.</strong> Saber quem chamar ou onde ir reduz atraso quando algo sai do esperado.</li>
      </ul></section>
      <section class="panel"><h2>Redução de danos não é desistir de parar</h2><p>Ela pode coexistir com metas de reduzir ou de chegar à abstinência. A Lei nº 11.343/2006 reconhece redução de riscos e danos nas ações de atenção, e a política de saúde trabalha com projetos de cuidado compatíveis com a realidade da pessoa.</p></section>
      <section class="panel danger"><h2>Quando a estratégia deixa de ser “reduzir risco” e vira urgência</h2><p>Convulsão, alteração importante de consciência, dificuldade respiratória, intoxicação grave, abstinência grave, agitação com risco ou outro sinal de gravidade exigem avaliação urgente.</p></section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Você continua tendo direito ao cuidado','Estar usando uma substância não elimina seu direito à saúde.',[['ad-ajuda','Onde procurar ajuda'],['direitos','Meus direitos']])}
      <section class="panel"><h3>Fontes</h3>${adSourcesList(['drogas','rd','capsad3'])}</section>
    </div></div>
  </div>`;

pages['ad-ajuda'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${adPageHead('Onde procurar ajuda','O cuidado não acontece só no CAPS AD. Diferentes pontos do SUS e da RAPS podem participar conforme a necessidade e a organização local.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel"><h2>UBS / Atenção Primária</h2><p>Pode ser porta de entrada para avaliação, cuidado contínuo, prevenção, saúde clínica e articulação com outros pontos da rede.</p></section>
      <section class="panel"><h2>CAPS / CAPS AD</h2><p>Serviços comunitários de atenção psicossocial. CAPS AD é voltado às necessidades relacionadas ao uso prejudicial de álcool e outras drogas. <strong>A procura por cuidado não exige que a pessoa já esteja abstinente.</strong></p></section>
      <section class="panel"><h2>CAPS AD III</h2><p>É modalidade com funcionamento 24 horas e recursos específicos definidos em norma federal. A disponibilidade depende da rede local.</p></section>
      <section class="panel warning"><h2>UPA, pronto-socorro e hospital</h2><p>São importantes quando há intoxicação, abstinência grave, convulsão, alteração de consciência, dificuldade respiratória, trauma ou outra urgência clínica/psíquica.</p></section>
      <section class="panel danger"><h2>SAMU 192</h2><p>Em situação de urgência ou emergência com necessidade de socorro móvel, ligue 192. A ligação é gratuita.</p><a class="btn danger" href="tel:192">Ligar 192</a></section>
      <section class="panel"><h2>Outros pontos que podem existir na rede</h2><ul class="law-list"><li>Consultório na Rua;</li><li>Unidade de Acolhimento;</li><li>serviços hospitalares e outros pontos da RAPS;</li><li>assistência social e outras políticas públicas quando a necessidade não é apenas de saúde.</li></ul><p style="margin-top:12px">Endereços e disponibilidade precisam ser conferidos na rede local; o PWA não deve inventar serviços ou horários.</p></section>
      ${adBack()}
    </div><div class="side-stack">
      ${sideBox('Não sabe se é urgência?','Se houver sinal de gravidade ou piora rápida, prefira avaliação presencial e não espere a situação “ficar clara”.',[['onde-ajuda','Entender portas do SUS'],['direitos-atendimento','Direitos no atendimento']])}
      <section class="panel"><h3>Fontes</h3>${adSourcesList(['raps','capsad3','samu'])}</section>
    </div></div>
  </div>`;
