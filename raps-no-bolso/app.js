const BASE = './';

const menuItems = [
  ['inicio','⌂','Início','O que você procura agora?'],
  ['direitos','⚖','Meus direitos','Direitos no SUS e na saúde mental'],
  ['parar-fumar','🚭','Pare de fumar','Dicas práticas para reduzir ou parar'],
  ['alcool-drogas','◒','Álcool e outras drogas','Informação, escolhas e cuidado'],
  ['reducao-danos','＋','Redução de danos','Diminuir riscos e proteger a vida'],
  ['crise','♡','Crise e ansiedade','O que fazer no momento difícil'],
  ['onde-ajuda','⌖','Onde buscar ajuda','UBS, CAPS, UPA, hospital e SAMU'],
  ['raps','◎','Entenda a RAPS','Como a rede de cuidado se organiza'],
  ['ouvsus','◉','OuvSUS','Reclamação, denúncia, pedido e elogio'],
  ['familia','⌂','Família e rede de apoio','Como apoiar sem julgar'],
  ['fontes','≡','Fontes e atualização','De onde vêm as informações']
];

const sources = {
  direitos: [
    ['Carta dos Direitos e Deveres da Pessoa Usuária da Saúde — Resolução CNS nº 553/2017','https://bvsms.saude.gov.br/bvs/saudelegis/cns/2018/res0553_15_01_2018.html'],
    ['Portaria GM/MS nº 940/2011 — Cartão Nacional de Saúde','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2011/prt0940_28_04_2011.html'],
    ['Lei nº 10.216/2001 — direitos em saúde mental','https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm']
  ],
  fumar: [
    ['INCA — Como parar de fumar','https://www.gov.br/inca/pt-br/assuntos/causas-e-prevencao-do-cancer/tabagismo/como-parar-de-fumar'],
    ['Ministério da Saúde — 10 passos para parar de fumar','https://www.gov.br/saude/pt-br/assuntos/saude-brasil/eu-quero-parar-de-fumar/noticias/2017/confira-os-10-passos-para-parar-de-fumar/'],
    ['Linha de Cuidado do Tabagismo — Sou paciente','https://linhasdecuidado.saude.gov.br/portal/tabagismo/sou-paciente/']
  ],
  reducao: [
    ['Ministério da Saúde — Redução de Danos','https://www.gov.br/aids/pt-br/assuntos/prevencao-combinada/reducao-de-danos'],
    ['Portaria nº 1.028/2005 — redução de danos sociais e à saúde','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2005/prt1028_01_07_2005.html']
  ],
  ajuda: [
    ['Ministério da Saúde — UPA 24h','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/u/upa-24h'],
    ['Ministério da Saúde — SAMU 192','https://www.gov.br/saude/pt-br/composicao/saes/samu-192'],
    ['Ministério da Saúde — SUS e Saúde Mental','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/sus-e-a-saude-mental']
  ],
  ouvsus: [
    ['Ouvidoria-Geral do SUS — canais oficiais','https://www.gov.br/saude/pt-br/canais-de-atendimento/ouvsus'],
    ['Como classificar uma manifestação','https://www.gov.br/saude/pt-br/canais-de-atendimento/ouvsus/faq/faq/como-classificar-minha-manifestacao'],
    ['Cadastrar manifestação na OuvSUS','https://www.gov.br/pt-br/servicos/cadastrar-manifestacao-na-ouvidoria-geral-do-sus-ouvsus']
  ]
};

