import { Link } from "wouter";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cover bg-center relative" style={{
      backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg')"
    }}>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4 relative z-10">
        <Link href="/" className="flex flex-col items-center">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg" alt="Baraka Logo" className="h-20 w-20 object-contain" />
          <span className="text-sm font-bold text-center text-white drop-shadow-lg">Kapiri mposhi Baraka learning center</span>
        </Link>
        <nav className="space-x-6 hidden md:flex">
          <Link href="/" className="transition text-white font-semibold hover:text-yellow-300">Home</Link>
          <a href="/#programs" className="transition text-white font-semibold hover:text-yellow-300">Programs</a>
          <a href="/#about" className="transition text-white font-semibold hover:text-yellow-300">About</a>
          <a href="/#contact" className="transition text-white font-semibold hover:text-yellow-300">Contact</a>
        </nav>
      </div>
    </header>
  );
}
