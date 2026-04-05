"use client";

import { useTransition } from "./TransitionProvider";
import { AnchorHTMLAttributes, ReactNode } from "react";

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export default function TransitionLink({ href, children, className, ...props }: TransitionLinkProps) {
  const { navigate } = useTransition();
  
  return (
    <a 
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
