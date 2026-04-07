// lib/translations.ts

type TranslationDict = {
  nav: { home: string; projects: string; about: string; contact: string; gallery: string; close: string; allProjects: string };
  common: { scroll: string; loading: string; backTo: string; home: string; dragToExplore: string; commercialInteriors: string; open: string; copyright: string };
  home: { iconicProjects: string; viewAllProjects: string; menuDescription: string };
  about: { heading1: string; heading2: string; philosophyTitle: string; philosophyBody: string; studioTitle: string; studioBody: string };
  contact: { heading1: string; heading2: string; emailLabel: string; phoneLabel: string; namePlaceholder: string; emailPlaceholder: string; messagePlaceholder: string; send: string; thankYou: string; thankYouSub: string; sendAnother: string };
  gallery: { title: string; loadingGallery: string; prev: string; next: string };
  projects: { label: string; loadingProjects: string };
  projectDetail: { yearLabel: string; areaLabel: string; categoryLabel: string; technicalDocs: string; blueprintsHeading: string; blueprintsDesc: string; siteAndSituation: string; floorPlans: string; facadesAndSections: string; technicalDetails: string; generalDocs: string; nextProject: string; notFound: string; backToHome: string; allRightsReserved: string };
  footer: { instagram: string; facebook: string; linkedin: string };
};

const en: TranslationDict = {
  nav: {
    home: "Home",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    gallery: "Gallery",
    close: "CLOSE",
    allProjects: "All Projects",
  },
  common: {
    scroll: "Scroll",
    loading: "Loading...",
    backTo: "Back to",
    home: "Home",
    dragToExplore: "Drag to explore",
    commercialInteriors: "Commercial Interiors",
    open: "Open",
    copyright: "©2026",
  },
  home: {
    iconicProjects: "ICONIC PROJECTS",
    viewAllProjects: "View All Projects",
    menuDescription: "Contemporary moods with traditional twists that work together to deliver a unique look and feel for every client.",
  },
  about: {
    heading1: "Designing spaces that inspire,",
    heading2: "elevate, and define.",
    philosophyTitle: "Our Philosophy",
    philosophyBody: "At MKS Studio, we believe that the environment you inhabit profoundly impacts your daily life and productivity. Our approach is rooted in contemporary moods intertwined with traditional twists, delivering a unique and highly personalized look for every client.",
    studioTitle: "The Studio",
    studioBody: "Based in the heart of the design district, our studio is a laboratory for aesthetic exploration. We collaborate closely with artisans, architects, and visionaries to execute projects that range from intimate commercial spaces to large-scale corporate headquarters.",
  },
  contact: {
    heading1: "Let's",
    heading2: "Talk.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Tell us about your project",
    send: "Send Message",
    thankYou: "Thank you.",
    thankYouSub: "Your email client has been opened — we'll get back to you soon.",
    sendAnother: "Send another message",
  },
  gallery: {
    title: "INTERIORS GALLERY",
    loadingGallery: "Loading Gallery...",
    prev: "PREV",
    next: "NEXT",
  },
  projects: {
    label: "Projects",
    loadingProjects: "Loading Projects",
  },
  projectDetail: {
    yearLabel: "Year",
    areaLabel: "Area",
    categoryLabel: "Category",
    technicalDocs: "Technical Documentation",
    blueprintsHeading: "Project Blueprints & Specifications",
    blueprintsDesc: "Comprehensive technical documentation, featuring architectural site plans, detailed floor distributions, and furniture specifications.",
    siteAndSituation: "Site & Situation",
    floorPlans: "Floor Plans",
    facadesAndSections: "Facades & Sections",
    technicalDetails: "Technical Details & Specs",
    generalDocs: "General Documentation",
    nextProject: "Next Project",
    notFound: "Project Not Found",
    backToHome: "Back to Home",
    allRightsReserved: "© 2026 MKS Studio. All Rights Reserved.",
  },
  footer: {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
  },
};

const ro: TranslationDict = {
  nav: {
    home: "Acasă",
    projects: "Proiecte",
    about: "Despre",
    contact: "Contact",
    gallery: "Galerie",
    close: "ÎNCHIDE",
    allProjects: "Toate Proiectele",
  },
  common: {
    scroll: "Derulează",
    loading: "Se încarcă...",
    backTo: "Înapoi la",
    home: "Acasă",
    dragToExplore: "Trage pentru a explora",
    commercialInteriors: "Interioare Comerciale",
    open: "Deschide",
    copyright: "©2026",
  },
  home: {
    iconicProjects: "PROIECTE ICONICE",
    viewAllProjects: "Vezi Toate Proiectele",
    menuDescription: "Stări contemporane cu accente tradiționale care lucrează împreună pentru a oferi un aspect unic și o experiență personalizată fiecărui client.",
  },
  about: {
    heading1: "Creăm spații care inspiră,",
    heading2: "înalță și definesc.",
    philosophyTitle: "Filosofia Noastră",
    philosophyBody: "La MKS Studio, credem că mediul în care trăiești îți influențează profund viața de zi cu zi și productivitatea. Abordarea noastră se bazează pe stări contemporane îmbinate cu accente tradiționale, oferind un aspect unic și personalizat fiecărui client.",
    studioTitle: "Studioul",
    studioBody: "Aflat în inima cartierului de design, studioul nostru este un laborator al explorării estetice. Colaborăm îndeaproape cu artizani, arhitecți și vizionari pentru a realiza proiecte ce variază de la spații comerciale intime până la sedii corporative de amploare.",
  },
  contact: {
    heading1: "Hai să",
    heading2: "Vorbim.",
    emailLabel: "Email",
    phoneLabel: "Telefon",
    namePlaceholder: "Nume",
    emailPlaceholder: "Email",
    messagePlaceholder: "Spune-ne despre proiectul tău",
    send: "Trimite Mesaj",
    thankYou: "Mulțumim.",
    thankYouSub: "Clientul tău de email a fost deschis — te vom contacta în curând.",
    sendAnother: "Trimite alt mesaj",
  },
  gallery: {
    title: "GALERIE INTERIOARE",
    loadingGallery: "Se încarcă galeria...",
    prev: "ÎNAPOI",
    next: "URMĂTOR",
  },
  projects: {
    label: "Proiecte",
    loadingProjects: "Se încarcă proiectele",
  },
  projectDetail: {
    yearLabel: "An",
    areaLabel: "Suprafață",
    categoryLabel: "Categorie",
    technicalDocs: "Documentație Tehnică",
    blueprintsHeading: "Planuri & Specificații",
    blueprintsDesc: "Documentație tehnică completă, cu planuri de situație arhitecturale, distribuții detaliate ale etajelor și specificații de mobilier.",
    siteAndSituation: "Sit & Situație",
    floorPlans: "Planuri de Etaj",
    facadesAndSections: "Fațade & Secțiuni",
    technicalDetails: "Detalii Tehnice & Specificații",
    generalDocs: "Documentație Generală",
    nextProject: "Proiectul Următor",
    notFound: "Proiect Negăsit",
    backToHome: "Înapoi Acasă",
    allRightsReserved: "© 2026 MKS Studio. Toate drepturile rezervate.",
  },
  footer: {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
  },
};

export const translations = { en, ro };
export type Language = "en" | "ro";
