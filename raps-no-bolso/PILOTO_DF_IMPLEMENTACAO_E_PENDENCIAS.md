# RAPS no Bolso — prévia Distrito Federal (09/11/2026)

## Escopo concluído no branch
- Seleção explícita `Goiânia — atual` / `Distrito Federal — prévia` na entrada e na rota `?p=selecionar-regiao`.
- Rota `?p=df-servicos`, independente das rotas e do catálogo de Goiânia, com SAMU 192 e pesquisa oficial da SES-DF para **CAPS, UBS, UPA e hospitais**.
- Duas referências documentadas de saúde mental com rota externa por endereço: HSVP (Taguatinga Sul) e Hospital de Base (Asa Sul). O Maps faz sua própria navegação; o site não coleta o GPS nessa tela.
- Sem login/CPF/contatos obrigatórios; não cria protocolo, não informa vagas nem transforma a lista em classificação de risco.
- Compatibilidade de cache PWA v24 e smoke browser de acesso DF/Goiânia, links e navegação móvel.

## Fontes oficiais efetivamente verificadas
- GeoJSON SES-DF (camadas oficialmente anunciadas, arquivos **não obtidos/validados**): https://info.saude.df.gov.br/download-camadas/
- Busca CAPS SES-DF (porta aberta/demanda espontânea, sem encaminhamento): https://info.saude.df.gov.br/busca-saude-caps/
- Busca UBS SES-DF (referência territorial; acolhimento não pode ser negado por falta de documentos): https://info.saude.df.gov.br/busca-saude-ubs/
- Busca UPA SES-DF (urgência, 24h): https://info.saude.df.gov.br/u/
- Mapa hospitais SES-DF: https://info.saude.df.gov.br/hospitaismaps/
- Hospital São Vicente de Paulo, endereço QSC 01, Área Especial, Setor C Sul, Taguatinga Sul, e emergência psiquiátrica 24h: https://www.saude.df.gov.br/documents/37101/869001/MINUTA__CARTA_DE_SERVICOS_HSVP.pdf
- Hospital de Base, endereço SMHS, Área Especial, Quadra 101, Asa Sul, referência de urgência 24h com psiquiatria entre especialidades divulgadas: https://igesdf.org.br/unidades/hospital-de-base/

## Pendências — NÃO IMPLEMENTADAS nesta prévia
1. Baixar, verificar a licença/atualização e **importar** camadas GeoJSON por tipo de unidade. A interface oficial foi encontrada, mas a extração das URLs e validação dos registros não foi possível nesta sessão. Não alegar catálogo completo.
2. Normalizar nomes, tipos assistenciais, regiões administrativas, CNES, endereços e coordenadas; rejeitar geocódigos inválidos e registrar data/fonte.
3. Desenvolver o ranking por **menor trajeto viário** para o DF com provedor autorizado e limites definidos; por enquanto abrir trajetos no Maps por endereço, sem ETA ou ranking próprio.
4. Verificar territorialização da UBS e CAPS por região de residência; acesso e horários especiais, inclusive saúde mental.
5. Testes em Android físico/fora do ambiente de CI, acessibilidade, chegada na unidade e GPS recusado.
6. Testar uso contínuo e política de consumo do roteador comunitário antes de ampliar demanda. Não reutilizar cegamente códigos GO.
7. Qualquer integração a prontuários ou sistemas internos do SUS requer projeto/convênios, governança e autorização específicos.

## Segurança e publicação
- O endereço de produção de Goiânia, domínio e configuração de GitHub Pages não devem mudar.
- A prévia DF exige validação do smoke no GitHub Actions antes de qualquer merge. O branch não é prova de publicação.
- Não afirmar que o serviço mais próximo é o mais indicado ou que haverá atendimento sem regulação.
- Não afirmar que o catálogo DF está completo ou que a matriz viária DF já calcula trajetos.


## Revisão 10/11/2026 — corrigir formulário de CEP da busca de UPA
- Evidência fornecida pelo usuário: captura do navegador Android aberta pelo botão UPA, exibindo campo obrigatório "Digite o CEP ou Endereço", sem acesso rápido por localização.
- Correção: rota interna \`?p=df-upas\` com lista **13 UPAs do IGESDF** por nome e endereço, sem CEP, CPF ou cadastro. A rota é exibida mesmo sem GPS.
- Ao tocar no cartão de UPA da página DF, o app navega para \`df-upas\` e tenta GPS do aparelho **apenas após essa escolha**, via autorização do navegador. O cartão informa previamente envio temporário ao Valhalla/OpenStreetMap para obter trajetos. A página contém botão para repetir a tentativa.
- A matriz viária usa 6 coordenadas públicas do GeoNode IPEDF (\`saude_sala_situacao_2\`, camada publicada em **2023**) para São Sebastião, Sobradinho, Núcleo Bandeirante, Samambaia, Recanto das Emas e Ceilândia. **NÃO** afirmar que representam o conjunto das 13 UPAs nem que continuam exatas para a entrada da unidade em 2026.
- Resultados parciais sempre mostram \`comparação PARCIAL: N de 13\`; as sete unidades ainda sem coordenada validada ficam visíveis e podem abrir rotas por endereço. Nenhuma é classificada como mais próxima sem cálculo.
- Rotas internas pela rede viária: \`Valhalla /sources_to_targets\` comunitário para carro/pedestre, sem disponibilidade garantida, trânsito atualizado ou dados de vaga. Ônibus abre Google Maps sem ranking interno. GPS permanece na sessão de cálculo e não é salvo localmente. Ao abrir mapa externo, o provedor recebe os dados da rota.
- Se GPS for negado, coordenada inválida ou roteador não responder, a lista das treze UPAs e seus links externos continuam utilizáveis sem CEP.
- Endereços e horários: https://igesdf.org.br/unidades/ (portal oficial do gestor, conferido em nov/2026). Camada e data: https://catalogo.ipe.df.gov.br/layers/geonode_data:geonode:saude_sala_situacao_2 (2023). Fontes de serviços: https://info.saude.df.gov.br/u/.
- Testes Playwright: abrir UPA sem redirecionar, nenhuma entrada CEP, 13 unidades mesmo sem GPS, 6 dados geográficos históricos, ranking simulado por percurso viário e não proximidade reta, estado parcial, botão rota para todas, modo mobile e isolamento de Goiânia.
- **PENDENTE**: camada GeoJSON SES-DF atualizada e geocódigo auditado das 13; verificação de entrada real e trajeto em Android físico; qualidade e condições de uso do roteador em produção. Nunca apresentar "mais próxima de todas" enquanto estes itens não forem resolvidos.
