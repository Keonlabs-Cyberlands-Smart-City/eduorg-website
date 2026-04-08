import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface FacebookPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  link?: string;
  date: string;
  type: string;
}

export default function FacebookFeed() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading: queryLoading, error: queryError } = trpc.social.getFacebookPosts.useQuery({
    limit: 6,
  });

  useEffect(() => {
    if (data) {
      const formattedPosts = data.posts.map((post: any) => ({
        ...post,
        date: new Date(post.date).toLocaleDateString(),
      }));
      setPosts(formattedPosts);
      setIsLoading(false);
    }

    if (queryError) {
      setError("Unable to load Facebook posts. Please try again later.");
      setIsLoading(false);
    }
  }, [data, queryError]);

  if (isLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading Facebook posts...</div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-2">Facebook feed not yet configured</p>
        <p className="text-sm text-gray-500">
          Add your Facebook Page ID and Access Token in the admin settings to display posts here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200"
        >
          {/* Post Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
          )}

          {/* Post Content */}
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: "#e07f10" }}>
              {post.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {post.content}
            </p>

            {/* Post Meta */}
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>{post.date}</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {post.type === "photo" ? "📸 Photo" : post.type === "video" ? "🎥 Video" : "📝 Post"}
              </span>
            </div>

            {/* View Post Button */}
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center py-2 rounded text-white transition hover:opacity-90"
                style={{ backgroundColor: "#e07f10" }}
              >
                View on Facebook
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
