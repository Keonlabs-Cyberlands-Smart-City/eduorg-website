import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="pt-10 pb-6" style={{backgroundColor: '#2d3e2d'}}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
        <div>
          <div className="flex flex-col items-center mb-3">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg" alt="Baraka Logo" className="h-12 w-12 object-contain mb-2" />
            <h3 className="font-bold text-sm text-center" style={{color: '#95ba12'}}>Kapiri mposhi Baraka learning center</h3>
          </div>
          <p className="text-sm text-gray-300">Empowering communities through education, training, and outreach programs.</p>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-gray-300 hover:underline">Home</Link></li>
            <li><a href="/#programs" className="text-gray-300 hover:underline">Programs</a></li>
            <li><a href="/#about" className="text-gray-300 hover:underline">About</a></li>
            <li><a href="/#contact" className="text-gray-300 hover:underline">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Programs</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/bootcamp" className="text-gray-300 hover:underline">Bootcamps</Link></li>
            <li><Link href="/sports" className="text-gray-300 hover:underline">Sports</Link></li>
            <li><Link href="/clubs" className="text-gray-300 hover:underline">Clubs</Link></li>
            <li><Link href="/library" className="text-gray-300 hover:underline">Library</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3 text-white">Contact</h3>
          <p className="text-sm text-gray-300">📍 Location: Zambia</p>
          <p className="text-sm text-gray-300">📞 Phone: +260 000 000 000</p>
          <p className="text-sm text-gray-300">📧 Email: info@barakalearning.com</p>
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-gray-400">
        &copy; 2026 Kapiri mposhi Baraka learning center. All rights reserved.
      </div>
    </footer>
  );
}
