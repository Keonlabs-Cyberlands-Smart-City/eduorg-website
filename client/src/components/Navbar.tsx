import { Link } from "wouter";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { isDark, toggleDarkMode, isLoaded } = useDarkMode();
  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
        <Link href="/" className="flex flex-col items-center">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg" alt="Baraka Logo" className="h-12 w-12 object-contain" />
          <span className="text-xs font-bold text-center" style={{color: '#95ba12'}}>Kapiri mposhi Baraka</span>
        </Link>
        <nav className="space-x-6 hidden md:flex items-center">
          <Link href="/" className="transition" style={{color: '#e07f10'}}>Home</Link>
          <a href="/#programs" className="transition" style={{color: '#e07f10'}}>Programs</a>
          <Link href="/stories-gallery" className="transition" style={{color: '#e07f10'}}>Stories</Link>
          <a href="/#about" className="transition" style={{color: '#e07f10'}}>About</a>
          <a href="/#contact" className="transition" style={{color: '#e07f10'}}>Contact</a>
          {isLoaded && (
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5" style={{color: '#e07f10'}} />
              ) : (
                <Moon className="w-5 h-5" style={{color: '#e07f10'}} />
              )}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
