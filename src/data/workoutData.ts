import { Objective, Location, DayWorkout, Exercise } from '../types';

// Core pool of exercises organized by equipment environment and biomechanical movement pattern
const EXERCISE_POOL = {
  academia: {
    push: [
      {
        id: 'ac_push_1',
        name: 'Supino Reto com Barra (Pegada Média)',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'push' as const,
        description: 'Deitado no banco plano, empurre a barra estendendo os cotovelos de forma controlada a partir do peito.',
        tips: 'Mantenha os cotovelos a 45 graus e apoie firmemente os pés no chão.'
      },
      {
        id: 'ac_push_2',
        name: 'Desenvolvimento de Ombros com Barra',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'A partir do peito, empurre a barra verticalmente acima da cabeça até estender os cotovelos.',
        tips: 'Ative o abdômen para manter a coluna estável e evitar a hiperextensão da lombar.'
      },
      {
        id: 'ac_push_3',
        name: 'Tríceps Overhead com Corda na Polia',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'De costas para a polia, segure a corda acima da cabeça e estenda os cotovelos para a frente e para cima.',
        tips: 'Mantenha os braços estáticos ao lado das orelhas flexionando apenas os antebraços.'
      },
      {
        id: 'ac_push_4',
        name: 'Crucifixo na Polia (Crossover)',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'De pé entre as polias altas, traga os braços para a frente e para baixo em um movimento arqueado cruzando as mãos.',
        tips: 'Foque no esmagamento do peitoral no ponto máximo do movimento.'
      },
      {
        id: 'ac_push_5',
        name: 'Supino Inclinado com Barra',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'push' as const,
        description: 'No banco inclinado, empurre a barra para cima focando na porção superior do peito.',
        tips: 'Controle a descida da barra até quase tocar a parte superior do peito.'
      },
      {
        id: 'ac_push_6',
        name: 'Tríceps Testa deitado na Polia',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado sob a polia, segure a barra reta e flexione apenas os cotovelos descendo o peso em direção à testa.',
        tips: 'Mantenha os cotovelos paralelos e fixos durante toda a execução.'
      },
      {
        id: 'ac_push_7',
        name: 'Elevação Lateral Sentado na Polia',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Sentado na polia baixa, eleve o cabo lateralmente focando na cabeça lateral do deltoide.',
        tips: 'Mantenha a postura reta e levante liderando o movimento através do cotovelo.'
      },
      {
        id: 'ac_push_8',
        name: 'Crucifixo Declinado com Halteres',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'No banco declinado, abra os halteres lateralmente alongando o peitoral inferior com segurança.',
        tips: 'Mantenha uma leve flexão nos cotovelos para preservar as articulações.'
      },
      {
        id: 'ac_push_9',
        name: 'Desenvolvimento Arnold com Halteres',
        series: '3 séries x 10 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'Segure os halteres na frente do peito e empurre-os rotacionando os punhos para fora conforme sobe.',
        tips: 'Trabalha todas as porções do ombro de maneira altamente completa.'
      },
      {
        id: 'ac_push_10',
        name: 'Tríceps Unilateral na Polia',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Puxe o cabo estendendo o braço totalmente para baixo de forma isolada focando no tríceps.',
        tips: 'Mantenha o cotovelo colado ao tronco, focando apenas na extensão do braço.'
      },
      {
        id: 'ac_push_11',
        name: 'Supino com Pegada Fechada (Close-Grip)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado no banco reto, empurre a barra segurando-a com as mãos separadas na largura dos ombros.',
        tips: 'Excelente exercício composto com ênfase no tríceps e peitoral interno.'
      }
    ],
    pull: [
      {
        id: 'ac_pull_1',
        name: 'Puxada Frontal com Pegada Fechada',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'No pulley, puxe a barra curta ou triângulo verticalmente até a altura do peito, inclinando-se levemente para trás.',
        tips: 'Sinta a contração das dorsais, liderando a puxada através dos cotovelos.'
      },
      {
        id: 'ac_pull_2',
        name: 'Remada Curvada com Barra',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'Inclinado para a frente, puxe a barra na direção da cintura mantendo a coluna reta e firme.',
        tips: 'Esprema as costas no topo mantendo os cotovelos próximos ao corpo.'
      },
      {
        id: 'ac_pull_3',
        name: 'Rosca Alternada Inclinada com Halteres',
        series: '3 séries x 10 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Sentado em banco inclinado, faça a flexão alternada dos cotovelos girando a palma da mão para cima.',
        tips: 'A inclinação coloca o bíceps em uma posição de alongamento máximo excelente.'
      },
      {
        id: 'ac_pull_4',
        name: 'Remada Curvada com Dois Halteres',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Com o tronco inclinado à frente, puxe os dois halteres simultaneamente rente ao corpo.',
        tips: 'Excelente estabilidade para trabalhar o miolo das costas e deltoides posteriores.'
      },
      {
        id: 'ac_pull_5',
        name: 'Barra Fixa com Pegada Supinada (Chin-Up)',
        series: '3 séries x Máximo de repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Segure na barra com pegada supinada (palmas para você) e puxe-se até o queixo passar da barra.',
        tips: 'Foco excepcional nas dorsais e grande recrutamento de força nos bíceps.'
      },
      {
        id: 'ac_pull_6',
        name: 'Rosca Concentrada',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Sentado, apoie o cotovelo na parte interna da coxa e flexione o antebraço erguendo o halter de forma isolada.',
        tips: 'Excelente isolador que foca no pico de contração máxima do bíceps.'
      },
      {
        id: 'ac_pull_7',
        name: 'Crucifixo Invertido na Polia',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Em pé de frente para a polia alta, puxe os cabos cruzando os braços para trás para isolar o posterior de ombro.',
        tips: 'Mantenha os cotovelos alinhados horizontalmente para focar inteiramente nos ombros.'
      },
      {
        id: 'ac_pull_8',
        name: 'Remada para Deltóide Posterior com Corda na Polia',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Segure as pontas da corda e puxe-as na direção do rosto abrindo bem os cotovelos ao final.',
        tips: 'Excelente construtor de força e estabilidade na musculatura do manguito e posterior de ombro.'
      },
      {
        id: 'ac_pull_9',
        name: 'Rosca Martelo Alternada com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Erga os halteres alternadamente mantendo as palmas das mãos voltadas para dentro (neutra).',
        tips: 'Excelente exercício para trabalhar o antebraço, braquial e braquiorradial.'
      },
      {
        id: 'ac_pull_10',
        name: 'Encolhimento de Ombros com Barra',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Segure a barra à frente do corpo e encolha os ombros verticalmente para cima em direção às orelhas.',
        tips: 'Não gire os ombros; suba-os em linha reta para contrair perfeitamente o trapézio.'
      }
    ],
    legs: [
      {
        id: 'ac_legs_1',
        name: 'Panturrilha no Leg Press',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Apoie apenas a ponta dos pés na parte inferior da plataforma do Leg Press e estenda as panturrilhas.',
        tips: 'Aproveite a amplitude do aparelho para alongar e contrair bem as panturrilhas.'
      },
      {
        id: 'ac_legs_2',
        name: 'Extensão de Panturrilha (Calf Press)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Execute a extensão completa do tornozelo na máquina de panturrilha/prensa para membros inferiores.',
        tips: 'Cadencie o movimento segurando a contração no topo e controlando a descida.'
      },
      {
        id: 'ac_legs_3',
        name: 'Flexão de Pernas na Bola Suíça (Ball Leg Curl)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Deitado, com os pés apoiados na bola, eleve o quadril e flexione as pernas trazendo a bola rumo aos glúteos.',
        tips: 'Mantém o abdômen e glúteos sob altíssima tensão estabilizadora de cadeia posterior.'
      },
      {
        id: 'ac_legs_4',
        name: 'Elevação de Panturrilha Sentado com Barra',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Sentado, apoie a barra acolchoada sobre as coxas e eleve os calcanhares contraindo os sóleos.',
        tips: 'Use um calço sob os pés para obter uma excelente amplitude de alongamento.'
      },
      {
        id: 'ac_legs_5',
        name: 'Agachamento Livre com Barra',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Com a barra apoiada nos trapézios, execute o agachamento flexionando joelhos e quadril com estabilidade.',
        tips: 'Mantenha a coluna neutra e empurre os joelhos ligeiramente para fora na descida.'
      },
      {
        id: 'ac_legs_6',
        name: 'Cadeira Adutora',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Sentado na máquina adutora, realize o fechamento das pernas contraindo a parte interna das coxas.',
        tips: 'Não use impulsos rápidos e sinta a musculatura adutora trabalhar de forma isolada.'
      },
      {
        id: 'ac_legs_7',
        name: 'Agachamento Completo com Barra (Full Squat)',
        series: '4 séries x 8 repetições',
        rest: 120,
        animationType: 'legs' as const,
        description: 'Agache profundamente ultrapassando a paralela dos 90 graus com controle e força abdominal.',
        tips: 'Excelente recrutamento de glúteos e pernas de forma integral para quem possui boa mobilidade.'
      },
      {
        id: 'ac_legs_8',
        name: 'Levantamento Terra com Barra (Deadlift)',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'A partir do chão, levante a barra até ficar em pé erguendo com as pernas, glúteos e eretores da espinha.',
        tips: 'Exercício composto fantástico de potência. Mantenha a barra colada às pernas na subida.'
      },
      {
        id: 'ac_legs_9',
        name: 'Afundo Estático com Barra nos Ombros',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'legs' as const,
        description: 'Dê um passo à frente com a barra nos ombros e flexione as pernas verticalmente formando 90 graus.',
        tips: 'Excelente trabalho unilateral para corrigir assimetrias de pernas e glúteos.'
      },
      {
        id: 'ac_legs_10',
        name: 'Passada Caminhando com Barra',
        series: '3 séries x 20 passos totais',
        rest: 75,
        animationType: 'legs' as const,
        description: 'Execute afundos caminhando de forma coordenada, flexionando uma perna de cada vez.',
        tips: 'Trabalho excepcional de estabilidade, equilíbrio e potência unilateral.'
      },
      {
        id: 'ac_legs_11',
        name: 'Subida no Banco com Barra nos Ombros',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'legs' as const,
        description: 'Com a barra apoiada nos ombros, suba em uma plataforma sólida e firme empurrando o corpo para cima.',
        tips: 'A perna que está no banco deve realizar todo o trabalho mecânico de subida.'
      },
      {
        id: 'ac_legs_12',
        name: 'Prensa de Panturrilha de Pé',
        series: '4 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'De pé, execute a extensão de tornozelos contraindo as panturrilhas de forma controlada.',
        tips: 'Concentre-se em empurrar com a base do dedão para focar na musculatura interna.'
      }
    ],
    core: [
      {
        id: 'ac_core_1',
        name: 'Abdominal na Máquina (Ab Crunch Machine)',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Sentado na máquina, contraia o reto abdominal trazendo o tronco para a frente de forma controlada.',
        tips: 'Solte todo o ar na fase de contração máxima.'
      },
      {
        id: 'ac_core_2',
        name: 'Abdominal com Rolo (Ab Roller)',
        series: '4 séries x 12 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'De joelhos, empurre o rolo de abdômen para a frente estendendo o tronco sem forçar a lombar.',
        tips: 'Use o abdômen e glúteos contraídos para frear o movimento de descida.'
      },
      {
        id: 'ac_core_3',
        name: 'Abdominal Reverso Declinado',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'No banco declinado, eleve as pernas trazendo o quadril levemente para cima para focar na porção inferior.',
        tips: 'Não use balanço; faça o movimento apenas com a força abdominal.'
      },
      {
        id: 'ac_core_4',
        name: 'Abdominal Russo na Polia',
        series: '3 séries x 15 rotações',
        rest: 45,
        animationType: 'core' as const,
        description: 'Com o cabo na horizontal, rotacione o tronco ativando os oblíquo laterais de forma controlada.',
        tips: 'Estabilize as pernas e quadris mantendo-os voltados para a frente.'
      },
      {
        id: 'ac_core_5',
        name: 'Abdominal na Polia com Bola Bosu',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado na bola Bosu segurando os puxadores da polia, execute o crunch alongando o abdômen.',
        tips: 'Excelente para dar uma amplitude de alongamento maior ao reto abdominal.'
      }
    ],
    cardio: [
      {
        id: 'ac_cardio_1',
        name: 'Bicicleta Ergométrica (Stationary Bicycling)',
        series: '20 minutos em ritmo constante',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Pedale de forma contínua, mantendo a frequência cardíaca ideal para oxigenação geral.',
        tips: 'Ajuste a altura do selim para ficar confortável.'
      },
      {
        id: 'ac_cardio_2',
        name: 'Ciclismo Livre (Bicycling)',
        series: '20 a 30 minutos em ritmo moderado',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Pedal ao ar livre ou simulador, excelente para condicionamento geral.',
        tips: 'Mantenha giros constantes e respiração controlada.'
      },
      {
        id: 'ac_cardio_3',
        name: 'Salto Alternado na Caixa (Box Skip)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Salte na caixa com pernas alternadas de forma rápida, elevando as pulsações.',
        tips: 'Ideal para treinar velocidade, força elástica e queima calórica rápida.'
      },
      {
        id: 'ac_cardio_4',
        name: 'Corrida Lateral no Banco (Bench Sprint)',
        series: '4 séries x 30 segundos ativos',
        rest: 45,
        animationType: 'cardio' as const,
        description: 'Corra lateralmente sobre o banco de exercícios tocando os pés de forma ágil.',
        tips: 'Excelente trabalho aeróbico e de agilidade.'
      }
    ]
  },
  casa: {
    push: [
      {
        id: 'ca_push_1',
        name: 'Flexão Relógio (Clock Push-Up)',
        series: '4 séries x Repetições máximas',
        rest: 60,
        animationType: 'push' as const,
        description: 'A cada repetição, rotacione a posição das mãos em formato de círculo/relógio executando a flexão.',
        tips: 'Recruta diferentes porções musculares e desenvolve estabilidade tridimensional de ombros.'
      },
      {
        id: 'ca_push_2',
        name: 'Desenvolvimento Arnold com Halteres',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'A partir da linha do peitoral, empurre os halteres girando as palmas para fora no topo.',
        tips: 'Ativação total dos ombros usando halteres no conforto de casa.'
      },
      {
        id: 'ca_push_3',
        name: 'Tríceps no Banco (Bench Dips)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Apoie as mãos na borda de um banco ou cadeira firme e desça o quadril flexionando os cotovelos.',
        tips: 'Mantenha as costas rente à cadeira para focar a tensão puramente no tríceps.'
      },
      {
        id: 'ca_push_4',
        name: 'Crucifixo Declinado com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado em leve declive, abra os braços lateralmente controlando a descida do peso para alongar o peitoral.',
        tips: 'Ótima ativação da porção inferior do peitoral.'
      },
      {
        id: 'ca_push_5',
        name: 'Flexão Declinada (Pés Elevados)',
        series: '3 séries x Repetições máximas',
        rest: 60,
        animationType: 'push' as const,
        description: 'Apoie os pés em uma cadeira ou sofá e as mãos no chão para executar a flexão de braços.',
        tips: 'Joga maior ênfase e carga na porção superior do peito e nos ombros anterior.'
      },
      {
        id: 'ca_push_6',
        name: 'Tríceps Testa Declinado com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado com halteres em banco declinado, flexione apenas os cotovelos descendo os pesos ao lado da testa.',
        tips: 'Garante excelente isolamento e amplitude do tríceps.'
      },
      {
        id: 'ca_push_7',
        name: 'Elevação de Ombros Alternada (Frontal e Lateral)',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Alterne uma repetição de elevação frontal com outra de elevação lateral de ombros com halteres.',
        tips: 'Trabalha deltoides anteriores e laterais com altíssima eficiência e coordenação.'
      },
      {
        id: 'ca_push_8',
        name: 'Flexão Fechada com Apoio no Halter',
        series: '3 séries x Repetições máximas',
        rest: 60,
        animationType: 'push' as const,
        description: 'Coloque as mãos próximas apoiadas sobre o corpo de um halter firme no chão e execute a flexão.',
        tips: 'Tensão contínua absurda e isolamento excelente para peitoral interno e tríceps.'
      },
      {
        id: 'ca_push_9',
        name: 'Supino Fechado com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado de costas, empurre os halteres colados um ao outro no meio do peitoral.',
        tips: 'Trabalho excelente de compressão isométrica do peitoral e estímulo de tríceps.'
      },
      {
        id: 'ca_push_10',
        name: 'Desenvolvimento Arnold com Halteres',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Empurre os halteres girando os punhos, garantindo excelente trabalho completo de deltoides.',
        tips: 'Execute de forma lenta para controlar a estabilização com halteres.'
      },
      {
        id: 'ca_push_11',
        name: 'Elevação de Ombros Alternada (Frontal e Lateral)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Alterne movimentos frontais e laterais recrutando ombros de forma completa em casa.',
        tips: 'Mantenha o corpo estável e não balance o quadril.'
      },
      {
        id: 'ca_push_12',
        name: 'Crucifixo Declinado com Halteres',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'No banco declinado, faça abertura lateral controlada com halteres alongando o peito.',
        tips: 'Foque no esmagamento das fibras na subida.'
      }
    ],
    pull: [
      {
        id: 'ca_pull_1',
        name: 'Remada Curvada com Dois Halteres',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'Com o tronco inclinado, puxe os dois halteres simultaneamente na direção do abdômen.',
        tips: 'Foque em espremer as escápulas juntas no topo de cada repetição.'
      },
      {
        id: 'ca_pull_2',
        name: 'Remada Curvada com Halteres (Pegada Neutra)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Com as palmas voltadas para dentro, puxe os dois halteres simulando a remada curvada.',
        tips: 'A pegada neutra poupa os punhos e dá excelente ênfase nos dorsais e bíceps.'
      },
      {
        id: 'ca_pull_3',
        name: 'Rosca Alternada Inclinada com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Deitado em banco/colchão levemente inclinado, flexione os cotovelos alternadamente girando as palmas.',
        tips: 'Excelente para recrutar a cabeça longa do bíceps de forma isolada.'
      },
      {
        id: 'ca_pull_4',
        name: 'Remada Curvada com Dois Halteres',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Tronco inclinado, execute a puxada com halteres trabalhando a espessura das costas.',
        tips: 'Mantenha a coluna neutra e cabeça alinhada.'
      },
      {
        id: 'ca_pull_5',
        name: 'Rosca Concentrada com Halter',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Apoie o cotovelo na coxa de forma unilateral e erga o peso isolando o bíceps.',
        tips: 'Ideal para trabalhar o "pico" do bíceps no treino caseiro.'
      },
      {
        id: 'ca_pull_6',
        name: 'Rosca Martelo Alternada com Halteres',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Segurando os halteres com as palmas voltadas uma para a outra, faça a flexão alternada.',
        tips: 'Foco forte no antebraço e braquiorradial.'
      },
      {
        id: 'ca_pull_7',
        name: 'Crucifixo Invertido com Cabeça Apoiada',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Incline-se apoiando a testa em um banco ou superfície firme e faça a elevação lateral invertida.',
        tips: 'Isola perfeitamente o posterior de ombro, eliminando o balanço do tronco.'
      },
      {
        id: 'ca_pull_8',
        name: 'Remada Curvada com Dois Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Tronco inclinado, puxe os dois halteres em direção ao quadril ativando as costas de forma simétrica.',
        tips: 'Mantenha as escápulas ativas durante todo o movimento.'
      },
      {
        id: 'ca_pull_9',
        name: 'Rosca Direta com Barra EZ e Elástico',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Utilize o elástico sob os pés acoplado à barra curta/EZ para adicionar resistência variável ao bíceps.',
        tips: 'Conforme você sobe o peso, o elástico estica e a contração do bíceps fica absurdamente forte no topo.'
      },
      {
        id: 'ca_pull_10',
        name: 'Rosca Martelo Cruzada (Cross-Body)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Traga o halter alternadamente na diagonal na direção do ombro oposto de forma coordenada.',
        tips: 'Fortalece de forma excelente o braquial e a pegada.'
      },
      {
        id: 'ca_pull_11',
        name: 'Barra Fixa Assistida com Elástico (Band Assisted)',
        series: '3 séries x Máximo de repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Na barra fixa de porta, apoie os pés/joelho no elástico para atenuar a carga e facilitar a subida.',
        tips: 'Excelente para quem está evoluindo na força das costas em casa.'
      },
      {
        id: 'ca_pull_12',
        name: 'Bom Dia com Elástico (Band Good Morning)',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Posicione o elástico sob os pés e atrás do pescoço, incline o tronco estendendo a lombar e posterior de coxa.',
        tips: 'Inicie com foco total na flexão do quadril, mantendo a coluna retilínea.'
      }
    ],
    legs: [
      {
        id: 'ca_legs_1',
        name: 'Agachamento Livre (Peso Corporal)',
        series: '5 séries x 20 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Agache empurrando os quadris para trás, mantendo os joelhos alinhados com a ponta dos pés.',
        tips: 'Postura ereta e abdômen contraído são chaves para a boa execução.'
      },
      {
        id: 'ca_legs_2',
        name: 'Afundo com Barra/Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Com carga nos ombros ou mãos, dê um passo à frente flexionando joelhos a 90 graus.',
        tips: 'Excelente construtor de coxas e glúteos.'
      },
      {
        id: 'ca_legs_3',
        name: 'Flexão de Pernas na Bola Suíça',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Deitado, com calcanhares na bola suíça, eleve os quadris e puxe a bola em direção aos glúteos.',
        tips: 'Recrutamento absurdo dos posteriores de coxa (isquiotibiais).'
      },
      {
        id: 'ca_legs_4',
        name: 'Elevação de Panturrilha Unilateral sobre Halter',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Em pé, apoie a ponta do pé sobre o pegador de um halter firme para usá-lo como bloco de alongamento.',
        tips: 'Foco excepcional no alongamento e contração da panturrilha em casa.'
      },
      {
        id: 'ca_legs_5',
        name: 'Agachamento na Cadeira (Chair Squat)',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Execute o agachamento de forma controlada tocando sutilmente a cadeira antes de subir.',
        tips: 'Excelente educativo para aprimorar o padrão de agachamento de forma confortável.'
      },
      {
        id: 'ca_legs_6',
        name: 'Adução de Quadril com Elástico',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Prenda o elástico em um ponto fixo e puxe-o para dentro cruzando as pernas de forma controlada.',
        tips: 'Ativação específica da musculatura interna da coxa.'
      },
      {
        id: 'ca_legs_7',
        name: 'Afundo Reverso Cruzado (Crossover Reverse Lunge)',
        series: '3 séries x 10 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Dê um passo para trás e na diagonal (cruzando atrás do corpo), flexionando os joelhos para agachar.',
        tips: 'Uma das variações mais potentes e eficientes para ativação e modelagem de glúteos.'
      },
      {
        id: 'ca_legs_8',
        name: 'Bom Dia com Elástico (Band Good Morning)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Realize a flexão de quadril com elástico exercendo força para trás contra a lombar.',
        tips: 'Sinta o alongamento concentrado nos posteriores de coxa.'
      },
      {
        id: 'ca_legs_9',
        name: 'Afundo Estático com Barra/Halteres nos Ombros',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Segure peso nos ombros e flexione as pernas de forma unilateral com equilíbrio.',
        tips: 'Garante excelente desenvolvimento de força unilateral.'
      },
      {
        id: 'ca_legs_10',
        name: 'Passada Caminhando (Peso Corporal)',
        series: '4 séries x 20 passos totais',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Dê passos coordenados flexionando alternadamente cada perna a 90 graus.',
        tips: 'Trabalho unilateral espetacular para condicionamento e pernas.'
      },
      {
        id: 'ca_legs_11',
        name: 'Subida no Degrau/Banco com Barra nos Ombros',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Com carga nos ombros, suba em um banco firme estendendo a perna de apoio completamente.',
        tips: 'A perna que sobe puxa todo o peso, ideal para glúteos e quadríceps.'
      },
      {
        id: 'ca_legs_12',
        name: 'Elevação Pélvica de Solo (Butt Lift / Bridge)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Deitado com joelhos flexionados, eleve o quadril contraindo glúteos intensamente no topo.',
        tips: 'Mantenha a força concentrada nos calcanhares.'
      }
    ],
    core: [
      {
        id: 'ca_core_1',
        name: 'Abdominal Bicicleta (Air Bike)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'core' as const,
        description: 'No ar, simule pedalar alternando joelho com o cotovelo oposto de forma dinâmica.',
        tips: 'Mantém a tensão contínua em toda a parede abdominal.'
      },
      {
        id: 'ca_core_2',
        name: 'Abdominal Cruzado (Cross-Body Crunch)',
        series: '3 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado, traga o cotovelo oposto em direção ao joelho flexionado alternando os lados.',
        tips: 'Sinta os oblíquos laterais esmagarem.'
      },
      {
        id: 'ca_core_3',
        name: 'Abdominais de Solo Clássicos',
        series: '4 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Realize flexões do abdômen mantendo a coluna lombar apoiada no solo.',
        tips: 'Aperte e segure a contração máxima.'
      },
      {
        id: 'ca_core_4',
        name: 'Abdominal Declinado',
        series: '3 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Em plano declinado (sofá ou colchão adaptado), flexione o reto abdominal trazendo o tronco.',
        tips: 'Evite tensionar o pescoço.'
      },
      {
        id: 'ca_core_5',
        name: 'Abdominal Toque no Calcanhar',
        series: '3 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado, flexione o tronco lateralmente tocando os calcanhares alternadamente.',
        tips: 'Exercício fantástico e seguro para definir os oblíquos.'
      }
    ],
    cardio: [
      {
        id: 'ca_cardio_1',
        name: 'Bicicleta Ergométrica',
        series: '4 séries x 5 minutos dinâmicos',
        rest: 60,
        animationType: 'cardio' as const,
        description: 'Pedale de forma constante e intensa simulando subidas.',
        tips: 'Garante excelente condicionamento aeróbico sem sair de casa.'
      },
      {
        id: 'ca_cardio_2',
        name: 'Salto na Caixa (Box Jump)',
        series: '4 séries x 12 repetições',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Salte sobre uma caixa ou plataforma sólida estendendo totalmente os quadris ao topo.',
        tips: 'Amorteça a descida flexionando levemente os joelhos.'
      },
      {
        id: 'ca_cardio_3',
        name: 'Salto Alternado na Caixa (Box Skip)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Suba e desça a caixa alternando as pernas de forma explosiva.',
        tips: 'Ótima queima de gordura e fortalecimento do quadríceps.'
      },
      {
        id: 'ca_cardio_4',
        name: 'Salto de Profundidade no Degrau (Depth Jump Leap)',
        series: '4 séries x 10 saltos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Dê um passo para fora de um degrau e ao tocar o solo salte explosivamente para cima.',
        tips: 'Desenvolve potência reativa e agilidade cardiovascular.'
      }
    ]
  }
};

