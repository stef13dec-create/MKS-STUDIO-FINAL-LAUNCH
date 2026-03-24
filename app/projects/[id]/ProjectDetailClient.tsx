"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import LiquidImage from "@/components/LiquidImage";
import { getProject, getProjects, Project } from "@/lib/firebase";
import { getPath } from "@/lib/utils";

export default function ProjectDetailClient({ id }: { id: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current project by ID (single doc read — fast)
    getProject(id)
      .then((proj) => {
        setProject(proj);
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      })
      .finally(() => {
        setLoading(false);
      });

    // Fetch next project in parallel without blocking the main render
    getProjects()
      .then((allProjects) => {
        const currentIndex = allProjects.findIndex((p) => p.id === id);
        if (currentIndex !== -1) {
          setNextProject(allProjects[(currentIndex + 1) % allProjects.length]);
        }
      })
      .catch((error) => {
        console.error("Error fetching next project:", error);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1c18] text-white">
        <div className="animate-pulse text-xs tracking-[0.4em] uppercase opacity-50">Loading Project...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#1a1c18] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-sans font-light tracking-widest uppercase mb-4">Project Not Found</h1>
          <TransitionLink href="/" className="underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">Back to Home</TransitionLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1c18] text-white min-h-screen font-sans selection:bg-white selection:text-black">
      <CustomCursor />
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference">
        <Link href="/" className="group">
          <Image 
            src={getPath("/logo.png")} 
            alt="MKS Studio Logo" 
            width={180} 
            height={80} 
            className="w-[120px] md:w-[180px] h-auto object-contain invert brightness-0 opacity-80 group-hover:opacity-100 transition-opacity" 
          />
        </Link>
        <div className="flex items-center gap-8">
          <TransitionLink href="/projects" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity">
            All Projects
          </TransitionLink>
          <TransitionLink href="/" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors group">
             <span className="text-xl group-hover:scale-110 transition-transform">&times;</span>
          </TransitionLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
          className="w-full h-full"
        >
          <LiquidImage 
            src={project.image} 
            alt={project.title} 
            className="object-cover w-full h-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-6 md:bottom-20 md:left-20 z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            <span className="text-xs md:text-sm tracking-[0.4em] uppercase opacity-80 block mb-2">{project.category}</span>
            <h1 className="text-5xl md:text-8xl lg:text-[10vw] font-medium tracking-tighter leading-none uppercase">{project.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="px-6 py-20 md:px-20 md:py-40 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">Year</span>
            <span className="text-lg md:text-xl font-medium tracking-wider">{project.date}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">Area</span>
            <span className="text-lg md:text-xl font-medium tracking-wider">{project.size}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">Category</span>
            <span className="text-lg md:text-xl font-medium tracking-wider">{project.category}</span>
          </div>
        </div>
        
        <div className="md:col-span-8">
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-xl md:text-3xl lg:text-4xl font-light leading-relaxed tracking-tight text-white/90"
          >
            {project.description}
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="px-6 md:px-20 pb-40 flex flex-col gap-10 md:gap-20">
          {project.gallery.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`relative overflow-hidden w-full ${index % 2 === 0 ? 'aspect-[16/9]' : 'aspect-square md:w-[60%] md:ml-auto'}`}
            >
              <div className="group relative w-full h-full">
                <Image
                  src={img}
                  alt={`${project.title} Gallery ${index + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Next Project Footer */}
      {nextProject && (
        <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
          <TransitionLink href={`/projects/${nextProject.id}`} className="block w-full h-full cursor-none" data-cursor-text="NEXT">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-700 z-10" />
            <Image 
              src={nextProject.image} 
              alt={nextProject.title} 
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
              <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4 opacity-70 group-hover:translate-y-[-10px] transition-transform duration-700">Next Project</span>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-medium tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">{nextProject.title}</h2>
              <div className="mt-8 overflow-hidden h-px w-20 bg-white/30 group-hover:w-40 transition-all duration-700" />
            </div>
          </TransitionLink>
        </section>
      )}

      {/* Footer Minimal */}
      <footer className="p-10 text-center text-[10px] tracking-[0.3em] uppercase opacity-40 font-medium">
        &copy; 2026 MKS Studio. All Rights Reserved.
      </footer>
    </div>
  );
}
