// Consolidação segura da Fase 4 — 12/09/2026.
// Recupera somente lacunas úteis da PR #1 sem substituir a arquitetura atual.
// Conteúdo educativo; não substitui avaliação clínica ou orientação jurídica individual.

const fase4Sources = {
  identificacao: ['Portaria de Consolidação GM/MS nº 1/2017 — arts. 255 a 270 (redação atualizada)','https://bvsms.saude.gov.br/bvs/saudelegis/gm/2017/prc0001_03_10_2017_comp.html'],
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

fase4InsertAfter('alcool-drogas', ['abstinencia','⚠','Abstinência','Sinais de alerta e quando procurar avaliação urgente.']);
fase4InsertAfter('ouvsus', ['lai-sic','📄','LAI / SIC','Como pedir documentos e informações públicas.']);

// Corrige a regra documental antiga sem apagar o restante do módulo de direitos.
function fase4CorrigirIdentificacao(html) {
  return html
    .replace(
      '<li><strong>Não ter, não portar ou não saber o número do Cartão SUS não impede o atendimento solicitado.</strong> Essa regra está expressa no art. 13 da Portaria GM/MS nº 940/2011.</li>',
      '<li><strong>Não portar ou não saber o número do CPF/CNS não é, por si só, impedimento ao atendimento.</strong> Pela redação atual da Portaria de Consolidação GM/MS nº 1/2017, a pessoa pode ser identificada por outro documento válido; situações de urgência e hipóteses específicas têm ressalva expressa.</li>'
    )
    .replace(
      '<li><strong>O cadastro pode ser regularizado depois.</strong> A própria norma permite que identificação e cadastramento sejam realizados posteriormente ao atendimento.</li>',
      '<li><strong>Identificação e cadastramento podem ser concluídos depois do atendimento.</strong> A norma também prevê hipóteses em que a identificação completa não é possível no momento do cuidado.</li>'
    )
    .replace(
      '<div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Estou sem o Cartão SUS agora. A Portaria nº 940/2011, art. 13, diz que isso não impede o atendimento. Posso regularizar o cadastro depois.”</div>',
      '<div class="panel soft" style="margin-top:14px"><strong>Como pedir:</strong> “Estou sem o número do CPF/CNS agora. Posso me identificar com outro documento válido. Se houver cadastro a regularizar, peço orientação para concluir isso sem transformar a burocracia em barreira ao cuidado necessário.”</div>'
    )
    .replace(
      '<p>A regra específica acima fala do Cartão SUS. Ela não significa que todo documento civil seja irrelevante em qualquer situação. O serviço pode precisar de dados para cadastro, identificação e continuidade do cuidado. <strong>Em urgência e emergência, porém, a ausência documental não deve virar barreira para receber e cuidar da pessoa.</strong></p>',
      '<p>Fora das hipóteses excepcionais, o serviço pode precisar identificar a pessoa por documento válido para cadastro e continuidade do cuidado. <strong>Em urgência, acidente grave, transtorno mental, condição clínica ou neurológica grave e outras hipóteses previstas na norma, a impossibilidade de identificação completa não deve impedir o cuidado necessário.</strong></p>'
    );
}

if (typeof pages['direitos-atendimento'] === 'function') {
  const fase4DireitosAtendimentoOriginal = pages['direitos-atendimento'];
  pages['direitos-atendimento'] = () => fase4CorrigirIdentificacao(fase4DireitosAtendimentoOriginal());
}

if (typeof pages['onde-ajuda'] === 'function') {
  const fase4OndeAjudaOriginal = pages['onde-ajuda'];
  pages['onde-ajuda'] = () => fase4OndeAjudaOriginal().replace(
    '<section class="panel success"><h2>Sem Cartão SUS?</h2><p>A ausência ou inexistência do Cartão Nacional de Saúde não é impedimento para a realização do atendimento solicitado. O cadastramento pode ser resolvido no fluxo administrativo sem transformar o cartão em barreira ao cuidado.</p></section>',
    `<section class="panel success"><h2>Sem o número do CPF/CNS?</h2><p>Isso não deve virar uma barreira automática. A redação atual da Portaria de Consolidação GM/MS nº 1/2017 permite identificação por outro documento válido e ressalva expressamente situações de urgência e hipóteses em que a identificação completa não é possível no momento. Identificação e cadastramento podem ser concluídos depois do atendimento.</p><p class="small">Fonte: <a href="${fase4Sources.identificacao[1]}" target="_blank" rel="noopener noreferrer">${fase4Sources.identificacao[0]} ↗</a></p></section>`
  );
}

pages.abstinencia = () => `
  <div class="page">
    ${emergencyStrip()}
    ${pageHead('Abstinência','Reduzir ou interromper o uso de álcool pode provocar sintomas. Em algumas pessoas, a abstinência pode ser grave e precisa de avaliação profissional.','Álcool e outras drogas')}
    <div class="content-grid">
      <div class="content-stack">
        <section class="panel danger">
          <h2>Quando a abstinência pode ser perigosa</h2>
          <p>O Ministério da Saúde informa que a redução repentina do álcool pode resultar em abstinência grave em pessoas com uso pesado e prolongado. Convulsões, confusão ou desorientação, alucinações, agitação intensa, alteração importante de consciência ou piora rápida exigem avaliação urgente.</p>
          <div class="hero-actions"><a class="btn danger" href="tel:192">Ligar 192</a>${link('onde-ajuda','Ver portas de urgência','btn secondary')}</div>
        </section>
        <section class="panel">
          <h2>Sinais que merecem atenção</h2>
          <ul class="tip-list">
            <li>Tremores, suor intenso, náusea, ansiedade e aumento importante dos batimentos podem aparecer após reduzir ou interromper o álcool.</li>
            <li>Histórico de convulsão ou delirium em abstinências anteriores aumenta a preocupação.</li>
            <li>Outras doenças clínicas ou psiquiátricas, falta de apoio social e tentativas anteriores complicadas também podem aumentar o risco.</li>
          </ul>
        </section>
        <section class="panel warning">
          <h2>Não transforme esta página em um plano de desintoxicação</h2>
          <p>Se o uso é frequente ou intenso, ou se você já teve abstinência importante, é mais seguro procurar avaliação antes de fazer uma interrupção brusca sozinho. Este aplicativo não orienta dose, esquema de remédio ou automedicação.</p>
        </section>
        <section class="panel">
          <h2>Onde procurar</h2>
          <ul class="law-list">
            <li><strong>UBS:</strong> pode fazer avaliação inicial e articular continuidade do cuidado conforme a gravidade.</li>
            <li><strong>CAPS AD:</strong> acolhe necessidades relacionadas ao uso de álcool e outras drogas e pode construir cuidado sem exigir abstinência como condição de entrada.</li>
            <li><strong>UPA, pronto-socorro ou SAMU 192:</strong> quando houver sinais de gravidade, risco ou piora rápida.</li>
          </ul>
        </section>
      </div>
      <div class="side-stack">
        ${sideBox('Relacionado','Se sua meta é reduzir riscos ou mudar o padrão de uso, veja também o conteúdo de álcool e outras drogas.',[['alcool-drogas','Álcool e outras drogas'],['reducao-danos','Redução de danos']])}
        <section class="panel"><h3>Fonte oficial</h3>${sourceList([fase4Sources.abstinencia])}</section>
      </div>
    </div>
  </div>`;

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
