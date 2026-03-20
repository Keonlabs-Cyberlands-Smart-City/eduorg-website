import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Library() {
  const stats = [
    { number: "5000+", label: "Books Available" },
    { number: "2000+", label: "Active Readers" },
    { number: "50+", label: "Schools Served" },
    { number: "100+", label: "Reading Programs" },
  ];

  const updates = [
    { title: "New Book Collection", desc: "Added 500 new books to our library.", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794" },
    { title: "Reading Program", desc: "Monthly reading challenges for students.", img: "https://images.unsplash.com/photo-1507842217343-583f20270319" },
    { title: "Library Expansion", desc: "Opening new library branches in schools.", img: "https://images.unsplash.com/photo-1507842217343-583f20270319" },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    "https://images.unsplash.com/photo-1507842217343-583f20270319",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      {/* HERO */}
      <section className="h-[400px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg')" }}>
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-4xl font-bold">Library Program</h2>
          <p>Promoting literacy and knowledge through books</p>
        </div>
      </section>

      {/* STATISTICS */}
      <section id="overview" className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Library Statistics</h2>
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
          <h2 className="text-3xl font-bold mb-6 text-center">Library Gallery</h2>
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
