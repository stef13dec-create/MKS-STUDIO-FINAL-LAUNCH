"use client";

import { motion } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import BackHome from "@/components/BackHome";
import { getPath } from "@/lib/utils";

export default function About() {
  return (
    <div className="min-h-screen w-full bg-[#1c1c1c] text-[#E4E3E0] font-sans selection:bg-[#E4E3E0] selection:text-[#1c1c1c]">
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#1c1c1c]/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 md:px-8 h-12 md:h-14">
          <TransitionLink href="/" className="group flex-shrink-0">
            <Image src={getPath("/logo.png")} alt="MKS Studio Logo" width={80} height={36} className="w-[60px] md:w-[80px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" priority />
          </TransitionLink>
          <div className="flex items-center gap-4 md:gap-8">
            <TransitionLink href="/" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-70 hover:opacity-100 transition-opacity">
              Home
            </TransitionLink>
            <TransitionLink href="/contact" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-70 hover:opacity-100 transition-opacity">
              Contact
            </TransitionLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 md:pt-28 pb-20 px-6 md:px-20 lg:px-40 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-center mb-16"
        >
          Designing spaces that inspire,<br className="hidden md:block" />
          elevate, and define.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          className="relative w-full aspect-[21/9] mb-24 overflow-hidden rounded-sm"
        >
          <Image
            src={getPath("/about-hero.png")}
            alt="MKS Studio Interior"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs tracking-[0.3em] uppercase mb-6 opacity-60">Our Philosophy</h2>
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#D1D1D1]">
              At MKS Studio, we believe that the environment you inhabit profoundly impacts your daily life and productivity. Our approach is rooted in contemporary moods intertwined with traditional twists, delivering a unique and highly personalized look for every client.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-xs tracking-[0.3em] uppercase mb-6 opacity-60">The Studio</h2>
            <p className="text-lg md:text-xl font-light leading-relaxed text-[#D1D1D1]">
              Based in the heart of the design district, our studio is a laboratory for aesthetic exploration. We collaborate closely with artisans, architects, and visionaries to execute projects that range from intimate commercial spaces to large-scale corporate headquarters.
            </p>
          </motion.div>
        </div>

        <BackHome />
      </main>

      {/* Footer */}
      <footer className="w-full p-6 md:p-10 flex justify-between items-end text-[8px] md:text-[10px] tracking-widest uppercase font-medium opacity-60 border-t border-white/5 mt-20">
        <div>Commercial Interiors</div>
        <div className="flex gap-8">
          <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a>
        </div>
        <div>&copy;2026 MKS Studio</div>
      </footer>
    </div>
  );
}
