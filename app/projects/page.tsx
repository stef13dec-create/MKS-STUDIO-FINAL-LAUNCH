"use client";
import { useRef, useState, useEffect, useCallback, memo } from "react";
import {
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
  animate,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import { Project, projects as projectsData } from "@/lib/data";
import { getPath } from "@/lib/utils";
import { useTranslation } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

// Staggered layout configuration for each project card
const CARD_CONFIGS = [
  { widthClass: "w-[90vw] md:w-[45vw]", offsetY: "mt-0 md:mt-[5vh]" },
  { widthClass: "w-[90vw] md:w-[38vw]", offsetY: "mt-[5vh] md:mt-[20vh]" },
  { widthClass: "w-[90vw] md:w-[50vw]", offsetY: "mt-0 md:mt-[-2vh]" },
  { widthClass: "w-[90vw] md:w-[40vw]", offsetY: "mt-[5vh] md:mt-[12vh]" },
];

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  hoveredProjectIndex,
  setHoveredProjectIndex,
  isVisible,
  lang,
}: {
  project: Project;
  index: number;
  hoveredProjectIndex: number | null;
  setHoveredProjectIndex: (val: number | null) => void;
  isVisible: boolean;
  lang: Language;
}) {
  const config = CARD_CONFIGS[index % CARD_CONFIGS.length];
  const isOtherHovered = hoveredProjectIndex !== null && hoveredProjectIndex !== index;

  return (
    <div
      className={`flex-shrink-0 ${config.widthClass} ${config.offsetY} flex flex-col gap-3`}
      onMouseEnter={() => setHoveredProjectIndex(index)}
      onMouseLeave={() => setHoveredProjectIndex(null)}
    >
      {/* Project Number - Hidden on mobile to prevent overlap with logo */}
      <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Image Container with clip-path reveal — natural aspect ratio, no cropping */}
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={isVisible ? { clipPath: "inset(0% 0 0 0)" } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="overflow-hidden"
      >
        <TransitionLink
          href={`/projects/${project.id}`}
          className="group block w-full"
          data-cursor-text="VIEW"
        >
          <Image
            src={getPath(project.image)}
            alt={project.title}
            width={0}
            height={0}
            sizes="(max-width: 768px) 80vw, 40vw"
            loading="eager"
            className="w-full h-auto transition-transform duration-[1.2s] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.05]"
            style={{
              opacity: isOtherHovered ? 0.8 : 1,
              filter: isOtherHovered ? "grayscale(1) invert(1)" : "grayscale(0) invert(0)",
              transition:
                "opacity 1.2s cubic-bezier(0.76,0,0.24,1), filter 1.2s cubic-bezier(0.76,0,0.24,1), transform 1.2s cubic-bezier(0.76,0,0.24,1)",
            }}
            referrerPolicy="no-referrer"
          />
        </TransitionLink>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
        className="flex flex-col gap-1"
      >
        <span className="text-sm md:text-base tracking-[0.15em] uppercase font-medium text-white">
          {lang === "ro" && project.titleRo ? project.titleRo : project.title}
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">
          {project.category}
        </span>
      </motion.div>
    </div>
  );
});

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(projectsData);
  const loading = false;
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set(projectsData.map((_, i) => i)));
  const [stripWidth, setStripWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { t, lang, setLang } = useTranslation();

  // Single motion value that drives the strip x position (used by both scroll and drag)
  const dragX = useMotionValue(0);
  // Separate motion value for the progress bar (0 → 1)
  const progressMV = useMotionValue(0);
  const progressBarWidth = useTransform(progressMV, [0, 1], ["0%", "100%"]);

  const updateDimensions = useCallback(() => {
    if (stripRef.current) setStripWidth(stripRef.current.scrollWidth);
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions, projects]);

  // useScroll must ALWAYS be called — never conditionally
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const maxTranslate = Math.max(0, stripWidth - viewportWidth);

  // ─────────────────────────────────────────────────────────────────────────────
  // SCROLL → dragX + progressMV (only when not actively dragging)
  // ─────────────────────────────────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isDragging) {
      dragX.set(-latest * maxTranslate);
      progressMV.set(latest);
    }

    if (projects.length === 0) return;
    const projectIndex = Math.min(Math.floor(latest * projects.length), projects.length - 1);
    setActiveIndex(projectIndex);
    setRevealedIndices((prev) => {
      if (prev.has(projectIndex)) return prev;
      const next = new Set(prev);
      next.add(projectIndex);
      return next;
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // DRAG → progressMV + activeIndex (while user is dragging)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = dragX.on("change", (v) => {
      if (!isDragging || maxTranslate === 0 || projects.length === 0) return;
      const progress = Math.abs(v) / maxTranslate;
      progressMV.set(Math.min(Math.max(progress, 0), 1));
      const idx = Math.min(Math.floor(progress * projects.length), projects.length - 1);
      setActiveIndex(idx);
      setRevealedIndices((prev) => {
        if (prev.has(idx)) return prev;
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    });
    return unsub;
  }, [dragX, isDragging, maxTranslate, projects.length, progressMV]);

  // ─────────────────────────────────────────────────────────────────────────────
  // DOT NAVIGATION — animate strip to the target project
  // ─────────────────────────────────────────────────────────────────────────────
  const goToProject = useCallback(
    (index: number) => {
      if (projects.length <= 1) return;
      const targetX = -(index / (projects.length - 1)) * maxTranslate;
      animate(dragX, targetX, { type: "spring", damping: 38, stiffness: 260, mass: 0.8 });
      progressMV.set(index / (projects.length - 1));
      setActiveIndex(index);
      setRevealedIndices((prev) => {
        if (prev.has(index)) return prev;
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    },
    [dragX, maxTranslate, projects.length, progressMV]
  );

  const scrollHeight = projects.length > 0 ? `${projects.length * 100}vh` : "400vh";

  return (
    <>
      <CustomCursor />

      {/* Loading overlay — rendered on top, fades out once data arrives */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 bg-black flex items-center justify-center z-[100]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeOut" } }}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-[1px] h-16 bg-white/20 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full bg-white/60"
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{
                    duration: 1.2,
                    ease: [0.76, 0, 0.24, 1],
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-medium">
                {t("projects.loadingProjects")}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed UI Overlays */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start pointer-events-auto">
          <Link href="/" className="group flex items-center gap-2">
            <Image 
              src={getPath("/logo.png")} 
              alt="MKS Studio Logo" 
              width={120} 
              height={54} 
              className="w-[80px] md:w-[120px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" 
              priority 
            />
          </Link>

          <div className="flex items-center gap-6 ml-auto">
            <TransitionLink
              href="/"
              className="text-xs tracking-[0.2em] uppercase font-bold text-white/90 hover:text-white flex items-center gap-2 group"
            >
              <span className="w-4 h-[1px] bg-white transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              {t("nav.home")}
            </TransitionLink>
            <div className="w-[1px] h-3 bg-white/20" />
            <TransitionLink
              href="/gallery"
              className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("nav.gallery")}
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors"
            >
              {t("nav.contact")}
            </TransitionLink>
            <div className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-medium text-white/80">
              <button onClick={() => setLang("en")} className={lang === "en" ? "opacity-100" : "opacity-40 hover:opacity-70 transition-opacity"}>EN</button>
              <span className="opacity-20">·</span>
              <button onClick={() => setLang("ro")} className={lang === "ro" ? "opacity-100" : "opacity-40 hover:opacity-70 transition-opacity"}>RO</button>
            </div>
          </div>
        </header>

        {/* Left Indicator - Pill-shaped upward scroll animation (Desktop only) */}
        <div className="hidden md:flex absolute left-6 md:left-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-30 pointer-events-none">
          <div className="w-[22px] h-[38px] rounded-full border border-white/30 flex justify-center p-1.5 pt-1">
            <motion.div
              animate={{
                y: [18, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="w-1 h-1.5 bg-white rounded-full"
            />
          </div>
          <span className="text-[10px] md:text-[11px] tracking-widest uppercase opacity-80 font-medium">{t("common.scroll")}</span>
        </div>


        {/* Centered Project Header (PROJECTS | 01 TITLE) */}
        <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 flex items-center justify-center whitespace-nowrap z-50">
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
              {t("projects.label")}
            </span>
            <span className="text-[10px] md:text-xs text-white/20">|</span>
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 font-medium mr-2 md:mr-4">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="overflow-hidden h-6 flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                className="text-[8px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase text-white/90 font-bold max-w-[120px] md:max-w-none truncate"
              >
                {lang === "ro" && projects[activeIndex]?.titleRo ? projects[activeIndex].titleRo : projects[activeIndex]?.title}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10">
          <motion.div className="h-full bg-white/60" style={{ width: progressBarWidth }} />
        </div>

        {/* ── Dot Navigator ─────────────────────────────────────────────────────── */}
        {!loading && projects.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-[10px] pointer-events-auto">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => goToProject(i)}
                aria-label={`Go to project ${i + 1}`}
                className="group flex items-center justify-center w-5 h-5"
              >
                <span
                  className="block rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIndex ? "20px" : "5px",
                    height: "5px",
                    backgroundColor:
                      i === activeIndex
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.25)",
                    boxShadow: i === activeIndex ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                    transform: i === activeIndex ? "scaleY(1)" : "scaleY(1)",
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Drag hint — fades away after first drag */}
        {!loading && (
          <motion.div
            className="absolute bottom-[52px] left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isDragging ? 0 : 0.6 }}
            transition={{ duration: 0.4 }}
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5H13M1 5L4 2M1 5L4 8" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round"/>
              <path d="M13 5L10 2M13 5L10 8" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-medium">
              {t("common.dragToExplore")}
            </span>
          </motion.div>
        )}

        <div className="hidden md:block absolute bottom-6 md:bottom-10 left-6 md:left-10 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/50 font-medium">
          {t("common.commercialInteriors")}
        </div>
        <div className="hidden md:block absolute bottom-6 md:bottom-10 right-6 md:right-10 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-white/50 font-medium">
          {t("common.copyright")}
        </div>
      </div>

      {/* Scrollable Container — always mounted so useScroll ref is always hydrated */}
      <div
        ref={containerRef}
        className="relative bg-black"
        style={{ height: scrollHeight }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
          <motion.div
            ref={stripRef}
            className="flex items-start gap-8 md:gap-16 pl-[10vw] md:pl-[15vw] pr-[20vw]"
            style={{
              x: dragX,
              cursor: isDragging ? "grabbing" : "grab",
              willChange: "transform",
            }}
            drag="x"
            dragConstraints={{ left: -maxTranslate, right: 0 }}
            dragElastic={0.06}
            dragMomentum={true}
            dragTransition={{ bounceDamping: 32, bounceStiffness: 280, timeConstant: 220 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          >
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                hoveredProjectIndex={hoveredProjectIndex}
                setHoveredProjectIndex={setHoveredProjectIndex}
                isVisible={revealedIndices.has(i)}
                lang={lang}
              />
            ))}

            {/* End of list Back to Home Button */}
            <div className="flex-shrink-0 w-[60vw] md:w-[30vw] h-full flex flex-col items-center justify-center gap-8 pl-[10vw]">
              <div className="w-[1px] h-20 bg-white/10" />
              <TransitionLink 
                href="/" 
                className="group flex flex-col items-center gap-6 transition-all duration-500 hover:scale-105"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 relative overflow-hidden">
                  <motion.span 
                    initial={{ x: 0 }}
                    whileHover={{ x: -40, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl"
                  >
                    &larr;
                  </motion.span>
                  <motion.span 
                    initial={{ x: 40, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl absolute"
                  >
                    &larr;
                  </motion.span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40 group-hover:text-white transition-colors">
                    {t("common.backTo")}
                  </span>
                  <span className="text-sm tracking-[0.4em] uppercase font-bold text-white group-hover:text-white transition-colors">
                    {t("common.home")}
                  </span>
                </div>
              </TransitionLink>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
