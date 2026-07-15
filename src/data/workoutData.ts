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
        tips: 'Foque na parte superior do peito.'
      },
      {
        id: 'ac_push_6',
        name: 'Tríceps Testa com Barra W',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Deitado no banco, desça a barra em direção à testa flexionando apenas os cotovelos.',
        tips: 'Mantenha os cotovelos apontados para o teto e paralelos.'
      },
      {
        id: 'ac_push_7',
        name: 'Elevação Lateral com Halteres',
        series: '4 séries x 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Em pé, erga os braços lateralmente até a altura dos ombros, cotovelos semi-flexionados.',
        tips: 'Conduza o movimento com os cotovelos, sem dar impulso.'
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
        tips: 'Pense em puxar com as costas, e não apenas com as mãos.'
      },
      {
        id: 'ac_pull_2',
        name: 'Remada Baixa Sentado',
        series: '4 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'Segure o puxador triângulo, puxe-o até o abdômen contraindo intensamente as escápulas.',
        tips: 'Mantenha a postura ereta e evite balançar demais o tronco.'
      },
      {
        id: 'ac_pull_3',
        name: 'Rosca Alternada com Halteres',
        series: '3 séries x 10 repetições (cada braço)',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Eleve o halter flexionando o cotovelo e gire o punho para fora (supinação) na subida.',
        tips: 'Evite usar o impulso dos ombros ou balançar as costas.'
      },
      {
        id: 'ac_pull_4',
        name: 'Remada Curvada com Barra',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'pull' as const,
        description: 'Inclinado para a frente com a coluna ereta, puxe a barra em direção ao umbigo.',
        tips: 'Estabilize bem a lombar flexionando levemente os joelhos.'
      },
      {
        id: 'ac_pull_5',
        name: 'Puxada Fechada (Triângulo)',
        series: '3 séries x 12 repetições',
        rest: 75,
        animationType: 'pull' as const,
        description: 'No pulley com o puxador triângulo, puxe em direção ao peitoral inferior.',
        tips: 'Sinta alongar bem as costas na subida controlada.'
      },
      {
        id: 'ac_pull_6',
        name: 'Rosca Concentrada Unilateral',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'pull' as const,
        description: 'Sentado, apoie o cotovelo na parte interna da coxa e flexione o braço trazendo o halter.',
        tips: 'Movimento isolado do bíceps, sem balanço.'
      }
    ],
    legs: [
      {
        id: 'ac_legs_1',
        name: 'Leg Press 45º',
        series: '4 séries x 12 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Apoie os pés na plataforma na largura dos ombros, destrave o aparelho e dobre os joelhos até 90 graus.',
        tips: 'Nunca estenda totalmente os joelhos no topo do movimento para proteger as articulações.'
      },
      {
        id: 'ac_legs_2',
        name: 'Cadeira Extensora',
        series: '4 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Sentado no aparelho, estenda os joelhos sustentando o peso por 1 segundo no topo.',
        tips: 'Mantenha o quadril bem colado no banco para não sobrecarregar a lombar.'
      },
      {
        id: 'ac_legs_3',
        name: 'Mesa Flexora',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Deitado de bruços, flexione as pernas trazendo o rolo até a linha dos glúteos.',
        tips: 'Controle o movimento de retorno (fase excêntrica) bem devagar.'
      },
      {
        id: 'ac_legs_4',
        name: 'Panturrilha Gêmeos Sentado',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'legs' as const,
        description: 'Apoie as pontas dos pés na plataforma e realize a flexão plantar máxima.',
        tips: 'Alongue completamente na descida e segure 1 segundo no topo.'
      },
      {
        id: 'ac_legs_5',
        name: 'Agachamento Smith / Guiado',
        series: '4 séries x 10 repetições',
        rest: 90,
        animationType: 'legs' as const,
        description: 'Sob a barra guiada, agache de forma estável mantendo os joelhos alinhados com os pés.',
        tips: 'Mantém o quadril alinhado e o peito para cima.'
      },
      {
        id: 'ac_legs_6',
        name: 'Cadeira Flexora Sentado',
        series: '3 séries x 12 repetições',
        rest: 60,
        animationType: 'legs' as const,
        description: 'Sentado, empurre o rolo de apoio para baixo flexionando os joelhos para contrair os isquiotibiais.',
        tips: 'Mantenha o quadril firme sem escorregar para a frente.'
      }
    ],
    core: [
      {
        id: 'ac_core_1',
        name: 'Abdominal Supra na Prancha',
        series: '4 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Prenda os pés e flexione o abdômen erguendo as costas em direção aos joelhos.',
        tips: 'Expulse todo o ar dos pulmões no pico do movimento.'
      },
      {
        id: 'ac_core_2',
        name: 'Prancha Abdominal Estática',
        series: '4 séries x 45 segundos',
        rest: 45,
        animationType: 'core' as const,
        description: 'Apoie os cotovelos e pontas dos pés mantendo o corpo retinho como uma tábua.',
        tips: 'Mantenha glúteos e abdômen contraídos para poupar a lombar.'
      },
      {
        id: 'ac_core_3',
        name: 'Abdominal Infra Solo',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado, eleve as pernas juntas até 90 graus e desça devagar sem encostar no chão.',
        tips: 'Se doer a lombar, coloque as mãos sob os glúteos.'
      }
    ],
    cardio: [
      {
        id: 'ac_cardio_1',
        name: 'Esteira Intervalada',
        series: '15 a 20 minutos (1 min corrida rápida / 1 min caminhada)',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Alterne a velocidade para elevar e reduzir a frequência cardíaca ciclicamente.',
        tips: 'Mantenha postura ereta e respiração profunda.'
      },
      {
        id: 'ac_cardio_2',
        name: 'Bicicleta Ergométrica',
        series: '20 minutos em ritmo moderado',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Pedale de forma constante, ajustando a carga para sentir resistência sem trancar o movimento.',
        tips: 'Ajuste a altura do banco para que o joelho fique levemente flexionado no ponto baixo.'
      },
      {
        id: 'ac_cardio_3',
        name: 'Elíptico / Transport',
        series: '15 minutos intensidade constante',
        rest: 0,
        animationType: 'cardio' as const,
        description: 'Exercício de baixo impacto que trabalha membros superiores e inferiores de forma sincronizada.',
        tips: 'Mantenha o abdômen firme e use os braços de apoio ativamente.'
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
        tips: 'Caso esteja difícil, apoie os joelhos no chão de forma adaptada.'
      },
      {
        id: 'ca_push_2',
        name: 'Tríceps Banco (Dips)',
        series: '4 séries x 12 a 15 repetições',
        rest: 60,
        animationType: 'push' as const,
        description: 'Apoie as mãos na beirada de uma cadeira estável ou sofá, estenda as pernas à frente e flexione os cotovelos.',
        tips: 'Mantenha as costas raspando bem próximo do sofá na descida.'
      },
      {
        id: 'ca_push_3',
        name: 'Flexão Declinada (Pés no Sofá)',
        series: '3 séries x Repetições máximas',
        rest: 90,
        animationType: 'push' as const,
        description: 'Coloque os pés em cima de um banco ou sofá e as mãos no chão para focar na parte superior do peito.',
        tips: 'Cuidado para não relaxar o quadril.'
      },
      {
        id: 'ca_push_4',
        name: 'Flexão Diamante (Tríceps & Peito)',
        series: '3 séries x Falha adaptada',
        rest: 60,
        animationType: 'push' as const,
        description: 'Aproxime as mãos no chão formando um losango com os polegares e indicadores.',
        tips: 'Excelente ativador de tríceps em casa.'
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
        description: 'Apoie um joelho e mão num sofá. Puxe um galão de água em direção ao quadril.',
        tips: 'Suba espremendo a asa das costas, descendo de forma controlada.'
      },
      {
        id: 'ca_pull_3',
        name: 'Superman (Extensor Lombar)',
        series: '3 séries x 15 repetições',
        rest: 45,
        animationType: 'pull' as const,
        description: 'Deitado de bruços, erga as coxas e o peito simultaneamente do solo por 1 segundo.',
        tips: 'Não hiperestenda demais o pescoço, olhe sempre para o chão.'
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
        tips: 'Empurre os joelhos para fora durante todo o movimento.'
      },
      {
        id: 'ca_legs_2',
        name: 'Agachamento Búlgaro (Pé na Cadeira)',
        series: '3 séries x 10 a 12 repetições (cada perna)',
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
        tips: 'Mantenha o tronco erguido.'
      }
    ],
    core: [
      {
        id: 'ca_core_1',
        name: 'Prancha Abdominal Estática',
        series: '4 séries x 40 segundos',
        rest: 30,
        animationType: 'core' as const,
        description: 'Apoie os antebraços e pontas dos pés mantendo o alinhamento da coluna.',
        tips: 'Não deixe o quadril cair.'
      },
      {
        id: 'ca_core_2',
        name: 'Abdominal Bicicleta',
        series: '3 séries x 20 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deitado, traga o cotovelo oposto em direção ao joelho flexionado em movimentos alternados.',
        tips: 'Sinta a rotação e contração dos oblíquos.'
      },
      {
        id: 'ca_core_3',
        name: 'Abdominal Remador Completo',
        series: '4 séries x 15 repetições',
        rest: 45,
        animationType: 'core' as const,
        description: 'Deite-se completamente e suba sentando, abraçando os joelhos simultaneamente.',
        tips: 'Use os braços para auxiliar na subida controlada.'
      }
    ],
    cardio: [
      {
        id: 'ca_cardio_1',
        name: 'Burpees Completos',
        series: '4 séries x 10 repetições',
        rest: 60,
        animationType: 'cardio' as const,
        description: 'Inicie de pé, agache, flexione o corpo até o chão, suba estendendo e dê um salto palmar.',
        tips: 'O exercício de peso corporal mais intenso para queima de gordura.'
      },
      {
        id: 'ca_cardio_2',
        name: 'Polichinelos Rápidos',
        series: '4 séries x 60 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Coordene braços e pernas fechando e abrindo em velocidade constante.',
        tips: 'Mantenha ritmo elevado e respiração constante.'
      },
      {
        id: 'ca_cardio_3',
        name: 'Corrida Estacionária (Skipping)',
        series: '4 séries x 45 segundos ativos',
        rest: 30,
        animationType: 'cardio' as const,
        description: 'Simule corrida elevando os joelhos à altura do quadril sem sair do lugar.',
        tips: 'Mova os braços coordenadamente nas laterais.'
      }
    ]
  }
};

