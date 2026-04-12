import { useEffect, useState } from "react";

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress as percentage
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      
      const scrollProgress = documentHeight > 0 
        ? (scrolled / documentHeight) * 100 
        : 0;

      setProgress(Math.min(scrollProgress, 100));
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return progress;
};
