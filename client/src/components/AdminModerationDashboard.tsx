import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Check, X, Eye, Trash2, Filter, Search } from "lucide-react";

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
  status: string;
  createdAt: Date;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "teacher", label: "Teachers" },
  { value: "student", label: "Students" },
  { value: "headteacher", label: "Headteachers" },
  { value: "parent", label: "Parents" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

export default function AdminModerationDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [selectedStories, setSelectedStories] = useState<Set<number>>(new Set());

  const { data, isLoading, refetch } = trpc.stories.getPending.useQuery();
  const approveStory = trpc.stories.approve.useMutation();
  const rejectStory = trpc.stories.reject.useMutation();
  const deleteStory = trpc.stories.delete.useMutation();

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

  const selectedStory = stories.find((s) => s.id === selectedStoryId);

  const handleApprove = async (id: number) => {
    try {
      await approveStory.mutateAsync({ id });
      toast.success("Story approved!");
      refetch();
    } catch (error) {
      toast.error("Failed to approve story");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectStory.mutateAsync({ id });
      toast.success("Story rejected!");
      refetch();
    } catch (error) {
      toast.error("Failed to reject story");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this story?")) {
      try {
        await deleteStory.mutateAsync({ id });
        toast.success("Story deleted!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete story");
      }
    }
  };

  const handleBulkApprove = async () => {
    if (selectedStories.size === 0) {
      toast.error("No stories selected");
      return;
    }

    let approved = 0;
    for (const id of Array.from(selectedStories)) {
      try {
        await approveStory.mutateAsync({ id });
        approved++;
      } catch (error) {
        console.error("Error approving story:", error);
      }
    }

    toast.success(`${approved} stories approved!`);
    setSelectedStories(new Set());
    refetch();
  };

  const handleBulkReject = async () => {
    if (selectedStories.size === 0) {
      toast.error("No stories selected");
      return;
    }

    let rejected = 0;
    for (const id of Array.from(selectedStories)) {
      try {
        await rejectStory.mutateAsync({ id });
        rejected++;
      } catch (error) {
        console.error("Error rejecting story:", error);
      }
    }

    toast.success(`${rejected} stories rejected!`);
    setSelectedStories(new Set());
    refetch();
  };

  const toggleStorySelection = (id: number) => {
    const newSelected = new Set(selectedStories);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStories(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedStories.size === filteredStories.length) {
      setSelectedStories(new Set());
    } else {
      setSelectedStories(new Set(filteredStories.map((s) => s.id)));
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading pending stories...</div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-600 text-sm font-semibold">Total Pending</p>
          <p className="text-3xl font-bold text-blue-700">{stories.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-600 text-sm font-semibold">Selected</p>
          <p className="text-3xl font-bold text-yellow-700">{selectedStories.size}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-600 text-sm font-semibold">Filtered Results</p>
          <p className="text-3xl font-bold text-green-700">{filteredStories.length}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title, author, or school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Filter size={20} style={{ color: "#e07f10" }} />
          <span className="font-semibold text-gray-700">Filter by Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
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

      {/* Bulk Actions */}
      {selectedStories.size > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedStories.size === filteredStories.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 cursor-pointer"
            />
            <span className="text-sm font-semibold text-gray-700">
              {selectedStories.size} story/stories selected
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold flex items-center gap-2"
            >
              <Check size={18} />
              Approve All
            </button>
            <button
              onClick={handleBulkReject}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold flex items-center gap-2"
            >
              <X size={18} />
              Reject All
            </button>
          </div>
        </div>
      )}

      {/* Stories List */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pending stories found.</p>
          <p className="text-gray-400 text-sm mt-2">All stories have been reviewed!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className={`bg-white rounded-lg shadow hover:shadow-lg transition border-2 cursor-pointer ${
                selectedStoryId === story.id ? "border-orange-500" : "border-transparent"
              }`}
              onClick={() => setSelectedStoryId(selectedStoryId === story.id ? null : story.id)}
            >
              {/* Story Card Header */}
              <div className="p-4 border-b border-gray-200 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={selectedStories.has(story.id)}
                      onChange={() => toggleStorySelection(story.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <h3 className="font-bold text-lg line-clamp-2" style={{ color: "#e07f10" }}>
                      {story.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>By:</strong> {story.authorName} | <strong>School:</strong> {story.school}
                  </p>
                  <div
                    className="inline-block px-2 py-1 rounded text-white text-xs font-semibold"
                    style={{ backgroundColor: getCategoryColor(story.category) }}
                  >
                    {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                  </div>
                </div>
              </div>

              {/* Story Preview */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{story.content}</p>

                {/* Media Indicators */}
                {(story.imageUrl || story.videoUrl || story.audioUrl) && (
                  <div className="flex gap-2 mb-3">
                    {story.imageUrl && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        📷 Image
                      </span>
                    )}
                    {story.videoUrl && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        🎬 Video
                      </span>
                    )}
                    {story.audioUrl && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        🎙️ Audio
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-3">
                  Submitted: {formatDate(story.createdAt)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(story.id);
                  }}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <Check size={16} />
                  Approve
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(story.id);
                  }}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <X size={16} />
                  Reject
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(story.id);
                  }}
                  className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded View */}
              {selectedStoryId === story.id && (
                <div className="p-4 bg-blue-50 border-t border-blue-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Full Story</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{story.content}</p>

                  {/* Media Preview */}
                  {story.imageUrl && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Image Preview:</p>
                      <img
                        src={story.imageUrl}
                        alt="Story"
                        className="max-w-full h-auto rounded-lg max-h-48"
                      />
                    </div>
                  )}

                  {/* Media Links */}
                  <div className="space-y-2">
                    {story.videoUrl && (
                      <a
                        href={story.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        ▶️ View Video
                      </a>
                    )}
                    {story.audioUrl && (
                      <a
                        href={story.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800 font-semibold"
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
