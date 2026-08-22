// Encontre o caminho — orientação educativa por necessidade.
// Não faz diagnóstico, triagem clínica automatizada nem garante vaga/atendimento em serviço específico.

(() => {
  sources.caminho = [
    ['Ministério da Saúde — Rede de Atenção Psicossocial (RAPS)','https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps'],
    ['Ministério da Saúde — Centros de Atenção Psicossocial (CAPS)','https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps/caps/caps/'],
    ['Ministério da Saúde — UPA 24h','https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/u/upa-24h'],
    ['Ministério da Saúde — SAMU 192','https://www.gov.br/saude/pt-br/composicao/saes/samu-192']
  ];

  if (!menuItems.some(([r]) => r === 'encontre-caminho')) {
    const helpIndex = menuItems.findIndex(([r]) => r === 'onde-ajuda');
    const item = ['encontre-caminho','🧭','Encontre o caminho','Escolha o que está acontecendo e veja por onde começar'];
    if (helpIndex >= 0) menuItems.splice(helpIndex, 0, item);
    else menuItems.push(item);
  }

  const situations = [
    ['acompanhamento','🫶','Quero acompanhamento','Estou sofrendo ou preciso de cuidado, mas não parece uma urgência.'],
    ['recaida','↩️','Tive uma recaída','Voltei a usar álcool ou outra droga e quero retomar o cuidado.'],
    ['abstinencia','⚠️','Estou com abstinência','Parei ou reduzi e estou com sintomas.'],
    ['crise','🫨','Estou em crise ou muito angustiado','Ansiedade, sofrimento intenso, agitação ou sensação de não dar conta.'],
    ['intoxicacao','🚑','Há sinais graves agora','Desmaio, convulsão, falta de ar, intoxicação importante ou outro risco imediato.'],
    ['ajudar','🤝','Quero ajudar alguém','Quero saber como acompanhar outra pessoa até uma porta de cuidado.'],
    ['direito','⚖️','Meu direito foi negado','Preciso entender como registrar a negativa ou procurar o canal adequado.']
  ];

  const results = {
    acompanhamento: {
      level:'usual',
      title:'Comece pela atenção que acompanha o cuidado',
      primary:'UBS / Atenção Primária',
      secondary:'CAPS, quando houver sofrimento psíquico intenso, persistente ou necessidade relacionada a álcool e outras drogas',
      body:'A UBS é a principal porta de entrada do SUS e pode avaliar, acompanhar e articular a rede. Os CAPS são serviços públicos de saúde mental abertos à comunidade para situações de sofrimento psíquico intenso e necessidades relacionadas ao uso prejudicial de álcool e outras drogas.',
      actions:[['onde-ajuda','Entender UBS, CAPS, UPA e SAMU'],['raps','Entender a RAPS']]
    },
    recaida: {
      level:'attention',
      title:'Recaída não precisa virar afastamento do cuidado',
      primary:'CAPS/CAPS AD ou serviço que já acompanha você',
      secondary:'UBS também pode ser uma porta de entrada e ajudar a reorganizar o cuidado',
      body:'Se não há sinais de urgência, o objetivo é reduzir riscos e retomar contato com a rede. Não dirija, evite misturar substâncias e, se puder, fique com alguém de confiança até estar mais seguro. Se houver intoxicação importante, perda de consciência, convulsão, dificuldade respiratória ou risco relevante, mude para a rota de urgência.',
      actions:[['alcool-recaida','O que fazer depois de uma recaída'],['alcool-ajuda','Onde procurar ajuda']]
    },
    abstinencia: {
      level:'danger',
      title:'Abstinência pode exigir avaliação de saúde',
      primary:'Avaliação profissional — e urgência quando houver sinais graves',
      secondary:'CAPS/CAPS AD, UBS ou serviço que já acompanha podem ajudar a organizar o cuidado quando não houver emergência',
      body:'Abstinência de álcool e de algumas substâncias pode ser perigosa. Se houver convulsão, confusão importante, alteração de consciência, alucinações, dificuldade respiratória, agitação intensa ou piora rápida, procure urgência imediatamente ou acione o SAMU 192. O aplicativo não orienta esquema caseiro de desintoxicação nem doses de medicamentos.',
      actions:[['alcool-abstinencia','Entender abstinência e sinais de alerta'],['onde-ajuda','Ver portas de cuidado']]
    },
    crise: {
      level:'attention',
      title:'Primeiro: segurança e intensidade da crise',
      primary:'CAPS ou UBS quando não há risco imediato',
      secondary:'UPA/pronto-socorro ou SAMU 192 se houver risco de morte, tentativa de suicídio, convulsão, perda de consciência, violência iminente ou sofrimento extremo que exija socorro imediato',
      body:'Em uma crise sem sinais de emergência, reduza estímulos, procure um lugar mais seguro, tente ficar acompanhado e busque uma porta de cuidado. Não presuma que todo sintoma físico seja “apenas ansiedade”.',
      actions:[['crise','Orientações para crise e ansiedade'],['onde-ajuda','Onde buscar ajuda']]
    },
    intoxicacao: {
      level:'emergency',
      title:'Isto é uma rota de urgência/emergência',
      primary:'SAMU 192 quando houver necessidade de socorro móvel ou risco imediato',
      secondary:'UPA ou pronto-socorro quando for possível chegar com segurança a uma porta de urgência',
      body:'Desmaio, convulsão, dificuldade respiratória, intoxicação grave, alteração importante da consciência e outras situações com risco de morte, sequela ou sofrimento intenso precisam de avaliação urgente. Não espere o aplicativo resolver a situação.',
      actions:[['onde-ajuda','Entender UPA e SAMU']]
    },
    ajudar: {
      level:'usual',
      title:'Ajude sem assumir sozinho a função de profissional',
      primary:'Se houver risco imediato: SAMU 192 / urgência',
      secondary:'Sem urgência: ofereça companhia para UBS, CAPS/CAPS AD ou serviço que já acompanha a pessoa',
      body:'Pergunte o que a pessoa precisa, ajude a reduzir riscos e facilite o acesso ao cuidado. Evite confronto, humilhação ou tentar “resolver tudo” sozinho. Se a pessoa estiver inconsciente, convulsionando, com dificuldade respiratória, risco de violência ou outro sinal grave, trate como urgência.',
      actions:[['familia','Família e rede de apoio'],['onde-ajuda','Onde buscar ajuda']]
    },
    direito: {
      level:'usual',
      title:'Negativa de direito é outro caminho — não uma triagem clínica',
      primary:'Entenda primeiro qual direito e qual resposta o serviço deu',
      secondary:'Depois use Conselho/controle social, gestão ou Ouvidoria conforme o objetivo',
      body:'Registre data, local, o que foi solicitado e a resposta recebida. O RAPS no Bolso tem módulos próprios para direitos, OuvSUS e participação social. Em situação de urgência, a prioridade continua sendo receber cuidado e segurança.',
      actions:[['direitos','Meus direitos'],['ouvsus','Como usar a OuvSUS'],['participe-sus','Participe do SUS']]
    }
  };

  function pathResultCard(key){
    const r=results[key];
    if(!r)return '';
    const cls=r.level==='emergency'?'danger':r.level==='danger'?'warning':r.level==='attention'?'soft':'success';
    const emergencyAction=r.level==='emergency'?'<a class="btn" href="tel:192">Ligar 192</a>':'';
    return `<section class="panel ${cls} path-result" tabindex="-1">
      <div class="eyebrow">Orientação por necessidade</div>
      <h2>${r.title}</h2>
      <div class="path-service"><small>Por onde começar</small><strong>${r.primary}</strong></div>
      <div class="path-service secondary"><small>Outra possibilidade</small><strong>${r.secondary}</strong></div>
      <p>${r.body}</p>
      <div class="hero-actions">${emergencyAction}${r.actions.map(([route,label])=>link(route,label,'btn secondary')).join('')}</div>
      <p class="path-disclaimer"><strong>Importante:</strong> esta orientação não é diagnóstico nem classificação de risco. Serviços e fluxos podem variar conforme município, horário, território e avaliação profissional.</p>
    </section>`;
  }

  pages['encontre-caminho'] = () => `
    <div class="page">
      ${emergencyStrip()}
      ${pageHead('Encontre o caminho','Escolha a situação mais parecida com o que está acontecendo. O aplicativo mostra por qual tipo de serviço começar e quando mudar para urgência.','Navegação no SUS/RAPS')}

      <section class="panel warning path-safety">
        <h2>Antes de escolher</h2>
        <p><strong>Se há risco imediato, perda de consciência, convulsão, dificuldade respiratória, tentativa de suicídio, violência iminente ou outra situação grave, não use este guia como triagem.</strong> Procure uma porta de urgência ou acione o SAMU 192.</p>
        <div class="hero-actions"><a class="btn" href="tel:192">Ligar 192</a><button class="btn secondary" type="button" data-path-key="intoxicacao">Ver orientação de urgência</button></div>
      </section>

      <section class="section-head"><div><div class="eyebrow">O que está acontecendo?</div><h2>Escolha uma situação</h2></div><p>Você pode trocar de opção a qualquer momento.</p></section>
      <section class="nav-grid path-grid" aria-label="Situações para orientação">
        ${situations.map(([key,icon,title,desc])=>`<button class="nav-card path-choice" type="button" data-path-key="${key}"><span class="icon-square" aria-hidden="true">${icon}</span><span><strong>${title}</strong><p>${desc}</p></span><span class="go">›</span></button>`).join('')}
      </section>

      <div id="pathResult" class="path-result-wrap" aria-live="polite"></div>

      <section class="panel soft" style="margin-top:18px">
        <h2>O que este guia faz — e o que não faz</h2>
        <ul class="tip-list">
          <li><strong>Faz:</strong> explica o papel geral de UBS, CAPS, UPA, pronto-socorro e SAMU conforme fontes oficiais.</li>
          <li><strong>Não faz:</strong> diagnosticar, definir gravidade clínica, indicar medicamento ou garantir que determinada unidade esteja aberta ou tenha vaga.</li>
          <li><strong>Próxima evolução:</strong> integrar diretório local verificado e, se houver base confiável, mostrar serviços próximos sem transformar GPS em requisito para usar o app.</li>
        </ul>
      </section>

      <div class="content-grid" style="margin-top:18px"><div class="content-stack"></div><div class="side-stack"><section class="panel"><h3>Fontes oficiais</h3>${sourceList(sources.caminho)}</section></div></div>
    </div>`;

  document.addEventListener('click',e=>{
    const choice=e.target.closest('[data-path-key]');
    if(!choice)return;
    const key=choice.dataset.pathKey;
    if(!results[key])return;
    const target=document.getElementById('pathResult');
    if(!target)return;
    target.innerHTML=pathResultCard(key);
    document.querySelectorAll('.path-choice').forEach(btn=>btn.classList.toggle('selected',btn.dataset.pathKey===key));
    const panel=target.querySelector('.path-result');
    panel?.focus({preventScroll:true});
    target.scrollIntoView({behavior:'smooth',block:'start'});
  });
})();
