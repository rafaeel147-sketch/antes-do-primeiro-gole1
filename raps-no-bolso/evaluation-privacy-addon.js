// Complementa a página de privacidade após a inclusão do módulo de avaliação.
(() => {
  pages.privacidade = () => `
    <div class="page">
      ${pageHead('Privacidade','O RAPS no Bolso continua sem login e sem cadastro clínico. Participação social e avaliação podem guardar registros somente no próprio aparelho.')}
      <div class="content-grid"><div class="content-stack">
        <section class="panel"><h2>O que esta versão não pede</h2><ul class="tip-list"><li>Nome, CPF ou conta de usuário.</li><li>Diagnóstico ou prontuário.</li><li>Diário clínico, de consumo ou de humor.</li><li>Localização GPS.</li></ul></section>
        <section class="panel success"><h2>Registros de participação</h2><p>“Sugira uma melhoria”, “Antes e depois” e “Leve uma proposta ao Conselho” usam <strong>IndexedDB no navegador deste aparelho</strong>. Textos e fotos opcionais não são enviados a servidor nesta versão.</p><p>Evite incluir pessoas identificáveis, documentos, prontuários, telas ou informações de saúde nas fotos e observações.</p></section>
        <section class="panel success"><h2>Feedback e testes de usabilidade</h2><p>O módulo “Ajude a melhorar” também usa armazenamento local no aparelho. Pode guardar página avaliada, resposta de utilidade, notas de clareza e facilidade, resultado de uma tarefa, tempo do teste, obstáculos observados e comentário opcional.</p><p>O teste guiado cria somente um <strong>código aleatório de sessão</strong>. Não há campo para nome, CPF, prontuário ou diagnóstico. Não escreva informação clínica pessoal nas observações.</p></section>
        <section class="panel warning"><h2>Exportar e apagar</h2><p>Os módulos oferecem exportação para análise local. O painel de avaliação exporta CSV/JSON; o módulo de participação exporta seus registros próprios. Limpar os dados do site/PWA ou desinstalar pode apagar o conteúdo local.</p><p>Antes de qualquer coleta institucional ou sincronização futura em servidor, o projeto deverá definir finalidade, governança, acesso, retenção, proteção de dados e requisitos éticos aplicáveis.</p></section>
        <section class="panel soft"><h2>Links externos</h2><p>Ao abrir sites oficiais externos, passam a valer as políticas e tecnologias do serviço acessado. Este protótipo não controla esses sites.</p></section>
      </div><div class="side-stack">${sideBox('Controle dos seus dados','Nesta versão você pode apagar os registros de avaliação no próprio painel e limpar os dados locais do PWA pelo navegador.',[['avaliacao-painel','Painel de avaliação'],['participe-sus','Participe do SUS'],['inicio','Ir para o início']])}</div></div>
    </div>`;
})();
