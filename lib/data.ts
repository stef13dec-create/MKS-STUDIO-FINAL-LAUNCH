export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  size: string;
  image: string;
  description: string;
  gallery: string[];
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const projects: Project[] = [
  {
    id: "brasov-retreat",
    title: "Brasov Retreat",
    subtitle: "Alpine Resort",
    category: "Hospitality",
    date: "2024",
    size: "2,100 m²",
    image: "/projects/brasov-retreat-hero.png",
    description:
      "Nestled in the Carpathian Mountains, this resort lobby redefines alpine luxury. We used local natural stone and timber, paired with floor-to-ceiling vistas, to create a seamless connection between the interior and the breathtaking landscape.",
    gallery: [
      "/projects/brasov-retreat-1.png",
      "/projects/brasov-retreat-2.png",
    ],
  },
  {
    id: "bucharest-hq",
    title: "Bucharest HQ",
    subtitle: "Tech Hub",
    category: "Commercial",
    date: "2023",
    size: "1,200 m²",
    image: "/projects/bucharest-hq-hero.png",
    description:
      "Our hallmark project in the capital. The design focuses on transparency and fluidity, utilizing high-end glass partitions and a monochrome palette to create a tech-forward atmosphere that encourages collaboration.",
    gallery: [
      "/projects/bucharest-hq-1.png",
      "/projects/bucharest-hq-2.png",
    ],
  },
  {
    id: "cluj-office",
    title: "Cluj Office",
    subtitle: "Creative Studio",
    category: "Creative",
    date: "2022",
    size: "850 m²",
    image: "/projects/cluj-office-hero.png",
    description:
      "A creative hub designed for a digital agency. We combined industrial elements like exposed brick with modern acoustic solutions and bespoke wooden furniture to foster an inspiring and cozy workspace.",
    gallery: [
      "/projects/cluj-office-1.png",
      "/projects/cluj-office-2.png",
    ],
  },
  {
    id: "timisoara-hub",
    title: "Timisoara Hub",
    subtitle: "Innovation Center",
    category: "Corporate",
    date: "2023",
    size: "1,500 m²",
    image: "/projects/timisoara-hub-hero.png",
    description:
      "A futuristic innovation center that prioritizes ergonomic design and integrated technology. The space features green living walls and modular pods, creating a flexible environment for cutting-edge research and development.",
    gallery: [
      "/projects/timisoara-hub-1.png",
    ],
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "brasov-retreat-hero",
    src: "/projects/brasov-retreat-hero.png",
    alt: "Brasov Retreat - Alpine Lobby",
  },
  {
    id: "bucharest-hq-1",
    src: "/projects/bucharest-hq-1.png",
    alt: "Bucharest HQ - Meeting Room",
  },
  {
    id: "cluj-office-hero",
    src: "/projects/cluj-office-hero.png",
    alt: "Cluj Office - Creative Space",
  },
  {
    id: "ghq-hero",
    src: "/projects/bucharest-hq-hero.png",
    alt: "Bucharest HQ - Main Office",
  },
  {
    id: "timisoara-hub-hero",
    src: "/projects/timisoara-hub-hero.png",
    alt: "Timisoara Hub - Innovation Center",
  },
];

export function getProjects(): Promise<Project[]> {
  return Promise.resolve(projects);
}

export function getProject(id: string): Promise<Project | null> {
  return Promise.resolve(projects.find((p) => p.id === id) ?? null);
}

export function getGalleryImages(): Promise<GalleryImage[]> {
  return Promise.resolve(galleryImages);
}
