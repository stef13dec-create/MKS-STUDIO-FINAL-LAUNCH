"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import CustomCursor from "@/components/CustomCursor";
import LiquidImage from "@/components/LiquidImage";
import { projects as projectsData } from "@/lib/data";
import { getPath } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const isImageDrawing = (path: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(path);

export default function ProjectDetailClient({ id }: { id: string }) {
  const { t, lang, setLang } = useTranslation();

  const project = projectsData.find((p) => p.id === id) ?? null;
  const currentIndex = projectsData.findIndex((p) => p.id === id);
  const nextProject = currentIndex !== -1 ? projectsData[(currentIndex + 1) % projectsData.length] : null;

  if (!project) {
    return (
      <div className="h-[100svh] md:h-screen w-full flex items-center justify-center bg-[#1a1c18] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-sans font-light tracking-widest uppercase mb-4">{t("projectDetail.notFound")}</h1>
          <TransitionLink href="/" className="underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">{t("projectDetail.backToHome")}</TransitionLink>
        </div>
      </div>
    );
  }

  const projectTitle = lang === "ro" && project.titleRo ? project.titleRo : project.title;
  const projectDescription = lang === "ro" && project.descriptionRo ? project.descriptionRo : project.description;
  const nextTitle = nextProject ? (lang === "ro" && nextProject.titleRo ? nextProject.titleRo : nextProject.title) : "";

  return (
    <div className="bg-[#1a1c18] text-white min-h-[100svh] md:min-h-screen font-sans selection:bg-white selection:text-black">
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
          <div className="flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase font-medium">
            <button onClick={() => setLang("en")} className={lang === "en" ? "opacity-100" : "opacity-40 hover:opacity-70 transition-opacity"}>EN</button>
            <span className="opacity-20">·</span>
            <button onClick={() => setLang("ro")} className={lang === "ro" ? "opacity-100" : "opacity-40 hover:opacity-70 transition-opacity"}>RO</button>
          </div>
          <TransitionLink href="/projects" className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity">
            {t("nav.allProjects")}
          </TransitionLink>
          <TransitionLink href="/" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-colors group">
             <span className="text-xl group-hover:scale-110 transition-transform">&times;</span>
          </TransitionLink>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[100svh] md:h-screen w-full overflow-hidden">
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
            <h1 className="text-5xl md:text-8xl lg:text-[10vw] font-medium tracking-tighter leading-none uppercase">{projectTitle}</h1>
          </motion.div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="px-6 py-20 md:px-20 md:py-40 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">{t("projectDetail.yearLabel")}</span>
            <span className="text-lg md:text-xl font-medium tracking-wider">{project.date}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">{t("projectDetail.areaLabel")}</span>
            <span className="text-lg md:text-xl font-medium tracking-wider">{project.size}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">{t("projectDetail.categoryLabel")}</span>
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
            {projectDescription}
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
                {img.endsWith(".mp4") ? (
                  <video
                    src={getPath(img)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={getPath(img)}
                    alt={`${project.title} Gallery ${index + 1}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Technical Drawings Section */}
      {project.drawings && project.drawings.length > 0 && (
        <section className="px-6 py-20 md:px-20 bg-[#121410] border-y border-white/5">
          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-4 max-w-2xl">
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-50 font-bold">{t("projectDetail.technicalDocs")}</span>
              <h2 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase leading-tight">{t("projectDetail.blueprintsHeading")}</h2>
              <p className="text-sm opacity-40 leading-relaxed max-w-lg mt-2">{t("projectDetail.blueprintsDesc")}</p>
            </div>

            <div className="flex flex-col gap-16">
              {(() => {
                const categories: { [key: string]: string[] } = {
                  [t("projectDetail.siteAndSituation")]: [],
                  [t("projectDetail.floorPlans")]: [],
                  [t("projectDetail.facadesAndSections")]: [],
                  [t("projectDetail.technicalDetails")]: [],
                  [t("projectDetail.generalDocs")]: [],
                };

                project.drawings?.forEach(d => {
                  const filename = d.split('/').pop()?.toUpperCase() || "";
                  if (filename.startsWith("A0")) categories[t("projectDetail.siteAndSituation")].push(d);
                  else if (filename.startsWith("A1")) categories[t("projectDetail.floorPlans")].push(d);
                  else if (filename.startsWith("A3")) categories[t("projectDetail.facadesAndSections")].push(d);
                  else if (filename.startsWith("A7") || filename.startsWith("A9") || filename.includes("FURNITURE")) categories[t("projectDetail.technicalDetails")].push(d);
                  else categories[t("projectDetail.generalDocs")].push(d);
                });

                return Object.entries(categories)
                  .filter(([_, docs]) => docs.length > 0)
                  .map(([title, docs]) => (
                    <div key={title} className="flex flex-col gap-8">
                      <div className="flex items-center gap-4">
                        <div className="h-px bg-white/10 flex-grow" />
                        <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-30 whitespace-nowrap">{title}</h3>
                        <div className="w-10 h-px bg-white/10" />
                      </div>

                      <div className="md:hidden flex flex-col gap-4">
                        {docs.map((drawing, index) => {
                          const fileName = drawing.split('/').pop()?.replace(/_/g, ' ').replace(/\.(pdf|jpg|jpeg|png|webp)$/i, '') || 'Drawing';
                          const isImg = isImageDrawing(drawing);
                          return isImg ? (
                            /* Image drawing — show as full-width image on mobile */
                            <a
                              key={index}
                              href={getPath(drawing)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-full aspect-[4/3] overflow-hidden bg-white rounded-sm"
                            >
                              <Image
                                src={getPath(drawing)}
                                alt={fileName}
                                fill
                                className="object-contain p-4"
                                sizes="100vw"
                                loading="lazy"
                              />
                            </a>
                          ) : (
                            /* PDF — text link */
                            <a
                              key={index}
                              href={getPath(drawing)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 px-4 py-3 border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-colors rounded-sm"
                            >
                              <span className="text-[10px] tracking-[0.2em] uppercase text-white/80 line-clamp-1">
                                {fileName}
                              </span>
                              <span className="text-[9px] tracking-[0.25em] uppercase text-white/40">{t("common.open")}</span>
                            </a>
                          );
                        })}
                      </div>

                      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {docs.map((drawing, index) => {
                          const fileName = drawing.split('/').pop()?.replace(/_/g, ' ').replace(/\.(pdf|jpg|jpeg|png|webp)$/i, '') || 'Drawing';
                          const isImg = isImageDrawing(drawing);
                          return (
                            <motion.a
                              key={index}
                              href={getPath(drawing)}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
                              className="group relative flex flex-col bg-white border border-black/5 overflow-hidden hover:border-black/20 transition-all duration-500 rounded-sm shadow-sm"
                            >
                              {isImg ? (
                                /* Image drawing — show full image, taller card */
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-white">
                                  <Image
                                    src={getPath(drawing)}
                                    alt={fileName}
                                    fill
                                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                /* PDF — iframe preview */
                                <div className="relative aspect-square overflow-hidden bg-white p-10 pb-24 pointer-events-none">
                                  <iframe
                                    src={`${getPath(drawing)}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                                    className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                    loading="lazy"
                                  />
                                </div>
                              )}

                              {/* Label */}
                              <div className="p-5 flex items-center justify-between gap-3 bg-white border-t border-black/5">
                                <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-black/50 group-hover:text-black transition-colors line-clamp-1">
                                  {fileName}
                                </span>
                                <ExternalLink size={14} className="text-black/20 group-hover:text-black/50 transition-colors flex-shrink-0" />
                              </div>
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  ));
              })()}
            </div>
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      {nextProject && (
        <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
          <TransitionLink href={`/projects/${nextProject.id}`} className="block w-full h-full cursor-none" data-cursor-text="NEXT">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-700 z-10" />
            <Image
              src={getPath(nextProject.image)}
              alt={nextProject.title}
              fill
              className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
              <span className="text-[10px] md:text-xs tracking-[0.5em] uppercase mb-4 opacity-70 group-hover:translate-y-[-10px] transition-transform duration-700">{t("projectDetail.nextProject")}</span>
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-medium tracking-tighter uppercase group-hover:scale-105 transition-transform duration-700">{nextTitle}</h2>
              <div className="mt-8 overflow-hidden h-px w-20 bg-white/30 group-hover:w-40 transition-all duration-700" />
            </div>
          </TransitionLink>
        </section>
      )}

      {/* Footer Minimal */}
      <footer className="p-10 text-center text-[10px] tracking-[0.3em] uppercase opacity-40 font-medium">
        {t("projectDetail.allRightsReserved")}
      </footer>
    </div>
  );
}
