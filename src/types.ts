export type Objective = 'emagrecer' | 'ganhar_massa' | 'ganhar_forca' | 'saude_longevidade' | 'definicao';
export type Location = 'academia_pequena' | 'academia_media' | 'academia_franquia' | 'casa_calistenia';

export interface UserProfile {
  objective: Objective;
  location: Location; // Represents gym type / environment
  daysPerWeek: number; // 1 to 7 days
  allowedMachines: string[]; // List of selected machines / weights types
  healthLimitations: string[]; // Selected medical or physical restrictions
  workoutDurationCategory: 'rapido' | 'moderado' | 'completo'; // 1-2 to 3 ex, 4-6 ex, 6 or more
  weight: number; // current weight in kg
  height: number; // height in cm
  desiredWeight: number; // target weight in kg
  experienceLevel: 'iniciante' | 'intermediario' | 'avancado'; // gym tenure
  waterDrunk: number; // in ml
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
}

export interface Exercise {
  id: string;
  name: string;
  series: string; // e.g. "4 x 10" or "3 x 12"
  rest: number; // rest time in seconds
  animationType: 'push' | 'pull' | 'legs' | 'core' | 'cardio';
  description: string;
  tips: string;
}

export interface DayWorkout {
  dayName: string;
  muscleGroup: string;
  exercises: Exercise[];
}

export interface FoodReplacement {
  original: string;
  originalProtein: string;
  originalPrice: 'alto' | 'medio';
  substitute: string;
  substituteProtein: string;
  substitutePrice: 'baixo' | 'muito_baixo' | 'medio';
  ratio: string;
  savingTip: string;
  category: 'proteina' | 'carbo' | 'gordura';
}
