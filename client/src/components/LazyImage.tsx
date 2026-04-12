import { useLazyImage } from "@/hooks/useLazyImage";
import { CSSProperties } from "react";

interface LazyImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
}

export default function LazyImage({
  src,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3C/svg%3E",
  alt,
  className = "",
  style,
  width,
  height,
}: LazyImageProps) {
  const { ref, isLoaded, error } = useLazyImage();

  return (
    <img
      ref={ref}
      data-src={src}
      src={placeholder}
      alt={alt}
      className={`${className} transition-all duration-500 ${
        isLoaded ? "opacity-100 blur-0" : "opacity-75 blur-sm"
      } ${error ? "opacity-50" : ""}`}
      style={{
        ...style,
        width,
        height,
      }}
    />
  );
}
