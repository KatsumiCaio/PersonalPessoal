import { Objective, Location, DayWorkout, Exercise } from '../types';

// Core pool of exercises organized by equipment environment and biomechanical movement pattern
const EXERCISE_POOL = {
  academia: {
    push: [
      {
        id: 'ac_push_1',
        name: 'Supino Reto com Barra',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'push' as const,
        description: 'Deitado no banco reto, empurre a barra estendendo os cotovelos sem tirar as escápulas do banco.',
        tips: 'Mantenha os calcanhares firmes no chão e contraia o abdômen para estabilidade.'
      },
      {
        id: 'ac_push_2',
        name: 'Desenvolvimento com Halteres',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'Sentado com apoio nas costas, empurre os halteres acima da cabeça até quase estender os braços.',
        tips: 'Não curve excessivamente a lombar ao erguer o peso.'
      },
      {
        id: 'ac_push_3',
        name: 'Tríceps Polia com Corda',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Segurando a corda, estenda completamente os cotovelos para baixo, abrindo as pontas da corda no final.',
        tips: 'Mantenha os cotovelos colados ao corpo o tempo todo.'
      },
      {
        id: 'ac_push_4',
        name: 'Crucifixo na Polia (Crossover)',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Aproxime as mãos à frente do peito em um arco, mantendo uma leve flexão de cotovelo.',
        tips: 'Aperte o peitoral por 1 segundo no ponto máximo de contração.'
      },
      {
        id: 'ac_push_5',
        name: 'Supino Inclinado com Halteres',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'push' as const,
        description: 'No banco inclinado a 30 graus, empurre os halteres para cima de forma coordenada.',
        tips: 'Foque na parte superior do peito para ombros preenchidos.'
      },
      {
        id: 'ac_push_6',
        name: 'Tríceps Testa com Barra W',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado no banco, desça a barra em direção à testa flexionando apenas os cotovelos.',
        tips: 'Mantenha os cotovelos apontados para o teto e perfeitamente paralelos.'
      },
      {
        id: 'ac_push_7',
        name: 'Elevação Lateral com Halteres',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Em pé, erga os braços lateralmente até a altura dos ombros, cotovelos semi-flexionados.',
        tips: 'Conduza o movimento com os cotovelos, mantendo os trapézios relaxados.'
      },
      {
        id: 'ac_push_8',
        name: 'Crucifixo Inclinado com Halteres',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'No banco inclinado, abra os braços segurando os halteres em movimento de arco até alongar o peitoral.',
        tips: 'Mantenha uma flexão constante e leve nos cotovelos para poupar a articulação.'
      },
      {
        id: 'ac_push_9',
        name: 'Desenvolvimento Arnold com Halteres',
        series: '3 séries x 10 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'Desenvolvimento de ombros iniciando com rotação de punho de dentro para fora na subida.',
        tips: 'Excelente exercício completo para deltoide anterior e lateral.'
      },
      {
        id: 'ac_push_10',
        name: 'Tríceps Francês Unilateral na Polia',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'De costas para a polia, segure o puxador acima da cabeça e estenda o braço para o teto.',
        tips: 'Mantém o bíceps colado na orelha para isolar a porção longa do tríceps.'
      },
      {
        id: 'ac_push_11',
        name: 'Elevação Frontal com Halteres (Pegada Neutra)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Erga os halteres à frente alternadamente até a linha dos olhos, com pegada de martelo.',
        tips: 'Foco na porção anterior do deltoide.'
      }
    ],
    pull: [
      {
        id: 'ac_pull_1',
        name: 'Puxada Aberta no Pulley',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Incline o tronco levemente para trás e puxe a barra em direção à clavícula conduzindo com os cotovelos.',
        tips: 'Pense em puxar com as costas, e não apenas puxar com a força dos braços.'
      },
      {
        id: 'ac_pull_2',
        name: 'Remada Baixa Sentado (Triângulo)',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'Segure o puxador triângulo, puxe-o até o abdômen contraindo intensamente as escápulas.',
        tips: 'Mantenha a postura perfeitamente ereta e evite balançar demais o tronco.'
      },
      {
        id: 'ac_pull_3',
        name: 'Rosca Alternada com Halteres',
        series: '3 séries x 10 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Eleve o halter flexionando o cotovelo e gire o punho para fora (supinação) na subida.',
        tips: 'Evite usar o impulso dos ombros ou balançar as costas para roubar.'
      },
      {
        id: 'ac_pull_4',
        name: 'Remada Curvada com Barra (Pegada Pronada)',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Inclinado para a frente com a coluna ereta, puxe a barra em direção ao umbigo espremendo as costas.',
        tips: 'Estabilize bem a lombar flexionando levemente os joelhos.'
      },
      {
        id: 'ac_pull_5',
        name: 'Puxada Fechada com Triângulo',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'No pulley com o puxador triângulo, puxe em direção ao peitoral inferior trazendo os cotovelos rente ao corpo.',
        tips: 'Sinta alongar bem as costas na subida controlada.'
      },
      {
        id: 'ac_pull_6',
        name: 'Rosca Concentrada Unilateral',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Sentado, apoie o cotovelo na parte interna da coxa e flexione o braço trazendo o halter de forma isolada.',
        tips: 'Foco exclusivo na contração máxima (pico de contração) do bíceps.'
      },
      {
        id: 'ac_pull_7',
        name: 'Crucifixo Invertido com Halteres (Posterior de Ombros)',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Incline o tronco para frente a 45 graus e abra os halteres lateralmente focando na parte traseira dos ombros.',
        tips: 'Mantenha as escápulas abertas no início e feche no final do movimento.'
      },
      {
        id: 'ac_pull_8',
        name: 'Remada Cavalinho na Máquina ou Barra T',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Segurando a barra T, puxe em direção ao peito com o tronco inclinado, contraindo as costas.',
        tips: 'Excelente construtor de espessura de costas.'
      },
      {
        id: 'ac_pull_9',
        name: 'Rosca Martelo com Halteres',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Eleve os halteres paralelamente com a pegada neutra (palmas viradas uma para a outra).',
        tips: 'Excelente exercício para braquiorradial (antebraço) e braquial.'
      },
      {
        id: 'ac_pull_10',
        name: 'Encolhimento com Halteres (Trapézio)',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Em pé, segurando halteres pesados, eleve os ombros em direção às orelhas e sustente por 1s.',
        tips: 'Não faça movimentos circulares com os ombros para proteger as articulações.'
      }
    ],
    legs: [
      {
        id: 'ac_legs_1',
        name: 'Leg Press 45º Tradicional',
        series: '4 séries x 12 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Apoie os pés na plataforma na largura dos ombros, destrave o aparelho e dobre os joelhos até 90 graus.',
        tips: 'Nunca estenda totalmente os joelhos no topo do movimento para proteger a patela.'
      },
      {
        id: 'ac_legs_2',
        name: 'Cadeira Extensora (Quadríceps)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Sentado no aparelho, estenda os joelhos sustentando o peso por 1 segundo no topo de forma isométrica.',
        tips: 'Mantenha o quadril bem colado no banco usando as travas laterais.'
      },
      {
        id: 'ac_legs_3',
        name: 'Mesa Flexora (Posteriores de Coxa)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Deitado de bruços, flexione as pernas trazendo o rolo até a linha dos glúteos e controle a volta.',
        tips: 'Controle o movimento de retorno (fase excêntrica) de forma lenta e cadenciada.'
      },
      {
        id: 'ac_legs_4',
        name: 'Panturrilha Gêmeos Sentado',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Apoie as pontas dos pés na plataforma da máquina e realize a flexão plantar máxima para panturrilhas densas.',
        tips: 'Alongue completamente na descida e segure 1 segundo no topo com contração máxima.'
      },
      {
        id: 'ac_legs_5',
        name: 'Agachamento Guiado (Smith Machine)',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Sob a barra guiada, posicione os pés levemente à frente e agache de forma coordenada mantendo a coluna ereta.',
        tips: 'Mantenha os joelhos alinhados com a ponta dos pés para evitar lesões.'
      },
      {
        id: 'ac_legs_6',
        name: 'Cadeira Flexora Sentado',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Sentado, empurre o rolo de apoio para baixo flexionando os joelhos para contrair os isquiotibiais.',
        tips: 'Mantenha as costas totalmente apoiadas no encosto para maior torque.'
      },
      {
        id: 'ac_legs_7',
        name: 'Agachamento Livre com Barra Olímpica',
        series: '4 séries x 8 repetições',
        rest: 120,
        animationType: 'legs' as const,
        description: 'Apoie a barra no trapézio, afaste os pés e agache empurrando os quadris para trás.',
        tips: 'Exercício rei dos membros inferiores. Contraia muito o core durante a subida.'
      },
      {
        id: 'ac_legs_8',
        name: 'Stiff com Halteres (Foco Isquiotibiais & Glúteo)',
        series: '4 séries x 10 repetições',
        rest: 75,
        animationType: 'legs' as const,
        description: 'Em pé, desça os halteres rente às pernas, flexionando apenas os quadris e mantendo a coluna alinhada.',
        tips: 'Mantenha os joelhos quase esticados (semi-flexão rígida) para alongar ao máximo o posterior.'
      },
      {
        id: 'ac_legs_9',
        name: 'Afundo com Halteres (Passada Estática)',
        series: '3 séries x 12 repetições (cada perna)',
        rest: 75,
        animationType: 'legs' as const,
        description: 'Com um halter em cada mão, posicione um pé à frente e o outro atrás, agachando verticalmente.',
        tips: 'O joelho de trás deve quase tocar o solo para amplitude excelente.'
      },
      {
        id: 'ac_legs_10',
        name: 'Cadeira Abdutora (Glúteo Médio)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Sentado na máquina, empurre os apoios para fora afastando as pernas e contraindo as laterais do glúteo.',
        tips: 'Incline levemente o tronco para a frente para isolar mais os glúteos.'
      },
      {
        id: 'ac_legs_11',
        name: 'Cadeira Adutora (Parte Interna da Coxa)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Feche as pernas contra a resistência da máquina, focando no adutor da coxa.',
        tips: 'Controle o retorno devagar para evitar estalos.'
      }
    ],
    core: [
      {
        id: 'ac_core_1',
        name: 'Abdominal Supra na Prancha Inclinada',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Prenda os pés no apoio e flexione o abdômen erguendo as costas em direção aos joelhos.',
        tips: 'Expulse todo o ar dos pulmões no topo para contração máxima do reto abdominal.'
      },
      {
        id: 'ac_core_2',
        name: 'Prancha Abdominal Estática de Solo',
        series: '4 séries x 45 segundos',
        rest: 45,
        animationType: 'core' as const,
        description: 'Apoie os cotovelos e pontas dos pés mantendo o corpo reto e o core totalmente engajado.',
        tips: 'Mantenha os glúteos e abdômen contraídos para poupar a região lombar.'
      },
      {
        id: 'ac_core_3',
        name: 'Abdominal Infra na Paralela ou Solo',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Eleve as pernas juntas mantendo o abdômen inferior sob tensão constante.',
        tips: 'Tente levantar o quadril levemente no topo para maior ativação das fibras inferiores.'
      },
      {
        id: 'ac_core_4',
        name: 'Abdominal Oblíquo na Polia (Woodchopper)',
        series: '3 séries x 15 repetições (cada lado)',
        rest: 45,
        animationType: 'core' as const,
        description: 'Na polia média/alta, puxe o cabo em diagonal cruzando o corpo em rotação controlada de tronco.',
        tips: 'Excelente para treinar o abdômen funcional e oblíquos.'
      },
      {
        id: 'ac_core_5',
        name: 'Prancha Lateral Estática',
        series: '3 séries x 30 segundos (cada lado)',
        rest: 45,
        animationType: 'core' as const,
        description: 'Apoie-se em um cotovelo lateralmente, mantendo o quadril elevado e a coluna alinhada.',
        tips: 'Não deixe o quadril ceder em direção ao solo.'
      }
    ],
    cardio: [
      {
        id: 'ac_cardio_1',
        name: 'Esteira Intervalada HIIT',
        series: '15 a 20 minutos (1 min corrida rápida / 1 min caminhada)',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Alterne a velocidade para elevar e reduzir a frequência cardíaca ciclicamente acelerando o metabolismo.',
        tips: 'Mantenha postura ereta e respiração profunda.'
      },
      {
        id: 'ac_cardio_2',
        name: 'Bicicleta Ergométrica Recumbente ou Vertical',
        series: '20 minutos em ritmo moderado',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Pedale de forma constante, mantendo uma frequência moderada para saúde cardiovascular e queima calórica.',
        tips: 'Ajuste a altura do banco para que o joelho fique apenas levemente flexionado no ponto mais baixo.'
      },
      {
        id: 'ac_cardio_3',
        name: 'Elíptico / Transport de Baixo Impacto',
        series: '15 minutos intensidade constante',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Exercício de baixo impacto nas articulações que trabalha membros superiores e inferiores sincronizadamente.',
        tips: 'Mantenha o abdômen firme e empurre/puxe as manoplas ativamente.'
      },
      {
        id: 'ac_cardio_4',
        name: 'Escada Ergométrica (Climber)',
        series: '10 minutos em ritmo constante',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Suba os degraus da máquina simulando uma subida infinita de escadaria.',
        tips: 'Incrível ativador de glúteos e altíssimo gasto calórico.'
      }
    ]
  },
  casa: {
    push: [
      {
        id: 'ca_push_1',
        name: 'Flexão de Braço (Push-Ups) Clássica',
        series: '4 séries x Repetições máximas',
        rest: 90,
        animationType: 'push' as const,
        description: 'Deite de bruços, apoie as mãos além da largura dos ombros e empurre o corpo mantendo-o firme.',
        tips: 'Caso esteja muito difícil, apoie os joelhos no chão de forma adaptada.'
      },
      {
        id: 'ca_push_2',
        name: 'Tríceps Banco (Dips)',
        series: '4 séries x 12 a 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Apoie as mãos na beirada de uma cadeira estável ou sofá, estenda as pernas à frente e flexione os cotovelos.',
        tips: 'Mantenha as costas raspando bem próximo da borda na descida para isolar o tríceps.'
      },
      {
        id: 'ca_push_3',
        name: 'Flexão Declinada (Pés no Sofá)',
        series: '3 séries x Repetições máximas',
        rest: 90,
        animationType: 'push' as const,
        description: 'Coloque os pés em cima de um banco ou sofá e as mãos no chão para focar na parte superior do peito.',
        tips: 'Cuidado para não relaxar o quadril caindo a lombar.'
      },
      {
        id: 'ca_push_4',
        name: 'Flexão Diamante (Foco em Tríceps)',
        series: '3 séries x Repetições máximas',
        rest: 60,
        animationType: 'push' as const,
        description: 'Aproxime as mãos no chão formando um losango com os polegares e indicadores.',
        tips: 'Excelente ativador de tríceps e peitoral interno em casa.'
      },
      {
        id: 'ca_push_5',
        name: 'Flexão Inclinada (Mãos no Sofá)',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Mãos apoiadas no sofá e pés no chão, empurre o corpo mantendo o alinhamento corporal.',
        tips: 'Excelente variação leve para focar na porção inferior do peitoral.'
      },
      {
        id: 'ca_push_6',
        name: 'Desenvolvimento de Ombros (Garrafas de Água)',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Sentado ou em pé, empurre garrafas ou galões de água acima da cabeça.',
        tips: 'Mantenha os ombros para trás e a coluna ereta.'
      },
      {
        id: 'ca_push_7',
        name: 'Elevação Lateral com Galão de Carga',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Segure galões leves nas mãos e levante os braços lateralmente até a linha dos ombros.',
        tips: 'Suba o peso controladamente sem usar balanço.'
      },
      {
        id: 'ca_push_8',
        name: 'Flexão Pike (Foco Deltoide/Ombros)',
        series: '3 séries x 8 a 10 repetições',
        rest: 75,
        animationType: 'push' as const,
        description: 'Eleve o quadril formando um V invertido com o corpo e flexione os cotovelos trazendo a cabeça rumo ao solo.',
        tips: 'Excelente substituto do desenvolvimento de ombros sem peso.'
      }
    ],
    pull: [
      {
        id: 'ca_pull_1',
        name: 'Puxada no Chão com Toalha',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'Deitado de barriga para baixo, segure uma toalha esticada e puxe-a contra o peito contraindo as costas.',
        tips: 'Faça força constante esticando a toalha para fora para ativar o dorsal (costas).'
      },
      {
        id: 'ca_pull_2',
        name: 'Remada Unilateral com Galão de Água',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Apoie um joelho e mão num sofá. Puxe um galão de água ou amaciante em direção ao quadril.',
        tips: 'Suba espremendo a asa das costas, descendo de forma controlada.'
      },
      {
        id: 'ca_pull_3',
        name: 'Superman (Extensor Lombar)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'pull' as const,
        description: 'Deitado de bruços, erga as coxas e o peito simultaneamente do solo por 1 segundo e segure.',
        tips: 'Não hiperestenda demais o pescoço, olhe sempre para o chão.'
      },
      {
        id: 'ca_pull_4',
        name: 'Rosca Direta Unilateral com Galão',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Segurando a alça de um galão de água, flexione o cotovelo trazendo a carga até o peito.',
        tips: 'Mantenha o cotovelo fixo na lateral do corpo.'
      },
      {
        id: 'ca_pull_5',
        name: 'Rosca Martelo Bilateral com Garrafas',
        series: '3 séries x 15 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Em pé, eleve garrafas de água com a pegada neutra para trabalhar os bíceps e antebraços.',
        tips: 'Execute o movimento completo de forma bem cadenciada.'
      },
      {
        id: 'ca_pull_6',
        name: 'Crucifixo Invertido Curvado (Garrafas)',
        series: '3 séries x 15 repetições',
        rest: 65,
        animationType: 'pull' as const,
        description: 'Incline o tronco para frente, quadris para trás, abra os braços segurando garrafas para deltoide posterior.',
        tips: 'Ótimo para manter a postura ereta e corrigir ombros caídos.'
      }
    ],
    legs: [
      {
        id: 'ca_legs_1',
        name: 'Agachamento Profundo (Air Squats)',
        series: '5 séries x 20 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Agache até o limite confortável rompendo a linha de 90 graus das pernas, mantendo calcanhares no chão.',
        tips: 'Empurre os joelhos para fora durante todo o movimento para segurança.'
      },
      {
        id: 'ca_legs_2',
        name: 'Agachamento Búlgaro (Pé na Cadeira)',
        series: '3 séries x 10 a 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Apoie o peito de um pé atrás em uma cadeira e dê um passo à frente. Agache de forma unilateral.',
        tips: 'Incrível exercício para quadríceps e glúteos de forma isolada!'
      },
      {
        id: 'ca_legs_3',
        name: 'Elevação Pélvica Unilateral (Solo)',
        series: '3 séries x 15 repetições (cada perna)',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Deitado de costas, levante uma perna esticada e empurre o quadril para o alto usando apenas a outra perna.',
        tips: 'Excelente para treinar posterior de coxa e glúteo sem pesos adicionais.'
      },
      {
        id: 'ca_legs_4',
        name: 'Panturrilha Unilateral no Degrau',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Na ponta de um degrau, faça flexão plantar completa em uma perna de cada vez.',
        tips: 'Desça o calcanhar o máximo possível para alongar bem a fáscia muscular.'
      },
      {
        id: 'ca_legs_5',
        name: 'Passada / Afundo Alternado',
        series: '4 séries x 20 passos totais',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Dê passos alternados à frente, descendo o quadril de forma estável.',
        tips: 'Mantenha o tronco perfeitamente erguido e abdômen contraído.'
      },
      {
        id: 'ca_legs_6',
        name: 'Agachamento Isométrico na Parede (Wall Sit)',
        series: '3 séries x 45 segundos',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Costas encostadas na parede, deslize até os joelhos ficarem a 90 graus e segure a posição.',
        tips: 'Mantenha os braços relaxados e calcanhares firmes.'
      },
      {
        id: 'ca_legs_7',
        name: 'Glúteo Coice de Quatro Apoios',
        series: '3 séries x 15 repetições (cada lado)',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Em quatro apoios no solo, empurre a sola do pé em direção ao teto contraindo o glúteo.',
        tips: 'Não curve a coluna lombar na subida.'
      }
    ],
    core: [
      {
        id: 'ca_core_1',
        name: 'Prancha Abdominal Estática de Solo',
        series: '4 séries x 40 segundos',
        rest: 30,
        animationType: 'core' as const,
        description: 'Apoie os antebraços e pontas dos pés mantendo o alinhamento retilíneo da coluna.',
        tips: 'Não deixe o quadril cair.'
      },
      {
        id: 'ca_core_2',
        name: 'Abdominal Bicicleta (Oblíquos)',
        series: '3 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado, traga o cotovelo oposto em direção ao joelho flexionado em movimentos alternados.',
        tips: 'Sinta a rotação do tronco e contração forte das laterais.'
      },
      {
        id: 'ca_core_3',
        name: 'Abdominal Remador Completo',
        series: '4 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deite-se completamente e suba sentando, abraçando os joelhos simultaneamente.',
        tips: 'Use os braços para auxiliar na subida controlada e segure 1s.'
      },
      {
        id: 'ca_core_4',
        name: 'Abdominal Russo (Russian Twists)',
        series: '3 séries x 20 rotações',
        rest: 45,
        animationType: 'core' as const,
        description: 'Sentado com joelhos semi-flexionados, incline o tronco para trás a 45º e gire as mãos de um lado para o outro.',
        tips: 'Erga os pés do chão para aumentar o desafio se for intermediário.'
      },
      {
        id: 'ca_core_5',
        name: 'Abdominal Elevação de Pernas (Infra)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado com as mãos sob o quadril, eleve as pernas esticadas até 90 graus e desça devagar.',
        tips: 'Mantenha as pernas sem tocar o solo no final para manter a tensão.'
      }
    ],
    cardio: [
      {
        id: 'ca_cardio_1',
        name: 'Burpees Completos (Corpo Todo)',
        series: '4 séries x 10 repetições',
        rest: 60,
        animationType: 'cardio' as const,
        description: 'Inicie de pé, agache rapidamente, jogue as pernas para trás fazendo flexão, suba e salte.',
        tips: 'O exercício de peso corporal definitivo para condicionamento e queima calórica.'
      },
      {
        id: 'ca_cardio_2',
        name: 'Polichinelos Rápidos de Cardio',
        series: '4 séries x 60 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Coordene braços e pernas fechando e abrindo em velocidade constante e ritmo alto.',
        tips: 'Mantenha ritmo constante e aterrissagem leve nas pontas dos pés.'
      },
      {
        id: 'ca_cardio_3',
        name: 'Corrida Estacionária (Skipping)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Simule corrida elevando os joelhos à altura do quadril sem sair do lugar.',
        tips: 'Mova os braços coordenadamente nas laterais ajudando no impulso.'
      },
      {
        id: 'ca_cardio_4',
        name: 'Mountain Climbers (Escalador Solo)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Na posição de flexão, traga os joelhos alternadamente rumo ao peito em velocidade.',
        tips: 'Trabalha aeróbico intenso e o abdômen ao mesmo tempo.'
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
