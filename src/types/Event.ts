// Tipos refinados para categorías y deportes
export type SportType =
  | "Carrera"
  | "Triatlón"
  | "Ciclismo"
  | "Natación"
  | "Entrenamiento"
  | "Otro";

export type AthleteCategory =
  | "Principiante"
  | "Intermedio"
  | "Avanzado"
  | "Elite"
  | "Recreativo";

// Periodos de inscripción por rangos de fechas
export interface RegistrationPeriod {
  label: string;     // Ej: "Inscripción temprana"
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

// Estructura completa del evento (Mongo + frontend)
export interface Event {
  // Mongo
  _id?: string;
  id: string; // usado en las URLs /events/[id]

  // Datos principales (ya existentes en el proyecto)
  name: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  price: string;
  type: SportType | string;
  image: string;
  slotsLeft: number;

  // Nuevos campos avanzados
  description?: string;

  // Varias distancias posibles (ej: ["5K","10K","21K"])
  distances?: string[];

  // Deporte (puede ser igual a type)
  sport?: SportType;

  // ✅ Varias categorías disponibles para el evento
  categories?: AthleteCategory[];

  // Campo legacy (por si algo viejo lo usa)
  category?: AthleteCategory;

  // Rango de edades
  minAge?: number;
  maxAge?: number;

  // ✅ Tallas que estarán disponibles (multi selección)
  shirtSizes?: string[]; // XS, S, M, L, XL, XXL

  // Rangos de inscripción
  registrationPeriods?: RegistrationPeriod[];

  // Datos opcionales para solicitudes externas
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  requestStatus?: "pending" | "approved" | "rejected";

  // Auditoría
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}