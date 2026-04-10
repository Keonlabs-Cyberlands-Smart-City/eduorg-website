import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminModerationDashboard from "@/components/AdminModerationDashboard";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg";

export default function Admin() {
  // ===== ALL HOOKS DECLARED FIRST (BEFORE ANY CONDITIONALS) =====
  const [, setLocation] = useLocation();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Post form state
  const [page, setPage] = useState("dayin");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Statistics state
  const [statsPage, setStatsPage] = useState("bootcamp");
  const [bootcampStats, setBootcampStats] = useState({ bootcamps: "12", students: "300+", schools: "25+", activities: "50+" });
  const [sportsStats, setSportsStats] = useState({ events: "8", athletes: "400+", schools: "15+", tournaments: "20+" });
  const [clubsStats, setClubsStats] = useState({ clubs: "4", members: "500+", activities: "30+", participants: "100+" });
  const [libraryStats, setLibraryStats] = useState({ books: "5000+", readers: "2000+", schools: "50+", programs: "100+" });
  const [dayinStats, setDayinStats] = useState({ events: "10", students: "600+", schools: "40+", activities: "200+" });
  const [outreachStats, setOutreachStats] = useState({ programs: "6", members: "1000+", communities: "50+", volunteers: "150+" });
  
  // UI state
  const [activeTab, setActiveTab] = useState("posts");
  const [galleryFilterProgram, setGalleryFilterProgram] = useState("all");
  
  // Messages state
  const [messages, setMessages] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // ===== EFFECTS =====
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setLocation("/admin-login");
    }
    setAuthChecked(true);
  }, [setLocation]);
  // Load messages from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      loadStats();
    }
  }, [isAuthenticated]);

  // ===== FUNCTIONS =====
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminLoginTime");
    setLocation("/admin-login");
  };

  const loadPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("date", "desc"));
      onSnapshot(q, (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      });
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const loadStats = async () => {
    try {
      const statsSnapshot = await getDocs(collection(db, "statistics"));
      statsSnapshot.forEach((doc) => {
        const data = doc.data() as any;
        if (doc.id === "bootcamp") setBootcampStats(data);
        if (doc.id === "sports") setSportsStats(data);
        if (doc.id === "clubs") setClubsStats(data);
        if (doc.id === "library") setLibraryStats(data);
        if (doc.id === "dayin") setDayinStats(data);
        if (doc.id === "outreach") setOutreachStats(data);
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      if (fileImage) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          finalImageUrl = event.target?.result as string;
          await addDoc(collection(db, "posts"), {
            page,
            title,
            content,
            visitDate,
            tags,
            image: finalImageUrl,
            date: new Date(),
          });
          resetForm();
        };
        reader.readAsDataURL(fileImage);
      } else {
        await addDoc(collection(db, "posts"), {
          page,
          title,
          content,
          visitDate,
          tags,
          image: finalImageUrl,
          date: new Date(),
        });
        resetForm();
      }
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setVisitDate("");
    setTags("");
    setImageUrl("");
    setFileImage(null);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleSaveStats = async () => {
    try {
      const statsMap: { [key: string]: any } = {
        bootcamp: bootcampStats,
        sports: sportsStats,
        clubs: clubsStats,
        library: libraryStats,
        dayin: dayinStats,
        outreach: outreachStats,
      };

      const stats = statsMap[statsPage];
      if (stats) {
        await setDoc(doc(db, "statistics", statsPage), stats);
        alert("Statistics updated successfully!");
      }
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  const updateStats = (field: string, value: string) => {
    switch (statsPage) {
      case "bootcamp":
        setBootcampStats({ ...bootcampStats, [field]: value });
        break;
      case "sports":
        setSportsStats({ ...sportsStats, [field]: value });
        break;
      case "clubs":
        setClubsStats({ ...clubsStats, [field]: value });
        break;
      case "library":
        setLibraryStats({ ...libraryStats, [field]: value });
        break;
      case "dayin":
        setDayinStats({ ...dayinStats, [field]: value });
        break;
      case "outreach":
        setOutreachStats({ ...outreachStats, [field]: value });
        break;
      default:
        break;
    }
  };

  // ===== EARLY RETURNS FOR LOADING/UNAUTHENTICATED STATES =====
  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // ===== RENDER =====
  const currentStats = {
    bootcamp: bootcampStats,
    sports: sportsStats,
    clubs: clubsStats,
    library: libraryStats,
    dayin: dayinStats,
    outreach: outreachStats,
  }[statsPage] as any;

  const filteredPosts = galleryFilterProgram === "all" ? posts : posts.filter((p) => p.page === galleryFilterProgram);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 flex-1 w-full">
        {/* Logout button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-semibold ${activeTab === "posts" ? "border-b-2" : ""}`}
            style={{ borderColor: activeTab === "posts" ? "#8abc20" : "transparent", color: activeTab === "posts" ? "#8abc20" : "#666" }}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 font-semibold ${activeTab === "gallery" ? "border-b-2" : ""}`}
            style={{ borderColor: activeTab === "gallery" ? "#8abc20" : "transparent", color: activeTab === "gallery" ? "#8abc20" : "#666" }}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-semibold ${activeTab === "stats" ? "border-b-2" : ""}`}
            style={{ borderColor: activeTab === "stats" ? "#8abc20" : "transparent", color: activeTab === "stats" ? "#8abc20" : "#666" }}
          >
            Update Statistics
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 font-semibold ${activeTab === "messages" ? "border-b-2" : ""}`}
            style={{ borderColor: activeTab === "messages" ? "#8abc20" : "transparent", color: activeTab === "messages" ? "#8abc20" : "#666" }}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab("moderation")}
            className={`px-4 py-2 font-semibold ${activeTab === "moderation" ? "border-b-2" : ""}`}
            style={{ borderColor: activeTab === "moderation" ? "#8abc20" : "transparent", color: activeTab === "moderation" ? "#8abc20" : "#666" }}
          >
            Story Moderation
          </button>
        </div>

        {/* POSTS TAB */}
        {activeTab === "posts" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#8abc20" }}>
                Create Post
              </h2>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <select value={page} onChange={(e) => setPage(e.target.value)} className="w-full p-2 border rounded">
                  <option value="dayin">Day-in</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="sports">Sports</option>
                  <option value="clubs">Clubs</option>
                  <option value="library">Library</option>
                  <option value="outreach">Outreach</option>
                </select>
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" rows={4} required></textarea>
                <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="w-full p-2 border rounded" />
                <input type="text" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border rounded" />
                <input type="url" placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border rounded" />
                <div>
                  <label className="block text-sm font-semibold mb-2">Or upload image:</label>
                  <input type="file" accept="image/*" onChange={(e) => setFileImage(e.target.files?.[0] || null)} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={loading} className="w-full p-2 rounded text-white font-semibold" style={{ backgroundColor: "#8abc20" }}>
                  {loading ? "Creating..." : "Create Post"}
                </button>
              </form>
            </div>

            {/* Posts List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4" style={{ color: "#8abc20" }}>
                Recent Posts
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {posts.map((post) => (
                  <div key={post.id} className="border-l-4 pl-4" style={{ borderColor: "#8abc20" }}>
                    <h3 className="font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-600">{post.page}</p>
                    <p className="text-xs text-gray-500">{post.date?.toDate?.().toLocaleDateString()}</p>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-600 text-sm mt-2 hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === "gallery" && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Filter by Program:</label>
              <select value={galleryFilterProgram} onChange={(e) => setGalleryFilterProgram(e.target.value)} className="p-2 border rounded">
                <option value="all">All Programs</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="sports">Sports</option>
                <option value="clubs">Clubs</option>
                <option value="library">Library</option>
                <option value="dayin">Day-in</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />}
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                    <p className="text-xs text-gray-500 mb-2">{post.date?.toDate?.().toLocaleDateString()}</p>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{post.page}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#8abc20" }}>
              Update Statistics
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Select Program:</label>
              <select value={statsPage} onChange={(e) => setStatsPage(e.target.value)} className="w-full p-2 border rounded">
                <option value="bootcamp">Bootcamp</option>
                <option value="sports">Sports</option>
                <option value="clubs">Clubs</option>
                <option value="library">Library</option>
                <option value="dayin">Day-in</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>
            <div className="space-y-4">
              {currentStats &&
                Object.entries(currentStats).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold mb-1 capitalize">{key}:</label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => updateStats(key, e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
            </div>
            <button onClick={handleSaveStats} className="w-full mt-6 p-2 rounded text-white font-semibold" style={{ backgroundColor: "#8abc20" }}>
              Save Statistics
            </button>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#8abc20" }}>
              Contact Form Messages
            </h2>
            {messages.length === 0 ? (
              <p className="text-gray-600">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <div key={msg.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{msg.name}</h3>
                        <p className="text-sm text-gray-600">{msg.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt?.toDate?.() || msg.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${msg.replied ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {msg.replied ? "Replied" : "New"}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3 p-2 bg-white rounded border-l-4" style={{ borderColor: "#8abc20" }}>{msg.message}</p>
                    
                    {replyingTo === msg.id ? (
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="w-full p-2 border rounded mb-2"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              alert(`Reply sent to ${msg.email}: ${replyText}`);
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                          >
                            Send Reply
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(msg.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODERATION TAB */}
        {activeTab === "moderation" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6" style={{ color: "#8abc20" }}>
              Story Moderation Dashboard
            </h2>
            <AdminModerationDashboard />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
