import { ReactNode } from "react";
import { useParallax } from "@/hooks/useParallax";

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  speed?: number;
  minHeight?: string;
  className?: string;
}

export default function ParallaxHero({
  children,
  backgroundImage,
  speed = 0.5,
  minHeight = "600px",
  className = "",
}: ParallaxHeroProps) {
  const { ref, style } = useParallax({ speed, direction: "up" });

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        minHeight,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Parallax background layer */}
      {backgroundImage && (
        <div
          style={{
            ...style,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
      )}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content layer */}
      <div className="relative z-20 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
