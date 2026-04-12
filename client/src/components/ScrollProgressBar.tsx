import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-500 via-orange-500 to-blue-500 z-50 transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        boxShadow: progress > 0 ? "0 0 10px rgba(149, 186, 18, 0.6)" : "none",
      }}
    />
  );
}
