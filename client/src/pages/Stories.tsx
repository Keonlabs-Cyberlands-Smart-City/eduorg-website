import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Lock, X, FileUp } from "lucide-react";

const CATEGORIES = [
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
  { value: "headteacher", label: "School Headteacher" },
  { value: "parent", label: "Parent" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];

interface FileUpload {
  file: File;
  preview: string;
  type: "image" | "video" | "audio";
}

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
  });

  const [uploadedFiles, setUploadedFiles] = useState<{
    image?: FileUpload;
    video?: FileUpload;
    audio?: FileUpload;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "video" | "audio"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    // Validate file type
    const validTypes: Record<string, string[]> = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/quicktime"],
      audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"],
    };

    if (!validTypes[fileType].includes(file.type)) {
      toast.error(`Invalid ${fileType} format`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: { file, preview, type: fileType },
      }));
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded`);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fileType: "image" | "video" | "audio") => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileType];
      return newFiles;
    });
    if (fileType === "image" && imageInputRef.current) imageInputRef.current.value = "";
    if (fileType === "video" && videoInputRef.current) videoInputRef.current.value = "";
    if (fileType === "audio" && audioInputRef.current) audioInputRef.current.value = "";
  };

  const uploadFileToServer = async (file: File, fileType: string): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileType);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Failed to upload ${fileType}`);
      return null;
    }
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
      // Upload files to server
      let imageUrl: string | undefined = undefined;
      let videoUrl: string | undefined = undefined;
      let audioUrl: string | undefined = undefined;

      if (uploadedFiles.image) {
        const url = await uploadFileToServer(uploadedFiles.image.file, "image");
        if (url) imageUrl = url;
      }
      if (uploadedFiles.video) {
        const url = await uploadFileToServer(uploadedFiles.video.file, "video");
        if (url) videoUrl = url;
      }
      if (uploadedFiles.audio) {
        const url = await uploadFileToServer(uploadedFiles.audio.file, "audio");
        if (url) audioUrl = url;
      }

      const result = await submitStory.mutateAsync({
        adminKey: "Keonlabs2026",
        category: formData.category as any,
        authorName: formData.authorName,
        school: formData.school,
        title: formData.title,
        content: formData.content,
        imageUrl,
        videoUrl,
        audioUrl,
      });

      if (result.success) {
        toast.success(result.message);
        setFormData({
          category: "",
          authorName: "",
          school: "",
          title: "",
          content: "",
        });
        setUploadedFiles({});
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

                {/* File Uploads */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Upload Media (Optional)</h3>

                  {/* Image Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📷 Image
                    </label>
                    {uploadedFiles.image ? (
                      <div className="relative inline-block">
                        <img
                          src={uploadedFiles.image.preview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg border-2 border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("image")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 transition"
                      >
                        <FileUp size={24} className="mx-auto mb-2" style={{ color: "#e07f10" }} />
                        <p className="text-sm text-gray-600">Click to upload image</p>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP (max 50MB)</p>
                      </button>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, "image")}
                      className="hidden"
                    />
                  </div>

                  {/* Video Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎬 Video
                    </label>
                    {uploadedFiles.video ? (
                      <div className="relative inline-block">
                        <div className="h-32 w-32 bg-gray-200 rounded-lg border-2 border-green-500 flex items-center justify-center">
                          <p className="text-sm text-gray-600">Video ready</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("video")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 transition"
                      >
                        <FileUp size={24} className="mx-auto mb-2" style={{ color: "#e07f10" }} />
                        <p className="text-sm text-gray-600">Click to upload video</p>
                        <p className="text-xs text-gray-500">MP4, WebM, MOV (max 50MB)</p>
                      </button>
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileSelect(e, "video")}
                      className="hidden"
                    />
                  </div>

                  {/* Audio Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎙️ Audio
                    </label>
                    {uploadedFiles.audio ? (
                      <div className="relative inline-block">
                        <div className="h-32 w-32 bg-gray-200 rounded-lg border-2 border-green-500 flex items-center justify-center">
                          <p className="text-sm text-gray-600">Audio ready</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("audio")}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => audioInputRef.current?.click()}
                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-orange-500 transition"
                      >
                        <FileUp size={24} className="mx-auto mb-2" style={{ color: "#e07f10" }} />
                        <p className="text-sm text-gray-600">Click to upload audio</p>
                        <p className="text-xs text-gray-500">MP3, WAV, OGG, M4A (max 50MB)</p>
                      </button>
                    )}
                    <input
                      ref={audioInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileSelect(e, "audio")}
                      className="hidden"
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
