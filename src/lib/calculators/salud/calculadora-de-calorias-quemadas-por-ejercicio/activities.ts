export type ExerciseIntensity = "light" | "moderate" | "vigorous";

export interface ExerciseVariant {
  id: string;
  label: string;
  description: string;
  met: number;
  intensity: ExerciseIntensity;
  source: "2024-adult-compendium";
  sourceCode: string;
}

export interface ExerciseActivity {
  id: string;
  label: string;
  category: string;
  popular?: boolean;
  defaultVariantId: string;
  variants: ExerciseVariant[];
}

const variant = (
  id: string,
  label: string,
  description: string,
  met: number,
  intensity: ExerciseIntensity,
  sourceCode: string,
): ExerciseVariant => ({
  id,
  label,
  description,
  met,
  intensity,
  source: "2024-adult-compendium",
  sourceCode,
});

export const EXERCISE_ACTIVITIES: ExerciseActivity[] = [
  {
    id: "walking", label: "Caminar", category: "walking", popular: true,
    defaultVariantId: "walking-moderate",
    variants: [
      variant("walking-slow", "Lento", "3.2-3.9 km/h, superficie plana", 2.8, "light", "17152"),
      variant("walking-moderate", "Moderado", "4.5-5.5 km/h, superficie plana", 3.8, "moderate", "17190"),
      variant("walking-brisk", "Rápido", "5.6-6.3 km/h, superficie plana", 4.8, "moderate", "17200"),
      variant("walking-hills", "En subida", "Pendiente de 6-10%, ritmo moderado-rápido", 7, "vigorous", "17035"),
    ],
  },
  {
    id: "running", label: "Correr", category: "running", popular: true,
    defaultVariantId: "running-10-kmh",
    variants: [
      variant("running-8-kmh", "8 km/h", "Ritmo aproximado de 7:30 min/km", 8.5, "vigorous", "12030"),
      variant("running-10-kmh", "10 km/h", "Ritmo aproximado de 6:00 min/km", 9.3, "vigorous", "12050"),
      variant("running-10-8-kmh", "10.8 km/h", "Ritmo aproximado de 5:33 min/km", 10.5, "vigorous", "12060"),
      variant("running-12-kmh", "12 km/h", "Ritmo aproximado de 5:00 min/km", 11.8, "vigorous", "12080"),
    ],
  },
  {
    id: "cycling", label: "Bicicleta", category: "cycling", popular: true,
    defaultVariantId: "cycling-moderate",
    variants: [
      variant("cycling-easy", "Paseo suave", "Ritmo fácil elegido por la persona", 4.3, "moderate", "01015"),
      variant("cycling-moderate", "Ritmo moderado", "Ritmo moderado elegido por la persona", 7, "vigorous", "01016"),
      variant("cycling-vigorous", "Ritmo vigoroso", "Ritmo vigoroso elegido por la persona", 9, "vigorous", "01017"),
      variant("cycling-spin", "Clase de spinning", "Bicicleta fija, clase grupal", 9, "vigorous", "01270"),
    ],
  },
  {
    id: "strength", label: "Fuerza", category: "conditioning", popular: true,
    defaultVariantId: "strength-general",
    variants: [
      variant("strength-general", "Rutina general", "Varios ejercicios, 8-15 repeticiones", 3.5, "moderate", "02054"),
      variant("strength-compound", "Sentadillas o peso muerto", "Esfuerzo lento o explosivo", 5, "moderate", "02052"),
      variant("strength-vigorous", "Esfuerzo vigoroso", "Pesas libres, máquinas o fisicoculturismo", 6, "vigorous", "02050"),
    ],
  },
  {
    id: "swimming", label: "Natación", category: "water", popular: true,
    defaultVariantId: "swimming-freestyle-slow",
    variants: [
      variant("swimming-leisure", "Recreativa", "Sin nadar largos", 6, "vigorous", "18310"),
      variant("swimming-freestyle-slow", "Libre lento", "Largos estilo libre, ritmo recreativo", 5.8, "moderate", "18240"),
      variant("swimming-crawl-medium", "Crol medio", "Aproximadamente 46 m/min", 8, "vigorous", "18290"),
      variant("swimming-freestyle-fast", "Libre rápido", "Largos estilo libre, esfuerzo vigoroso", 9.8, "vigorous", "18230"),
    ],
  },
  {
    id: "yoga", label: "Yoga", category: "conditioning", popular: true,
    defaultVariantId: "yoga-general",
    variants: [
      variant("yoga-hatha", "Hatha", "Práctica Hatha", 2.3, "light", "02150"),
      variant("yoga-general", "General", "Práctica general", 2.3, "light", "02175"),
      variant("yoga-vinyasa", "Vinyasa", "Práctica Vinyasa", 2.7, "light", "02185"),
      variant("yoga-power", "Power yoga", "Práctica de mayor esfuerzo", 4, "moderate", "02160"),
    ],
  },
  {
    id: "elliptical", label: "Elíptica", category: "conditioning",
    defaultVariantId: "elliptical-moderate",
    variants: [
      variant("elliptical-moderate", "Moderada", "Entrenador elíptico, esfuerzo moderado", 5, "moderate", "02048"),
      variant("elliptical-vigorous", "Vigorosa", "Entrenador elíptico, esfuerzo vigoroso", 9, "vigorous", "02049"),
    ],
  },
  {
    id: "rowing", label: "Remo estacionario", category: "conditioning",
    defaultVariantId: "rowing-moderate",
    variants: [
      variant("rowing-moderate", "Menos de 100 W", "Esfuerzo moderado", 5, "moderate", "02071"),
      variant("rowing-vigorous", "100-149 W", "Esfuerzo vigoroso", 7.5, "vigorous", "02072"),
      variant("rowing-fast", "150-199 W", "Esfuerzo vigoroso alto", 11, "vigorous", "02073"),
    ],
  },
  {
    id: "stairs", label: "Escaleras", category: "walking",
    defaultVariantId: "stairs-general",
    variants: [
      variant("stairs-slow", "Ritmo lento", "Subir escaleras lentamente", 4.5, "moderate", "17133"),
      variant("stairs-general", "Ritmo general", "Subir escaleras", 6.8, "vigorous", "17131"),
      variant("stairs-fast", "Ritmo rápido", "Un escalón a la vez", 9.3, "vigorous", "17134"),
    ],
  },
  {
    id: "hiit", label: "HIIT", category: "conditioning",
    defaultVariantId: "hiit-moderate",
    variants: [
      variant("hiit-moderate", "Moderado", "Ejercicio por intervalos de intensidad moderada", 7, "vigorous", "02210"),
      variant("hiit-vigorous", "Vigoroso", "Burpees, escaladores, saltos o Tabata", 11, "vigorous", "02214"),
    ],
  },
  {
    id: "dancing", label: "Baile", category: "dancing",
    defaultVariantId: "dancing-moderate",
    variants: [
      variant("dancing-slow", "Baile lento", "Vals, foxtrot o baile lento", 3, "moderate", "03040"),
      variant("dancing-moderate", "Baile moderado", "Baile folclórico, esfuerzo moderado", 5, "moderate", "03033"),
      variant("dancing-vigorous", "Baile vigoroso", "Club nocturno o baile folclórico vigoroso", 9.8, "vigorous", "03031"),
    ],
  },
  {
    id: "soccer", label: "Fútbol", category: "sports",
    defaultVariantId: "soccer-casual",
    variants: [
      variant("soccer-walking", "Fútbol caminando", "Partido sin correr", 3.5, "moderate", "15615"),
      variant("soccer-casual", "Partido casual", "Juego general no competitivo", 7, "vigorous", "15610"),
      variant("soccer-competitive", "Competitivo", "Partido competitivo", 9.5, "vigorous", "15605"),
    ],
  },
];

export const POPULAR_EXERCISE_ACTIVITIES = EXERCISE_ACTIVITIES.filter(
  (activity) => activity.popular,
);

export const getExerciseActivity = (id: string) =>
  EXERCISE_ACTIVITIES.find((activity) => activity.id === id);

export const getExerciseVariant = (activityId: string, variantId: string) =>
  getExerciseActivity(activityId)?.variants.find((item) => item.id === variantId);
