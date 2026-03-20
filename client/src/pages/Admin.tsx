import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const samplePost = {
        id: "1",
        page: "dayin",
        title: "Sample Post",
        content: "This is a sample post",
        date: "2026-03-20",
        tags: ["sample"],
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      };
      setPosts([samplePost]);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image = imageUrl;

      if (fileImage) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          image = event.target?.result as string;
          const newPost = {
            id: Date.now().toString(),
            page,
            title,
            content,
            date: visitDate,
            tags: tags.split(",").map((t) => t.trim()),
            image,
          };
          setPosts([newPost, ...posts]);
          resetForm();
        };
        reader.readAsDataURL(fileImage);
      } else {
        const newPost = {
          id: Date.now().toString(),
          page,
          title,
          content,
          date: visitDate,
          tags: tags.split(",").map((t) => t.trim()),
          image,
        };
        setPosts([newPost, ...posts]);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving post:", error);
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

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-2 gap-6 flex-1">
        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4 text-2xl">Create Post</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
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

      <Footer />
    </div>
  );
}
