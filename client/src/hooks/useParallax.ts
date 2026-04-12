import { useEffect, useRef, useState } from "react";

interface ParallaxConfig {
  speed?: number; // 0.5 = half speed, 1 = normal speed
  offset?: number; // Initial offset in pixels
  direction?: "up" | "down"; // Direction of parallax movement
}

export const useParallax = (config: ParallaxConfig = {}) => {
  const {
    speed = 0.5,
    offset = 0,
    direction = "up",
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const [offset3D, setOffset3D] = useState(offset);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const element = ref.current;
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top;
      const windowHeight = window.innerHeight;

      // Only apply parallax when element is in viewport
      if (elementTop < windowHeight && elementTop + elementRect.height > 0) {
        // Calculate scroll distance from top of viewport
        const scrollDistance = windowHeight - elementTop;
        
        // Apply parallax offset based on speed and direction
        const parallaxOffset = direction === "up" 
          ? scrollDistance * speed 
          : -scrollDistance * speed;

        setOffset3D(parallaxOffset);
      }
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, direction]);

  return {
    ref,
    style: {
      transform: `translateY(${offset3D}px)`,
      willChange: "transform",
    },
  };
};
