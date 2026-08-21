const APP_NAME = 'RAPS no Bolso';

const sources = {
  sus: 'https://www.planalto.gov.br/ccivil_03/leis/l8080.htm',
  direitos: 'https://www.gov.br/conselho-nacional-de-saude/pt-br/atos-normativos/resolucoes/2017/resolucao-no-553.pdf/view',
  portaria1: 'https://bvsms.saude.gov.br/bvs/saudelegis/gm/2017/prc0001_03_10_2017_comp.html',
  mental: 'https://www.planalto.gov.br/ccivil_03/leis/leis_2001/l10216.htm',
  servicoPublico: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13460.htm',
  lai: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm',
  lbi: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm',
  lgpd: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
  upa: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/u/upa-24h',
  samu: 'https://www.gov.br/saude/pt-br/composicao/saes/samu-192',
  caps: 'https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps/caps',
  rua: 'https://www.gov.br/saude/pt-br/composicao/saps/esf/consultorio-na-rua/consultorio-na-rua',
  tabaco: 'https://www.gov.br/inca/pt-br/assuntos/causas-e-prevencao-do-cancer/tabagismo/como-parar-de-fumar',
  tratamentoTabaco: 'https://www.gov.br/inca/pt-br/assuntos/gestor-e-profissional-de-saude/programa-nacional-de-controle-do-tabagismo/tratamento',
  ouvsus: 'https://www.gov.br/saude/pt-br/canais-de-atendimento/ouvsus',
  ouvsusServico: 'https://www.gov.br/pt-br/servicos/cadastrar-manifestacao-na-ouvidoria-geral-do-sus-ouvsus',
  falaBr: 'https://falabr.cgu.gov.br/web/home',
  capsGoiania: 'https://saude.goiania.go.gov.br/sobre-a-secretaria/consultas-sus/centros-de-atencao-psicossocial-caps/'
};

const icons = {
  urgent: '🚑', services: '🏥', rights: '⚖️', smoke: '🚭', anxiety: '🫁', withdrawal: '🧠',
  access: '🪪', ouvidoria: '💬', accessibility: '♿', caps: '🧩', ubs: '➕', upa: '🏥', samu: '🚑'
};

