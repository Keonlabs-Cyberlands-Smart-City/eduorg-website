import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/baraka-logo-draft_1_e8f3dd40.jpg";

export default function Admin() {
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

  const [activeTab, setActiveTab] = useState("posts");
  const [galleryFilterProgram, setGalleryFilterProgram] = useState("all");

  useEffect(() => {
    loadPosts();
    loadStats();
  }, []);

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
      let image = imageUrl;

      if (fileImage) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          image = event.target?.result as string;
          await addDoc(collection(db, "posts"), {
            page,
            title,
            content,
            date: visitDate,
            tags: tags.split(",").map((t) => t.trim()),
            image,
          });
          resetForm();
          setLoading(false);
        };
        reader.readAsDataURL(fileImage);
      } else {
        await addDoc(collection(db, "posts"), {
          page,
          title,
          content,
          date: visitDate,
          tags: tags.split(",").map((t) => t.trim()),
          image,
        });
        resetForm();
        setLoading(false);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setLoading(false);
    }
  };

  const handleSaveStats = async () => {
    try {
      const statsMap: Record<string, any> = {
        bootcamp: bootcampStats,
        sports: sportsStats,
        clubs: clubsStats,
        library: libraryStats,
        dayin: dayinStats,
        outreach: outreachStats,
      };

      await setDoc(doc(db, "statistics", statsPage), statsMap[statsPage]);
      alert("Statistics updated successfully!");
    } catch (error) {
      console.error("Error saving stats:", error);
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

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const currentStats: any = {
    bootcamp: bootcampStats,
    sports: sportsStats,
    clubs: clubsStats,
    library: libraryStats,
    dayin: dayinStats,
    outreach: outreachStats,
  }[statsPage] || bootcampStats;

  const setCurrentStats = (stats: any) => {
    switch (statsPage) {
      case "bootcamp":
        setBootcampStats(stats);
        break;
      case "sports":
        setSportsStats(stats);
        break;
      case "clubs":
        setClubsStats(stats);
        break;
      case "library":
        setLibraryStats(stats);
        break;
      case "dayin":
        setDayinStats(stats);
        break;
      case "outreach":
        setOutreachStats(stats);
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 flex-1 w-full">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-semibold ${activeTab === "posts" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-2 font-semibold ${activeTab === "gallery" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 font-semibold ${activeTab === "stats" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}
          >
            Update Statistics
          </button>
        </div>

        {/* POSTS TAB */}
        {activeTab === "posts" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* FORM */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-4 text-2xl">Create Post</h2>

              <form onSubmit={handleSubmitPost} className="space-y-3">
                <select
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="dayin">Day-In</option>
                  <option value="outreach">Outreach</option>
                  <option value="library">Library</option>
                  <option value="clubs">Clubs</option>
                  <option value="sports">Sports</option>
                  <option value="bootcamp">Bootcamp</option>
                </select>

                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFileImage(e.target.files?.[0] || null)}
                  className="w-full p-2 border rounded"
                />

                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={5}
                  required
                />

                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />

                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2 border rounded"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </form>
            </div>

            {/* POSTS */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold mb-4 text-2xl">Posts</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {posts.length === 0 ? (
                  <p className="text-gray-500">No posts yet</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="border rounded p-3 bg-gray-50">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      <h3 className="font-bold">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                      <p className="text-xs text-blue-600 mt-1">Program: {post.page}</p>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-500 text-sm hover:underline mt-2"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* PHOTO GALLERY TAB */}
        {activeTab === "gallery" && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold mb-4 text-2xl">Photo Gallery</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Filter by Program</label>
              <select
                value={galleryFilterProgram}
                onChange={(e) => setGalleryFilterProgram(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Programs</option>
                <option value="bootcamp">Bootcamp</option>
                <option value="sports">Sports</option>
                <option value="clubs">Clubs</option>
                <option value="library">Library</option>
                <option value="dayin">Day-in</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts
                .filter((post) => galleryFilterProgram === "all" || post.page === galleryFilterProgram)
                .filter((post) => post.image)
                .map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">📅 {post.date}</span>
                        <span className="text-xs font-semibold" style={{color: '#95ba12'}}>Program: {post.page}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {posts.filter((post) => galleryFilterProgram === "all" || post.page === galleryFilterProgram).filter((post) => post.image).length === 0 && (
              <p className="text-gray-500 text-center py-8">No photos available for this program</p>
            )}
          </div>
        )}

        {/* STATISTICS TAB */}
        {activeTab === "stats" && (
          <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
            <h2 className="font-bold mb-4 text-2xl">Update Program Statistics</h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Select Program</label>
              <select
                value={statsPage}
                onChange={(e) => setStatsPage(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="bootcamp">Bootcamp</option>
                <option value="sports">Sports</option>
                <option value="clubs">Clubs</option>
                <option value="library">Library</option>
                <option value="dayin">Day-in</option>
                <option value="outreach">Outreach</option>
              </select>
            </div>

            <div className="space-y-4">
              {statsPage === "bootcamp" && (
                <>
                  <input
                    type="text"
                    placeholder="Bootcamps / Year"
                    value={currentStats.bootcamps || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, bootcamps: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Students Reached"
                    value={currentStats.students || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, students: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Schools Visited"
                    value={currentStats.schools || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, schools: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Activities Conducted"
                    value={currentStats.activities || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, activities: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {statsPage === "sports" && (
                <>
                  <input
                    type="text"
                    placeholder="Sports Events / Year"
                    value={currentStats.events || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, events: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Athletes Engaged"
                    value={currentStats.athletes || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, athletes: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Schools Participated"
                    value={currentStats.schools || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, schools: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Tournaments Hosted"
                    value={currentStats.tournaments || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, tournaments: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {statsPage === "clubs" && (
                <>
                  <input
                    type="text"
                    placeholder="Active Clubs"
                    value={currentStats.clubs || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, clubs: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Club Members"
                    value={currentStats.members || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, members: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Activities / Year"
                    value={currentStats.activities || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, activities: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Participants"
                    value={currentStats.participants || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, participants: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {statsPage === "library" && (
                <>
                  <input
                    type="text"
                    placeholder="Books Available"
                    value={currentStats.books || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, books: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Active Readers"
                    value={currentStats.readers || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, readers: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Schools Served"
                    value={currentStats.schools || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, schools: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Reading Programs"
                    value={currentStats.programs || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, programs: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {statsPage === "dayin" && (
                <>
                  <input
                    type="text"
                    placeholder="Day-in Events / Year"
                    value={currentStats.events || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, events: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Students Participated"
                    value={currentStats.students || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, students: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Schools Visited"
                    value={currentStats.schools || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, schools: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Activities Conducted"
                    value={currentStats.activities || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, activities: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}

              {statsPage === "outreach" && (
                <>
                  <input
                    type="text"
                    placeholder="Outreach Programs / Year"
                    value={currentStats.programs || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, programs: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Community Members Reached"
                    value={currentStats.members || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, members: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Communities Served"
                    value={currentStats.communities || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, communities: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Volunteers Engaged"
                    value={currentStats.volunteers || ""}
                    onChange={(e) => setCurrentStats({ ...currentStats, volunteers: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </>
              )}
            </div>

            <button
              onClick={handleSaveStats}
              className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition mt-6"
            >
              Save Statistics
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
