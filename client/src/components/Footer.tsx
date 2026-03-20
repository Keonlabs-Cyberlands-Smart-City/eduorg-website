import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
        <div>
          <h3 className="font-bold text-lg mb-3">EduOrg</h3>
          <p className="text-sm text-gray-200">Empowering communities through education, training, and outreach programs.</p>
        </div>
        <div>
          <h3 className="font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><a href="/#programs" className="hover:underline">Programs</a></li>
            <li><a href="/#about" className="hover:underline">About</a></li>
            <li><a href="/#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Programs</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bootcamp" className="hover:underline">Bootcamps</Link></li>
            <li><Link href="/sports" className="hover:underline">Sports</Link></li>
            <li><Link href="/clubs" className="hover:underline">Clubs</Link></li>
            <li><Link href="/library" className="hover:underline">Library</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Contact</h3>
          <p className="text-sm">📍 Location: Your City</p>
          <p className="text-sm">📞 Phone: +260 000 000 000</p>
          <p className="text-sm">📧 Email: info@eduorg.com</p>
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-gray-200">
        &copy; 2026 EduOrg. All rights reserved.
      </div>
    </footer>
  );
}