const REALISTIC_DAYS_MAPPING: Record<number, string[]> = {
  1: ['Segunda-feira'],
  2: ['Terça-feira', 'Quinta-feira'],
  3: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
  4: ['Segunda-feira', 'Terça-feira', 'Quinta-feira', 'Sexta-feira'],
  5: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
  6: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  7: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']
};

export const getAlternativesForExercise = (
  exercise: Exercise,
  rawLocation: Location,
  rawObjective: Objective
): Exercise[] => {
  const location: 'academia' | 'casa' = 
    (rawLocation === 'casa_calistenia') ? 'casa' : 'academia';
  const pool = EXERCISE_POOL[location];
  const type = exercise.animationType;
  const categoryExercises = pool[type] || [];
  
  const objective: 'emagrecer' | 'ganhar_massa' | 'condicionamento' = 
    (rawObjective === 'emagrecer' || rawObjective === 'definicao') ? 'emagrecer' : 
    (rawObjective === 'ganhar_massa' || rawObjective === 'ganhar_forca') ? 'ganhar_massa' : 'condicionamento';

  return categoryExercises
    .filter(ex => ex.id !== exercise.id)
    .map(ex => {
      const copy = { ...ex };
      if (objective === 'emagrecer') {
        copy.series = copy.series.replace('10 repetições', '15 repetições')
                                .replace('12 repetições', '15 repetições')
                                .replace('4 séries', '4 séries rápidas')
                                .replace('3 séries', '3 séries dinâmicas');
        copy.rest = Math.max(30, copy.rest - 15);
      } else if (objective === 'ganhar_massa') {
        if (!copy.series.includes('falha') && !copy.series.includes('Falha')) {
          copy.series = copy.series + ' (Foco na fase excêntrica/descida lenta)';
        }
      } else if (rawObjective === 'ganhar_forca') {
        copy.series = '5 séries x 5 repetições (Carga progressiva máxima)';
        copy.rest = Math.max(90, copy.rest + 30);
      }
      return copy;
    });
};

