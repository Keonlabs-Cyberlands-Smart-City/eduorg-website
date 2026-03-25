import { Link } from "wouter";

const programs = [
  { name: "Bootcamps", desc: "Academic intensive programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg", link: "/bootcamp" },
  { name: "Sports", desc: "Games and physical activities", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/sports images_52357345.jpg", link: "/sports" },
  { name: "Clubs", desc: "ICT, literacy and social clubs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg", link: "/clubs" },
  { name: "Outreach Visits", desc: "Community engagement programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg", link: "/outreach" },
  { name: "Day-in Visits", desc: "Daily school engagement", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/day in images 2_ced30474.jpg", link: "/dayin" },
  { name: "Library", desc: "Books and resources", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg", link: "/library" },
];

const teachers = [
  { name: "Teacher 1", role: "Mathematics", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg" },
  { name: "Teacher 2", role: "Science", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Day in images_d7c99881.jpg" },
  { name: "Teacher 3", role: "English", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg" },
  { name: "Teacher 4", role: "ICT", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/day in images 2_ced30474.jpg" },
  { name: "Teacher 5", role: "General Studies", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg" },
];

const managers = [
  { name: "Manager 1", role: "Operations", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/manager 2_557f98ee.jpg" },
  { name: "Manager 2", role: "Programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg" },
  { name: "Manager 3", role: "Finance", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/manager 2_557f98ee.jpg" },
  { name: "Manager 4", role: "HR", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg" },
  { name: "Manager 5", role: "Logistics", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/manager 2_557f98ee.jpg" },
  { name: "Manager 6", role: "Administration", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg" },
];

const coordinators = [
  { name: "Coordinator 1", role: "ICT Club", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg" },
  { name: "Coordinator 2", role: "Literacy Club", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg" },
  { name: "Coordinator 3", role: "Sports Club", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/sports images_52357345.jpg" },
  { name: "Coordinator 4", role: "Community Club", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Day in images_d7c99881.jpg" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* NAVBAR */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div className="flex flex-col items-center">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg" alt="Baraka Logo" className="h-56 w-56 object-contain" />
            <h1 className="text-sm font-bold text-center" style={{color: '#95ba12'}}>Kapiri mposhi Baraka learning center</h1>
          </div>
          <nav className="space-x-6 hidden md:flex">
            <a href="#" className="hover:text-blue-600 transition" style={{color: '#e07f10'}}>Home</a>
            <a href="#programs" className="hover:text-blue-600 transition" style={{color: '#e07f10'}}>Programs</a>
            <a href="#about" className="hover:text-blue-600 transition" style={{color: '#e07f10'}}>About</a>
            <a href="#contact" className="hover:text-blue-600 transition" style={{color: '#e07f10'}}>Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="h-[500px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg')" }}>
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-5xl font-bold mb-4" style={{color: '#e57d06'}}>Make learning fun and engaging</h2>
          <p className="mb-4">Daily activities, bootcamps, clubs and more</p>
          <a href="#programs" className="bg-blue-600 px-6 py-2 rounded inline-block hover:bg-blue-700 transition">Explore Programs</a>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section id="programs" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{color: '#c2e708'}}>Our Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((prog, idx) => (
              <Link key={idx} href={prog.link} className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition">
                <img src={prog.img} alt={prog.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold" style={{color: '#e58a0b'}}>{prog.name}</h3>
                  <p className="text-gray-600">{prog.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600">We provide structured academic programs, sports, and community initiatives to empower students and adults through education.</p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
          <form className="grid gap-4 bg-white p-6 rounded-lg shadow">
            <input type="text" placeholder="Your Name" className="p-3 border rounded" required />
            <input type="email" placeholder="Your Email" className="p-3 border rounded" required />
            <textarea placeholder="Message" className="p-3 border rounded" rows={5} required></textarea>
            <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition" style={{backgroundColor: '#8abc20'}}>Send Message</button>
          </form>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{color: '#dbea06', fontWeight: '900', backgroundColor: '#e07f10'}}>Our Team</h2>

          <h3 className="text-2xl font-semibold mb-4">Teachers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {teachers.map((teacher, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-2xl text-center shadow hover:shadow-lg transition">
                <img src={teacher.img} alt={teacher.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="font-bold">{teacher.name}</h4>
                <p className="text-sm text-gray-500">{teacher.role}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Management</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {managers.map((manager, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-2xl text-center shadow hover:shadow-lg transition" style={{backgroundColor: '#f3f4f6'}}>
                <img src={manager.img} alt={manager.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="font-bold">{manager.name}</h4>
                <p className="text-sm text-gray-500">{manager.role}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Club Coordinators</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {coordinators.map((coord, idx) => (
              <div key={idx} className="bg-gray-100 p-6 rounded-2xl text-center shadow hover:shadow-lg transition">
                <img src={coord.img} alt={coord.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="font-bold">{coord.name}</h4>
                <p className="text-sm text-gray-500">{coord.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-700 text-white pt-10 pb-6" style={{backgroundColor: '#738e10'}}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          <div>
            <h3 className="font-bold text-lg mb-3">EduOrg</h3>
            <p className="text-sm text-gray-200">Empowering communities through education, training, and outreach programs.</p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#programs" className="hover:underline">Programs</a></li>
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
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
    </div>
  );
}