function esc(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function link(url,label){return `<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;}
function card(route, icon, title, text){return `<a class="option-card" href="#/${route}"><span class="card-icon" aria-hidden="true">${icon}</span><span><h2>${esc(title)}</h2><p>${esc(text)}</p></span><span class="arrow" aria-hidden="true">›</span></a>`;}
function pageHead(title, subtitle=''){return `<div class="page-head"><a class="back" href="#/" aria-label="Voltar ao início">←</a><div><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div></div>`;}
function section(title, body){return `<section class="section"><h2>${title}</h2>${body}</section>`;}
function law(title, text, how, sourceUrl, sourceName){return `<div class="law"><strong>${title}</strong><p>${text}</p>${how?`<div class="say">Como pedir: “${how}”</div>`:''}<p class="small">Fonte: ${link(sourceUrl,sourceName)}</p></div>`;}
function sourcesBlock(items){return section('Fontes oficiais',`<div class="source-list">${items.map(([u,l])=>link(u,l)).join('')}</div><p class="small">Conteúdo educativo. Regras locais podem organizar fluxos e referências, mas não anulam direitos nem o atendimento de urgência.</p>`);}

const pages = {
  home(){return `
    <div class="hero"><span class="tag">Protótipo Fase 4</span><span class="tag">PWA</span><span class="tag">Acessível</span><h1>O que você precisa agora?</h1><p>Escolha uma opção. Cada assunto abre em uma página curta, sem transformar o aplicativo em uma tela interminável.</p></div>
    <div class="alert alert-danger"><strong>Risco imediato?</strong> Falta de ar intensa, convulsão, desmaio, suspeita de infarto/AVC, intoxicação grave, tentativa de suicídio ou situação com risco de vida: procure urgência ou ligue <strong>192</strong>.</div>
    <div class="grid two">
      ${card('urgencia',icons.urgent,'Preciso de ajuda agora','SAMU, UPA, hospital, crise de saúde mental e sinais de alarme.')}
      ${card('servicos',icons.services,'Qual serviço devo procurar?','UBS, CAPS, CAPS AD, UPA, SAMU, hospital e Consultório na Rua.')}
      ${card('direitos',icons.rights,'Meus direitos no SUS','Lei por lei, em linguagem simples, com uma frase pronta de como pedir.')}
      ${card('acesso',icons.access,'Sem documento ou fora do bairro?','O que pode e o que não pode impedir atendimento e como agir.')}
      ${card('parar-de-fumar',icons.smoke,'Quero parar de fumar','Dicas práticas e como pedir tratamento gratuito no SUS.')}
      ${card('ansiedade',icons.anxiety,'Crise de ansiedade','Passos simples para atravessar a crise e saber quando procurar urgência.')}
      ${card('abstinencia',icons.withdrawal,'Abstinência','Sinais comuns, sinais perigosos e onde procurar ajuda, especialmente no álcool.')}
      ${card('ouvidoria',icons.ouvidoria,'Reclamar, denunciar, pedir ou elogiar','OuvSUS, 136, tipos de manifestação e Lei de Acesso à Informação.')}
      ${card('acessibilidade',icons.accessibility,'Acessibilidade e inclusão','Atendimento sem discriminação, recursos acessíveis e proteção de direitos.')}
    </div>`;},

  urgencia(){return `${pageHead('Ajuda agora','Qual porta do SUS faz mais sentido em uma urgência ou emergência?')}
    <div class="alert alert-danger"><strong>Ligue 192</strong> quando houver risco de vida ou necessidade de atendimento móvel urgente. A ligação para o SAMU é gratuita e funciona 24 horas.</div>
    ${section('SAMU 192',`<p>Atendimento móvel de urgência. Pode orientar por telefone e enviar equipe quando a regulação identificar necessidade.</p><ul><li>falta de ar intensa;</li><li>desmaio ou alteração importante de consciência;</li><li>convulsão;</li><li>suspeita de infarto ou AVC;</li><li>trauma grave;</li><li>intoxicação importante;</li><li>crise psiquiátrica com risco imediato para a própria pessoa ou terceiros.</li></ul><div class="action-row"><a class="btn danger" href="tel:192">Ligar 192</a></div>`)}
    ${section('UPA 24h',`<p>Atende urgências 24 horas, todos os dias. Faz avaliação, exames iniciais, medicação, observação, estabilização e encaminhamento quando o caso exige hospital.</p><p>Exemplos oficiais: dor forte no peito, falta de ar intensa, crise convulsiva, febre alta, vômitos persistentes, fratura, cortes, suspeita de infarto ou derrame.</p>`)}
    ${section('Hospital / pronto-socorro',`<p>É o ponto de maior complexidade quando há necessidade de cirurgia, internação, trauma grave, cuidados intensivos ou recursos que a UPA não possui. Em emergência, procure o serviço de urgência disponível mais próximo ou acione o SAMU.</p>`)}
    ${section('Crise de saúde mental',`<p>Urgência e emergência também incluem situações psiquiátricas e relacionadas ao uso de álcool e outras drogas. UPA, pronto-socorro e SAMU podem atender e articular o encaminhamento para a RAPS.</p><p>CAPS também acolhem crises. Em Goiânia, a rede municipal informa atendimento de urgência psiquiátrica 24h no Pronto Socorro Psiquiátrico Wassily Chuc.</p>`)}
    ${sourcesBlock([[sources.samu,'Ministério da Saúde — SAMU 192'],[sources.upa,'Ministério da Saúde — UPA 24h'],[sources.caps,'Ministério da Saúde — CAPS e RAPS'],[sources.capsGoiania,'SMS Goiânia — CAPS e urgência psiquiátrica']])}`;},

  servicos(){return `${pageHead('Onde procurar atendimento','Entenda o que cada ponto da rede costuma fazer.')}
    ${section('UBS / Unidade Básica de Saúde',`<p>É a principal porta de entrada para cuidado contínuo: consultas, vacinação, prevenção, saúde mental na atenção básica, acompanhamento de doenças crônicas, curativos, pré-natal, ações de promoção da saúde e encaminhamentos quando necessários.</p><div class="say">Você pode dizer: “Preciso de acolhimento e quero entender qual atendimento consigo fazer hoje e qual será meu acompanhamento.”</div>`)}
    ${section('CAPS e CAPS AD',`<p>São serviços comunitários de saúde mental. Acolhem sofrimento psíquico intenso e, nos CAPS AD, necessidades relacionadas ao uso prejudicial de álcool e outras drogas. Oferecem cuidado multiprofissional, grupos, atendimentos individuais, apoio social, manejo de crises, construção de Projeto Terapêutico Singular e articulação da rede.</p><p>O Ministério da Saúde informa que o primeiro acolhimento pode ser por procura direta, sem necessidade de consulta previamente marcada.</p><div class="say">“Quero um acolhimento. Preciso conversar sobre meu sofrimento/uso de álcool ou outras drogas e saber qual cuidado a equipe pode construir comigo.”</div>`)}
    ${section('UPA 24h',`<p>Urgência de complexidade intermediária: avaliação médica, estabilização, exames iniciais, medicação e observação. Funciona 24 horas.</p>`)}
    ${section('SAMU 192',`<p>Atendimento móvel de urgência e orientação por telefone. Use quando a pessoa não consegue chegar com segurança ao serviço ou há risco imediato.</p>`)}
    ${section('Hospital de urgência',`<p>Casos de maior complexidade, como trauma grave, necessidade cirúrgica, internação ou suporte intensivo. A rede pode regular o encaminhamento a partir de UPA ou SAMU.</p>`)}
    ${section('Consultório na Rua',`<p>Equipes multiprofissionais de atenção básica que atuam de forma itinerante para ampliar o acesso da população em situação de rua. Podem realizar cuidado no território e articular UBS, CAPS, urgência e assistência social.</p>`)}
    ${sourcesBlock([[sources.caps,'Ministério da Saúde — Centros de Atenção Psicossocial'],[sources.upa,'Ministério da Saúde — UPA 24h'],[sources.samu,'Ministério da Saúde — SAMU 192'],[sources.rua,'Ministério da Saúde — Consultório na Rua']])}`;},

  direitos(){return `${pageHead('Meus direitos no SUS','A lei, o que ela significa e uma frase simples para usar na prática.')}
    ${section('Direitos essenciais',`
      ${law('Lei nº 8.080/1990 — arts. 2º e 7º','A saúde é direito fundamental e o SUS deve observar acesso universal, integralidade, igualdade e atenção humanizada.','Quero ser acolhido e orientado sobre o atendimento que o SUS oferece para minha necessidade. Se este não for o serviço adequado, preciso que me expliquem qual é o fluxo correto.',sources.sus,'Lei nº 8.080/1990')}
      ${law('Resolução CNS nº 553/2017 — Carta dos Direitos da Pessoa Usuária da Saúde','Reúne direitos como acesso organizado, atendimento adequado, humanizado, acolhedor, sem discriminação, respeito à pessoa, informações claras e participação nas decisões sobre o cuidado.','Quero que me expliquem, em linguagem clara, o que está sendo proposto, quais alternativas existem e qual é o próximo passo do meu cuidado.',sources.direitos,'Resolução CNS nº 553/2017')}
      ${law('Portaria de Consolidação GM/MS nº 1/2017','Consolida normas de direitos dos usuários e do funcionamento do SUS. Também disciplina identificação/cadastro e impede que problemas cadastrais sejam confundidos com barreira absoluta ao atendimento, especialmente em urgência.','Estou sem meu CNS/CPF agora. Preciso ser avaliado. Se for necessário, o cadastro pode ser regularizado depois do atendimento conforme a situação.',sources.portaria1,'Portaria de Consolidação GM/MS nº 1/2017')}
      ${law('Lei nº 10.216/2001 — saúde mental','Garante tratamento com humanidade, respeito, sigilo, informações sobre o tratamento, proteção contra abuso e preferência por serviços comunitários. A internação é indicada quando recursos extra-hospitalares forem insuficientes.','Quero conhecer meu plano de cuidado, os motivos das condutas e as alternativas comunitárias disponíveis antes de qualquer medida mais restritiva.',sources.mental,'Lei nº 10.216/2001')}
      ${law('Lei nº 13.460/2017 — usuário de serviço público','Protege o usuário no atendimento público: respeito, acessibilidade, cortesia, igualdade, proibição de exigências sem base legal e direito de apresentar reclamação, denúncia, sugestão ou elogio.','Qual é a regra que exige esse documento/procedimento? Se o atendimento for recusado, quero saber o motivo e como registrar uma manifestação na ouvidoria.',sources.servicoPublico,'Lei nº 13.460/2017')}
      ${law('Lei nº 12.527/2011 — Lei de Acesso à Informação','Permite pedir informações públicas sem precisar justificar o motivo. Em regra, o órgão responde imediatamente quando possível ou em até 20 dias, prorrogáveis por mais 10 com justificativa.','Quero fazer um pedido de acesso à informação com base na Lei nº 12.527/2011. Solicito os dados/documentos públicos descritos abaixo.',sources.lai,'Lei nº 12.527/2011')}
      ${law('Lei nº 13.146/2015 — Lei Brasileira de Inclusão','Garante acessibilidade e proteção contra discriminação à pessoa com deficiência, inclusive no acesso à saúde e à informação.','Preciso de recurso de acessibilidade para conseguir compreender e utilizar este serviço em igualdade de condições.',sources.lbi,'Lei nº 13.146/2015')}
      ${law('Lei nº 13.709/2018 — LGPD','Dados de saúde são dados pessoais sensíveis. O tratamento desses dados deve observar base legal, segurança, finalidade e direitos do titular.','Quero saber quais dados meus estão sendo usados, para qual finalidade e como posso acessar ou corrigir informações pessoais incorretas.',sources.lgpd,'Lei Geral de Proteção de Dados')}
    `)}
    ${sourcesBlock([[sources.sus,'Lei nº 8.080/1990'],[sources.direitos,'Carta dos Direitos — Resolução CNS nº 553/2017'],[sources.portaria1,'Portaria de Consolidação GM/MS nº 1/2017'],[sources.mental,'Lei nº 10.216/2001'],[sources.servicoPublico,'Lei nº 13.460/2017'],[sources.lai,'Lei nº 12.527/2011']])}`;},

  acesso(){return `${pageHead('Sem documento ou fora do bairro?','Evite duas confusões comuns: cadastro não é a mesma coisa que atendimento; território não elimina acolhimento.')}
    <div class="alert alert-info"><strong>Resumo:</strong> em urgência, a prioridade é a condição clínica. Falta de documento, CPF ou Cartão SUS não deve impedir o cuidado urgente. Na atenção básica, o acompanhamento contínuo pode ser organizado pela UBS de referência do território.</div>
    ${section('Estou sem documento',`<p>O SUS usa CPF/CNS e outros dados para identificação e registro, mas a impossibilidade de apresentar ou consultar esses dados não transforma uma situação de urgência em “sem atendimento”. O cadastro pode ser regularizado posteriormente nas hipóteses previstas pelas normas.</p><div class="say">“Estou sem documento agora. Preciso ser acolhido e avaliado. Se houver cadastro para regularizar, quero orientação para fazer isso depois do atendimento necessário.”</div>`)}
    ${section('Estou em outro bairro',`<p><strong>UPA, SAMU e pronto-socorro:</strong> atendem conforme urgência e gravidade; não funcionam como consulta de rotina vinculada ao bairro.</p><p><strong>UBS:</strong> deve acolher e avaliar a demanda. Para acompanhamento programado, equipe de Saúde da Família, consultas continuadas ou certas rotinas, o município pode organizar referência por território e orientar a pessoa para a unidade responsável por seu endereço.</p><div class="say">“Eu entendo que meu acompanhamento pode ser em outra UBS. Mas preciso de acolhimento e orientação sobre o que pode ser resolvido hoje e para onde devo ser encaminhado.”</div>`)}
    ${section('Se recusarem sem explicar',`<ol><li>Peça o motivo da recusa em linguagem clara.</li><li>Pergunte qual norma ou fluxo está sendo aplicado.</li><li>Anote unidade, data, horário e setor.</li><li>Peça orientação formal sobre onde e quando será atendido.</li><li>Se necessário, registre reclamação/solicitação na ouvidoria e guarde o protocolo.</li></ol><div class="action-row"><a class="btn secondary" href="#/ouvidoria">Como registrar</a><a class="btn secondary" href="#/direitos">Ver leis</a></div>`)}
    ${sourcesBlock([[sources.portaria1,'Portaria de Consolidação GM/MS nº 1/2017'],[sources.sus,'Lei nº 8.080/1990'],[sources.direitos,'Carta dos Direitos da Pessoa Usuária da Saúde'],[sources.servicoPublico,'Lei nº 13.460/2017']])}`;},

  'parar-de-fumar'(){return `${pageHead('Quero parar de fumar','Dicas práticas e como conseguir apoio gratuito no SUS.')}
    ${section('O SUS pode ajudar',`<p>O tratamento do tabagismo é oferecido gratuitamente na rede do SUS. O cuidado pode incluir avaliação, acompanhamento individual ou em grupo, abordagem cognitivo-comportamental e, quando indicado por profissional, medicamentos para reduzir sintomas de abstinência.</p><p>O INCA informa que podem ser usados, conforme avaliação clínica, terapia de reposição de nicotina e bupropiona.</p><div class="say">“Quero parar de fumar. Esta UBS oferece tratamento do tabagismo? Se não oferece aqui, para qual unidade do município vocês encaminham?”</div>`)}
    ${section('Comece com um plano simples',`<ol><li>Escolha uma data para começar.</li><li>Retire cigarros, isqueiros e cinzeiros do alcance.</li><li>Identifique os três gatilhos mais comuns: café, álcool, ansiedade, depois das refeições, amigos fumando etc.</li><li>Prepare substitutos: água gelada, caminhada curta, respiração lenta, goma sem açúcar, escovar os dentes, mudar de ambiente.</li><li>Avise uma pessoa de confiança que você está tentando parar.</li><li>Se escorregar e fumar, trate como recaída pontual: retome o plano em vez de abandonar a tentativa.</li></ol>`)}
    ${section('Quando a vontade vier forte',`<p>A fissura costuma vir em ondas. Experimente adiar alguns minutos, beber água devagar, mudar de ambiente, ocupar as mãos, caminhar ou fazer uma atividade curta. Evite, no começo, situações que estejam fortemente ligadas ao cigarro.</p><p><strong>Não comece medicação por conta própria.</strong> Bupropiona e reposição de nicotina têm indicações, contraindicações e ajustes que precisam de avaliação profissional.</p>`)}
    ${sourcesBlock([[sources.tabaco,'INCA — Como parar de fumar'],[sources.tratamentoTabaco,'INCA — Tratamento do tabagismo no SUS']])}`;},

  ansiedade(){return `${pageHead('Crise de ansiedade','Uma sequência curta para reduzir o pico e reconhecer quando pode ser algo além de ansiedade.')}
    <div class="alert alert-warning"><strong>Importante:</strong> dor forte no peito, desmaio, falta de ar intensa, alteração neurológica, convulsão ou sintomas novos e muito intensos precisam de avaliação de urgência. Não presuma que tudo é “só ansiedade”.</div>
    ${section('Durante a crise',`<ol><li><strong>Reduza estímulos:</strong> sente-se ou fique em local mais tranquilo, se for seguro.</li><li><strong>Respire mais devagar:</strong> inspire sem forçar e faça a saída do ar um pouco mais longa. Exemplo: 4 segundos entrando e 6 saindo. Se ficar tonto, volte à respiração natural.</li><li><strong>Aterre no presente:</strong> nomeie 5 coisas que vê, 4 que toca, 3 que ouve, 2 cheiros e 1 gosto ou sensação corporal.</li><li><strong>Use uma frase curta:</strong> “Meu corpo está em alerta. Eu não preciso resolver tudo agora.”</li><li><strong>Peça companhia:</strong> se puder, fique perto de alguém de confiança.</li></ol>`)}
    ${section('Depois que passar o pico',`<p>Registre o que aconteceu antes da crise: local, pensamentos, uso de cafeína/álcool/outras substâncias, sono, conflito, fome, medicação e duração. Isso ajuda a equipe a identificar padrão e construir prevenção.</p><div class="say">“Tenho tido crises de ansiedade. Quero avaliação e um plano do que fazer quando começar, além de acompanhamento para reduzir a frequência.”</div>`)}
    ${section('Onde buscar ajuda',`<ul><li><strong>UBS:</strong> avaliação e acompanhamento de quadros leves/moderados, além de articulação com saúde mental.</li><li><strong>CAPS:</strong> sofrimento psíquico intenso, crise e quadros que precisam de cuidado especializado comunitário.</li><li><strong>UPA/SAMU/pronto-socorro:</strong> quando há risco, sintomas físicos importantes ou crise que precisa de avaliação imediata.</li></ul>`)}
    ${sourcesBlock([[sources.caps,'Ministério da Saúde — CAPS e atenção à crise'],[sources.upa,'Ministério da Saúde — UPA 24h'],[sources.samu,'Ministério da Saúde — SAMU 192']])}`;},

  abstinencia(){return `${pageHead('Abstinência','Algumas abstinências são desconfortáveis; outras podem ser perigosas e exigem avaliação médica.')}
    <div class="alert alert-danger"><strong>Álcool e alguns medicamentos:</strong> parar abruptamente após uso intenso ou prolongado pode causar complicações graves. Convulsão, confusão, alucinações, agitação intensa ou piora rápida exigem urgência.</div>
    ${section('Álcool',`<p>Podem aparecer tremores, suor, ansiedade, náusea, insônia, irritabilidade e aumento da frequência cardíaca. Em quadros graves podem ocorrer convulsões, alucinações e estado confusional.</p><p>Se houve consumo pesado/frequente, abstinência grave anterior, convulsões, outras doenças ou uso de vários medicamentos, é mais seguro procurar avaliação profissional em vez de tentar “desintoxicar” sozinho.</p><div class="say">“Estou reduzindo ou parei o álcool e estou com sintomas de abstinência. Preciso ser avaliado para saber se existe risco de complicação e qual é o tratamento seguro.”</div>`)}
    ${section('Nicotina',`<p>É comum haver irritabilidade, ansiedade, dificuldade de concentração, alteração do sono, aumento do apetite e fissura. O SUS possui tratamento específico para cessação do tabagismo e pode usar apoio comportamental e medicação quando indicada.</p><div class="action-row"><a class="btn secondary" href="#/parar-de-fumar">Ver plano para parar de fumar</a></div>`)}
    ${section('Outras substâncias e medicamentos',`<p>O risco varia muito. Benzodiazepínicos e alguns outros medicamentos não devem ser suspensos abruptamente sem orientação. Em uso de outras drogas, o CAPS AD pode avaliar, apoiar redução de danos, tratamento e articulação com urgência quando necessário.</p><p><strong>Não use remédio de outra pessoa e não tente controlar abstinência perigosa com álcool ou sedativos por conta própria.</strong></p>`)}
    ${section('Sinais para procurar urgência',`<ul><li>convulsão;</li><li>alucinações ou confusão;</li><li>desmaio;</li><li>agitação extrema;</li><li>vômitos repetidos com dificuldade para hidratar;</li><li>falta de ar, dor no peito ou alteração importante de consciência;</li><li>risco de se machucar ou machucar alguém.</li></ul><div class="action-row"><a class="btn danger" href="tel:192">Ligar 192</a><a class="btn secondary" href="#/servicos">Ver serviços</a></div>`)}
    ${sourcesBlock([[sources.caps,'Ministério da Saúde — CAPS e cuidado relacionado a álcool e outras drogas'],[sources.samu,'Ministério da Saúde — SAMU 192'],[sources.upa,'Ministério da Saúde — UPA 24h'],[sources.tratamentoTabaco,'INCA — Tratamento do tabagismo']])}`;},

  ouvidoria(){return `${pageHead('Ouvidoria, pedidos e elogios','Escolha o tipo certo de manifestação e guarde o protocolo.')}
    ${section('OuvSUS — o que você pode registrar',`<ul><li><strong>Solicitação:</strong> pedir providência, serviço, insumo ou orientação.</li><li><strong>Reclamação:</strong> relatar atendimento inadequado, demora, barreira de acesso ou problema no serviço.</li><li><strong>Denúncia:</strong> comunicar irregularidade que precisa ser apurada.</li><li><strong>Sugestão:</strong> propor melhoria.</li><li><strong>Elogio:</strong> reconhecer profissional, equipe ou serviço.</li></ul><p>A OuvSUS atende pelo <strong>136</strong> e também possui canais digitais. Reclamações e denúncias podem admitir registro anônimo conforme o canal e o tipo; nesse caso, normalmente não é possível acompanhar o andamento.</p><div class="action-row"><a class="btn" href="tel:136">Ligar 136</a>${link(sources.ouvsusServico,'Abrir serviço oficial de manifestação')}</div>`)}
    ${section('Como escrever uma manifestação forte',`<ol><li>Diga qual unidade/serviço está envolvido.</li><li>Informe data, horário aproximado e setor.</li><li>Descreva fatos objetivos em ordem.</li><li>Explique o prejuízo ou risco causado.</li><li>Faça um pedido claro: apurar, orientar, corrigir, responder, garantir fluxo etc.</li><li>Anexe documentos quando forem relevantes.</li><li>Guarde o protocolo.</li></ol><div class="say">“Solicito resposta objetiva sobre o fato narrado, providências adotadas, setor responsável e orientação para evitar repetição do problema.”</div>`)}
    ${section('Quero documentos ou dados públicos: LAI / SIC',`<p>Pedido de informação pública é diferente de reclamação. Use a Lei nº 12.527/2011 quando quiser documentos, relatórios, contratos, protocolos, números, listas, critérios ou informações que estejam sob guarda do poder público.</p><p>Você não precisa justificar por que quer a informação. No Executivo Federal, a plataforma é o Fala.BR; estados e municípios podem utilizar sistema próprio de SIC/e-SIC.</p><div class="say">“Com base na Lei nº 12.527/2011, solicito acesso aos seguintes documentos/informações: … Favor fornecer em formato digital, quando disponível.”</div>`)}
    ${sourcesBlock([[sources.ouvsus,'Ministério da Saúde — OuvSUS'],[sources.ouvsusServico,'Gov.br — registrar manifestação na OuvSUS'],[sources.servicoPublico,'Lei nº 13.460/2017'],[sources.lai,'Lei nº 12.527/2011'],[sources.falaBr,'Plataforma Fala.BR']])}`;},

  acessibilidade(){return `${pageHead('Acessibilidade e inclusão','O direito não é só entrar no serviço: é conseguir compreender, comunicar e usar o cuidado.')}
    ${section('O que o aplicativo deve oferecer',`<ul><li>texto ampliável;</li><li>alto contraste;</li><li>leitura em voz alta;</li><li>linguagem simples;</li><li>botões grandes e foco visível;</li><li>navegação por teclado e leitor de tela;</li><li>ícones acompanhados de texto — nunca só cor ou símbolo;</li><li>conteúdo dividido em páginas curtas.</li></ul>`)}
    ${section('No atendimento de saúde',`<p>A pessoa com deficiência tem direito a acessibilidade e não discriminação. Barreiras de comunicação, informação e acesso físico devem ser enfrentadas pelo serviço.</p><div class="say">“Preciso de uma forma acessível de comunicação para compreender o atendimento e participar das decisões sobre meu cuidado.”</div>`)}
    ${section('Proteção de dados',`<p>O app não deve exigir localização, diagnóstico ou outros dados sensíveis para permitir leitura dos conteúdos. Geolocalização deve ser opcional, usada apenas quando a pessoa escolher buscar serviços próximos e com explicação clara de finalidade.</p>`)}
    ${sourcesBlock([[sources.lbi,'Lei Brasileira de Inclusão — Lei nº 13.146/2015'],[sources.lgpd,'Lei Geral de Proteção de Dados — Lei nº 13.709/2018'],[sources.direitos,'Carta dos Direitos da Pessoa Usuária da Saúde']])}`;}
};

function route(){
  const raw = location.hash.replace(/^#\/?/,'').split('?')[0].replace(/^\//,'');
  return raw || 'home';
}

function render(){
  const name = route();
  const fn = pages[name] || pages.home;
  document.getElementById('app').innerHTML = fn();
  document.querySelectorAll('.bottom-nav a').forEach(a=>{
    const nav = a.dataset.nav;
    a.classList.toggle('active',(name==='home'&&nav==='home') || name===nav || (name==='acesso'&&nav==='direitos') || (['parar-de-fumar','ansiedade','abstinencia','ouvidoria','acessibilidade'].includes(name)&&nav==='home'));
  });
  document.title = `${name==='home'?'Início':document.querySelector('h1')?.textContent || APP_NAME} — ${APP_NAME}`;
  window.scrollTo({top:0,behavior:'instant'});
}

let fontScale = Number(localStorage.getItem('raps-font') || 1);
function setFont(v){fontScale=Math.max(.9,Math.min(1.45,v));document.documentElement.style.setProperty('--font-scale',fontScale);localStorage.setItem('raps-font',fontScale);}
setFont(fontScale);

document.getElementById('fontUp').addEventListener('click',()=>setFont(fontScale+.1));
document.getElementById('fontDown').addEventListener('click',()=>setFont(fontScale-.1));
document.getElementById('contrast').addEventListener('click',()=>{document.body.classList.toggle('high-contrast');localStorage.setItem('raps-contrast',document.body.classList.contains('high-contrast')?'1':'0');});
if(localStorage.getItem('raps-contrast')==='1') document.body.classList.add('high-contrast');

document.getElementById('speak').addEventListener('click',()=>{
  if(!('speechSynthesis' in window)) return alert('Leitura em voz alta não está disponível neste navegador.');
  speechSynthesis.cancel();
  const text = document.getElementById('conteudo').innerText;
  const u = new SpeechSynthesisUtterance(text);u.lang='pt-BR';u.rate=.95;speechSynthesis.speak(u);
});

window.addEventListener('hashchange',render);
render();

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
