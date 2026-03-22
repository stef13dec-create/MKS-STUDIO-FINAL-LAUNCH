"use client";

import { motion } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";

export default function Contact() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#1C1C1C] text-[#E4E3E0] font-sans">
      <CustomCursor />

      {/* LEFT PANEL - Image */}
      <div className="relative hidden md:block w-1/2 h-full overflow-hidden">
        {/* Logo top left */}
        <div className="absolute top-8 left-8 z-50 mix-blend-difference">
          <TransitionLink href="/" className="flex flex-col items-start gap-1 group">
            <div className="text-2xl font-light tracking-widest leading-none">LM</div>
          </TransitionLink>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/contact-hero.png"
            alt="MKS Studio Architecture Detail"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* RIGHT PANEL - Form & Info */}
      <div className="relative w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:p-16 lg:p-24 overflow-y-auto">
        
        {/* Mobile Logo */}
        <div className="md:hidden mb-12">
          <TransitionLink href="/" className="flex flex-col items-start gap-1 group">
            <div className="text-2xl md:text-3xl font-light tracking-widest leading-none">LM</div>
            <div className="text-[6px] md:text-[8px] tracking-[0.4em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">Liron Moran</div>
            <div className="text-[6px] md:text-[8px] tracking-[0.4em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">Interiors</div>
          </TransitionLink>
        </div>

        {/* Right Corner Nav */}
        <div className="absolute top-8 right-8 z-50 text-[10px] md:text-xs tracking-widest uppercase font-medium opacity-80 mix-blend-difference">
           <TransitionLink href="/about" className="hover:opacity-70 transition-opacity text-white">
              About
            </TransitionLink>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
           className="mt-8 md:mt-0"
        >
          <h1 className="text-5xl md:text-7xl font-sans font-light tracking-tighter leading-none mb-12">
            Let's<br/>Talk.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-4">Email</h3>
              <a href="mailto:hello@lironmoran.com" className="text-lg md:text-xl font-light hover:italic transition-all inline-block hover:translate-x-1 duration-300">hello@lironmoran.com</a>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-4">Phone</h3>
              <a href="tel:+1234567890" className="text-lg md:text-xl font-light hover:italic transition-all inline-block hover:translate-x-1 duration-300">+1 (234) 567-890</a>
            </div>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer"
              />
              <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
            </div>
            
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer"
              />
              <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
            </div>

            <div className="relative group">
              <textarea 
                placeholder="Tell us about your project" 
                rows={3}
                className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer resize-none"
              />
              <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
            </div>

            <button 
              type="submit"
              className="mt-8 px-10 py-5 rounded-full text-[10px] md:text-xs tracking-[0.2em] uppercase border border-white/30 hover:bg-white hover:text-black transition-all duration-300"
              data-cursor-effect="true"
            >
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Footer info */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="mt-20 flex justify-between items-end text-[8px] md:text-[10px] tracking-widest uppercase opacity-50"
        >
          <div>
            123 Design Avenue<br/>
            New York, NY 10012
          </div>
          <div className="text-right flex flex-col gap-1">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
