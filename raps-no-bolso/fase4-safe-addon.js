// Consolidação segura da Fase 4 — revisada em 16/09/2026.
// Recupera lacunas úteis sem depender de substituições textuais frágeis para conteúdo jurídico.
// Conteúdo educativo; não substitui avaliação clínica ou orientação jurídica individual.

const fase4Sources = {
  identificacao: ['Portaria de Consolidação GM/MS nº 1/2017 — arts. 255 a 265 (redação atualizada)','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2017/prc0001_03_10_2017_comp.html'],
  abstinencia: ['Ministério da Saúde — Linha de Cuidado: transtornos por uso de álcool / síndrome de abstinência','https://linhasdecuidado.saude.gov.br/portal/transtornos-por-uso-de-alcool-no-adulto/unidade-de-atencao-primaria/manejo-inicial-conduta/'],
  lai: ['Lei nº 12.527/2011 — Lei de Acesso à Informação','https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm'],
  laiFaq: ['Acesso à Informação — perguntas frequentes sobre a LAI','https://www.gov.br/acessoainformacao/pt-br/perguntas-frequentes/aspectos-gerais'],
  falaBr: ['Fala.BR — Plataforma Integrada de Ouvidoria e Acesso à Informação','https://falabr.cgu.gov.br/web/home']
};

function fase4InsertAfter(route, item) {
  if (menuItems.some(([r]) => r === item[0])) return;
  const index = menuItems.findIndex(([r]) => r === route);
  if (index >= 0) menuItems.splice(index + 1, 0, item);
  else menuItems.push(item);
}

fase4InsertAfter('ouvsus', ['lai-sic','📄','LAI / SIC','Como pedir documentos e informações públicas.']);

// Atualiza a fonte usada pelo módulo de direitos para a redação vigente consolidada.
if (typeof rightsSources !== 'undefined') {
  rightsSources.cartao = fase4Sources.identificacao;
  sources.direitos = Object.values(rightsSources);
}

