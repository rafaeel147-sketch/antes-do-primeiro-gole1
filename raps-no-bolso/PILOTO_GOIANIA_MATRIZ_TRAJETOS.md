# Piloto Goiânia — comparação de trajetos da rede de saúde (08/11/2026)

## Objetivo e escopo
O comparador `?p=rotas-rede` consulta todas as unidades **registradas no diretório atual do aplicativo** (hospitais HUGO/HUGOL, UPA 24h, CAPS e CAPS AD, UBS/USF/CS/CAIS/CIAMS, ambulatório e pronto-socorro psiquiátrico). "Todos" agrupa **por tipo de atendimento**; não equivale atendimento de UBS ao de pronto-socorro.

O botão "Comparar trajetos agora" requer ação e consentimento explícitos. Não solicita GPS ao abrir a página, não usa dados em segundo plano, não salva GPS em localStorage e não solicita CPF. O GPS é enviado à instância externa de roteamento **apenas após consentimento**; os códigos CNES e coordenadas das unidades vêm da base pública estadual e não exigem GPS. Ao tocar "Ver trajeto no mapa", o app de mapas passa a receber os dados informados.

## Fontes e cálculo
- Diretório já registrado no aplicativo: HUGO/HUGOL (SES-GO), rede municipal CAPS/UPA (SMS Goiânia), atenção básica (PDF oficial, 87 registros com CAIS/CIAMS e possível duplicação de CNES).
- CNES/Dados Abertos GO: `https://dadosabertos.go.gov.br/dataset/cnes-cadastro-nacional-de-estabelecimentos-de-saude/resource/7559175a-98ac-4719-bf30-5e6455ba57c5`.
- Roteamento viário experimental: Valhalla comunitário `https://valhalla1.openstreetmap.de/sources_to_targets`, com identificador `X-Client-Id`; OpenStreetMap, sem SLA, sem garantia de trânsito atualizado. A documentação do servidor público pede notificação aos responsáveis via GitHub Discussions para apps de usuário final. Notificação: **PENDENTE**.
- O usuário escolhe `Carro` ou `A pé` e ordenação por km de percurso ou tempo estimado; a matriz contém distância de **rota de vias**, não distância em linha reta. "Ônibus" abre itinerário no Google Maps, sem ranking interno de linhas (depende de horários/GTFS/provedor).
- O app consulta as unidades com códigos CNES mapeados e coordenadas válidas em Goiânia, em lotes de até 20 destinos, limitando requisições com intervalo de 1,25 s. Sem disponibilidade ou com coordenadas faltantes, o resultado informa quantas unidades foram efetivamente comparadas e não alega a mais próxima de toda a cidade.
- **Não há** previsão de chegada real, tempo de espera, vagas, regulação, lotação, acessibilidade das calçadas ou trânsito em tempo real. Não usar como triagem clínica. Em emergências, ligar 192.

## Limites e riscos não resolvidos
1. Coordenadas CNES podem ser antigas ou incorretas, inclusive dados historicamente discrepantes do pronto-socorro psiquiátrico; o comparador só aceita coordenadas plausíveis, sem garantir georreferenciamento exato à entrada da unidade.
2. Nem todo CAPS tem CNES identificado inequivocamente. O CAPS AD Casa, por exemplo, permanece sem código associado neste módulo e sem ranking automático até confirmação.
3. A base municipal de atenção básica inclui 87 registros e também unidades que **não são UBS**; preservar a categoria e não afirmar que todos são postos idênticos.
4. Valhalla aberto é apenas piloto e pode falhar ou limitar uso, especialmente com volume. Antes de escalar nacionalmente, migrar para provedor contratado ou infraestrutura de roteamento própria, com métricas, limites globais, observabilidade, política de privacidade e comunicação ao operador do serviço comunitário.
5. Validação em Android físico e acessibilidade de chegada: **pendente**. CI prova funcionamento simulado, não mede qualidade ou segurança de cada rota real.

## Regras de publicação
- Não alterar URL, domínio, `CNAME`, repositório ou configuração do GitHub Pages.
- Testar que o catálogo inclui todas as unidades registradas, GPS não é ativado sem consentimento, HUGOL/HUGO são classificados por matriz de percurso e não por distância em linha reta, grupos clínicos não são confundidos, ônibus não recebe ETA inventada, modo sem GPS permanece disponível, sem erros JS e com SW offline do próprio site.
- Um serviço sem distância confiável permanece visível, mas é considerado "Trajeto não calculado". Se parte dos destinos não foi calculada, o ranking é explicitamente **PARCIAL**.