const PORTUGUESE_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

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
  daysPerWeek: number = 3
): DayWorkout[] => {
  const objective: 'emagrecer' | 'ganhar_massa' | 'condicionamento' = 
    (rawObjective === 'emagrecer' || rawObjective === 'definicao') ? 'emagrecer' : 
    (rawObjective === 'ganhar_massa' || rawObjective === 'ganhar_forca') ? 'ganhar_massa' : 'condicionamento';

  const location: 'academia' | 'casa' = 
    (rawLocation === 'casa_calistenia') ? 'casa' : 'academia';

  const pool = EXERCISE_POOL[location];
  const workouts: DayWorkout[] = [];

  // Safely clamp daysPerWeek between 1 and 7
  const validDays = Math.max(1, Math.min(7, daysPerWeek));

  for (let i = 0; i < validDays; i++) {
    const dayName = PORTUGUESE_DAYS[i];
    let muscleGroup = '';
    let exercises: Exercise[] = [];

    // Helper functions to retrieve from the pool
    const getPush = (idx: number) => pool.push[idx % pool.push.length];
    const getPull = (idx: number) => pool.pull[idx % pool.pull.length];
    const getLegs = (idx: number) => pool.legs[idx % pool.legs.length];
    const getCore = (idx: number) => pool.core[idx % pool.core.length];
    const getCardio = (idx: number) => pool.cardio[idx % pool.cardio.length];

    // Build splits based on number of days per week and objective
    if (validDays === 1) {
      muscleGroup = 'Treino Integrado Corpo Todo (Full-Body)';
      exercises = [getLegs(0), getPush(0), getPull(0), getCore(0), getCardio(0)];
    } else if (validDays === 2) {
      if (i === 0) {
        muscleGroup = 'Membros Superiores (Upper Body)';
        exercises = [getPush(0), getPull(0), getPush(1), getPull(1), getCore(0)];
      } else {
        muscleGroup = 'Membros Inferiores & Core (Lower Body & Core)';
        exercises = [getLegs(0), getLegs(1), getLegs(2), getCore(1), getCardio(0)];
      }
    } else if (validDays === 3) {
      if (i === 0) {
        muscleGroup = 'Peito, Ombros & Tríceps (Empurrar / Push)';
        exercises = [getPush(0), getPush(4), getPush(1), getPush(2), getCore(0)];
      } else if (i === 1) {
        muscleGroup = 'Costas, Bíceps & Abdômen (Puxar / Pull)';
        exercises = [getPull(0), getPull(1), getPull(3), getPull(2), getCore(1)];
      } else {
        muscleGroup = 'Pernas Completas (Membros Inferiores / Legs)';
        exercises = [getLegs(0), getLegs(1), getLegs(2), getLegs(3), getCardio(0)];
      }
    } else if (validDays === 4) {
      if (i === 0) {
        muscleGroup = 'Peito & Tríceps (Foco Hipertrofia Peitoral)';
        exercises = [getPush(0), getPush(4), getPush(2), getPush(3), getCore(0)];
      } else if (i === 1) {
        muscleGroup = 'Costas & Bíceps (Foco Espessura & Densidade)';
        exercises = [getPull(0), getPull(1), getPull(2), getPull(5), getCore(1)];
      } else if (i === 2) {
        muscleGroup = 'Ombros, Trapézio & Abdômen (Deltoides)';
        exercises = [getPush(1), getPush(6), getPush(5), getCore(2), getCardio(0)];
      } else {
        muscleGroup = 'Membros Inferiores Completos (Pernas / Legs)';
        exercises = [getLegs(0), getLegs(1), getLegs(2), getLegs(3), getLegs(5)];
      }
    } else if (validDays === 5) {
      if (i === 0) {
        muscleGroup = 'Peito & Tríceps (Foco Lateral e Superior)';
        exercises = [getPush(0), getPush(4), getPush(2), getCore(0)];
      } else if (i === 1) {
        muscleGroup = 'Costas & Bíceps (Foco Largura)';
        exercises = [getPull(0), getPull(4), getPull(2), getCore(1)];
      } else if (i === 2) {
        muscleGroup = 'Pernas (Foco Coxas/Quadríceps)';
        exercises = [getLegs(0), getLegs(1), getLegs(4), getCardio(0)];
      } else if (i === 3) {
        muscleGroup = 'Ombros & Trapézio Completo';
        exercises = [getPush(1), getPush(6), getPush(5), getCore(2)];
      } else {
        muscleGroup = 'Posteriores de Coxa, Glúteos & Panturrilhas';
        exercises = [getLegs(2), getLegs(5), getLegs(3), getCardio(1)];
      }
    } else if (validDays === 6) {
      if (i === 0 || i === 3) {
        muscleGroup = `Push (Empurrar) - Variação ${i === 0 ? 'A' : 'B'}`;
        exercises = i === 0 
          ? [getPush(0), getPush(1), getPush(2), getCore(0)]
          : [getPush(4), getPush(6), getPush(3), getCore(1)];
      } else if (i === 1 || i === 4) {
        muscleGroup = `Pull (Puxar) - Variação ${i === 1 ? 'A' : 'B'}`;
        exercises = i === 1
          ? [getPull(0), getPull(1), getPull(2), getCore(2)]
          : [getPull(3), getPull(4), getPull(5), getCardio(0)];
      } else {
        muscleGroup = `Legs (Pernas Completas) - Variação ${i === 2 ? 'A' : 'B'}`;
        exercises = i === 2
          ? [getLegs(0), getLegs(1), getLegs(3), getCardio(1)]
          : [getLegs(4), getLegs(2), getLegs(5), getCore(0)];
      }
    } else { // 7 days
      if (i === 0) {
        muscleGroup = 'Push (Empurrar) - Peito, Ombro & Tríceps';
        exercises = [getPush(0), getPush(1), getPush(2), getCore(0)];
      } else if (i === 1) {
        muscleGroup = 'Pull (Puxar) - Costas, Bíceps & Abdômen';
        exercises = [getPull(0), getPull(1), getPull(2), getCore(1)];
      } else if (i === 2) {
        muscleGroup = 'Legs (Pernas) - Quadríceps & Panturrilha';
        exercises = [getLegs(0), getLegs(1), getLegs(3), getCardio(0)];
      } else if (i === 3) {
        muscleGroup = 'HIIT Resistência & Core Abdominal';
        exercises = [getCardio(0), getCardio(1), getCore(0), getCore(1), getCore(2)];
      } else if (i === 4) {
        muscleGroup = 'Membros Superiores Integrados';
        exercises = [getPush(4), getPull(3), getPush(6), getPull(4)];
      } else if (i === 5) {
        muscleGroup = 'Posteriores de Coxa & Glúteos';
        exercises = [getLegs(2), getLegs(5), getLegs(3), getCardio(2)];
      } else {
        muscleGroup = 'Mobilidade, Flexibilidade & Regenerativo';
        exercises = [
          {
            id: 'regen_1',
            name: 'Alongamento de Cadeia Posterior',
            series: '3 séries x 45 segundos',
            rest: 30,
            animationType: 'core' as const,
            description: 'Sente-se e tente tocar a ponta dos pés com as pernas esticadas, relaxando a respiração.',
            tips: 'Não force a dor, apenas sinta alongar suavemente.'
          },
          {
            id: 'regen_2',
            name: 'Caminhada Regenerativa Leve',
            series: '15 minutos ritmo calmo',
            rest: 0,
            animationType: 'cardio' as const,
            description: 'Caminhada contínua para circulação sanguínea e recuperação muscular.',
            tips: 'Ritmo para conseguir conversar normalmente.'
          }
        ];
      }
    }

    // Personalize repetitions, series titles or guidelines based on user's selected objective
    exercises = exercises.map(ex => {
      const copy = { ...ex };
      if (objective === 'emagrecer') {
        // Higher reps, slightly lower rest
        copy.series = copy.series.replace('10 repetições', '15 repetições')
                                .replace('12 repetições', '15 repetições')
                                .replace('4 séries', '4 séries rápidas')
                                .replace('3 séries', '3 séries dinâmicas');
        copy.rest = Math.max(30, copy.rest - 15);
      } else if (objective === 'ganhar_massa') {
        // Standard hypertrophic cues
        if (!copy.series.includes('falha') && !copy.series.includes('Falha')) {
          copy.series = copy.series + ' (Foco na fase excêntrica/descida lenta)';
        }
      } else if (rawObjective === 'ganhar_forca') {
        // High weight, low reps, high rest
        copy.series = '5 séries x 5 repetições (Carga progressiva máxima)';
        copy.rest = Math.max(90, copy.rest + 30);
      }
      return copy;
    });

    workouts.push({
      dayName: dayName,
      muscleGroup: muscleGroup,
      exercises: exercises
    });
  }

  return workouts;
};
