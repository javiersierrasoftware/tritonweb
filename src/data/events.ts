export type TritonEvent = {
  id: string;       // slug
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  distance: string;
  price: string;
  slotsLeft: number;
  image: string;
  description: string;
};

export const EVENTS: TritonEvent[] = [
  {
    id: "triton-10k-nocturna",
    name: "Carrera 10K Nocturna TRITON",
    date: "15 Feb 2026",
    time: "7:00 PM",
    location: "Sincelejo, Sucre",
    type: "Carrera",
    distance: "10K",
    price: "$60.000",
    slotsLeft: 120,
    image:
      "https://images.pexels.com/photos/1191147/pexels-photo-1191147.jpeg",
    description:
      "La tradicional carrera nocturna del Club TRITON. Un recorrido vibrante por las principales avenidas de la ciudad con ambientación LED, música en vivo y puntos de hidratación estratégicos.",
  },
  {
    id: "triatlon-sprint-bahia",
    name: "Triatlón Sprint Bahía TRITON",
    date: "22 Mar 2026",
    time: "6:00 AM",
    location: "Santa Marta, Magdalena",
    type: "Triatlón",
    distance: "750m – 20K – 5K",
    price: "$150.000",
    slotsLeft: 80,
    image:
      "https://images.pexels.com/photos/3763878/pexels-photo-3763878.jpeg",
    description:
      "Competencia oficial con salida desde la Bahía de Santa Marta. Natación en mar abierto, ciclismo técnico y carrera a pie costera.",
  },
  {
    id: "fondo-costa-120k",
    name: "Fondo Ciclismo Costa 120K",
    date: "5 Abr 2026",
    time: "5:00 AM",
    location: "Ruta Caribe",
    type: "Entrenamiento",
    distance: "120K",
    price: "Miembros TRITON",
    slotsLeft: 60,
    image:
      "https://images.pexels.com/photos/2986016/pexels-photo-2986016.jpeg",
    description:
      "Rodada grupal de resistencia por toda la zona costera. Vehículo de acompañamiento, hidratación y soporte mecánico básico.",
  },
];