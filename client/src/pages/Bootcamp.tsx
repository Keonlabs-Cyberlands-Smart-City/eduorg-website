import { useState, useEffect } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Bootcamp() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    bootcamps: "12",
    students: "300+",
    schools: "25+",
    activities: "50+",
  });

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

  const gallery = [
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg",
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Day in images_d7c99881.jpg",
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/day in images 2_ced30474.jpg",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      {/* HERO */}
      <section
        className="h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg')",
        }}
      >
        <div className="bg-black/60 p-8 rounded-xl text-center">
          <h2 className="text-4xl font-bold">Bootcamp Program</h2>
          <p>Impacting students through education and outreach</p>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-blue-600">{stats.bootcamps}</h3>
              <p className="text-gray-600">Bootcamps / Year</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-blue-600">{stats.students}</h3>
              <p className="text-gray-600">Students Reached</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-blue-600">{stats.schools}</h3>
              <p className="text-gray-600">Schools Visited</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <h3 className="text-4xl font-bold text-blue-600">{stats.activities}</h3>
              <p className="text-gray-600">Activities Conducted</p>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST UPDATES */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Updates</h2>
          {updates.length === 0 ? (
            <p className="text-gray-500">No updates yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {updates.map((update) => (
                <div key={update.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  {update.image && (
                    <img
                      src={update.image}
                      alt={update.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{update.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{update.content}</p>
                    <p className="text-xs text-gray-500">Date: {update.date}</p>
                    {update.tags && update.tags.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {update.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
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

      {/* GALLERY */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Photo Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Gallery ${idx}`}
                className="w-full h-64 object-cover rounded-lg hover:shadow-lg transition"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
