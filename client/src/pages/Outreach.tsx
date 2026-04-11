import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg";

export default function Outreach() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    programs: "6",
    members: "1000+",
    communities: "50+",
    volunteers: "150+",
  });

  useEffect(() => {
    loadUpdates();
    loadStats();
  }, []);

  const loadUpdates = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("page", "==", "outreach"),
        orderBy("date", "desc")
      );
      onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUpdates(postsData);
      });
    } catch (error) {
      console.error("Error loading updates:", error);
    }
  };

  const loadStats = async () => {
    try {
      const docRef = doc(db, "statistics", "outreach");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStats(docSnap.data() as any);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="h-[500px] bg-cover bg-center flex items-center justify-center text-white relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 bg-black/40 backdrop-blur-sm p-12 rounded-2xl text-center animate-fade-in-up max-w-2xl">
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#e57d06' }}>
            Outreach Program
          </h2>
          <p className="text-xl text-gray-100">Community engagement and social impact initiatives</p>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#95ba12' }}>
            Our Impact
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Transforming communities through collaborative outreach</p>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "Programs", value: stats.programs, color: "#e57d06" },
              { label: "Community Members", value: stats.members, color: "#95ba12" },
              { label: "Communities Served", value: stats.communities, color: "#e57d06" },
              { label: "Volunteers Engaged", value: stats.volunteers, color: "#95ba12" },
            ].map((stat, idx) => (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 100}
                duration={600}
              >
                <div
                  className="bg-white p-8 rounded-2xl shadow-lg hover-lift border-t-4 transition-all duration-300"
                  style={{ borderColor: stat.color }}
                >
                  <h3 className="text-5xl font-bold mb-3" style={{ color: stat.color }}>
                    {stat.value}
                  </h3>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST UPDATES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#95ba12' }}>
              Latest Updates
            </h2>
            <div className="h-1 w-24" style={{ backgroundColor: '#e57d06' }}></div>
          </div>

          {updates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No updates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {updates.map((update, idx) => (
                <ScrollReveal
                  key={update.id}
                  animation="fade-up"
                  delay={idx * 150}
                  duration={600}
                >
                  <div
                    className="bg-white rounded-2xl shadow-lg hover-lift overflow-hidden border border-gray-100 transition-all duration-300"
                  >
                    {update.image && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      <img
                        src={update.image}
                        alt={update.title}
                        className="w-full h-full object-cover hover-scale-lg transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3" style={{ color: '#e57d06' }}>
                      {update.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">{update.content}</p>
                    <p className="text-xs text-gray-500 mb-3">📅 {update.date}</p>
                    {update.tags && update.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {update.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full font-medium transition-all duration-300"
                            style={{ backgroundColor: '#e5f7e5', color: '#95ba12' }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 text-white" style={{ backgroundColor: '#e57d06' }}>
        <div className="max-w-4xl mx-auto px-4 text-center animate-fade-in-up">
          <h3 className="text-3xl font-bold mb-4">Get Involved in Our Outreach</h3>
          <p className="text-lg mb-8 text-gray-100">Make a difference in your community with us</p>
          <button
            className="px-8 py-3 bg-white rounded-lg font-bold transition-all duration-300 hover-scale"
            style={{ color: '#95ba12' }}
          >
            Join Us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
