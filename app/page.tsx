"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import Loader from "@/components/Loader";
import CustomCursor from "@/components/CustomCursor";
import { getPath } from "@/lib/utils";

import LiquidImage from "@/components/LiquidImage";
import { Project, projects as projectsData } from "@/lib/data";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem("loaderShown")) {
      setLoading(false);
    }
  }, []);
  const [projects] = useState<Project[]>(projectsData);
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [shineTrigger, setShineTrigger] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const advance = useCallback((dir: 1 | -1) => {
    if (projects.length === 0) return;
    setIsScrolling(true);
    setDirection(dir);
    setActiveProject((prev) => (prev + dir + projects.length) % projects.length);
    setShineTrigger((prev) => prev + 1);
    setTimeout(() => setIsScrolling(false), 600);
  }, [projects.length]);

  // Auto-scroll effect
  useEffect(() => {
    if (isHovered || menuOpen || loading) return;
    const timer = setInterval(() => {
      advance(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, menuOpen, loading, advance]);

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || menuOpen) return;
      if (e.deltaY > 30) advance(1);
      else if (e.deltaY < -30) advance(-1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || menuOpen) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      advance(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isScrolling, menuOpen, advance]);

  return (
    <>
      <CustomCursor />
      {loading && <Loader onComplete={() => { sessionStorage.setItem("loaderShown", "1"); setLoading(false); }} />}

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 pointer-events-auto flex">
            {/* Background Columns */}
            <div className="absolute inset-0 flex w-full h-full overflow-hidden">
              {[0, 1, 2, 3, 4].map((col) => (
                <motion.div
                  key={col}
                  className="w-1/5 h-full bg-black"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{
                    y: "-100%",
                    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 * col }
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                    delay: 0.05 * (4 - col),
                  }}
                />
              ))}
            </div>

            {/* Menu Content */}
            <motion.div
              className="absolute inset-0 z-10 text-white p-6 md:p-10 flex flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {/* Header inside menu */}
              <header className="w-full flex justify-between items-start">
                <Link href="/" className="flex flex-col items-start gap-1 group ml-12 md:ml-20" onClick={() => setMenuOpen(false)}>
                  <Image src={getPath("/logo.png")} alt="MKS Studio Logo" width={150} height={68} className="w-[70px] md:w-[150px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" priority />
                </Link>

                <div className="flex items-center gap-6">
                  <Link href="/gallery" onClick={() => setMenuOpen(false)} className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium opacity-70 hover:opacity-100 transition-opacity">
                    Gallery
                  </Link>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors relative group"
                    data-cursor-text="CLOSE"
                  >
                    <span className="absolute w-4 md:w-5 h-[1px] bg-current rotate-45 group-hover:bg-black transition-colors" />
                    <span className="absolute w-4 md:w-5 h-[1px] bg-current -rotate-45 group-hover:bg-black transition-colors" />
                  </button>
                </div>
              </header>

              {/* Main Menu Content */}
              <div className="flex-1 flex items-center justify-between mt-10 md:mt-20">
                <nav>
                  <ul className="flex flex-col gap-4 md:gap-6 text-5xl md:text-7xl lg:text-[7vw] font-sans font-medium uppercase tracking-tighter leading-none">
                    {["Home", "Projects", "About", "Contact"].map((item, i) => (
                      <li key={item} onMouseEnter={() => !isMobile && setHoveredItem(i)} onMouseLeave={() => !isMobile && setHoveredItem(null)}>
                        <Link
                          href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center group"
                          data-cursor-text="GO"
                        >
                          <span className="text-2xl md:text-5xl mr-2 md:mr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 md:w-20 flex justify-end overflow-visible">
                            <motion.span
                              initial={{ x: -20 }}
                              animate={{ x: !isMobile && hoveredItem === i ? 0 : -20 }}
                              transition={{ duration: 0.3 }}
                              className="block"
                            >
                              &rarr;
                            </motion.span>
                          </span>
                          <motion.div
                            animate={{ x: !isMobile && hoveredItem === i ? 20 : 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex"
                          >
                            {item.split("").map((char, charIndex) => (
                              <motion.span
                                key={charIndex}
                                animate={{ rotateY: !isMobile && hoveredItem === i ? 180 : 0 }}
                                transition={{
                                  duration: 0.6,
                                  ease: [0.76, 0, 0.24, 1],
                                  delay: charIndex * 0.04
                                }}
                                style={{ display: "inline-block", whiteSpace: "pre" }}
                              >
                                {char}
                              </motion.span>
                            ))}
                          </motion.div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="hidden md:flex flex-col items-end justify-between h-full py-10 w-1/3">
                  <p className="text-right text-xs md:text-sm tracking-widest leading-relaxed max-w-xs uppercase opacity-80">
                    Contemporary moods with traditional twists that work together to deliver a unique look and feel for every client.
                  </p>
                  <div className="text-[15vw] leading-none font-sans font-light tracking-tighter">
                    0{hoveredItem !== null ? hoveredItem + 1 : 1}
                  </div>
                </div>
              </div>

              {/* Footer inside menu */}
              <footer className="w-full flex justify-between items-end text-[8px] md:text-[10px] tracking-widest uppercase font-medium opacity-80">
                <div>Commercial Interiors</div>
                <div className="flex gap-8">
                  <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
                  <a href="#" className="hover:opacity-100 transition-opacity">Facebook</a>
                </div>
                <div className="md:hidden text-6xl leading-none font-sans font-light">
                  0{hoveredItem !== null ? hoveredItem + 1 : 1}
                </div>
              </footer>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main 
        className="relative w-full h-[100svh] md:h-screen overflow-hidden text-white font-sans transition-colors duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ backgroundColor: ["#51534E", "#40423D", "#2F312D"][activeProject % 3] }}
      >
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-4 md:p-6 z-40 flex justify-between items-start">
          <Link href="/" className="absolute top-0 left-0 p-1 md:p-2 group">
            <Image src={getPath("/logo.png")} alt="MKS Studio Logo" width={150} height={68} className="w-[70px] md:w-[150px] object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" priority />
          </Link>

          <div className="flex items-center gap-6 ml-auto">
            <TransitionLink href="/gallery" className="hidden md:block text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity">
              Gallery
            </TransitionLink>
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex flex-col items-center justify-center gap-1.5 hover:bg-white hover:text-black transition-colors"
            >
              <span className="w-4 md:w-5 h-[1px] bg-current block" />
              <span className="w-4 md:w-5 h-[1px] bg-current block" />
            </button>
          </div>
        </header>

        {/* Left Indicator - Pill-shaped upward scroll animation (DESKTOP ONLY) */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 z-30 pointer-events-none">
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
          <span className="text-[10px] tracking-widest uppercase opacity-80">Scroll</span>
        </div>

        {/* Right Indicator */}
        <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 text-[10px] md:text-xs tracking-widest uppercase font-medium opacity-80 pointer-events-none hidden md:block">
          {projects.length > 0 ? (
            <>{activeProject + 1} - {projects.length}</>
          ) : (
            <>... - ...</>
          )}
        </div>

        {/* Footer */}
        <footer className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:left-10 flex justify-between items-end z-30 text-[8px] md:text-[10px] tracking-widest uppercase font-medium opacity-80">
          <div className="hidden md:block">Commercial Interiors</div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center w-full max-w-[200px]">
            <TransitionLink href="/projects" className="underline underline-offset-4 hover:opacity-100 transition-opacity text-center whitespace-nowrap">
              View All Projects
            </TransitionLink>
          </div>
          <div className="hidden md:block">&copy;2026</div>
        </footer>

        {/* Center Content (Text & Image) */}
        <div className="absolute inset-0 flex flex-col items-center justify-around z-10 pt-[12svh] pb-[6svh] md:pt-0 md:pb-0 md:justify-center">
          {/* Image Slider */}
          <div className="relative z-20 flex flex-col items-center gap-3 md:gap-6 w-full">
            {/* Top Text */}
            <div className="absolute bottom-full mb-6 md:mb-10 w-full flex justify-center pointer-events-none">
              <h2
                key={shineTrigger}
                className={`text-lg md:text-2xl font-sans tracking-[0.4em] pl-[0.4em] uppercase whitespace-nowrap ${shineTrigger > 0 ? 'animate-shine' : 'text-transparent'}`}
              >
                ICONIC PROJECTS
              </h2>
            </div>

            <div
              className="relative w-full md:w-[50vw] aspect-[4/3] md:aspect-[3/2] pointer-events-auto overflow-hidden group transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)] md:hover:scale-[1.05]"
              onMouseEnter={() => {
                setShineTrigger(prev => prev + 1);
                setIsHovered(true);
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              {projects[activeProject] && (
                <TransitionLink href={`/projects/${projects[activeProject].id}`} className="block w-full h-full" data-cursor-text="VIEW">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={activeProject}
                      custom={direction}
                      variants={{
                        initial: (direction: number) => ({
                          y: isMobile ? "0%" : (direction > 0 ? "100%" : "-100%"),
                          opacity: 0,
                          scale: isMobile ? 1.03 : 1.1
                        }),
                        animate: {
                          y: "0%",
                          opacity: 1,
                          scale: 1
                        },
                        exit: (direction: number) => ({
                          y: isMobile ? "0%" : (direction > 0 ? "-100%" : "100%"),
                          opacity: 0,
                          scale: isMobile ? 0.98 : 0.95,
                          zIndex: 0
                        })
                      }}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ 
                        duration: 0.8, 
                        ease: [0.76, 0, 0.24, 1],
                        opacity: { duration: 0.4 }
                      }}
                      className="absolute inset-0 z-10"
                    >
                      <LiquidImage
                        src={projects[activeProject].image}
                        alt={projects[activeProject].title}
                        fit={isMobile ? "cover" : (projects[activeProject].heroFit || "cover")}
                        className="transition-transform duration-[0.8s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                    </motion.div>
                  </AnimatePresence>
                </TransitionLink>
              )}
            </div>

            {/* Project Info */}
            <div className="relative flex flex-col items-center text-center px-6 mt-2">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={activeProject}
                  custom={direction}
                  variants={{
                    initial: (direction: number) => ({
                      y: direction > 0 ? "20px" : "-20px",
                      opacity: 0
                    }),
                    animate: {
                      y: "0%",
                      opacity: 1
                    },
                    exit: (direction: number) => ({
                      y: direction > 0 ? "-20px" : "20px",
                      opacity: 0
                    })
                  }}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  className="relative flex flex-col items-center"
                >
                  {projects[activeProject] && (
                    <>
                      <span className="text-sm md:text-base tracking-[0.2em] pl-[0.2em] uppercase font-medium">{projects[activeProject].title}</span>
                      <span className="text-[10px] md:text-xs tracking-widest pl-[0.1em] uppercase opacity-70 mt-1">{projects[activeProject].subtitle}</span>
                      
                      <div className="flex flex-col items-center mt-6 md:hidden pointer-events-none">
                        <span className="text-[10px] tracking-[0.3em] pl-[0.3em] uppercase opacity-60 font-medium mb-3">
                          {activeProject + 1} / {projects.length}
                        </span>
                        
                        {/* Mobile Scroll Indicator Inside Flow */}
                        <div className="w-[16px] h-[28px] rounded-full border border-white/20 flex justify-center p-0.5 pt-0.5 opacity-40">
                          <motion.div
                            animate={{
                              y: [12, 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: [0.76, 0, 0.24, 1],
                            }}
                            className="w-0.5 h-1 bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
