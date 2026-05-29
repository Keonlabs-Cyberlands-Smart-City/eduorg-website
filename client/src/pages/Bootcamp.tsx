import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg";

export default function Bootcamp() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    bootcamps: "12",
    students: "300+",
    schools: "25+",
    activities: "50+",
  });

  const statsRef = useScrollAnimation();
  const updatesRef = useScrollAnimation();

  useEffect(() => {
    loadUpdates();
    loadStats();
  }, []);

  const loadUpdates = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("page", "==", "bootcamp"),
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
      const docRef = doc(db, "statistics", "bootcamp");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStats(docSnap.data() as any);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="h-[600px] bg-cover bg-center flex items-center justify-center text-white relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center animate-fade-in max-w-3xl px-6">
          <h1 className="text-6xl font-bold mb-4">Bootcamp Program</h1>
          <p className="text-2xl text-gray-200">Academic intensive programs for student excellence</p>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section ref={statsRef.ref} className={`py-24 bg-white transition-opacity duration-1000 ${statsRef.isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">Empowering students through intensive academic programs</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: "Bootcamps / Year", value: stats.bootcamps },
              { label: "Students Reached", value: stats.students },
              { label: "Schools Visited", value: stats.schools },
              { label: "Activities Conducted", value: stats.activities },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-white border border-gray-200 p-8 rounded-lg text-center hover:shadow-lg transition-all duration-500 animate-scale-in`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <h3 className="text-5xl font-bold mb-3 text-black">{stat.value}</h3>
                <p className="text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST UPDATES SECTION */}
      <section ref={updatesRef.ref} className={`py-24 bg-gray-50 transition-opacity duration-1000 ${updatesRef.isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-5xl font-bold mb-4">Latest Updates</h2>
            <div className="h-1 w-24 bg-black"></div>
          </div>

          {updates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No updates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {updates.map((update, idx) => (
                <div
                  key={update.id}
                  className={`bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-500 group animate-slide-up`}
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {update.image && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      <img
                        src={update.image}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-black">{update.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{update.content}</p>
                    <p className="text-xs text-gray-500 mb-4">📅 {update.date}</p>
                    {update.tags && update.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {update.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in">
          <h3 className="text-5xl font-bold mb-6">Ready to Join Our Bootcamp?</h3>
          <p className="text-xl text-gray-300 mb-8">Transform your academic journey with our intensive programs</p>
          <button className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto group">
            Learn More
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
