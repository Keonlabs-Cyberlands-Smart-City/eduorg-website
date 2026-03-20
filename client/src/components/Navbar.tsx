import { Link } from "wouter";

export default function Navbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">EduOrg</Link>
        <nav className="space-x-6 hidden md:flex">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <a href="/#programs" className="hover:text-blue-600 transition">Programs</a>
          <a href="/#about" className="hover:text-blue-600 transition">About</a>
          <a href="/#contact" className="hover:text-blue-600 transition">Contact</a>
          <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