export const getWorkoutForUser = (
  rawObjective: Objective,
  rawLocation: Location,
  daysPerWeek: number = 3,
  durationCategory: 'rapido' | 'moderado' | 'completo' = 'moderado',
  experienceLevel: 'iniciante' | 'intermediario' | 'avancado' = 'intermediario'
): DayWorkout[] => {
  const objective: 'emagrecer' | 'ganhar_massa' | 'condicionamento' = 
    (rawObjective === 'emagrecer' || rawObjective === 'definicao') ? 'emagrecer' : 
    (rawObjective === 'ganhar_massa' || rawObjective === 'ganhar_forca') ? 'ganhar_massa' : 'condicionamento';

  const location: 'academia' | 'casa' = 
    (rawLocation === 'casa_calistenia') ? 'casa' : 'academia';

  const pool = EXERCISE_POOL[location];
  const workouts: DayWorkout[] = [];

  const validDays = Math.max(1, Math.min(7, daysPerWeek));
  const scheduledDays = REALISTIC_DAYS_MAPPING[validDays] || REALISTIC_DAYS_MAPPING[3];

  // Configure target number of main exercises (excluding warm-up)
  let mainExercisesCount = 5; // Default moderado
  if (durationCategory === 'rapido') {
    mainExercisesCount = 3;
  } else if (durationCategory === 'completo') {
    mainExercisesCount = 7;
  }

  // Pre-defined high-quality warm-ups
  const warmUps = {
    academia: {
      id: 'warmup_ac',
      name: 'Aquecimento Geral na Esteira + Mobilidade Dinâmica',
      series: '5 a 8 minutos ritmo leve',
      rest: 0,
      animationType: 'cardio' as const,
      description: 'Prepare seu sistema cardiovascular na esteira e faça rotações de manguito/quadril leves para lubrificar as articulações.',
      tips: 'Não canse na esteira; o objetivo é apenas aquecer o corpo.'
    },
    casa: {
      id: 'warmup_ca',
      name: 'Mobilidade Geral de Solo + Polichinelos Dinâmicos',
      series: '5 minutos de ativação muscular',
      rest: 0,
      animationType: 'cardio' as const,
      description: 'Faça movimentos rotacionais de ombros, pescoço, quadril e execute uma série curta de polichinelos leves para aumentar a pulsação.',
      tips: 'Excelente preparação física para evitar lesões em casa.'
    }
  };

  const dayWarmUp = warmUps[location];

  for (let i = 0; i < validDays; i++) {
    const dayName = scheduledDays[i] || `Dia ${i + 1}`;
    let muscleGroup = '';
    let exercises: Exercise[] = [];

    // Helper functions to retrieve from pools safely
    const getPush = (idx: number) => pool.push[idx % pool.push.length];
    const getPull = (idx: number) => pool.pull[idx % pool.pull.length];
    const getLegs = (idx: number) => pool.legs[idx % pool.legs.length];
    const getCore = (idx: number) => pool.core[idx % pool.core.length];
    const getCardio = (idx: number) => pool.cardio[idx % pool.cardio.length];

    // Build splits based on number of days per week
    if (validDays === 1) {
      muscleGroup = 'Treino Integrado Corpo Todo (Full-Body Completo)';
      // Mix of all groups
      exercises = [
        getLegs(0), // Agachamento/Leg
        getPush(0), // Supino
        getPull(0), // Puxada/Remada
        getLegs(2), // Flexora (Isquiotibiais)
        getPush(6), // Elevação Lateral (Ombros)
        getPull(2), // Bíceps
        getCore(0), // Abdominal
        getCardio(0) // Cardio
      ];
    } else if (validDays === 2) {
      if (i === 0) {
        muscleGroup = 'Ficha A: Membros Superiores Completos';
        exercises = [
          getPush(0), // Supino reto
          getPull(0), // Puxada
          getPush(4), // Supino inclinado
          getPull(1), // Remada baixa
          getPush(6), // Elevação lateral
          getPush(2), // Tríceps
          getPull(2), // Bíceps
          getCore(1)  // Prancha
        ];
      } else {
        muscleGroup = 'Ficha B: Membros Inferiores & Core Abdominal';
        exercises = [
          getLegs(0), // Leg press
          getLegs(4), // Agachamento guiado
          getLegs(2), // Mesa flexora
          getLegs(7), // Stiff
          getLegs(3), // Panturrilha
          getCore(0), // Abdominal supra
          getCore(2), // Abdominal infra
          getCardio(1) // Cardio bike
        ];
      }
    } else if (validDays === 3) {
      if (i === 0) {
        muscleGroup = 'Ficha A: Empurrar (Peito, Ombros & Tríceps)';
        exercises = [
          getPush(0), // Supino reto
          getPush(4), // Supino inclinado
          getPush(1), // Desenvolvimento
          getPush(6), // Elevação lateral
          getPush(2), // Tríceps polia
          getPush(5), // Tríceps testa
          getCore(0)  // Abdominal supra
        ];
      } else if (i === 1) {
        muscleGroup = 'Ficha B: Puxar (Costas, Deltoide Traseiro & Bíceps)';
        exercises = [
          getPull(0), // Puxada aberta
          getPull(3), // Remada curvada
          getPull(1), // Remada baixa
          getPull(6), // Crucifixo invertido
          getPull(2), // Rosca alternada
          getPull(8), // Rosca martelo
          getCore(1)  // Prancha
        ];
      } else {
        muscleGroup = 'Ficha C: Pernas Completas, Panturrilhas & Cardio';
        exercises = [
          getLegs(0), // Leg press
          getLegs(1), // Extensora
          getLegs(2), // Mesa flexora
          getLegs(7), // Stiff
          getLegs(3), // Panturrilha
          getCardio(0), // Cardio esteira
          getCore(2)  // Abdominal infra
        ];
      }
    } else if (validDays === 4) {
      if (i === 0) {
        muscleGroup = 'Ficha A: Peito, Tríceps & Abdômen';
        exercises = [
          getPush(0), // Supino reto
          getPush(4), // Supino inclinado
          getPush(3), // Crossover
          getPush(2), // Tríceps polia
          getPush(5), // Tríceps testa
          getCore(0)  // Abdominal supra
        ];
      } else if (i === 1) {
        muscleGroup = 'Ficha B: Pernas Completas (Foco Quadríceps & Panturrilha)';
        exercises = [
          getLegs(0), // Leg press
          getLegs(4), // Agachamento Smith
          getLegs(1), // Extensora
          getLegs(8), // Afundo
          getLegs(3), // Panturrilha sentado
          getCardio(1) // Cardio bike
        ];
      } else if (i === 2) {
        muscleGroup = 'Ficha C: Costas, Bíceps & Lombar';
        exercises = [
          getPull(0), // Puxada aberta
          getPull(1), // Remada baixa
          getPull(4), // Puxada triângulo
          getPull(2), // Rosca alternada
          getPull(5), // Rosca concentrada
          getPull(9)  // Encolhimento trapézio
        ];
      } else {
        muscleGroup = 'Ficha D: Ombros, Posteriores de Coxa & Core';
        exercises = [
          getPush(1), // Desenvolvimento
          getPush(6), // Elevação lateral
          getPull(6), // Posterior de ombro
          getLegs(2), // Flexora
          getLegs(7), // Stiff
          getCore(1), // Prancha
          getCore(2)  // Abdominal infra
        ];
      }
    } else if (validDays === 5) {
      if (i === 0) {
        muscleGroup = 'Ficha A: Peito, Ombros (Frontal) & Abdômen';
        exercises = [
          getPush(0), getPush(4), getPush(3), getPush(10), getCore(0), getCore(2)
        ];
      } else if (i === 1) {
        muscleGroup = 'Ficha B: Costas, Ombros (Posterior) & Lombar';
        exercises = [
          getPull(0), getPull(3), getPull(1), getPull(6), getPull(7), getCore(1)
        ];
      } else if (i === 2) {
        muscleGroup = 'Ficha C: Pernas (Foco Anterior / Quadríceps) & Panturrilha';
        exercises = [
          getLegs(0), getLegs(4), getLegs(1), getLegs(8), getLegs(3), getCardio(0)
        ];
      } else if (i === 3) {
        muscleGroup = 'Ficha D: Ombros (Lateral) & Braços (Bíceps & Tríceps)';
        exercises = [
          getPush(1), getPush(6), getPush(2), getPull(2), getPush(5), getPull(8)
        ];
      } else {
        muscleGroup = 'Ficha E: Pernas (Foco Posterior & Glúteos) & Core';
        exercises = [
          getLegs(2), getLegs(7), getLegs(5), getLegs(9), getLegs(3), getCore(3)
        ];
      }
    } else if (validDays === 6) {
      // ABC-PPL (Push/Pull/Legs twice alternating)
      if (i === 0 || i === 3) {
        muscleGroup = `Ficha ${i === 0 ? 'A' : 'D'}: Empurrar (Push) - Variação ${i === 0 ? '1' : '2'}`;
        exercises = i === 0 
          ? [getPush(0), getPush(4), getPush(1), getPush(6), getPush(2), getCore(0)]
          : [getPush(7), getPush(8), getPush(1), getPush(6), getPush(5), getCore(1)];
      } else if (i === 1 || i === 4) {
        muscleGroup = `Ficha ${i === 1 ? 'B' : 'E'}: Puxar (Pull) - Variação ${i === 1 ? '1' : '2'}`;
        exercises = i === 1
          ? [getPull(0), getPull(1), getPull(2), getPull(6), getPull(9), getCore(2)]
          : [getPull(3), getPull(4), getPull(5), getPull(7), getPull(8), getCardio(0)];
      } else {
        muscleGroup = `Ficha ${i === 2 ? 'C' : 'F'}: Pernas Completas - Variação ${i === 2 ? '1' : '2'}`;
        exercises = i === 2
          ? [getLegs(0), getLegs(1), getLegs(2), getLegs(3), getLegs(8), getCardio(1)]
          : [getLegs(4), getLegs(7), getLegs(5), getLegs(9), getLegs(3), getCore(3)];
      }
    } else { // 7 Days (Professional athlete routine)
      if (i === 0) {
        muscleGroup = 'Ficha A: Peito & Deltoide Anterior';
        exercises = [getPush(0), getPush(4), getPush(3), getPush(10), getCore(0)];
      } else if (i === 1) {
        muscleGroup = 'Ficha B: Costas, Trapézio & Lombar';
        exercises = [getPull(0), getPull(3), getPull(1), getPull(9), getCore(1)];
      } else if (i === 2) {
        muscleGroup = 'Ficha C: Membros Inferiores (Quadríceps)';
        exercises = [getLegs(0), getLegs(4), getLegs(1), getLegs(8), getLegs(3)];
      } else if (i === 3) {
        muscleGroup = 'Ficha D: Deltoide Lateral, Traseiro & Core';
        exercises = [getPush(1), getPush(6), getPull(6), getCore(3), getCore(2)];
      } else if (i === 4) {
        muscleGroup = 'Ficha E: Braços Completos (Super-séries Bíceps/Tríceps)';
        exercises = [getPush(2), getPull(2), getPush(5), getPull(8), getCardio(2)];
      } else if (i === 5) {
        muscleGroup = 'Ficha F: Membros Inferiores (Posteriores & Glúteo)';
        exercises = [getLegs(2), getLegs(7), getLegs(5), getLegs(9), getLegs(3)];
      } else {
        muscleGroup = 'Ficha G: Alongamentos, Mobilidade & Treino Regenerativo';
        exercises = [
          {
            id: 'regen_1',
            name: 'Alongamento Completo de Cadeia Posterior',
            series: '3 séries x 45 segundos sustentados',
            rest: 30,
            animationType: 'core' as const,
            description: 'Sente-se no colchonete e incline o tronco para frente tentando segurar as pontas dos pés com joelhos esticados.',
            tips: 'Solte o ar de forma calma, permitindo que a gravidade relaxe os músculos posteriores.'
          },
          {
            id: 'regen_2',
            name: 'Caminhada Regenerativa Leve',
            series: '15 a 20 minutos ritmo calmo',
            rest: 0,
            animationType: 'cardio' as const,
            description: 'Caminhada contínua para circulação ativa e oxigenação muscular, acelerando a eliminação de metabólitos.',
            tips: 'Mantenha um ritmo tranquilo em que você consiga respirar somente pelo nariz.'
          }
        ];
      }
    }

    // Slice or adjust exercises array to match main exercises count requested by durationCategory
    // Ensure we do not completely erase key structures if we have too few exercises in custom routines
    if (validDays !== 7) {
      exercises = exercises.slice(0, mainExercisesCount);
    }

    // Personalize repetitions, series, rest and experience-level tips
    exercises = exercises.map(ex => {
      const copy = { ...ex };
      
      // Objective modifications
      if (objective === 'emagrecer') {
        // High reps, short rest
        copy.series = copy.series.replace('10 repetições', '15 repetições')
                                .replace('12 repetições', '15 repetições')
                                .replace('8 repetições', '12 repetições')
                                .replace('4 séries', '4 séries rápidas')
                                .replace('3 séries', '3 séries dinâmicas');
        copy.rest = Math.max(30, copy.rest - 15);
        copy.tips = copy.tips + ' [Foco Cardio: execute em velocidade moderada e evite descansar mais que o recomendado]';
      } else if (objective === 'ganhar_massa') {
        // Standard hypertrophic cadenced cues
        if (!copy.series.includes('falha') && !copy.series.includes('Falha')) {
          copy.series = copy.series + ' (Foco na descida controlada)';
        }
        copy.tips = copy.tips + ' [Foco Hipertrofia: controle a fase negativa descendo o peso em 3 segundos]';
      } else if (rawObjective === 'ganhar_forca') {
        // Heavy sets, low reps, high rest
        copy.series = '5 séries x 5 repetições (Carga Progressiva)';
        copy.rest = Math.max(90, copy.rest + 30);
        copy.tips = copy.tips + ' [Foco Força: utilize cargas desafiadoras mantendo a técnica perfeita, descanse bem]';
      }

      // Experience level modifications
      if (experienceLevel === 'iniciante') {
        copy.tips = '🔰 Iniciante: Foco total na postura perfeita do movimento, sem exagerar nas cargas. ' + copy.tips;
        // Slightly lower work volume for raw beginners
        if (copy.series.startsWith('5 séries')) copy.series = copy.series.replace('5 séries', '3 séries');
        if (copy.series.startsWith('4 séries')) copy.series = copy.series.replace('4 séries', '3 séries');
      } else if (experienceLevel === 'intermediario') {
        copy.tips = '⚡ Intermediário: Busque a progressão de carga gradual mantendo a excelente cadência. ' + copy.tips;
      } else if (experienceLevel === 'avancado') {
        copy.tips = '🔥 Avançado: Intensidade máxima! Execute as últimas repetições próximo à falha muscular com segurança. ' + copy.tips;
        // Slightly higher volume
        if (copy.series.startsWith('3 séries')) copy.series = copy.series.replace('3 séries', '4 séries');
      }

      return copy;
    });

    // Always append the warm-up exercise at the top (unless it's the regenerativo day)
    if (dayName !== 'Domingo' && muscleGroup !== 'Ficha G: Alongamentos, Mobilidade & Treino Regenerativo') {
      exercises.unshift(dayWarmUp);
    }

    workouts.push({
      dayName: dayName,
      muscleGroup: muscleGroup,
      exercises: exercises
    });
  }

  return workouts;
};
