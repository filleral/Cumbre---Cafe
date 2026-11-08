export type Roast = 'Clara' | 'Media' | 'Oscura';

export interface Product {
  slug: string;
  name: string;
  farm: string;
  town: string;
  variety: string;
  process: string;
  roast: Roast;
  altitude: string;
  notes: string[];
  price: number;
  weight: string;
  color: string;
  accent: string;
  tag?: string;
  short: string;
  description: string;
  profile: { acidez: number; cuerpo: number; dulzor: number; amargor: number };
  brew: { method: string; ratio: string; time: string }[];
}

export const PRODUCTS: Product[] = [
  {
    slug: 'cumbre-clasico',
    name: 'Cumbre Clásico',
    farm: 'Finca El Mirador',
    town: 'Pitalito, Huila',
    variety: 'Caturra',
    process: 'Lavado',
    roast: 'Media',
    altitude: '1.750 m s. n. m.',
    notes: ['Panela', 'Chocolate', 'Naranja'],
    price: 42000,
    weight: '340 g',
    color: '#b8412c',
    accent: '#f6efe4',
    tag: 'Más vendido',
    short: 'Nuestro café de todos los días: dulce, redondo y balanceado.',
    description:
      'El café que nos dio nombre. Cultivado por la familia Muñoz en las laderas de Pitalito, lavado y secado al sol en marquesina. En taza es dulce como la panela recién molida, con un final de chocolate con leche y un toque cítrico que lo mantiene vivo.',
    profile: { acidez: 3, cuerpo: 4, dulzor: 4, amargor: 2 },
    brew: [
      { method: 'Prensa francesa', ratio: '1:15', time: '4 min' },
      { method: 'V60', ratio: '1:16', time: '3 min' },
      { method: 'Moka', ratio: '1:7', time: '5 min' },
    ],
  },
  {
    slug: 'geisha-la-esperanza',
    name: 'Geisha La Esperanza',
    farm: 'Finca La Esperanza',
    town: 'San Agustín, Huila',
    variety: 'Geisha',
    process: 'Lavado',
    roast: 'Clara',
    altitude: '1.950 m s. n. m.',
    notes: ['Jazmín', 'Bergamota', 'Durazno'],
    price: 98000,
    weight: '250 g',
    color: '#2f4a3a',
    accent: '#d9a441',
    tag: 'Edición limitada',
    short: 'Floral, delicado y brillante. Un lote de solo 120 kg al año.',
    description:
      'La joya de la cosecha. Una variedad legendaria sembrada a casi dos mil metros, cerca del Parque Arqueológico. Taza limpia y sedosa con aroma intenso a jazmín, acidez de bergamota y un dulzor a durazno maduro. Para prepararlo con calma.',
    profile: { acidez: 5, cuerpo: 2, dulzor: 4, amargor: 1 },
    brew: [
      { method: 'V60', ratio: '1:16', time: '3:15 min' },
      { method: 'Chemex', ratio: '1:16', time: '4 min' },
    ],
  },
  {
    slug: 'honey-rosado',
    name: 'Honey Rosado',
    farm: 'Finca Los Naranjos',
    town: 'Acevedo, Huila',
    variety: 'Pink Bourbon',
    process: 'Honey',
    roast: 'Clara',
    altitude: '1.820 m s. n. m.',
    notes: ['Frutos rojos', 'Hibisco', 'Panela'],
    price: 68000,
    weight: '250 g',
    color: '#d97a8a',
    accent: '#2a1810',
    tag: 'Nuevo',
    short: 'Jugoso y frutal, con el dulzor del mucílago que se seca con el grano.',
    description:
      'El Pink Bourbon es una variedad rara que nace del cruce natural entre Bourbon rojo y amarillo. Doña Rubiela lo procesa en honey: secado con parte de su miel, lo que regala una taza jugosa a frutos rojos y flor de jamaica.',
    profile: { acidez: 4, cuerpo: 3, dulzor: 5, amargor: 1 },
    brew: [
      { method: 'Aeropress', ratio: '1:14', time: '2 min' },
      { method: 'V60', ratio: '1:16', time: '3 min' },
    ],
  },
  {
    slug: 'natural-tabi',
    name: 'Natural Tabi',
    farm: 'Finca Villa Clara',
    town: 'La Plata, Huila',
    variety: 'Tabi',
    process: 'Natural',
    roast: 'Media',
    altitude: '1.700 m s. n. m.',
    notes: ['Fresa', 'Vino tinto', 'Cacao'],
    price: 62000,
    weight: '340 g',
    color: '#6b2737',
    accent: '#f6efe4',
    short: 'Intenso y vinoso. La cereza se seca entera durante 30 días.',
    description:
      'Proceso natural: la cereza de café se seca entera, con su fruta, en camas africanas durante un mes. El resultado es un café con mucho cuerpo, notas de fresa madura, un carácter vinoso y un final de cacao.',
    profile: { acidez: 3, cuerpo: 5, dulzor: 4, amargor: 2 },
    brew: [
      { method: 'Prensa francesa', ratio: '1:15', time: '4 min' },
      { method: 'Cold brew', ratio: '1:8', time: '16 h' },
    ],
  },
  {
    slug: 'espresso-volcan',
    name: 'Espresso Volcán',
    farm: 'Blend de 3 fincas',
    town: 'Huila',
    variety: 'Castillo · Caturra',
    process: 'Lavado',
    roast: 'Oscura',
    altitude: '1.600 – 1.800 m s. n. m.',
    notes: ['Cacao amargo', 'Nuez', 'Melaza'],
    price: 40000,
    weight: '340 g',
    color: '#2a1810',
    accent: '#d9a441',
    short: 'Hecho para la máquina de espresso: crema densa y cuerpo intenso.',
    description:
      'Una mezcla pensada para espresso y bebidas con leche. Tostión desarrollada que resalta el cacao amargo y la nuez tostada, con una crema avellana persistente. Perfecto para cappuccinos y flat whites.',
    profile: { acidez: 1, cuerpo: 5, dulzor: 3, amargor: 4 },
    brew: [
      { method: 'Espresso', ratio: '1:2', time: '28 s' },
      { method: 'Moka', ratio: '1:7', time: '5 min' },
    ],
  },
  {
    slug: 'descafeinado-cana',
    name: 'Descafeinado Caña',
    farm: 'Cooperativa del Sur',
    town: 'Garzón, Huila',
    variety: 'Castillo',
    process: 'Descafeinado EA',
    roast: 'Media',
    altitude: '1.650 m s. n. m.',
    notes: ['Caramelo', 'Nuez', 'Manzana'],
    price: 45000,
    weight: '340 g',
    color: '#c9a77c',
    accent: '#2a1810',
    short: 'Todo el sabor, nada del insomnio. Descafeinado natural con caña.',
    description:
      'Descafeinado con acetato de etilo obtenido de la caña de azúcar, un método natural que conserva el dulzor del grano. Notas de caramelo, nuez y manzana verde. Ideal para la taza de la noche.',
    profile: { acidez: 2, cuerpo: 3, dulzor: 4, amargor: 2 },
    brew: [
      { method: 'Prensa francesa', ratio: '1:15', time: '4 min' },
      { method: 'Goteo', ratio: '1:16', time: '5 min' },
    ],
  },
  {
    slug: 'lavado-pitalito',
    name: 'Lavado Pitalito',
    farm: 'Asociación Cafés del Valle',
    town: 'Pitalito, Huila',
    variety: 'Castillo',
    process: 'Lavado',
    roast: 'Media',
    altitude: '1.680 m s. n. m.',
    notes: ['Caramelo', 'Mandarina', 'Cacao'],
    price: 38000,
    weight: '340 g',
    color: '#d9a441',
    accent: '#2a1810',
    short: 'Un café honesto de la asociación de pequeños productores del valle.',
    description:
      'Este lote reúne el café de 14 familias de la Asociación Cafés del Valle. Con cada bolsa pagamos 40 % por encima del precio de bolsa. Taza de caramelo, mandarina jugosa y un cacao suave.',
    profile: { acidez: 3, cuerpo: 3, dulzor: 4, amargor: 2 },
    brew: [
      { method: 'V60', ratio: '1:16', time: '3 min' },
      { method: 'Goteo', ratio: '1:16', time: '5 min' },
    ],
  },
  {
    slug: 'kit-cata',
    name: 'Kit de Cata',
    farm: '4 fincas del Huila',
    town: 'Huila',
    variety: 'Varias',
    process: 'Lavado · Honey · Natural',
    roast: 'Clara',
    altitude: '1.650 – 1.950 m s. n. m.',
    notes: ['4 perfiles', 'Guía impresa', 'Regalo'],
    price: 85000,
    weight: '4 × 100 g',
    color: '#4c6b55',
    accent: '#f6efe4',
    tag: 'Ideal para regalar',
    short: 'Cuatro cafés, cuatro procesos y una guía para aprender a catar en casa.',
    description:
      'Un viaje por el Huila en cuatro bolsitas: Lavado, Honey, Natural y Geisha. Incluye una guía ilustrada con la rueda de sabores y un código QR para unirte a una cata virtual con nuestro equipo.',
    profile: { acidez: 4, cuerpo: 3, dulzor: 4, amargor: 2 },
    brew: [{ method: 'V60', ratio: '1:16', time: '3 min' }],
  },
];