function link(route, label, cls='') {
  return `<a class="${cls}" href="?p=${route}" data-route="${route}">${label}</a>`;
}
function sourceList(items=[]) {
  return `<div class="source-list">${items.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener">${name} ↗</a>`).join('')}</div>`;
}
function emergencyStrip(){
  return `<div class="emergency-strip"><div><strong>Risco imediato, desmaio, convulsão, falta de ar intensa, tentativa de suicídio ou outra emergência?</strong><span> O SAMU 192 é gratuito. Em urgência/emergência, procure também UPA ou pronto-socorro.</span></div><a href="tel:192">Ligar 192</a></div>`;
}
function breadcrumb(title){return `<div class="breadcrumb">${link('inicio','Início')} <span>›</span> <span>${title}</span></div>`}
function pageHead(title,summary,eyebrow='RAPS no Bolso'){
  return `<section class="page-head">${breadcrumb(title)}<div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="summary">${summary}</p></section>`;
}
function sideBox(title, body, links=[]){return `<aside class="panel soft"><h3>${title}</h3><p>${body}</p>${links.length?`<div class="quick-links">${links.map(([r,l])=>link(r,`${l}<span>→</span>`)).join('')}</div>`:''}</aside>`}

const pages = {
  inicio: () => `
    <div class="page">
      ${emergencyStrip()}
      <section class="hero">
        <div class="hero-main">
          <div class="eyebrow">Informação simples para decisões reais</div>
          <h1>O que você procura agora?</h1>
          <p class="lead">Escolha uma área. Cada opção abre um caminho próprio, com informação curta primeiro e detalhes quando você quiser.</p>
          <div class="hero-actions">
            ${link('direitos','Ver meus direitos','btn')}
            ${link('parar-fumar','Quero parar de fumar','btn secondary')}
          </div>
        </div>
        <div class="hero-side">
          <div><span class="badge">PROTÓTIPO EDUCATIVO</span><h2 style="margin-top:14px">Rede, não labirinto.</h2><p>Você não precisa decorar qual serviço faz o quê. O aplicativo explica as portas de cuidado sem fazer diagnóstico ou prometer atendimento.</p></div>
          <div class="mini-box"><strong>Sem cadastro clínico</strong><br><small>Esta versão não pede relato de consumo, prontuário ou localização.</small></div>
        </div>
      </section>
      <div class="section-head"><div><div class="eyebrow">Menu principal</div><h2>Escolha por necessidade</h2></div><p>Os cartões abaixo levam para conteúdos separados. Nada de uma página única interminável.</p></div>
      <section class="nav-grid">
        ${menuItems.filter(x=>!['inicio','fontes'].includes(x[0])).map(([r,i,t,d])=>`<a class="nav-card" href="?p=${r}" data-route="${r}"><span class="icon-square" aria-hidden="true">${i}</span><span><strong>${t}</strong><p>${d}</p></span><span class="go">›</span></a>`).join('')}
      </section>
    </div>`,

  direitos: () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Meus direitos','Direitos explicados sem juridiquês, com a regra prática e a fonte oficial para conferir.')}
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel"><h2>Direitos que fazem diferença na prática</h2><ul class="law-list">
            <li><strong>Urgência e emergência:</strong> qualquer serviço de saúde deve receber e cuidar da pessoa e, se necessário, encaminhar para outro serviço adequado.</li>
            <li><strong>Sem Cartão SUS:</strong> a inexistência, ausência ou desconhecimento do número do Cartão Nacional de Saúde não pode impedir o atendimento solicitado.</li>
            <li><strong>Sem discriminação:</strong> você tem direito a atendimento acolhedor, adequado, inclusivo, acessível e humanizado.</li>
            <li><strong>Informação:</strong> você pode pedir explicações claras sobre seu cuidado, procedimentos, riscos, alternativas e encaminhamentos.</li>
            <li><strong>Privacidade e sigilo:</strong> informações pessoais e de saúde devem ser tratadas com confidencialidade.</li>
            <li><strong>Saúde mental:</strong> a Lei 10.216 garante tratamento com humanidade e respeito, proteção contra abuso, informação, sigilo e preferência por serviços comunitários e meios menos invasivos possíveis.</li>
          </ul></section>
          <section class="panel warning"><h2>“Moro em outro bairro. Podem me mandar embora?”</h2><p>Na atenção básica, o acesso é organizado preferencialmente pela rede territorial. Isso não transforma território em desculpa para abandono em situação de urgência ou emergência: nessas situações, o serviço deve receber, cuidar e encaminhar quando necessário.</p></section>
          <section class="panel"><h2>Se um direito não estiver sendo respeitado</h2><div class="steps"><div class="step"><div><strong>Peça informação clara</strong><p>Pergunte qual é o motivo, qual regra está sendo aplicada e qual encaminhamento será oferecido.</p></div></div><div class="step"><div><strong>Guarde os fatos essenciais</strong><p>Data, horário, local, setor, o que foi solicitado e o que foi respondido.</p></div></div><div class="step"><div><strong>Use a ouvidoria quando necessário</strong><p>Escolha entre reclamação, solicitação, denúncia, sugestão ou elogio conforme o caso.</p></div></div></div></section>
        </div>
        <div class="side-stack">
          ${sideBox('Atalhos','Quer transformar o direito em ação?',[['ouvsus','Como usar a OuvSUS'],['onde-ajuda','Entender onde buscar ajuda']])}
          <section class="panel"><h3>Fontes oficiais</h3>${sourceList(sources.direitos)}</section>
        </div>
      </div>
    </div>`,

  'parar-fumar': () => `
    <div class="page">
      ${pageHead('Pare de fumar','Dicas práticas para lidar com gatilhos e fissura. Aqui a proposta é ajudar no cotidiano — não receitar medicamento.','Tabaco e nicotina')}
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel success"><div class="callout"><span class="callout-icon">✓</span><div><h2>Comece pelo ambiente</h2><p>Quanto menos automático for pegar um cigarro, mais espaço você cria entre a vontade e o ato de fumar.</p></div></div><ul class="tip-list">
            <li><strong>Deixe cigarros longe do alcance fácil.</strong> Não carregue maço no bolso e evite deixar cigarro visível pela casa.</li>
            <li><strong>Retire cinzeiros e isqueiros dos lugares habituais.</strong> Pequenas mudanças quebram a rotina automática.</li>
            <li><strong>Identifique seus gatilhos.</strong> Café, bebida alcoólica, depois da refeição, ansiedade, conversa com fumantes ou um lugar específico podem disparar a vontade.</li>
            <li><strong>Mude o ritual.</strong> Depois de comer, levante, escove os dentes, caminhe um pouco ou faça outra atividade antes que o piloto automático entre em ação.</li>
          </ul></section>
          <section class="panel"><h2>Quando a vontade apertar</h2><p>A fissura costuma ser intensa, mas passa. Monte um “kit” simples para atravessar esses minutos.</p><ul class="tip-list">
            <li>Beba água gelada devagar.</li>
            <li>Chupe gelo, bala ou masque chiclete sem açúcar.</li>
            <li>Tenha fruta, cenoura em palitos ou outro substituto simples por perto.</li>
            <li>Saia do lugar onde você costuma fumar e caminhe alguns minutos.</li>
            <li>Respire mais devagar e ocupe as mãos com outra tarefa.</li>
            <li>Converse com alguém que apoie sua decisão sem cobrança.</li>
          </ul></section>
          <section class="panel"><h2>Se parar de uma vez parece difícil</h2><p>O INCA também descreve a possibilidade de uma parada gradual: reduzir a quantidade de cigarros ou adiar o primeiro cigarro do dia, com uma data definida para chegar a zero. A ideia é ter direção, não ficar reduzindo indefinidamente.</p><div class="steps"><div class="step"><div><strong>Conte sem se julgar</strong><p>Descubra quantos cigarros você fuma em um dia comum.</p></div></div><div class="step"><div><strong>Escolha uma mudança pequena</strong><p>Ex.: tirar um cigarro de um horário automático ou adiar o primeiro.</p></div></div><div class="step"><div><strong>Observe o que funcionou</strong><p>Use a informação para ajustar o próximo dia.</p></div></div></div></section>
          <section class="panel warning"><h2>Recaída não apaga o que você aprendeu</h2><p>Se voltar a fumar, observe qual foi o gatilho e retome a tentativa. O próprio INCA orienta a não tratar recaída como fracasso.</p></section>
          <section class="panel soft"><h2>Quer apoio do SUS?</h2><p>O SUS oferece tratamento para quem deseja parar de fumar. Procure uma UBS ou confirme na rede local onde o programa está disponível. Medicamentos, quando necessários, são assunto para avaliação profissional — este aplicativo não indica nem prescreve.</p></section>
        </div>
        <div class="side-stack">
          ${sideBox('Você pode tentar agora','Escolha uma única mudança para as próximas horas: afastar o maço, deixar água por perto ou mudar um gatilho específico.',[['onde-ajuda','Onde buscar apoio']])}
          <section class="panel"><h3>Fontes oficiais</h3>${sourceList(sources.fumar)}</section>
        </div>
      </div>
    </div>`,

  'alcool-drogas': () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Álcool e outras drogas','Informação para quem quer parar, reduzir ou simplesmente diminuir riscos — sem julgamento e sem exigir abstinência como porta de entrada.','Álcool e outras drogas')}
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel"><h2>Se você quer reduzir o álcool</h2><ul class="tip-list">
            <li><strong>Defina antes quanto pretende beber.</strong> Decidir depois que começou costuma ser mais difícil.</li>
            <li><strong>Atrasar o primeiro copo</strong> pode ajudar a reduzir o tempo total de consumo.</li>
            <li><strong>Alterne bebida alcoólica com água</strong> e não beba de estômago vazio.</li>
            <li><strong>Evite comprar ou guardar grandes quantidades em casa</strong> se disponibilidade for um gatilho.</li>
            <li><strong>Planeje dias sem álcool</strong> quando isso for seguro para você.</li>
            <li><strong>Não dirija nem opere máquinas após beber.</strong></li>
          </ul></section>
          <section class="panel danger"><h2>Atenção à abstinência do álcool</h2><p>Se você bebe diariamente em grande quantidade, já teve tremores intensos, confusão, convulsão ou outros sintomas importantes quando fica sem beber, não faça uma interrupção brusca sozinho. A abstinência alcoólica pode exigir avaliação e acompanhamento de saúde.</p></section>
          <section class="panel"><h2>Outras drogas: reduzir risco também é cuidado</h2><ul class="tip-list">
            <li>Evite misturar diferentes drogas e bebidas.</li>
            <li>Evite usar sozinho, especialmente quando há risco de perda de consciência.</li>
            <li>Não compartilhe instrumentos usados para consumo.</li>
            <li>Evite dirigir, nadar, subir em altura ou entrar em situações que exijam reflexos e julgamento.</li>
            <li>Procure um serviço de saúde se algo fugir do esperado. Pedir ajuda não exige que você “prove” que quer parar.</li>
          </ul></section>
          <section class="panel soft"><h2>Quer entender seu consumo?</h2><p>O Ministério da Saúde lançou em agosto de 2026 o <strong>Modera Brasil</strong> dentro do Meu SUS Digital, com autoavaliação e orientações para redução de riscos. Ele é uma ferramenta oficial separada deste PWA.</p><a class="btn secondary" href="https://www.gov.br/saude/pt-br/assuntos/noticias-ms/2026/agosto/em-novo-aplicativo-do-meu-sus-digital-populacao-podera-medir-o-seu-consumo-de-alcool-e-verificar-riscos-para-a-saude" target="_blank" rel="noopener">Conhecer o Modera Brasil ↗</a></section>
        </div>
        <div class="side-stack">
          ${sideBox('Escolha seu caminho','Você pode querer parar, reduzir ou só diminuir danos agora. O cuidado pode começar de onde você está.',[['reducao-danos','Ver redução de danos'],['onde-ajuda','Onde buscar ajuda']])}
          <section class="panel"><h3>Fontes</h3>${sourceList(sources.reducao)}</section>
        </div>
      </div>
    </div>`,

  'reducao-danos': () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Redução de danos','Reduzir danos é proteger a vida e a saúde mesmo quando a pessoa não quer ou não consegue interromper o uso agora.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>Princípios simples</h2><ul class="tip-list">
          <li>Alimente-se e hidrate-se.</li><li>Evite misturar drogas e bebidas.</li><li>Evite usar sozinho.</li><li>Não compartilhe seringas, cachimbos, canudos ou outros instrumentos de consumo.</li><li>Evite dirigir ou se colocar em situações incompatíveis com os efeitos da substância.</li><li>Tenha uma pessoa de confiança que saiba onde você está quando houver maior risco.</li><li>Proteja-se em relações sexuais; o SUS oferece preservativos, testagem e outras estratégias de prevenção.</li>
        </ul></section>
        <section class="panel success"><h2>Você continua tendo direito ao cuidado</h2><p>A estratégia de redução de danos reconhece que algumas pessoas não conseguem ou não querem parar naquele momento. Isso não elimina o direito à saúde. O foco é diminuir riscos, ampliar cuidado e proteger a vida.</p></section>
        <section class="panel danger"><h2>Sinais para buscar ajuda urgente</h2><p>Perda de consciência, dificuldade para respirar, convulsão, dor forte no peito, confusão intensa, agitação com risco, queda importante ou outra situação que pareça grave justificam busca de urgência. Em risco imediato, ligue 192.</p></section>
      </div><div class="side-stack">${sideBox('Não é “passar a mão na cabeça”','Redução de danos é uma estratégia de saúde pública. Ela pode coexistir com o objetivo de reduzir ou parar.',[['alcool-drogas','Álcool e outras drogas'],['onde-ajuda','Onde buscar ajuda']])}<section class="panel"><h3>Fontes oficiais</h3>${sourceList(sources.reducao)}</section></div></div>
    </div>`,

  crise: () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Crise e ansiedade','Um roteiro curto para organizar o momento. Sintomas intensos também podem ter causas físicas; não use esta página para se autodiagnosticar.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel success"><h2>Se você está conseguindo permanecer em segurança</h2><div class="steps">
          <div class="step"><div><strong>Reduza estímulos</strong><p>Se puder, vá para um lugar mais calmo, sente-se ou apoie o corpo.</p></div></div>
          <div class="step"><div><strong>Diminua o ritmo da respiração</strong><p>Sem forçar grandes inspirações. Solte o ar devagar e permita que a respiração encontre um ritmo mais confortável.</p></div></div>
          <div class="step"><div><strong>Traga atenção para o ambiente</strong><p>Observe coisas concretas ao redor: o chão, objetos, sons, temperatura e contato dos pés com o chão.</p></div></div>
          <div class="step"><div><strong>Procure uma pessoa de confiança</strong><p>Ficar acompanhado pode ajudar quando a sensação está muito intensa.</p></div></div>
          <div class="step"><div><strong>Adie decisões importantes</strong><p>Concentre-se primeiro em atravessar o pico da crise e recuperar segurança.</p></div></div>
        </div></section>
        <section class="panel danger"><h2>Não presuma que tudo é ansiedade</h2><p>Dor forte no peito, desmaio, falta de ar intensa, convulsão, sintomas neurológicos súbitos, intoxicação, tentativa de suicídio ou risco de machucar a si ou outra pessoa precisam de avaliação urgente. Ligue 192 ou procure UPA/pronto-socorro.</p></section>
        <section class="panel"><h2>Depois que a crise baixar</h2><ul class="tip-list"><li>Anote o que aconteceu antes da crise, sem tentar achar uma explicação perfeita.</li><li>Observe sono, alimentação, cafeína, álcool e outras substâncias como possíveis fatores que merecem conversa com a equipe.</li><li>Se as crises se repetem, leve o relato para UBS, CAPS ou profissional que acompanha você.</li></ul></section>
      </div><div class="side-stack">${sideBox('Ajuda não precisa esperar “ficar pior”','Você pode procurar cuidado antes de chegar ao limite.',[['onde-ajuda','Onde buscar ajuda'],['direitos','Meus direitos']])}<section class="panel"><h3>Emergência</h3><p><strong>SAMU 192</strong> — ligação gratuita para urgências e emergências.</p><a class="btn danger" href="tel:192">Ligar 192</a></section></div></div>
    </div>`,

  'onde-ajuda': () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Onde buscar ajuda','Entenda o papel de cada porta do SUS. A rede é articulada: você não precisa acertar sozinho o serviço “perfeito”.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>UBS — cuidado contínuo e porta de entrada</h2><p>A Atenção Primária acompanha saúde ao longo do tempo, faz avaliação inicial, prevenção, cuidado de condições comuns e articula encaminhamentos quando necessários. Também pode orientar sobre tabagismo e saúde mental conforme a rede local.</p></section>
        <section class="panel"><h2>CAPS / CAPS AD — cuidado psicossocial</h2><p>Os CAPS são serviços comunitários da RAPS. CAPS AD é voltado às necessidades relacionadas ao uso de álcool e outras drogas. A oferta e a organização variam conforme o território; CAPS não substitui UPA, hospital ou SAMU em toda situação.</p></section>
        <section class="panel warning"><h2>UPA 24h — urgências</h2><p>Funciona 24 horas e atende quadros agudos, realizando avaliação e estabilização inicial e encaminhando para hospital quando necessário.</p></section>
        <section class="panel danger"><h2>SAMU 192 — emergência móvel</h2><p>Use em situações de urgência ou emergência com risco de morte, sequela ou sofrimento intenso, como perda de consciência, convulsão, dificuldade respiratória importante, intoxicação grave, tentativa de suicídio ou trauma grave. A ligação é gratuita.</p><a class="btn danger" href="tel:192">Ligar 192</a></section>
        <section class="panel"><h2>Hospital / pronto-socorro</h2><p>Atende situações que exigem estrutura hospitalar. Em urgência/emergência, a regra nacional determina que qualquer serviço de saúde deve receber, cuidar e encaminhar quando necessário.</p></section>
        <section class="panel success"><h2>Sem Cartão SUS?</h2><p>A ausência ou inexistência do Cartão Nacional de Saúde não é impedimento para a realização do atendimento solicitado. O cadastramento pode ser resolvido no fluxo administrativo sem transformar o cartão em barreira ao cuidado.</p></section>
      </div><div class="side-stack">${sideBox('Próxima melhoria','O diretório local com endereços só deve entrar depois de cada serviço ser conferido em fonte oficial, com data de verificação.',[['raps','Entender a RAPS'],['direitos','Meus direitos']])}<section class="panel"><h3>Fontes oficiais</h3>${sourceList([...sources.ajuda,...sources.direitos.slice(0,2)])}</section></div></div>
    </div>`,

  raps: () => `
    <div class="page">
      ${pageHead('Entenda a RAPS','A Rede de Atenção Psicossocial não é um único lugar. Ela conecta diferentes pontos do SUS para cuidado em saúde mental e necessidades relacionadas ao uso de álcool e outras drogas.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>RAPS é rede, não sinônimo de CAPS</h2><p>O Ministério da Saúde descreve a RAPS como uma rede que reúne pontos da Atenção Primária, Atenção Especializada, urgência, hospital e outros componentes. O cuidado deve respeitar direitos, autonomia, dignidade e, sempre que possível, ser comunitário.</p></section>
        <section class="panel"><h2>Um caminho pode envolver mais de um serviço</h2><div class="steps"><div class="step"><div><strong>Entrada</strong><p>UBS, CAPS ou outro ponto da rede conforme a necessidade e organização local.</p></div></div><div class="step"><div><strong>Crise ou urgência</strong><p>UPA, pronto-socorro, hospital e SAMU podem participar quando necessário.</p></div></div><div class="step"><div><strong>Continuidade</strong><p>Depois da urgência, o cuidado deve voltar a ser articulado com os serviços que acompanham a pessoa no território.</p></div></div></div></section>
        <section class="panel success"><h2>Cuidado em liberdade</h2><p>A política de saúde mental toma direitos humanos, dignidade, autonomia e serviços comunitários como referências. A Lei 10.216 determina preferência por serviços comunitários e meios menos invasivos possíveis.</p></section>
      </div><div class="side-stack">${sideBox('Não sabe por onde começar?','Use a página de portas de cuidado para comparar UBS, CAPS, UPA, SAMU e hospital.',[['onde-ajuda','Onde buscar ajuda']])}<section class="panel"><h3>Fonte oficial</h3>${sourceList([['Ministério da Saúde — SUS e Saúde Mental','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental/sus-e-a-saude-mental'],sources.direitos[2]])}</section></div></div>
    </div>`,

  ouvsus: () => `
    <div class="page">
      ${pageHead('OuvSUS','Escolha o tipo de manifestação pelaquilo que você precisa. Ouvidoria não substitui atendimento de urgência.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>Qual opção escolher?</h2><ul class="law-list">
          <li><strong>Reclamação:</strong> insatisfação com serviço público ou conduta na prestação/fiscalização do serviço.</li>
          <li><strong>Solicitação:</strong> quando existe um pedido de atendimento, acesso, medicamento, consulta, exame ou outra ação.</li>
          <li><strong>Denúncia:</strong> quando você comunica irregularidade ou indício de irregularidade.</li>
          <li><strong>Sugestão:</strong> ideia para melhorar ações, práticas ou serviços do SUS.</li>
          <li><strong>Elogio:</strong> reconhecimento por serviço ou atendimento recebido.</li>
          <li><strong>Informação:</strong> quando o objetivo é obter informação sobre ações, programas, assistência ou SUS.</li>
        </ul></section>
        <section class="panel success"><h2>Antes de enviar</h2><ul class="tip-list"><li>Explique o que aconteceu em ordem simples.</li><li>Informe data, local e serviço quando souber.</li><li>Diga claramente o que você espera: resposta, providência, acesso, apuração ou registro de elogio.</li><li>Guarde o número do protocolo e acompanhe.</li></ul></section>
        <section class="panel"><h2>Canais</h2><p><strong>Telefone:</strong> OuvSUS 136. Também há canais oficiais pela internet, incluindo Fala.BR e formulário da Ouvidoria.</p><div class="hero-actions"><a class="btn" href="tel:136">Ligar 136</a><a class="btn secondary" href="https://www.gov.br/saude/pt-br/canais-de-atendimento/ouvsus" target="_blank" rel="noopener">Abrir OuvSUS ↗</a></div></section>
        <section class="panel warning"><h2>OuvSUS não é emergência</h2><p>Se alguém precisa de socorro imediato, use a rede assistencial. Em emergência, SAMU 192; também podem ser necessárias UPA ou porta hospitalar.</p></section>
      </div><div class="side-stack">${sideBox('Quer fundamentar a manifestação?','Veja os direitos antes de escrever.',[['direitos','Meus direitos']])}<section class="panel"><h3>Fontes oficiais</h3>${sourceList(sources.ouvsus)}</section></div></div>
    </div>`,

  familia: () => `
    <div class="page">
      ${pageHead('Família e rede de apoio','Apoiar não é vigiar. É reduzir isolamento, perceber risco e facilitar acesso ao cuidado sem transformar toda conversa em cobrança.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>O que costuma ajudar</h2><ul class="tip-list"><li>Escute antes de dar sermão.</li><li>Pergunte “como posso ajudar agora?” em vez de presumir a resposta.</li><li>Ofereça companhia para procurar atendimento quando a pessoa quiser ou precisar.</li><li>Ajude a diminuir gatilhos do ambiente quando isso for combinado.</li><li>Em tentativa de parar de fumar, ofereça água, fruta, caminhada ou distração sem cobrança constante.</li><li>Em crise, priorize segurança e reduza discussões.</li></ul></section>
        <section class="panel warning"><h2>Evite transformar apoio em controle</h2><p>Humilhação, ameaça, exposição pública, chantagem e cobranças repetidas podem afastar a pessoa do cuidado. Limites podem existir sem retirar dignidade.</p></section>
        <section class="panel danger"><h2>Quando a situação é de risco</h2><p>Se houver perda de consciência, convulsão, intoxicação grave, tentativa de suicídio, risco de violência ou outra emergência, procure atendimento urgente ou ligue 192.</p></section>
      </div><div class="side-stack">${sideBox('Entenda a rede','Saber a diferença entre UBS, CAPS, UPA e SAMU ajuda a família a não depender de um único serviço.',[['onde-ajuda','Onde buscar ajuda'],['raps','Entender a RAPS']])}</div></div>
    </div>`,

  fontes: () => `
    <div class="page">
      ${pageHead('Fontes e atualização','Conteúdo de saúde e direitos precisa mostrar de onde veio e quando foi conferido. Esta página reúne as principais referências desta versão.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>Direitos e saúde mental</h2>${sourceList(sources.direitos)}</section>
        <section class="panel"><h2>Tabagismo</h2>${sourceList(sources.fumar)}</section>
        <section class="panel"><h2>Redução de danos</h2>${sourceList(sources.reducao)}</section>
        <section class="panel"><h2>Urgência e RAPS</h2>${sourceList(sources.ajuda)}</section>
        <section class="panel"><h2>OuvSUS</h2>${sourceList(sources.ouvsus)}</section>
        <section class="panel soft"><h2>Critério editorial</h2><p>Serviços locais, endereços, horários e telefones mudam. Eles só devem ser publicados quando houver fonte responsável e data de verificação. Conteúdo clínico não deve ser tratado como prescrição individual.</p></section>
      </div><div class="side-stack"><section class="panel"><h3>Versão</h3><p><strong>Protótipo:</strong> repaginação de navegação<br><strong>Data-base:</strong> 21/08/2026<br><strong>Status:</strong> conteúdo educativo em revisão</p></section></div></div>
    </div>`,

  privacidade: () => `
    <div class="page">
      ${pageHead('Privacidade','Esta versão foi desenhada para funcionar sem pedir dados clínicos, login ou localização.')}
      <div class="content-grid"><div class="content-stack"><section class="panel"><h2>O que este protótipo não pede</h2><ul class="tip-list"><li>Nome ou cadastro.</li><li>Relato do que você usa.</li><li>Diário de consumo ou humor.</li><li>Prontuário.</li><li>Localização GPS.</li></ul></section><section class="panel soft"><h2>Links externos</h2><p>Ao abrir sites oficiais externos, passam a valer as políticas e tecnologias do serviço acessado. Este protótipo não controla esses sites.</p></section></div><div class="side-stack">${sideBox('Voltar ao início','Escolha outra área do aplicativo.',[['inicio','Ir para o início']])}</div></div>
    </div>`
};

