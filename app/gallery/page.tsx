"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import { GalleryImage, galleryImages as galleryData } from "@/lib/data";
import { getPath } from "@/lib/utils";

export default function Gallery() {
  const [galleryImages] = useState<GalleryImage[]>(galleryData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    if (galleryImages.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    if (galleryImages.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const currentImage = galleryImages[currentIndex];
  const nextImageIndex = galleryImages.length > 0 ? (currentIndex + 1) % galleryImages.length : 0;
  const nextImage = galleryImages[nextImageIndex];

  const leftImageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
    center: { x: "0%" },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
  };

  const rightImageVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  const numberVariants = {
    enter: (dir: number) => ({ y: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir: number) => ({ y: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  if (!currentImage) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#51524c] text-white">
        <div className="animate-pulse text-xs tracking-[0.4em] uppercase opacity-50">Loading Gallery...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#51524c] text-white font-sans">
      <CustomCursor />

      {/* ── MAIN IMAGE PANEL ─────────────────────────────────────────── */}
      <div className="relative w-full md:w-1/2 h-[62vh] md:h-full flex-shrink-0 overflow-hidden bg-black">

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={leftImageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={getPath(currentImage.src)}
              alt={currentImage.alt}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Close button — mobile only, overlaid on image */}
        <TransitionLink
          href="/"
          className="absolute top-4 right-4 z-50 md:hidden flex items-center gap-3 group"
        >
          <span className="text-[10px] tracking-widest uppercase font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            CLOSE
          </span>
          <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors relative">
            <span className="absolute w-3.5 h-px bg-current rotate-45" />
            <span className="absolute w-3.5 h-px bg-current -rotate-45" />
          </div>
        </TransitionLink>

        {/* Bottom label — desktop only */}
        <div className="absolute bottom-8 left-8 z-50 mix-blend-difference hidden md:block">
          <span className="text-xs tracking-widest uppercase font-medium">COMMERCIAL INTERIORS</span>
        </div>
      </div>

      {/* ── CONTROLS PANEL ───────────────────────────────────────────── */}
      <div className="relative w-full md:w-1/2 flex-1 md:h-full flex items-center justify-center">

        {/* Animated number */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8 overflow-hidden h-16 md:h-40 w-20 md:w-48">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={numberVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 text-[3rem] md:text-[8rem] leading-none font-light tracking-tighter"
            >
              {formatNumber(currentIndex + 1)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Close button — desktop only */}
        <TransitionLink
          href="/"
          className="absolute top-8 right-8 z-50 hidden md:flex items-center gap-4 group cursor-pointer"
        >
          <span className="text-xs tracking-widest uppercase font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            CLOSE
          </span>
          <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors relative">
            <span className="absolute w-4 h-px bg-current rotate-45" />
            <span className="absolute w-4 h-px bg-current -rotate-45" />
          </div>
        </TransitionLink>

        {/* Next image preview — desktop only */}
        <div className="relative hidden md:block w-[60%] aspect-[4/3] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={nextImageIndex}
              variants={rightImageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={getPath(nextImage.src)}
                alt={nextImage.alt}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PREV button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-[10px] md:text-xs tracking-widest uppercase font-medium hover:opacity-70 transition-opacity z-50 py-2 px-1"
          data-cursor-effect="true"
          aria-label="Previous image"
        >
          PREV
        </button>

        {/* NEXT button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-[10px] md:text-xs tracking-widest uppercase font-medium hover:opacity-70 transition-opacity z-50 py-2 px-1"
          data-cursor-effect="true"
          aria-label="Next image"
        >
          NEXT
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8">
          <span className="text-[10px] md:text-xs tracking-widest font-medium">
            {formatNumber(currentIndex + 1)} — {formatNumber(galleryImages.length)}
          </span>
        </div>

        {/* Centre label */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-[10px] md:text-xs tracking-widest uppercase font-medium">
            INTERIORS GALLERY
          </span>
        </div>
      </div>
    </div>
  );
}
