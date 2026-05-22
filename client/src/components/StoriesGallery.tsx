import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Search, Filter, Eye, Calendar } from "lucide-react";
import StorySkeleton from "./StorySkeleton";

interface Story {
  id: number;
  category: string;
  authorName: string;
  school: string;
  title: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  views: number | null;
  createdAt: Date;
}

const CATEGORIES = [
  { value: "all", label: "All Stories" },
  { value: "teacher", label: "Teachers" },
  { value: "student", label: "Students" },
  { value: "headteacher", label: "Headteachers" },
  { value: "parent", label: "Parents" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

export default function StoriesGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedStoryId, setExpandedStoryId] = useState<number | null>(null);

  const { data, isLoading } = trpc.stories.getAll.useQuery();
  const stories = data?.stories || [];

  // Filter stories based on search and category
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesCategory = selectedCategory === "all" || story.category === selectedCategory;
      const matchesSearch =
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.school.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [stories, searchQuery, selectedCategory]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      teacher: "#e07f10",
      student: "#95ba12",
      headteacher: "#c2e708",
      parent: "#3b82f6",
      staff: "#8b5cf6",
      other: "#6b7280",
    };
    return colors[category] || "#6b7280";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <StorySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search stories by title, author, or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} style={{ color: "#e07f10" }} />
          <h3 className="font-semibold text-gray-700">Filter by Category</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === cat.value
                  ? "text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              style={
                selectedCategory === cat.value
                  ? { backgroundColor: "#e07f10" }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"}
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No stories found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() =>
                setExpandedStoryId(expandedStoryId === story.id ? null : story.id)
              }
            >
              {/* Story Image or Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {story.imageUrl ? (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📖</div>
                      <p className="text-gray-500 text-sm">No image</p>
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: getCategoryColor(story.category) }}
                >
                  {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                </div>

                {/* Media Indicators */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {story.videoUrl && (
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      📹 Video
                    </div>
                  )}
                  {story.audioUrl && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      🎙️ Audio
                    </div>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: "#e07f10" }}>
                  {story.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{story.content}</p>

                {/* Author Info */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">{story.authorName}</p>
                  <p className="text-xs text-gray-500">{story.school}</p>
                </div>

                {/* Meta Info */}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(story.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    {story.views || 0} views
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {expandedStoryId === story.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">{story.content}</p>
                  </div>

                  {/* Media Links */}
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                    {story.videoUrl && (
                      <a
                        href={story.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ▶️ Watch Video
                      </a>
                    )}
                    {story.audioUrl && (
                      <a
                        href={story.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🎧 Listen to Audio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
