import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Lock } from "lucide-react";

const CATEGORIES = [
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "headteacher", label: "School Headteacher" },
  { value: "parent", label: "Parent" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

export default function Stories() {
  const [step, setStep] = useState<"auth" | "form">("auth");
  const [adminKey, setAdminKey] = useState("");
  const [keyError, setKeyError] = useState("");
  
  const [formData, setFormData] = useState({
    category: "",
    authorName: "",
    school: "",
    title: "",
    content: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitStory = trpc.stories.submit.useMutation();

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError("");

    if (adminKey === "Keonlabs2026") {
      setStep("form");
      toast.success("Access granted! You can now submit your story.");
    } else {
      setKeyError("Invalid admin key. Please try again.");
      toast.error("Invalid admin key");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.category || !formData.authorName || !formData.school || !formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitStory.mutateAsync({
        adminKey: "Keonlabs2026",
        category: formData.category as any,
        authorName: formData.authorName,
        school: formData.school,
        title: formData.title,
        content: formData.content,
        imageUrl: formData.imageUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        audioUrl: formData.audioUrl || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        setFormData({
          category: "",
          authorName: "",
          school: "",
          title: "",
          content: "",
          imageUrl: "",
          videoUrl: "",
          audioUrl: "",
        });
        setStep("auth");
        setAdminKey("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit story. Please try again.");
      console.error("Error submitting story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {step === "auth" ? (
            // Authentication Step
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-center mb-6">
                <Lock size={40} style={{ color: "#e07f10" }} />
              </div>
              <h1 className="text-3xl font-bold text-center mb-2" style={{ color: "#e07f10" }}>
                Share Your Story
              </h1>
              <p className="text-center text-gray-600 mb-8">
                Enter your admin key to submit a story to our community
              </p>

              <form onSubmit={handleKeySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      setKeyError("");
                    }}
                    placeholder="Enter your admin key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {keyError && (
                    <p className="text-red-500 text-sm mt-2">{keyError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg font-semibold text-white transition"
                  style={{ backgroundColor: "#e07f10" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d66d0a")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e07f10")}
                >
                  Unlock Story Submission
                </button>
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an admin key? Contact the administrator to get access.
              </p>
            </div>
          ) : (
            // Story Submission Form
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold mb-2" style={{ color: "#e07f10" }}>
                Submit Your Story
              </h1>
              <p className="text-gray-600 mb-8">
                Share your experience and inspire others in our community
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* School */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Enter your school name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your story a title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Story <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Tell your story... (minimum 10 characters)"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Media URLs */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/video.mp4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audio URL
                    </label>
                    <input
                      type="url"
                      name="audioUrl"
                      value={formData.audioUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/audio.mp3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("auth");
                      setAdminKey("");
                    }}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#e07f10", opacity: isSubmitting ? 0.7 : 1 }}
                    onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = "#d66d0a")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e07f10")}
                  >
                    <Upload size={20} />
                    {isSubmitting ? "Submitting..." : "Submit Story"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
