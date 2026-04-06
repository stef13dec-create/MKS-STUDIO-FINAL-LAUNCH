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
  drawings?: string[];
  heroFit?: "cover" | "contain";
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

export const projects: Project[] = [
  {
    id: "j8-ubisoft-studio",
    title: "J8 UBISOFT STUDIO",
    subtitle: "Creative Workspace",
    category: "Commercial",
    date: "2024",
    size: "4,500 m²",
    image: "/projects/j8-ubisoft-studio/1_reception.jpg",
    description:
      "A flagship studio project for Ubisoft at J8, designed to foster creativity and collaboration. The space integrates modern industrial aesthetics with functional zones, including specialized social areas, and panoramic workspaces.",
    gallery: [
      "/projects/j8-ubisoft-studio/1_reception.jpg",
      "/projects/j8-ubisoft-studio/03_Workspace_Panoramic.jpg",
      "/projects/j8-ubisoft-studio/04_entrance_lounge.jpg",
      "/projects/j8-ubisoft-studio/05_entrance_reception.jpg",
      "/projects/j8-ubisoft-studio/06_team_collaboration.jpg",
      "/projects/j8-ubisoft-studio/07_lounge_perspective.jpg",
      "/projects/j8-ubisoft-studio/08_social_zone_arcade.jpg",
      "/projects/j8-ubisoft-studio/09_workspace_depth.jpg",
      "/projects/j8-ubisoft-studio/10_conference_room.jpg",
      "/projects/j8-ubisoft-studio/11_break_area.jpg",
      "/projects/j8-ubisoft-studio/12_culture_collage.jpg",
      "/projects/j8-ubisoft-studio/13_meeting_pod_1.jpg",
      "/projects/j8-ubisoft-studio/14_meeting_pod_2.jpg",
      "/projects/j8-ubisoft-studio/15_interior_detail.jpg",
      "/projects/j8-ubisoft-studio/16_social_detail_1.jpg",
      "/projects/j8-ubisoft-studio/17_social_detail_2.jpg",
      "/projects/j8-ubisoft-studio/18_social_detail_3.jpg",
      "/projects/j8-ubisoft-studio/19_social_detail_4.jpg",
    ],
    drawings: [
      "/projects/j8-ubisoft-studio/drawings/23_furniture_spec_03.pdf",
      "/projects/j8-ubisoft-studio/drawings/24_furniture_spec_04.pdf",
      "/projects/j8-ubisoft-studio/drawings/25_furniture_spec_06.pdf",
      "/projects/j8-ubisoft-studio/drawings/26_furniture_spec_07.pdf",
      "/projects/j8-ubisoft-studio/drawings/27_furniture_spec_08.pdf",
      "/projects/j8-ubisoft-studio/drawings/28_furniture_spec_09.pdf",
      "/projects/j8-ubisoft-studio/drawings/29_furniture_spec_10.pdf",
      "/projects/j8-ubisoft-studio/drawings/30_furniture_spec_11.pdf",
      "/projects/j8-ubisoft-studio/drawings/31_furniture_spec_12.pdf",
      "/projects/j8-ubisoft-studio/drawings/32_furniture_spec_13.pdf",
      "/projects/j8-ubisoft-studio/drawings/33_furniture_spec_14.pdf",
      "/projects/j8-ubisoft-studio/drawings/34_furniture_spec_15.pdf",
      "/projects/j8-ubisoft-studio/drawings/35_furniture_spec_16.pdf",
      "/projects/j8-ubisoft-studio/drawings/36_furniture_spec_18.pdf",
      "/projects/j8-ubisoft-studio/drawings/37_furniture_spec_19.pdf",
      "/projects/j8-ubisoft-studio/drawings/38_furniture_spec_21.pdf",
      "/projects/j8-ubisoft-studio/drawings/39_furniture_spec_26.pdf",
      "/projects/j8-ubisoft-studio/drawings/40_furniture_spec_27.pdf",
      "/projects/j8-ubisoft-studio/drawings/42_furniture_spec_29.pdf",
    ],
  },
  {
    id: "house-voluntari",
    title: "House Voluntari",
    subtitle: "Modern Residential Villa",
    category: "Residential",
    date: "2024",
    size: "350 m²",
    image: "/projects/house-voluntari/02_Exterior-Front-Facade-Dusk.png",
    description:
      "A stunning contemporary villa in Voluntari, prioritizing indoor-outdoor living with expansive terraces, a private pool, and minimalist interior aesthetics.",
    gallery: [
      "/projects/house-voluntari/03_Exterior-Rear-Pool-Garden.png",
      "/projects/house-voluntari/04_Exterior-Rear-Terrace-Dining.png",
      "/projects/house-voluntari/05_Interior-Master-Bedroom.png",
      "/projects/house-voluntari/06_Animation-Exterior-Night-Lighting.mp4",
      "/projects/house-voluntari/4_HERO_Exterior-Pool-Lounge-Chairs.jpeg",
    ],
    drawings: [
      "/projects/house-voluntari/drawings/A001-PLAN DE SITUATIE.pdf",
      "/projects/house-voluntari/drawings/A101-PLAN PARTER.pdf",
      "/projects/house-voluntari/drawings/A102-PLAN ETAJ 1.pdf",
      "/projects/house-voluntari/drawings/A102-PLAN ETAJ 2.pdf",
      "/projects/house-voluntari/drawings/A301-FATADA PRINCIPALA.pdf",
      "/projects/house-voluntari/drawings/A302-FATADA POSTERIOARA.pdf",
      "/projects/house-voluntari/drawings/A303-FATADA LATERALA.pdf",
      "/projects/house-voluntari/drawings/A331-SECTIUNE AA.pdf",
      "/projects/house-voluntari/drawings/A332-SECTIUNE BB.pdf",
      "/projects/house-voluntari/drawings/A701-DETALIU ATIC SI FATADA VENTILATA.pdf",
      "/projects/house-voluntari/drawings/A702-DETALIU SCARA SI INCALZIRE IN PARDOSEALA.pdf",
      "/projects/house-voluntari/drawings/A901-TABLOU DE TAMPLARIE.pdf",
    ],
    heroFit: "contain",
  },
  {
    id: "ubisoft-craiova",
    title: "UBISOFT CRAIOVA STUDIO",
    subtitle: "Creative Tech Hub",
    category: "Commercial",
    date: "2024",
    size: "2,800 m²",
    image: "/projects/ubisoft-craiova/1_hero.jpeg",
    description:
      "A dynamic and technical workspace for Ubisoft's Craiova team, featuring specialized coding zones, creative collaborative hubs, and integrated social spaces designed for the next generation of tech talent.",
    gallery: [
      "/projects/ubisoft-craiova/02_HERO_Main_Workspace.jpeg",
      "/projects/ubisoft-craiova/02_Wide_Perspective.jpeg",
      "/projects/ubisoft-craiova/03_Lounge_and_Social.jpeg",
      "/projects/ubisoft-craiova/04_Breakout_Area.jpg",
      "/projects/ubisoft-craiova/05_Workspace_Depth.jpeg",
      "/projects/ubisoft-craiova/06_Meeting_Room.jpg",
      "/projects/ubisoft-craiova/07_Design_Details.jpeg",
      "/projects/ubisoft-craiova/11_Workspace_Linear_Rows.jpeg",
      "/projects/ubisoft-craiova/12_Workspace_Corner_View.jpeg",
      "/projects/ubisoft-craiova/13_Kitchen_Dining_Area.jpeg",
      "/projects/ubisoft-craiova/14_Lounge_Social_Space.jpeg",
      "/projects/ubisoft-craiova/15_Main_Conference_Room.jpeg",
      "/projects/ubisoft-craiova/16_Meeting_Room_Wide.jpeg",
      "/projects/ubisoft-craiova/21_Kitchen_Detail.jpg",
      "/projects/ubisoft-craiova/22_Workspace_Perspective.jpg",
      "/projects/ubisoft-craiova/23_Desk_Setup_Layout.jpg",
      "/projects/ubisoft-craiova/24_Collaboration_Pod.jpg",
      "/projects/ubisoft-craiova/25_Cafe_Seating.jpg",
      "/projects/ubisoft-craiova/26_Office_View_Wide.jpg",
    ],
    drawings: [
      "/projects/ubisoft-craiova/drawings/10_Full_Furniture_Plan.pdf",
      "/projects/ubisoft-craiova/drawings/08_Office_Zoning_Plan.jpg",
      "/projects/ubisoft-craiova/drawings/09_Furniture_Specs_1.jpg",
      "/projects/ubisoft-craiova/drawings/17_Furniture_Specs_2.jpg",
      "/projects/ubisoft-craiova/drawings/18_Furniture_Specs_3.jpg",
      "/projects/ubisoft-craiova/drawings/19_Furniture_Specs_4.jpg",
      "/projects/ubisoft-craiova/drawings/20_Furniture_Specs_5.jpg",
    ],
  },
  {
    id: "single-family-house",
    title: "SINGLE FAMILY HOUSE",
    subtitle: "Modern Architectural Residence",
    category: "Residential",
    date: "2024",
    size: "280 m²",
    image: "/projects/single-family-house/01_HERO_Exterior-Front-Facade-Sunset.png",
    description:
      "A modern single-family residence featuring open-plan living spaces, seamless interior-exterior integration, and sophisticated contemporary design.",
    gallery: [
      "/projects/single-family-house/01_HERO_Exterior-Front-Facade-Sunset.png",
      "/projects/single-family-house/02_Interior-Living-Kitchen-Dining.png",
      "/projects/single-family-house/03_Interior-Living-Dining-Open-Plan.png",
      "/projects/single-family-house/04_Interior-Lounge-Fireplace-Dining.png",
      "/projects/single-family-house/05_Interior-Master-Bedroom.png",
      "/projects/single-family-house/06_Animation-Exterior-Man-Walking.mp4",
    ],
    drawings: [
      "/projects/single-family-house/drawings/07_Plans-Site-Ground-Floor.pdf",
      "/projects/single-family-house/drawings/1097-600 GROUND FIRST FLOOR PLANS (2).pdf",
      "/projects/single-family-house/drawings/1097-620 ELEVATIONS (1).pdf",
      "/projects/single-family-house/drawings/1097-630 SECTIONS.pdf",
    ],
  },
  {
    id: "a-frame-alex",
    title: "A-FRAME ALEX",
    subtitle: "Modern A-Frame Residence",
    category: "Residential",
    date: "2024",
    size: "180 m²",
    image: "/projects/a-frame-alex/01_SUMMER_1.jpg",
    description:
      "A striking A-frame residence designed for a seamless connection with nature. Featuring bold geometry and expansive glass facades, the house offers both a warm winter retreat and an open summer living experience.",
    gallery: [
      "/projects/a-frame-alex/01_SUMMER_1.jpg",
      "/projects/a-frame-alex/01_SUMMER_2.jpg",
      "/projects/a-frame-alex/01_WINTER.png",
      "/projects/a-frame-alex/01_WINTER_2.png",
      "/projects/a-frame-alex/drawings/02_Axonometry.jpg",
      "/projects/a-frame-alex/drawings/02_Axonometry2.jpg",
      "/projects/a-frame-alex/drawings/03_ETAJ_2.jpg",
      "/projects/a-frame-alex/drawings/04_PARTER_2.jpg",
      "/projects/a-frame-alex/drawings/05_FATADA_PR_2.jpg",
      "/projects/a-frame-alex/drawings/06_FATADA_SEC_2.jpg",
    ],
    drawings: [],
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "j8-hero",
    src: "/projects/j8-ubisoft-studio/1_reception.jpg",
    alt: "J8 Ubisoft Studio Hero",
  },
  {
    id: "house-voluntari-hero",
    src: "/projects/house-voluntari/02_Exterior-Front-Facade-Dusk.png",
    alt: "House Voluntari Hero",
  },
  {
    id: "ubisoft-craiova-hero",
    src: "/projects/ubisoft-craiova/1_hero.jpeg",
    alt: "Ubisoft Craiova Studio Hero",
  },
  {
    id: "single-family-house-hero",
    src: "/projects/single-family-house/01_HERO_Exterior-Front-Facade-Sunset.png",
    alt: "Single Family House Hero",
  },
  {
    id: "a-frame-alex-hero",
    src: "/projects/a-frame-alex/01_SUMMER_1.jpg",
    alt: "A-Frame Alex Hero",
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
