import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Sports() {
  const stats = [
    { number: "8", label: "Sports Events / Year" },
    { number: "400+", label: "Athletes Engaged" },
    { number: "15+", label: "Schools Participated" },
    { number: "20+", label: "Tournaments Hosted" },
  ];

  const updates = [
    { title: "Football Tournament", desc: "Inter-school football championship held.", img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf" },
    { title: "Athletics Day", desc: "Track and field events conducted.", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211" },
    { title: "Team Training", desc: "Coaching sessions for various sports.", img: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042" },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211",
    "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      {/* HERO */}
      <section className="h-[400px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf')" }}>
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-4xl font-bold">Sports Program</h2>
          <p>Building champions through sports and teamwork</p>
        </div>
      </section>

      {/* STATISTICS */}
      <section id="overview" className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Sports Statistics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-3xl font-bold text-blue-600">{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section id="updates" className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Latest Updates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {updates.map((update, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl shadow hover:shadow-lg overflow-hidden transition">
                <img src={update.img} alt={update.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold">{update.title}</h3>
                  <p>{update.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Sports Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-xl w-full h-64 object-cover hover:shadow-lg transition" />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
