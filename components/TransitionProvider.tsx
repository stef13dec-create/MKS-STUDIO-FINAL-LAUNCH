"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

import { getPath } from '@/lib/utils';

interface TransitionContextType {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({ navigate: () => {} });

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");
  const router = useRouter();
  const pathname = usePathname();
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const navigate = (href: string) => {
    if (href === pathname) return;
    setIsTransitioning(true);
    setPhase("in");
    setTargetHref(href);
    
    // Wait for columns to cover screen
    setTimeout(() => {
      router.push(getPath(href));
    }, 1000); // 0.8s duration + 0.2s max delay
  };

  useEffect(() => {
    if (phase === "in" && targetHref === pathname) {
      // Once route changes, animate out
      setPhase("out");
      setTimeout(() => {
        setIsTransitioning(false);
        setPhase("idle");
        setTargetHref(null);
      }, 1000);
    }
  }, [pathname, phase, targetHref]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      
      {/* Columns Overlay */}
      <div 
        className={`fixed inset-0 z-[100] pointer-events-none flex ${isTransitioning ? "" : "hidden"}`}
      >
        {[0, 1, 2, 3, 4].map((col) => {
          let yValue = "100%";
          if (phase === "in") yValue = "0%";
          else if (phase === "out") yValue = "-100%";

          return (
            <motion.div
              key={col}
              className="w-1/5 h-full bg-black"
              initial={false}
              animate={{ y: yValue }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
                delay: col * 0.05
              }}
            />
          );
        })}
      </div>
    </TransitionContext.Provider>
  );
}
