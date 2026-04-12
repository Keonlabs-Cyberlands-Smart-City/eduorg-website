import { useEffect, useRef, useState } from "react";

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyImage = (options: UseLazyImageOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = "50px",
  } = options;

  const ref = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && ref.current) {
          const img = ref.current;
          const src = img.dataset.src;

          if (src) {
            const image = new Image();
            image.onload = () => {
              img.src = src;
              setIsLoaded(true);
            };
            image.onerror = () => {
              setError(true);
            };
            image.src = src;
          }

          observer.unobserve(img);
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
  }, [threshold, rootMargin]);

  return {
    ref,
    isLoaded,
    error,
  };
};
