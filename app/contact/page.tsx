"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import BackHome from "@/components/BackHome";
import { getPath } from "@/lib/utils";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    // Open email client with pre-filled content
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:hello@mks-studio.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1C1C1C] text-[#E4E3E0] font-sans">
      <CustomCursor />

      {/* Top Bar */}
      <nav className="flex-shrink-0 w-full z-50 bg-[#1C1C1C]/95 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 md:px-8 h-12 md:h-14">
          <TransitionLink href="/" className="group flex-shrink-0">
            <Image src={getPath("/logo.png")} alt="MKS Studio Logo" width={80} height={36} className="w-[60px] md:w-[80px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" priority />
          </TransitionLink>
          <div className="flex items-center gap-4 md:gap-8">
            <TransitionLink href="/" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-70 hover:opacity-100 transition-opacity">
              Home
            </TransitionLink>
            <TransitionLink href="/about" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium opacity-70 hover:opacity-100 transition-opacity">
              About
            </TransitionLink>
          </div>
        </div>
      </nav>

      {/* Content Row */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT PANEL — Image (desktop only) */}
        <div className="relative hidden md:block w-1/2 h-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={getPath("/projects/bucharest-hq-hero.png")}
              alt="MKS Studio Architecture Detail"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* RIGHT PANEL — Form & Info */}
        <div className="relative w-full md:w-1/2 h-full flex flex-col justify-between p-8 md:p-16 lg:p-24 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="mt-8 md:mt-0"
          >
            <h1 className="text-5xl md:text-7xl font-sans font-light tracking-tighter leading-none mb-12">
              Let&apos;s<br />Talk.
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div>
                <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-4">Email</h3>
                <a href="mailto:hello@mks-studio.com" className="text-lg md:text-xl font-light hover:italic transition-all inline-block hover:translate-x-1 duration-300">hello@mks-studio.com</a>
              </div>
              <div>
                <h3 className="text-[10px] tracking-[0.2em] uppercase opacity-50 mb-4">Phone</h3>
                <a href="tel:+1234567890" className="text-lg md:text-xl font-light hover:italic transition-all inline-block hover:translate-x-1 duration-300">+1 (234) 567-890</a>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="thanks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  className="py-16 flex flex-col gap-4"
                >
                  <p className="text-3xl md:text-4xl font-light tracking-tight">Thank you.</p>
                  <p className="text-sm opacity-50 tracking-widest uppercase">Your email client has been opened — we&apos;ll get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setName(""); setEmail(""); setMessage(""); }}
                    className="mt-6 self-start text-[10px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity border-b border-current pb-1"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                  onSubmit={handleSubmit}
                >
                  <div className="relative group">
                    <label htmlFor="contact-name" className="sr-only">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer"
                    />
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
                  </div>

                  <div className="relative group">
                    <label htmlFor="contact-email" className="sr-only">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer"
                    />
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
                  </div>

                  <div className="relative group">
                    <label htmlFor="contact-message" className="sr-only">Message</label>
                    <textarea
                      id="contact-message"
                      placeholder="Tell us about your project"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-white/20 py-4 text-base md:text-lg font-light focus:outline-none focus:border-white transition-colors peer resize-none"
                    />
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-white transition-all duration-500 peer-focus:w-full" />
                  </div>

                  <button
                    type="submit"
                    className="mt-8 px-10 py-5 rounded-full text-[10px] md:text-xs tracking-[0.2em] uppercase border border-white/30 hover:bg-white hover:text-black transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    data-cursor-effect="true"
                  >
                    Send Message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <BackHome />
          </motion.div>

          {/* Footer info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 flex justify-between items-end text-[10px] md:text-[11px] tracking-widest uppercase opacity-50"
          >
            <div>
              123 Design Avenue<br />
              New York, NY 10012
            </div>
            <div className="text-right flex flex-col gap-1">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
