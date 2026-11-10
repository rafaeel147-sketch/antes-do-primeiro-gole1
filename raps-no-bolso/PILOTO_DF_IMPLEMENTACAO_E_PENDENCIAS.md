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
