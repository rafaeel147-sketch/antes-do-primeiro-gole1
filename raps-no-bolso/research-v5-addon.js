// RAPS no Bolso V5 — pesquisa aplicada, participação social e apresentação científica.
// Camada informativa: não cria coleta nova nem servidor.
(() => {
  const route = 'pesquisa-participativa';

  if (!menuItems.some(([r]) => r === route)) {
    const evalIndex = menuItems.findIndex(([r]) => r === 'avaliacao');
    const item = [route,'🔬','Pesquisa e participação','Avaliação, escuta comunitária e apresentação científica'];
    if (evalIndex >= 0) menuItems.splice(evalIndex, 0, item);
    else menuItems.push(item);
  }

  pages[route] = () => `
    <div class="page">
      ${pageHead(
        'Pesquisa e participação',
        'O RAPS no Bolso também pode ser avaliado e aprimorado com participação voluntária de usuários, familiares, trabalhadores e pesquisadores — sem transformar o aplicativo em prontuário ou ferramenta clínica.',
        'Pesquisa aplicada • usabilidade • participação social'
      )}
      <section class="panel success">
        <div class="callout">
          <span class="callout-icon">🔬</span>
          <div>
            <h2>Melhorar com evidência e participação</h2>
            <p>O objetivo é descobrir se as pessoas encontram a informação, entendem o próximo passo e conseguem usar o aplicativo com autonomia. Participar de avaliação ou escuta não é obrigatório para usar o RAPS no Bolso.</p>
          </div>
        </div>
      </section>

      <section class="nav-grid" aria-label="Pesquisa e participação">
        <a class="nav-card" href="?p=avaliacao" data-route="avaliacao">
          <span class="icon-square">✓</span>
          <span><strong>Avaliar o aplicativo</strong><p>Feedback, clareza, facilidade e testes de usabilidade já disponíveis localmente.</p></span>
          <span class="go">›</span>
        </a>
        <a class="nav-card" href="?p=participe-sus" data-route="participe-sus">
          <span class="icon-square">🗣</span>
          <span><strong>Participação social</strong><p>Organize sugestões, melhorias e propostas sem confundir registro local com protocolo oficial.</p></span>
          <span class="go">›</span>
        </a>
        <a class="nav-card" href="?p=apresentacao-cientifica" data-route="apresentacao-cientifica">
          <span class="icon-square">▦</span>
          <span><strong>Apresentação científica</strong><p>Problema, objetivo, método possível, estágio do protótipo e indicadores avaliáveis.</p></span>
          <span class="go">›</span>
        </a>
        <a class="nav-card" href="?p=privacidade" data-route="privacidade">
          <span class="icon-square">🔒</span>
          <span><strong>Privacidade e dados</strong><p>Veja o que fica no aparelho, o que não é coletado e os limites desta versão.</p></span>
          <span class="go">›</span>
        </a>
      </section>

      <div class="content-grid">
        <div class="content-stack">
          <section class="panel">
            <h2>O que pode ser avaliado?</h2>
            <ul class="tip-list">
              <li>se a informação foi útil;</li>
              <li>se a pessoa encontrou o que procurava;</li>
              <li>clareza da linguagem;</li>
              <li>facilidade para localizar serviços e próximos passos;</li>
              <li>acessibilidade e barreiras de navegação;</li>
              <li>dificuldades de acesso e informação que está faltando;</li>
              <li>sugestões de usuários, familiares e trabalhadores.</li>
            </ul>
          </section>
          <section class="panel soft">
            <h2>Uso do app não depende de pesquisa</h2>
            <p>O conteúdo educativo, direitos, diretórios de serviços e rotas continuam disponíveis sem preencher avaliação, formulário ou escuta. Nesta V5, qualquer registro de avaliação/pesquisa deve ser voluntário e informado antes da gravação.</p>
          </section>
        </div>
        <div class="side-stack">
          <section class="panel warning">
            <h3>Não é prontuário</h3>
            <p>Esta área não deve pedir CPF, CNS, diagnóstico, prontuário, prescrição, medicação ou localização residencial para fins de pesquisa. Também não produz diagnóstico ou recomendação clínica automática.</p>
          </section>
          <section class="panel">
            <h3>Pesquisa institucional</h3>
            <p>Uma eventual pesquisa formal com participantes precisa ter desenho, responsável, governança de dados e avaliação ética próprios. O protótipo não presume autorização institucional.</p>
          </section>
        </div>
      </div>
    </div>`;

  pages['apresentacao-cientifica'] = () => `
    <div class="page">
      ${pageHead(
        'Apresentação científica',
        'Síntese técnica do RAPS no Bolso para discussão acadêmica e institucional, sem alegar parceria que não esteja formalizada.',
        'Protótipo aplicado • saúde digital • participação'
      )}
      <div class="content-grid">
        <div class="content-stack">
          <section class="panel">
            <h2>Problema</h2>
            <p>Pessoas que precisam compreender a RAPS podem enfrentar informação fragmentada, linguagem técnica, dificuldade para localizar serviços e incerteza sobre qual é o próximo passo.</p>
          </section>
          <section class="panel">
            <h2>Objetivo</h2>
            <p>Oferecer informação educativa, direitos, caminhos de cuidado e localização de serviços em uma interface móvel simples, enquanto cria condições para avaliar usabilidade, clareza, acessibilidade e participação social.</p>
          </section>
          <section class="panel">
            <h2>Públicos possíveis para avaliação</h2>
            <p>Usuários do SUS, familiares, trabalhadores, participantes de espaços de controle social e pesquisadores podem contribuir em desenhos de avaliação adequados ao objetivo de cada atividade.</p>
          </section>
          <section class="panel">
            <h2>Metodologia possível</h2>
            <ul class="tip-list">
              <li>testes de usabilidade com tarefas fictícias padronizadas;</li>
              <li>feedback de utilidade, clareza e facilidade;</li>
              <li>observação de barreiras de navegação e acessibilidade;</li>
              <li>escuta comunitária estruturada sem interpretação clínica;</li>
              <li>ciclos de linha de base → melhoria → novo teste;</li>
              <li>análise de indicadores agregados e registro das mudanças implementadas.</li>
            </ul>
          </section>
          <section class="panel">
            <h2>Estágio atual</h2>
            <p>Protótipo PWA funcional, com conteúdo educativo, participação local, avaliação de usabilidade, diretórios de serviços em Goiânia, GPS opcional para proximidade/rotas e funcionamento offline parcial conforme recursos cacheados.</p>
          </section>
          <section class="panel">
            <h2>Indicadores já previstos</h2>
            <ul class="tip-list">
              <li>taxa de conclusão de tarefa;</li>
              <li>entendimento do próximo passo;</li>
              <li>clareza e facilidade médias;</li>
              <li>tempo por tarefa;</li>
              <li>obstáculos e barreiras mais frequentes;</li>
              <li>utilidade percebida;</li>
              <li>melhorias originadas da participação social.</li>
            </ul>
          </section>
        </div>
        <div class="side-stack">
          <section class="panel success">
            <h3>Funcionalidades existentes</h3>
            <ul class="tip-list">
              <li>direitos e caminhos de cuidado;</li>
              <li>CAPS, urgência e Atenção Básica;</li>
              <li>proximidade por coordenadas públicas quando disponíveis;</li>
              <li>feedback e testes de usabilidade locais;</li>
              <li>participação social e exportação local;</li>
              <li>acessibilidade e PWA.</li>
            </ul>
          </section>
          <section class="panel warning">
            <h3>Limites</h3>
            <p>Não é prontuário, não substitui avaliação profissional, não executa diagnóstico e não possui servidor de pesquisa nesta versão.</p>
          </section>
          <section class="panel soft">
            <h3>IFG/UFG</h3>
            <p>Esta página está preparada para apresentação e discussão com instituições como IFG e UFG. Isso não representa parceria, aprovação, financiamento ou vínculo institucional enquanto não houver formalização.</p>
          </section>
          ${sideBox('Documentação','Consulte também privacidade e avaliação.',[['privacidade','Privacidade'],['avaliacao','Ajude a melhorar'],['pesquisa-participativa','Pesquisa e participação']])}
        </div>
      </div>
    </div>`;

  const CONSENT_VERSION = 'v5-local-1';
  const CONSENT_KEY = 'raps-v5-local-consent';
  const gatedForms = new Set([
    'quickEvalForm',
    'startTestForm',
    'finishTestForm',
    'suggestionForm',
    'improvementForm',
    'proposalForm'
  ]);
  let consentDialogOpen = false;

  function readConsent() {
    try {
      const value = JSON.parse(sessionStorage.getItem(CONSENT_KEY) || 'null');
      if (!value || value.accepted !== true || value.version !== CONSENT_VERSION) return null;
      return value;
    } catch {
      return null;
    }
  }

  function getConsentMeta() {
    const consent = readConsent();
    if (!consent) return null;
    return {
      consentVersion: consent.version,
      consentAt: consent.acceptedAt,
      collectionMode: 'local-voluntary'
    };
  }

  function saveConsent() {
    const value = {
      accepted: true,
      version: CONSENT_VERSION,
      acceptedAt: new Date().toISOString()
    };
    sessionStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    return value;
  }

  function closeConsentDialog() {
    document.getElementById('v5ConsentBackdrop')?.remove();
    consentDialogOpen = false;
  }

  function askConsent(onAccept) {
    if (readConsent()) {
      onAccept();
      return;
    }
    if (consentDialogOpen) return;
    consentDialogOpen = true;

    const backdrop = document.createElement('div');
    backdrop.id = 'v5ConsentBackdrop';
    backdrop.className = 'v5-consent-backdrop';
    backdrop.innerHTML = `
      <section class="v5-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="v5ConsentTitle" aria-describedby="v5ConsentText">
        <div class="eyebrow">Participação voluntária</div>
        <h2 id="v5ConsentTitle">Antes de salvar uma resposta</h2>
        <div id="v5ConsentText" class="v5-consent-copy">
          <p>Este registro será salvo somente neste aparelho para avaliação e melhoria do protótipo. Você pode usar o RAPS no Bolso normalmente sem participar.</p>
          <p>Não informe nome, CPF, CNS, prontuário, diagnóstico, medicação, endereço residencial ou outros dados clínicos/pessoais nos campos livres.</p>
          <p><strong>Este aceite vale apenas para a gravação local desta sessão.</strong> Ele não autoriza, por si só, uso dos dados em uma pesquisa institucional futura.</p>
        </div>
        <label class="v5-consent-check"><input id="v5ConsentCheck" type="checkbox"> Li as informações e concordo voluntariamente em registrar respostas neste aparelho nesta sessão.</label>
        <div class="v5-consent-actions">
          <button class="btn secondary" id="v5ConsentCancel" type="button">Agora não</button>
          <button class="btn" id="v5ConsentAccept" type="button" disabled>Concordo e continuar</button>
        </div>
      </section>`;
    document.body.appendChild(backdrop);

    const check = backdrop.querySelector('#v5ConsentCheck');
    const accept = backdrop.querySelector('#v5ConsentAccept');
    const cancel = backdrop.querySelector('#v5ConsentCancel');
    check.addEventListener('change', () => { accept.disabled = !check.checked; });
    cancel.addEventListener('click', closeConsentDialog);
    accept.addEventListener('click', () => {
      if (!check.checked) return;
      saveConsent();
      closeConsentDialog();
      setTimeout(onAccept, 0);
    });
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) closeConsentDialog();
    });
    check.focus();
  }

  function decorateConsentNotices() {
    for (const formId of gatedForms) {
      const form = document.getElementById(formId);
      if (!form || form.previousElementSibling?.matches('[data-v5-consent-note]')) continue;
      const note = document.createElement('section');
      note.className = 'panel soft compact-panel';
      note.dataset.v5ConsentNote = '1';
      note.innerHTML = '<strong>Participação opcional</strong><p>Você pode continuar usando o aplicativo sem responder. Antes do primeiro registro desta sessão, o RAPS no Bolso mostrará o que será salvo e pedirá sua concordância.</p>';
      form.parentNode?.insertBefore(note, form);
    }
  }

  document.addEventListener('submit', e => {
    const form = e.target;
    if (!gatedForms.has(form.id) || readConsent()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    askConsent(() => form.requestSubmit());
  }, true);

  document.addEventListener('click', e => {
    const pulse = e.target.closest('[data-pulse-answer]');
    if (!pulse || readConsent()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    askConsent(() => pulse.click());
  }, true);

  const contentRoot = document.getElementById('conteudo');
  if (contentRoot) {
    new MutationObserver(() => setTimeout(decorateConsentNotices, 0))
      .observe(contentRoot, { childList: true, subtree: true });
  }
  setTimeout(decorateConsentNotices, 0);

  window.RAPSResearchV5 = Object.freeze({
    version: 'v5',
    consentVersion: CONSENT_VERSION,
    collectionMode: 'local-voluntary',
    hasConsent: () => Boolean(readConsent()),
    getConsentMeta,
    askConsent
  });
})();