function currentRoute(){
  const p = new URLSearchParams(location.search).get('p') || 'inicio';
  return pages[p] ? p : 'inicio';
}
function renderNav(){
  const active=currentRoute();
  document.getElementById('drawerNav').innerHTML=menuItems.map(([r,i,t])=>`<a class="drawer-link ${active===r?'active':''}" href="?p=${r}" data-route="${r}"><span class="drawer-icon" aria-hidden="true">${i}</span><span>${t}</span><span class="drawer-arrow">›</span></a>`).join('');
}
function render(route=currentRoute(), push=false){
  if(!pages[route]) route='inicio';
  if(push){
    const url=route==='inicio'?'./':`?p=${route}`;
    history.pushState({route},'',url);
  }
  document.getElementById('conteudo').innerHTML=pages[route]();
  document.title=`${route==='inicio'?'RAPS no Bolso':menuItems.find(x=>x[0]===route)?.[2] || 'RAPS no Bolso'} — RAPS no Bolso`;
  renderNav();
  closeDrawer();
  window.scrollTo({top:0,behavior:'instant'});
  document.getElementById('conteudo').focus({preventScroll:true});
}

const drawer=document.getElementById('drawer');
const backdrop=document.getElementById('drawerBackdrop');
const menuButton=document.getElementById('menuButton');
function openDrawer(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');backdrop.hidden=false;menuButton.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'}
function closeDrawer(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');backdrop.hidden=true;menuButton.setAttribute('aria-expanded','false');document.body.style.overflow=''}
menuButton.addEventListener('click',()=>drawer.classList.contains('open')?closeDrawer():openDrawer());
document.getElementById('closeMenu').addEventListener('click',closeDrawer);
backdrop.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-route]');
  if(!a) return;
  const route=a.dataset.route;
  if(!pages[route])return;
  e.preventDefault();
  render(route,true);
});
window.addEventListener('popstate',()=>render(currentRoute(),false));

let scale=Number(localStorage.getItem('raps-font-scale')||1);
function applyScale(){document.documentElement.style.setProperty('--font-scale',String(scale));localStorage.setItem('raps-font-scale',String(scale))}
document.getElementById('fontUp').addEventListener('click',()=>{scale=Math.min(1.25,+(scale+.1).toFixed(2));applyScale()});
document.getElementById('fontDown').addEventListener('click',()=>{scale=Math.max(.9,+(scale-.1).toFixed(2));applyScale()});
const contrastBtn=document.getElementById('contrast');
if(localStorage.getItem('raps-contrast')==='1')document.body.classList.add('high-contrast');
contrastBtn.addEventListener('click',()=>{document.body.classList.toggle('high-contrast');localStorage.setItem('raps-contrast',document.body.classList.contains('high-contrast')?'1':'0')});
applyScale();
render();

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
