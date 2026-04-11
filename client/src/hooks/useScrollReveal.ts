import { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  threshold?: number | number[];
  rootMargin?: string;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "zoom";
  delay?: number;
  duration?: number;
}

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    animation = "fade-up",
    delay = 0,
    duration = 600,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay before revealing
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Unobserve after animation triggers
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, delay]);

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0";

    const animationMap: Record<string, string> = {
      "fade-up": "animate-fade-in-up",
      "fade-down": "animate-fade-in-down",
      "fade-left": "animate-fade-in-left",
      "fade-right": "animate-fade-in-right",
      scale: "animate-scale-in",
      zoom: "animate-zoom-in",
    };

    return animationMap[animation] || "animate-fade-in-up";
  };

  return {
    ref,
    isVisible,
    animationClass: getAnimationClass(),
    style: {
      transitionDuration: `${duration}ms`,
    },
  };
};
