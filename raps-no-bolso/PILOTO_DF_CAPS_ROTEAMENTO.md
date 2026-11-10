# RAPS no Bolso — CAPS Distrito Federal: acesso sem CEP e rotas por modalidade
Data da pesquisa: 10/11/2026. Implementação: `df-caps-routing-addon.js`.

## Problema observado
Depois da implementação de busca de UPA do DF sem CEP, a opção de CAPS ainda enviava ao buscador externo da SES-DF, cujo fluxo dependia de informar CEP/endereço. O usuário pediu que clicar em CAPS solicitasse a localização e mostrasse serviços próximos com trajeto, tal como no piloto de Goiânia.

## Fontes e conjunto de dados
- **Lista de 19 serviços e endereços atuais divulgada pelo GDF em 09/09/2026**: https://www.gdfsaude.df.gov.br/web/guest/w/setembro-amarelo-saiba-onde-e-como-buscar-apoio-em-saude-mental-no-df
- **Fonte geográfica IPEDF/GeoNode**, camada `saude_sala_situacao_2` publicada em **2023**: https://catalogo.ipe.df.gov.br/layers/geonode_data:geonode:saude_sala_situacao_2
- **CNES/DATASUS**: https://cnes2.datasus.gov.br/Mod_Ind_Unidade_Listar.asp?VComp=&VEstado=53&VListar=1&VMun=&VSubUni=&VTipo=70
- Orientação de acolhimento e busca territorial SES-DF: https://info.saude.df.gov.br/busca-saude-caps/
- Roteamento comunitário experimental: https://valhalla1.openstreetmap.de/sources_to_targets (OpenStreetMap/Valhalla), sem SLA, sem trânsito atual, podendo recusar requisições.

Os **19 serviços** listados em 2026 ficam acessíveis sem CEP ou GPS, separados por `CAPS adulto` (8), `CAPS AD` (7), `CAPSi` (4). O botão de CAPS no DF mostra aviso de privacidade antes do clique. Ao clicar, abre a rota interna `?p=df-caps` e tenta o GPS com permissão do navegador. A localização só é enviada ao serviço externo após autorização e apenas para comparação. O app não salva GPS em armazenamento persistente. Ao abrir o Maps, os próprios termos do provedor se aplicam.

## Cobertura e segurança do ranking
A camada de 2023 tem 18 CAPS, mas não coincide inteiramente com os 19 serviços, modalidades e sedes divulgados em 2026. O código associa coordenadas históricas de **14 registros** com correspondência plausível. **5 referências não entram no ranking automático:** CAPSi Recanto das Emas, CAPS II Brasília (novo endereço no Cruzeiro), CAPS III Gama, CAPS AD III Candango (sede SCS), CAPS AD III Ceilândia (QNN 16). Todos permanecem com endereço e rota externa. A associação das 14 coordenadas é **provisória**, não uma auditoria de acessos/entradas.

O comparador usa distância e tempo de **trajeto na rede viária** (não distância em linha reta), conforme matriz do Valhalla para carro/a pé. Cada modalidade é classificada separadamente. O selo "menor trajeto" significa somente **menor entre os percursos efetivamente calculados nessa modalidade**. Sempre exibir **PARCIAL** e contagem `N de M` quando não for possível comparar todas as unidades. O modo ônibus/metrô abre rotas externas no Maps, sem estimar tempo internamente. Se o GPS for recusado, falhar, ou o roteador não responder, a lista e as rotas permanecem acessíveis.

**Atenção**: CAPS mais próximo não necessariamente é a referência territorial, a modalidade adequada ou uma porta de atendimento de urgência. Para crise grave, 192, UPA ou hospital de urgência. Nunca alegar vagas ou atendimento confirmados.

## Testes
- Acesso interno após toque, sem CEP e com aviso explícito antes de solicitar GPS.
- Lista 19 e filtros 8/7/4 por modalidade.
- Simulação de matriz de percursos com diferente mais próximo em cada modalidade, sem misturar tipos.
- 14/19 com geo histórico, 5 sem; todos acessíveis por endereço, sem classificação falsa.
- Sem GPS, sem origem nos links Maps; GPS autorizado, origem apenas em link de rota.
- Layout Android 320, 390, 1024 px, fluxo UPA anterior e diretório/rotas de Goiânia intactos.
- Não publicar caso qualquer smoke, navegador ou teste de proximidade falhe.

## Pendências (não implementadas)
- Verificar visita/acesso real e a sede física de cada CAPS, coordenadas atualizadas e mudanças de endereço.
- Confirmar territorialização, modalidades e turnos, sobretudo acolhimento noturno dos CAPS III.
- Teste real em Android físico e consulta ao roteador comunitário sem mocks.
- Sustentar infraestrutura de roteamento com contrato e avaliação de privacidade para escala nacional.
