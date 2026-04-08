import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacebookFeed from "@/components/FacebookFeed";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const sendEmailMutation = trpc.email.sendContactForm.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Save to Firebase
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: new Date(),
        status: "new",
        replied: false
      });

      // Send emails via tRPC
      const result = await sendEmailMutation.mutateAsync({
        name,
        email,
        message,
      });

      if (result.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* NAVBAR */}
      <Navbar />

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
          <form className="grid gap-4 bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong>Message sent successfully!</strong> A confirmation email has been sent to {email}. We will respond soon.
              </div>
            )}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
            <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 border rounded" required />
            <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 border rounded" required />
            <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className="p-3 border rounded" rows={5} required></textarea>
            <button type="submit" disabled={loading} className="text-white p-3 rounded hover:opacity-90 transition disabled:opacity-50" style={{backgroundColor: '#8abc20'}}>{loading ? "Sending..." : "Send Message"}</button>
          </form>
        </div>
      </section>

      {/* FACEBOOK FEED SECTION */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{color: '#c2e708'}}>Follow Us on Facebook</h2>
          <p className="text-center text-gray-600 mb-8">Stay updated with our latest activities, events, and achievements</p>
          <FacebookFeed />
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{color: '#dbea06', fontWeight: '900', backgroundColor: '#e07f10'}}>Our Team</h2>

          <h3 className="text-2xl font-semibold mb-4">Teachers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {teachers.map((teacher, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-lg transition">
                <img src={teacher.img} alt={teacher.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h4 className="font-bold text-lg">{teacher.name}</h4>
                <p className="text-gray-600">{teacher.role}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Managers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {managers.map((manager, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-lg transition">
                <img src={manager.img} alt={manager.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h4 className="font-bold text-lg">{manager.name}</h4>
                <p className="text-gray-600">{manager.role}</p>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Club Coordinators</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {coordinators.map((coordinator, idx) => (
              <div key={idx} className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-lg transition">
                <img src={coordinator.img} alt={coordinator.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h4 className="font-bold text-lg">{coordinator.name}</h4>
                <p className="text-gray-600">{coordinator.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
