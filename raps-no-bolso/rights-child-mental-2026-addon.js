// Lei nº 15.413/2026 — direito de crianças e adolescentes à saúde mental no SUS.
// Fonte oficial verificada em 21/08/2026. Conteúdo educativo, sem substituir avaliação profissional ou orientação jurídica individual.

rightsSources.saudeMentalInfantojuvenil2026 = [
  'Lei nº 15.413/2026 — saúde mental de crianças e adolescentes no SUS',
  'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15413.htm'
];
sources.direitos = Object.values(rightsSources);

if (!rightsTopics.some(([r]) => r === 'direitos-saude-mental-infantojuvenil')) {
  const mentalIndex = rightsTopics.findIndex(([r]) => r === 'direitos-saude-mental');
  const item = [
    'direitos-saude-mental-infantojuvenil',
    '🧒',
    'Saúde mental de crianças e adolescentes',
    'Lei 15.413/2026: prevenção, tratamento e rede de cuidado no SUS.'
  ];
  if (mentalIndex >= 0) rightsTopics.splice(mentalIndex + 1, 0, item);
  else rightsTopics.push(item);
}

pages['direitos-saude-mental-infantojuvenil'] = () => `
  <div class="page">
    ${emergencyStrip()}
    ${rightsPageHead('Saúde mental de crianças e adolescentes','A Lei nº 15.413/2026 acrescentou o art. 11-A ao Estatuto da Criança e do Adolescente e tornou expresso o direito de acesso a programas de saúde mental do SUS para prevenção e tratamento.')}

    <div class="content-grid">
      <div class="content-stack">
        <section class="panel success">
          <div class="callout"><span class="callout-icon">🧒</span><div>
            <h2>Lei nº 15.413/2026</h2>
            <p><strong>Em vigor desde 22 de maio de 2026.</strong> A lei alterou o ECA para assegurar, no SUS, acesso de crianças e adolescentes a programas de saúde mental voltados à prevenção e ao tratamento de agravos.</p>
          </div></div>
        </section>

        <section class="panel">
          <h2>O que a lei garante</h2>
          <ul class="law-list">
            <li><strong>Prevenção e tratamento.</strong> Crianças e adolescentes têm direito de acesso a programas de saúde mental promovidos pelo SUS.</li>
            <li><strong>Atenção psicossocial básica e especializada.</strong> A lei determina que os programas contemplem esses dois níveis de atenção.</li>
            <li><strong>Urgência e emergência.</strong> O cuidado em saúde mental infantojuvenil também deve alcançar situações urgentes e emergenciais.</li>
            <li><strong>Atenção hospitalar quando necessária.</strong> A lei inclui expressamente essa possibilidade dentro da rede de cuidado.</li>
            <li><strong>Profissionais preparados.</strong> Quem atua na prevenção e no tratamento deve receber formação específica e permanente para identificar sinais de risco e realizar o acompanhamento necessário.</li>
            <li><strong>Proteção reforçada na vulnerabilidade.</strong> Crianças e adolescentes em situação de vulnerabilidade e em tratamento têm assegurado acesso aos recursos terapêuticos, de forma gratuita ou subsidiada, conforme as linhas de cuidado voltadas às suas necessidades específicas.</li>
          </ul>
        </section>

        <section class="panel warning">
          <h2>O que isso significa na prática</h2>
          <p>A lei não cria um único serviço obrigatório para todos os casos. Ela exige que o SUS organize acesso ao cuidado em diferentes pontos da rede, conforme a necessidade: atenção psicossocial básica ou especializada, urgência/emergência e atenção hospitalar quando indicada.</p>
        </section>

        <section class="panel">
          <h2>Como pedir o cuidado</h2>
          <div class="steps">
            <div class="step"><div><strong>Explique a necessidade</strong><p>Informe os sinais percebidos, há quanto tempo ocorrem e se existe risco imediato, prejuízo importante ou mudança acentuada de comportamento.</p></div></div>
            <div class="step"><div><strong>Peça avaliação e orientação de fluxo</strong><p>Você pode mencionar que o art. 11-A do ECA, incluído pela Lei 15.413/2026, assegura acesso a programas de saúde mental do SUS.</p></div></div>
            <div class="step"><div><strong>Se houver risco imediato</strong><p>Não espere uma consulta eletiva. Procure uma porta de urgência/emergência ou acione o SAMU 192 quando a situação exigir socorro imediato.</p></div></div>
          </div>
          <div class="panel soft" style="margin-top:14px"><strong>Frase simples:</strong> “Quero orientação para acesso ao cuidado em saúde mental. A Lei 15.413/2026 incluiu no ECA o direito de crianças e adolescentes a programas de prevenção e tratamento pelo SUS.”</div>
        </section>

        <section class="panel">
          <h2>Relação com os outros direitos</h2>
          <p>Essa lei se soma ao ECA, à Lei nº 10.216/2001, ao Estatuto dos Direitos do Paciente e às demais regras do SUS. Portanto, continuam valendo direitos como dignidade, informação, proteção contra abuso, cuidado adequado, privacidade e participação da família ou responsável nos limites legais e do melhor interesse da criança ou adolescente.</p>
          <div class="quick-links" style="margin-top:14px">
            ${link('direitos-saude-mental','Direitos gerais em saúde mental <span>→</span>')}
            ${link('direitos-2026','Novos direitos de 2026 <span>→</span>')}
            ${link('direitos-acompanhante','Direito a acompanhante <span>→</span>')}
          </div>
        </section>

        ${rightsBack()}
      </div>

      <div class="side-stack">
        <section class="panel"><h3>Fonte oficial</h3>${rightsSourcesList(['saudeMentalInfantojuvenil2026'])}</section>
        ${sideBox('Importante','Este conteúdo explica direitos e caminhos de acesso. Não diagnostica nem define sozinho qual serviço ou tratamento é indicado.',[['onde-ajuda','Onde buscar ajuda']])}
      </div>
    </div>
  </div>`;
