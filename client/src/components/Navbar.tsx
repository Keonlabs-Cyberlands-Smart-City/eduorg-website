import { Link } from "wouter";

export default function Navbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg" alt="Baraka Logo" className="h-16 w-16 object-contain" />
          <span className="text-lg font-bold" style={{color: '#95ba12'}}>Baraka learning center</span>
        </Link>
        <nav className="space-x-6 hidden md:flex">
          <Link href="/" className="transition" style={{color: '#e07f10'}}>Home</Link>
          <a href="/#programs" className="transition" style={{color: '#e07f10'}}>Programs</a>
          <a href="/#about" className="transition" style={{color: '#e07f10'}}>About</a>
          <a href="/#contact" className="transition" style={{color: '#e07f10'}}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
