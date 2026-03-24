"use client";
import { useRef, useState, useEffect, useCallback } from "react";
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
import { getProjects, Project } from "@/lib/firebase";
import { getPath } from "@/lib/utils";

// Staggered layout configuration for each project card
const CARD_CONFIGS = [
  { widthClass: "w-[80vw] md:w-[35vw]", heightClass: "h-[50vh] md:h-[70vh]", offsetY: "mt-0 md:mt-[5vh]" },
  { widthClass: "w-[80vw] md:w-[28vw]", heightClass: "h-[45vh] md:h-[55vh]", offsetY: "mt-[5vh] md:mt-[20vh]" },
  { widthClass: "w-[80vw] md:w-[40vw]", heightClass: "h-[55vh] md:h-[75vh]", offsetY: "mt-0 md:mt-[-2vh]" },
  { widthClass: "w-[80vw] md:w-[30vw]", heightClass: "h-[45vh] md:h-[60vh]", offsetY: "mt-[5vh] md:mt-[12vh]" },
];

function ProjectCard({
  project,
  index,
  hoveredProjectIndex,
  setHoveredProjectIndex,
  isVisible,
}: {
  project: Project;
  index: number;
  hoveredProjectIndex: number | null;
  setHoveredProjectIndex: (val: number | null) => void;
  isVisible: boolean;
}) {
  const config = CARD_CONFIGS[index % CARD_CONFIGS.length];
  const isOtherHovered = hoveredProjectIndex !== null && hoveredProjectIndex !== index;

  return (
    <div
      className={`flex-shrink-0 ${config.widthClass} ${config.offsetY} flex flex-col gap-3`}
      onMouseEnter={() => setHoveredProjectIndex(index)}
      onMouseLeave={() => setHoveredProjectIndex(null)}
    >
      {/* Project Number */}
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Image Container with clip-path reveal */}
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={isVisible ? { clipPath: "inset(0% 0 0 0)" } : {}}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className={`relative ${config.heightClass} overflow-hidden`}
      >
        <TransitionLink
          href={`/projects/${project.id}`}
          className="group block w-full h-full relative"
          data-cursor-text="VIEW"
        >
          <div
            className="relative w-full h-full transition-all duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[0.97]"
            style={{
              opacity: isOtherHovered ? 0.8 : 1,
              filter: isOtherHovered ? "grayscale(1) invert(1)" : "grayscale(0) invert(0)",
              transition:
                "opacity 0.8s cubic-bezier(0.25,1,0.5,1), filter 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 80vw, 40vw"
              referrerPolicy="no-referrer"
            />
          </div>
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
          {project.title}
        </span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">
          {project.category}
        </span>
      </motion.div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set([0]));
  const [stripWidth, setStripWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Single motion value that drives the strip x position (used by both scroll and drag)
  const dragX = useMotionValue(0);
  // Separate motion value for the progress bar (0 → 1)
  const progressMV = useMotionValue(0);
  const progressBarWidth = useTransform(progressMV, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
                Loading Projects
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
              href="/gallery"
              className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors"
            >
              Gallery
            </TransitionLink>
            <TransitionLink
              href="/contact"
              className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium text-white/80 hover:text-white transition-colors"
            >
              Contact
            </TransitionLink>
          </div>
        </header>

        {/* Centered Project Header (PROJECTS | 01 TITLE) */}
        <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 flex items-center justify-center whitespace-nowrap z-50">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
              Projects
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
                className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/90 font-bold"
              >
                {projects[activeIndex]?.title}
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
            <span className="text-[8px] tracking-[0.25em] uppercase text-white/30 font-medium">
              Drag to explore
            </span>
          </motion.div>
        )}

        <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
          Commercial Interiors
        </div>
        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 text-[8px] md:text-[10px] tracking-[0.3em] uppercase text-white/50 font-medium">
          &copy;2026
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
              />
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
