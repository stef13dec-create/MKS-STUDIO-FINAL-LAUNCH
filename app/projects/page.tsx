"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import { getProjects, Project } from "@/lib/firebase";

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
              transition: "opacity 0.8s cubic-bezier(0.25,1,0.5,1), filter 0.8s cubic-bezier(0.25,1,0.5,1), transform 0.8s cubic-bezier(0.25,1,0.5,1)",
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
              sizes="(max-width: 768px) 80vw, 40vw"
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
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
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
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], repeat: Infinity, repeatType: "loop" }}
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
          <TransitionLink href="/" className="absolute top-0 left-0 p-1 md:p-2 group">
            <Image
              src="/logo.png"
              alt="MKS Studio Logo"
              width={300}
              height={135}
              className="w-[140px] md:w-[220px] lg:w-[300px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity"
              priority
            />
          </TransitionLink>

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

        {/* Active Project Counter */}
        <div className="absolute top-6 md:top-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-1/2 md:mr-20 flex items-center gap-3 z-50">
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 font-medium">
            Projects
          </span>
          <span className="text-[10px] md:text-xs text-white/30">|</span>
          <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/50 font-medium">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Active Project Title */}
        <div className="hidden md:flex absolute top-10 left-1/2 -translate-x-1/2 items-center justify-center overflow-hidden h-6">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              className="text-xs tracking-[0.3em] uppercase text-white/70 font-medium whitespace-nowrap"
            >
              {projects[activeIndex]?.title}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10">
          <motion.div className="h-full bg-white/60" style={{ width: progressWidth }} />
        </div>

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
            style={{ x }}
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
