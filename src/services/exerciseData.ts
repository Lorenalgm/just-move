import { ExerciseConfig } from '../types/exercise';

export const EXERCISES: ExerciseConfig[] = [
  {
    id: 'shoulder_abduction',
    name: 'Abdução de ombro',
    category: 'Membros Superiores',
    targetReps: 12,
    targetPoints: 900,
    bestScore: 940,
    iconName: 'Activity',
    description: 'Eleve os braços lateralmente até a altura dos ombros e retorne de forma controlada.',
    instructions: [
      'Fique em pé, ereto e visível na câmera com espaço ao redor.',
      'Mantenha os braços estendidos ao lado do corpo.',
      'Eleve ambos os braços lateralmente até formarem uma linha horizontal (90°).',
      'Desça lentamente mantendo o abdômen contraído.'
    ],
    tips: [
      'Não eleve os ombros em direção às orelhas (mantenha o trapézio relaxado).',
      'Evite balançar o tronco para impulsionar o peso.',
      'Inspire ao descer e expire ao subir.'
    ],
    targetAngleMin: 80,
    targetAngleMax: 105,
    restAngle: 25,
    primaryJoints: 'Ombros e Cotovelos'
  },
  {
    id: 'shoulder_flexion',
    name: 'Flexão de ombro',
    category: 'Membros Superiores',
    targetReps: 10,
    targetPoints: 800,
    bestScore: 780,
    iconName: 'TrendingUp',
    description: 'Eleve os braços para frente até a altura dos olhos e desça suavemente.',
    instructions: [
      'Posicione-se de frente ou ligeiramente na diagonal para a câmera.',
      'Mantenha os cotovelos semidobrados ou estendidos.',
      'Eleve os dois braços para a frente até 90° a 110°.',
      'Retorne à posição inicial de forma lenta e cadenciada.'
    ],
    tips: [
      'Mantenha o tronco firme, sem inclinar as costas para trás.',
      'Controle o movimento na descida.'
    ],
    targetAngleMin: 80,
    targetAngleMax: 110,
    restAngle: 25,
    primaryJoints: 'Ombros e Peitoral Superior'
  },
  {
    id: 'squat',
    name: 'Agachamento livre',
    category: 'Membros Inferiores',
    targetReps: 12,
    targetPoints: 1000,
    bestScore: 1120,
    iconName: 'Flame',
    description: 'Flexione os joelhos e quadril como se fosse sentar em uma cadeira.',
    instructions: [
      'Afaste os pés na largura dos ombros.',
      'Mantenha o peito aberto e coluna neutra.',
      'Agache empurrando os joelhos para fora até formar aprox. 90°.',
      'Empurre o chão com os calcanhares para subir.'
    ],
    tips: [
      'Não deixe os joelhos desabarem para dentro.',
      'Mantenha os pés totalmente apoiados no chão.'
    ],
    targetAngleMin: 80,
    targetAngleMax: 105,
    restAngle: 165,
    primaryJoints: 'Quadril e Joelhos'
  },
  {
    id: 'jumping_jacks',
    name: 'Polichinelo cardio',
    category: 'Cardio & Agilidade',
    targetReps: 15,
    targetPoints: 850,
    bestScore: 850,
    iconName: 'Zap',
    description: 'Abra e feche pernas e braços em salto contínuo estimulando a respiração.',
    instructions: [
      'Comece com pés juntos e braços ao lado do corpo.',
      'Salte abrindo as pernas e batendo palmas acima da cabeça.',
      'Salte novamente voltando à posição inicial mantendo o ritmo.'
    ],
    tips: [
      'Aterrisse suavemente na ponta dos pés para proteger as articulações.',
      'Mantenha uma respiração constante e rítmica.'
    ],
    targetAngleMin: 130,
    targetAngleMax: 180,
    restAngle: 40,
    primaryJoints: 'Corpo Inteiro'
  }
];

export function getExerciseById(id: string): ExerciseConfig {
  return EXERCISES.find(e => e.id === id) || EXERCISES[0];
}