export interface Experience {
  id: string;
  title: string;
  kind: string;
  duration: string;
  people: string;
  price: number;
  place: string;
  description: string;
  includes: string[];
  scene: 'cata' | 'finca' | 'taller';
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'cata',
    title: 'Cata guiada en la tostadería',
    kind: 'Cata',
    duration: '2 horas',
    people: 'Hasta 10 personas',
    price: 60000,
    place: 'Tostadería Cumbre · Neiva',
    description:
      'Aprende a oler, sorber y describir el café como lo hacen los catadores profesionales. Probarás seis cafés de distintos procesos.',
    includes: ['6 cafés en mesa de cata', 'Rueda de sabores', 'Bolsa de 100 g para llevar'],
    scene: 'cata',
  },
  {
    id: 'finca',
    title: 'Un día en la finca',
    kind: 'Tour',
    duration: 'Día completo',
    people: 'Hasta 12 personas',
    price: 280000,
    place: 'Finca El Mirador · Pitalito',
    description:
      'Recorre los cafetales con la familia Muñoz, recoge cereza madura, conoce el beneficio y almuerza comida típica opita.',
    includes: ['Transporte desde Pitalito', 'Almuerzo campesino', 'Recolección y beneficio', 'Café de la casa'],
    scene: 'finca',
  },
  {
    id: 'taller',
    title: 'Taller de métodos en casa',
    kind: 'Taller',
    duration: '3 horas',
    people: 'Hasta 8 personas',
    price: 120000,
    place: 'Tostadería Cumbre · Neiva',
    description:
      'V60, prensa, Aeropress y moka. Domina la molienda, la proporción y el tiempo para preparar un café increíble cada mañana.',
    includes: ['4 métodos de preparación', 'Recetario digital', '15 % de descuento en equipos'],
    scene: 'taller',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'Pedí el Kit de Cata para regalarle a mi papá y terminamos haciendo la cata virtual en familia. ¡Ahora todos tomamos Geisha!',
    name: 'Laura Restrepo',
    city: 'Medellín',
  },
  {
    quote:
      'La suscripción me llega cada mes justo cuando se me está acabando el café. Fresco, bien empacado y con la historia de la finca.',
    name: 'Andrés Pinzón',
    city: 'Bogotá',
  },
  {
    quote:
      'El tour en la finca fue lo mejor de nuestro viaje al Huila. Ver todo el proceso le cambia a uno la forma de tomar café.',
    name: 'Camila & Tomás',
    city: 'Cali',
  },
];

export function formatCOP(value: number): string {
  return '$' + value.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}
