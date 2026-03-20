import { Link } from "wouter";

const programs = [
  { name: "Bootcamps", desc: "Academic intensive programs", img: "https://images.unsplash.com/photo-1588072432836-e10032774350", link: "/bootcamp" },
  { name: "Sports", desc: "Games and physical activities", img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf", link: "/sports" },
  { name: "Clubs", desc: "ICT, literacy and social clubs", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f", link: "/clubs" },
  { name: "Outreach Visits", desc: "Community engagement programs", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216", link: "/outreach" },
  { name: "Day-in Visits", desc: "Daily school engagement", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b", link: "/dayin" },
  { name: "Library", desc: "Books and resources", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794", link: "/library" },
];

const teachers = [
  { name: "Teacher 1", role: "Mathematics", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6" },
  { name: "Teacher 2", role: "Science", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
  { name: "Teacher 3", role: "English", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e" },
  { name: "Teacher 4", role: "ICT", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" },
  { name: "Teacher 5", role: "General Studies", img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e" },
];

const managers = [
  { name: "Manager 1", role: "Operations", img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126" },
  { name: "Manager 2", role: "Programs", img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12" },
  { name: "Manager 3", role: "Finance", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
  { name: "Manager 4", role: "HR", img: "https://images.unsplash.com/photo-1511367461989-f85a21fda167" },
  { name: "Manager 5", role: "Logistics", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
  { name: "Manager 6", role: "Administration", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" },
];

const coordinators = [
  { name: "Coordinator 1", role: "ICT Club", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f" },
  { name: "Coordinator 2", role: "Literacy Club", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1" },
  { name: "Coordinator 3", role: "Sports Club", img: "https://images.unsplash.com/photo-1502767089025-6572583495b0" },
  { name: "Coordinator 4", role: "Community Club", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* NAVBAR */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-blue-600">EduOrg</h1>
          <nav className="space-x-6 hidden md:flex">
            <a href="#" className="hover:text-blue-600 transition">Home</a>
            <a href="#programs" className="hover:text-blue-600 transition">Programs</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
            <Link href="/admin" className="hover:text-blue-600 transition">Admin</Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="h-[500px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644')" }}>
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-5xl font-bold mb-4">Empowering Education</h2>
          <p className="mb-4">Daily activities, bootcamps, clubs and more</p>
          <a href="#programs" className="bg-blue-600 px-6 py-2 rounded inline-block hover:bg-blue-700 transition">Explore Programs</a>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section id="programs" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Programs</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((prog, idx) => (
              <Link key={idx} href={prog.link} className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition">
                <img src={prog.img} alt={prog.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-bold">{prog.name}</h3>
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
            <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">Send Message</button>
          </form>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Team</h2>

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
              <div key={idx} className="bg-gray-100 p-6 rounded-2xl text-center shadow hover:shadow-lg transition">
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
      <footer className="bg-blue-700 text-white pt-10 pb-6">
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
