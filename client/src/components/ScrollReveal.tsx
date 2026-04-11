import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "zoom";
  delay?: number;
  duration?: number;
  threshold?: number | number[];
  rootMargin?: string;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  className = "",
}) => {
  const { ref, animationClass, style } = useScrollReveal({
    animation,
    delay,
    duration,
    threshold,
    rootMargin,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${animationClass} ${className}`}
      style={{
        ...style,
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
