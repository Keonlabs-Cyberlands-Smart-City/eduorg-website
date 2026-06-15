import { Link } from "wouter";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { isDark, toggleDarkMode, isLoaded } = useDarkMode();
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow dark:shadow-lg transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/manus-storage/imGE_d86ffa71.png" alt="Baraka Logo" className="h-14 w-auto object-contain" />
        </Link>
        <nav className="space-x-6 hidden md:flex items-center">
          <Link href="/" className="transition hover:opacity-80 font-medium text-orange-500">Home</Link>
          <a href="/#programs" className="transition hover:opacity-80 font-medium text-orange-500">Programs</a>
          <Link href="/stories-gallery" className="transition hover:opacity-80 font-medium text-orange-500">Stories</Link>
          <a href="/#about" className="transition hover:opacity-80 font-medium text-orange-500">About</a>
          <a href="/#contact" className="transition hover:opacity-80 font-medium text-orange-500">Contact</a>
          {isLoaded && (
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-orange-500" />
              ) : (
                <Moon className="w-5 h-5 text-orange-500" />
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
