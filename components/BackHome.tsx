"use client";
import { motion } from "motion/react";
import TransitionLink from "./TransitionLink";
import { useTranslation } from "@/contexts/LanguageContext";

export default function BackHome() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-20 w-full">
      <div className="w-[1px] h-20 bg-white/10" />
      <TransitionLink 
        href="/" 
        className="group flex flex-col items-center gap-6 transition-all duration-500 hover:scale-105"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 relative overflow-hidden">
          <motion.span 
            initial={{ x: 0 }}
            whileHover={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            &larr;
          </motion.span>
          <motion.span 
            initial={{ x: 40, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl absolute"
          >
            &larr;
          </motion.span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white/40 group-hover:text-white transition-colors">
            {t("common.backTo")}
          </span>
          <span className="text-sm tracking-[0.4em] uppercase font-bold text-white group-hover:text-white transition-colors">
            {t("common.home")}
          </span>
        </div>
      </TransitionLink>
    </div>
  );
}
