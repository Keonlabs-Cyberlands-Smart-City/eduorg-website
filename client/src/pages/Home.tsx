import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacebookFeed from "@/components/FacebookFeed";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import NewsletterForm from "@/components/NewsletterForm";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft } from "lucide-react";

const programs = [
  { name: "Bootcamps", desc: "Academic intensive programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg", link: "/bootcamp" },
  { name: "Sports", desc: "Games and physical activities", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/sports images_52357345.jpg", link: "/sports" },
  { name: "Clubs", desc: "ICT, literacy and social clubs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg", link: "/clubs" },
  { name: "Outreach Visits", desc: "Community engagement programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg", link: "/outreach" },
  { name: "Day-in Visits", desc: "Daily school engagement", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/day in images 2_ced30474.jpg", link: "/dayin" },
  { name: "Library", desc: "Books and resources", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg", link: "/library" },
];

const heroSlides = [
  {
    title: "Make Learning Fun",
    subtitle: "Engaging activities for every student",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg",
  },
  {
    title: "Build Skills",
    subtitle: "Through bootcamps and intensive programs",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/sports images_52357345.jpg",
  },
  {
    title: "Join Our Community",
    subtitle: "Clubs, sports, and outreach programs",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg",
  },
];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const sendEmailMutation = trpc.email.sendContactForm.useMutation();
  const getAllTeamQuery = trpc.teamMembers.getAll.useQuery();

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load team members
  useEffect(() => {
    if (getAllTeamQuery.data?.members) {
      setTeamMembers(getAllTeamQuery.data.members);
    }
  }, [getAllTeamQuery.data?.members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: new Date(),
        status: "new",
        replied: false
      });

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      {/* HERO CAROUSEL SECTION */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white px-6 animate-fade-in">
                <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {slide.subtitle}
                </p>
                <Link href="/programs">
                  <button className="bg-orange-500 text-white px-8 py-3 font-bold text-lg hover:bg-orange-600 transition-colors">
                    EXPLORE NOW
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-3 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Our Programs</h2>
            <p className="text-xl text-gray-600">Discover diverse learning opportunities</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog, idx) => (
              <Link key={idx} href={prog.link}>
                <div className="group relative overflow-hidden bg-gray-200 aspect-square cursor-pointer">
                  <img
                    src={prog.img}
                    alt={prog.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{prog.name}</h3>
                    <p className="text-gray-200 mb-4">{prog.desc}</p>
                    <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                      Learn More <ChevronRight className="w-5 h-5 ml-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">Meet the people behind EduOrg</p>
          </div>

          {/* Teachers */}
          {teamMembers.filter(m => m.category === 'teacher' && m.status === 'active').length > 0 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-8">Teachers</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.filter(m => m.category === 'teacher' && m.status === 'active').map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Managers */}
          {teamMembers.filter(m => m.category === 'manager' && m.status === 'active').length > 0 && (
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-8">Managers</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {teamMembers.filter(m => m.category === 'manager' && m.status === 'active').map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Coordinators */}
          {teamMembers.filter(m => m.category === 'coordinator' && m.status === 'active').length > 0 && (
            <div>
              <h3 className="text-3xl font-bold mb-8">Club Coordinators</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {teamMembers.filter(m => m.category === 'coordinator' && m.status === 'active').map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* NEWSLETTER SECTION */}
      <section className="py-16 px-4 bg-black text-white">
        <NewsletterForm />
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* FACEBOOK FEED SECTION */}
      <FacebookFeed />

      {/* CONTACT SECTION */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-gray-600 text-center mb-12">We'd love to hear from you</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-ring"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-ring"
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black transition-ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Team Member Card Component
function TeamMemberCard({ member }: { member: any }) {
  return (
    <div className="group overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      {member.photoUrl && (
        <div className="relative overflow-hidden bg-gray-200 aspect-square">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6">
        <h4 className="font-bold text-lg mb-1">{member.name}</h4>
        <p className="text-gray-600 font-semibold mb-3">{member.role}</p>
        {member.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{member.description}</p>
        )}
      </div>
    </div>
  );
}
