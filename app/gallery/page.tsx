"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import { Accessibility } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import { getGalleryImages, GalleryImage } from "@/lib/firebase";
import { useEffect } from "react";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGalleryImages();
        setGalleryImages(data);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
    }),
    center: {
      x: "0%",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
    }),
  };

  const rightImageVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  const numberVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  if (loading || !currentImage) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#51524c] text-white">
        <div className="animate-pulse text-xs tracking-[0.4em] uppercase opacity-50">Loading Gallery...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#51524c] text-white font-sans">
      <CustomCursor />

      {/* LEFT PANEL */}
      <div className="relative w-1/2 h-full overflow-hidden bg-black">
        {/* Logo top left */}
        <div className="absolute top-0 left-0 p-1 md:p-2 z-50 mix-blend-difference">
          <TransitionLink href="/" className="group">
            <Image src="/logo.png" alt="MKS Studio Logo" width={240} height={105} className="w-[120px] md:w-[180px] lg:w-[240px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" priority />
          </TransitionLink>
        </div>

        {/* Images */}
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
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {/* Bottom Left Text */}
        <div className="absolute bottom-8 left-8 z-50 mix-blend-difference">
          <span className="text-xs tracking-widest uppercase font-medium">COMMERCIAL INTERIORS</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative w-1/2 h-full flex items-center justify-center">

        {/* Top Left Number */}
        <div className="absolute top-8 left-8 overflow-hidden h-32 w-32">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={numberVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 text-[6rem] md:text-[8rem] leading-none font-light tracking-tighter"
            >
              {formatNumber(currentIndex + 1)}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Right Close */}
        <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
          <span className="text-xs tracking-widest uppercase font-medium">CLOSE</span>
          <TransitionLink href="/" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors group">
            <div className="flex flex-col gap-1.5 transition-transform group-hover:scale-90">
              <div className="w-4 h-px bg-current" />
              <div className="w-4 h-px bg-current" />
            </div>
          </TransitionLink>
        </div>

        {/* Center Image (Next Image Preview) */}
        <div className="relative w-[60%] aspect-[4/3] overflow-hidden">
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
                src={nextImage.src}
                alt={nextImage.alt}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PREV Button */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 text-xs tracking-widest uppercase font-medium hover:opacity-70 transition-opacity z-50"
          data-cursor-effect="true"
        >
          PREV
        </button>

        {/* NEXT Button */}
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-xs tracking-widest uppercase font-medium hover:opacity-70 transition-opacity z-50"
          data-cursor-effect="true"
        >
          NEXT
        </button>

        {/* Bottom Left Counter */}
        <div className="absolute bottom-8 left-8">
          <span className="text-xs tracking-widest font-medium">
            {formatNumber(currentIndex + 1)} - {formatNumber(galleryImages.length)}
          </span>
        </div>

        {/* Bottom Center Text */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-xs tracking-widest uppercase font-medium">INTERIORS GALLERY</span>
        </div>

        {/* Bottom Right Icons */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          <button
            aria-label="Accessibility options"
            className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
          >
            <Accessibility size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
