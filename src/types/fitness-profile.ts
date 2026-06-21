export interface FitnessProfileData {
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "general_fitness"
    | "rehabilitation";
  sessionsPerWeek: number;
  equipment: "none" | "home_basic" | "gym_full";
  trainingExperience: "beginner" | "intermediate" | "advanced";
  ageYears: number;
  heightCm: number;
  weightKg: number;
  bodyPhotos: string[];
  notes?: string;
}

export interface FitnessFormInputs {
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "endurance"
    | "general_fitness"
    | "rehabilitation";
  sessionsPerWeek: number;
  equipment: "none" | "home_basic" | "gym_full";
  trainingExperience: "beginner" | "intermediate" | "advanced";
  ageYears: string;
  heightCm: string;
  weightKg: string;
  notes: string;
}