// Conteúdo jurídico final definido diretamente: não depende de procurar frases exatas no HTML antigo.
pages['direitos-atendimento'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${rightsPageHead('Atendimento e documentos','O que vale quando você chega ao serviço: acolhimento, urgência, território, CPF/CNS, cadastro e barreiras burocráticas.')}
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
          <h2>4. Sem o número do CPF/CNS na mão</h2>
          <ul class="law-list">
            <li><strong>CPF é a identificação preferencial nos registros de saúde.</strong> Se a pessoa não possui CPF, a norma prevê atribuição de um número de Cartão Nacional de Saúde (CNS).</li>
            <li><strong>Não possuir ou não portar documento com o número do CPF ou CNS não é, por si só, impedimento ao atendimento.</strong> A regra atual admite identificação por outro documento válido.</li>
            <li><strong>Urgência e impossibilidade de identificação têm tratamento próprio.</strong> A própria norma ressalva situações de urgência e as hipóteses do art. 258.</li>
          </ul>
          <div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Estou sem o número do CPF/CNS agora. Posso me identificar com outro documento válido. Se houver cadastro a regularizar, peço orientação sem transformar a identificação administrativa em barreira ao cuidado necessário.”</div>
        </section>

        <section class="panel">
          <h2>5. Quando a identificação completa não é possível</h2>
          <p>O art. 258 da Portaria de Consolidação GM/MS nº 1/2017 dispensa a identificação unívoca nos registros quando não é possível obter os dados necessários, citando situações como pessoa acidentada grave, com transtorno mental, em condição clínica ou neurológica grave ou incapacitada por questão social ou cultural. Nesses casos, a norma prevê um registro mínimo substitutivo.</p>
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

pages['onde-ajuda'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${pageHead('Onde buscar ajuda','Entenda o papel de cada porta do SUS. A rede é articulada: você não precisa acertar sozinho o serviço “perfeito”.')}
    <div class="content-grid"><div class="content-stack">
      <section class="panel"><h2>UBS — cuidado contínuo e porta de entrada</h2><p>A Atenção Primária acompanha saúde ao longo do tempo, faz avaliação inicial, prevenção, cuidado de condições comuns e articula encaminhamentos quando necessários. Também pode orientar sobre tabagismo e saúde mental conforme a rede local.</p></section>
      <section class="panel"><h2>CAPS / CAPS AD — cuidado psicossocial</h2><p>Os CAPS são serviços comunitários da RAPS. CAPS AD é voltado às necessidades relacionadas ao uso de álcool e outras drogas. A oferta e a organização variam conforme o território; CAPS não substitui UPA, hospital ou SAMU em toda situação.</p></section>
      <section class="panel warning"><h2>UPA 24h — urgências</h2><p>Funciona 24 horas e atende quadros agudos, realizando avaliação e estabilização inicial e encaminhando para hospital quando necessário.</p></section>
      <section class="panel danger"><h2>SAMU 192 — emergência móvel</h2><p>Use em situações de urgência ou emergência com risco de morte, sequela ou sofrimento intenso, como perda de consciência, convulsão, dificuldade respiratória importante, intoxicação grave, tentativa de suicídio ou trauma grave. A ligação é gratuita.</p><a class="btn danger" href="tel:192">Ligar 192</a></section>
      <section class="panel"><h2>Hospital / pronto-socorro</h2><p>Atende situações que exigem estrutura hospitalar. Em urgência/emergência, a regra nacional determina que qualquer serviço de saúde deve receber, cuidar e encaminhar quando necessário.</p></section>
      <section class="panel success"><h2>Sem o número do CPF/CNS?</h2><p>Isso não deve virar uma barreira automática. A Portaria de Consolidação GM/MS nº 1/2017 prevê que não possuir ou não portar documento com CPF/CNS não constitui impedimento quando a pessoa pode ser identificada por outro documento válido, e ressalva situações de urgência e de impossibilidade de identificação previstas no art. 258.</p><p class="small">Fonte: <a href="${fase4Sources.identificacao[1]}" target="_blank" rel="noopener noreferrer">${fase4Sources.identificacao[0]} ↗</a></p></section>
    </div><div class="side-stack">${sideBox('Diretório local','Na versão de Goiânia você também pode consultar serviços verificados e a Atenção Básica.',[['servicos-goiania','CAPS e urgência em Goiânia'],['ubs-goiania','UBS em Goiânia'],['raps','Entender a RAPS'],['direitos','Meus direitos']])}<section class="panel"><h3>Fontes oficiais</h3>${sourceList([...sources.ajuda,...sources.direitos.slice(0,3)])}</section></div></div>
  </div>`;

// Uma única fonte de verdade para abstinência: a rota canônica do módulo AOD.
// O alias legado é mantido apenas para não quebrar links antigos já compartilhados.
if (typeof pages['ad-abstinencia'] === 'function') {
  pages.abstinencia = () => pages['ad-abstinencia']();
}

// Corrige apenas a mensagem curta da home para refletir o GPS opcional introduzido pelos diretórios.
if (typeof pages.inicio === 'function') {
  const fase4InicioOriginal = pages.inicio;
  pages.inicio = () => fase4InicioOriginal().replace(
    'Esta versão não pede relato de consumo, prontuário ou localização.',
    'Esta versão não pede relato de consumo ou prontuário. A localização é opcional e só é solicitada quando você escolhe usar recursos de rota.'
  );
}

pages['lai-sic'] = () => `
  <div class="page">
    ${pageHead('LAI / SIC','Use a Lei de Acesso à Informação quando o objetivo for obter documentos ou informações públicas — não para substituir uma reclamação assistencial.','Transparência e controle social')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <h2>Quando usar LAI</h2>
          <p>Use um pedido de acesso à informação para solicitar documentos, relatórios, dados, contratos, protocolos, critérios, planilhas ou outras informações públicas que estejam sob guarda de um órgão ou entidade.</p>
          <p><strong>Você não precisa justificar por que quer a informação.</strong> O pedido deve apenas ser claro o suficiente para permitir que o órgão localize o que foi solicitado.</p>
        </section>
        <section class="panel">
          <h2>Prazo geral</h2>
          <p>Se a informação estiver disponível, o acesso deve ser imediato quando possível. Caso não seja, a LAI prevê resposta em até <strong>20 dias</strong>, com possibilidade de prorrogação por mais <strong>10 dias</strong> mediante justificativa.</p>
        </section>
        <section class="panel">
          <h2>LAI não é a mesma coisa que OuvSUS</h2>
          <ul class="law-list">
            <li><strong>LAI / SIC:</strong> obter informação ou documento público.</li>
            <li><strong>OuvSUS:</strong> reclamação, solicitação assistencial, denúncia, sugestão ou elogio relacionado ao SUS.</li>
          </ul>
          <div class="hero-actions">${link('ouvsus','Ir para OuvSUS','btn secondary')}</div>
        </section>
        <section class="panel soft">
          <h2>Modelo curto de pedido</h2>
          <p>“Com fundamento na Lei nº 12.527/2011, solicito acesso aos seguintes documentos/informações: [descreva de forma objetiva]. Se disponíveis em formato digital, peço o envio nesse formato.”</p>
        </section>
        <section class="panel">
          <h2>Onde registrar</h2>
          <p>No Executivo Federal, a plataforma integrada é o Fala.BR. Estados e municípios podem utilizar SIC/e-SIC ou outro canal próprio; confira o canal oficial do ente responsável pela informação.</p>
          <div class="hero-actions"><a class="btn" href="${fase4Sources.falaBr[1]}" target="_blank" rel="noopener noreferrer">Abrir Fala.BR ↗</a></div>
        </section>
      </div>
      <div class="side-stack">
        <section class="panel"><h3>Fontes oficiais</h3>${sourceList([fase4Sources.lai,fase4Sources.laiFaq,fase4Sources.falaBr])}</section>
      </div>
    </div>
  </div>`;

// Inclui as novas referências também na página geral de fontes.
if (typeof pages.fontes === 'function') {
  const fase4FontesOriginal = pages.fontes;
  pages.fontes = () => fase4FontesOriginal().replace(
    '<section class="panel soft"><h2>Critério editorial</h2>',
    `<section class="panel"><h2>Abstinência de álcool</h2>${sourceList([fase4Sources.abstinencia])}</section><section class="panel"><h2>LAI / SIC e identificação no atendimento</h2>${sourceList([fase4Sources.lai,fase4Sources.laiFaq,fase4Sources.identificacao])}</section><section class="panel soft"><h2>Critério editorial</h2>`
  );
}

// Recupera a leitura em voz alta da PR antiga com controle de iniciar/parar.
(function fase4Speech() {
  const area = document.querySelector('.a11y-actions');
  if (!area || document.getElementById('speakPage')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'speakPage';
  button.setAttribute('aria-label','Ouvir conteúdo da página');
  button.setAttribute('aria-pressed','false');
  button.textContent = '🔊';
  area.appendChild(button);

  let activeUtterance = null;
  function stopSpeech() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    activeUtterance = null;
    button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-label','Ouvir conteúdo da página');
  }

  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) {
      window.alert('Leitura em voz alta não está disponível neste navegador.');
      return;
    }
    if (activeUtterance || window.speechSynthesis.speaking) {
      stopSpeech();
      return;
    }
    const text = document.getElementById('conteudo')?.innerText?.trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.onend = stopSpeech;
    utterance.onerror = stopSpeech;
    activeUtterance = utterance;
    button.setAttribute('aria-pressed','true');
    button.setAttribute('aria-label','Parar leitura da página');
    window.speechSynthesis.speak(utterance);
  });

  document.addEventListener('click', event => {
    if (event.target.closest('[data-route]')) stopSpeech();
  }, true);
  window.addEventListener('beforeunload', stopSpeech);
})();
