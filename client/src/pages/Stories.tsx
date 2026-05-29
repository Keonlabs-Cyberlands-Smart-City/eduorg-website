import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Lock, X, FileUp, CheckCircle, AlertCircle } from "lucide-react";

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
  size: string;
  uploadProgress?: number;
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
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const submitStory = trpc.stories.submit.useMutation();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

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
    processFile(file, fileType);
  };

  const processFile = (file: File, fileType: "image" | "video" | "audio") => {
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
      toast.error(`Invalid ${fileType} format. Supported: ${validTypes[fileType].join(", ")}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setUploadedFiles((prev) => ({
        ...prev,
        [fileType]: { 
          file, 
          preview, 
          type: fileType,
          size: formatFileSize(file.size),
          uploadProgress: 0
        },
      }));
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fileType: "image" | "video" | "audio") => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileType];
      return newFiles;
    });
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileType];
      return newProgress;
    });
    if (fileType === "image" && imageInputRef.current) imageInputRef.current.value = "";
    if (fileType === "video" && videoInputRef.current) videoInputRef.current.value = "";
    if (fileType === "audio" && audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleDrag = (e: React.DragEvent, fileType: string, isActive: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({
      ...prev,
      [fileType]: isActive,
    }));
  };

  const handleDrop = (e: React.DragEvent, fileType: "image" | "video" | "audio") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({
      ...prev,
      [fileType]: false,
    }));

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0], fileType);
    }
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

  const renderFileUploadBox = (
    fileType: "image" | "video" | "audio",
    inputRef: React.RefObject<HTMLInputElement | null>,
    label: string,
    formats: string
  ) => {
    const file = uploadedFiles[fileType];
    const isActive = dragActive[fileType] || false;

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>
        {file ? (
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="font-medium text-gray-700">{file.file.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Size: {file.size}</p>
                {file.uploadProgress !== undefined && file.uploadProgress > 0 && file.uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(fileType)}
                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragEnter={(e) => handleDrag(e, fileType, true)}
            onDragLeave={(e) => handleDrag(e, fileType, false)}
            onDragOver={(e) => handleDrag(e, fileType, true)}
            onDrop={(e) => handleDrop(e, fileType)}
            className={`w-full px-6 py-8 border-2 border-dashed rounded-lg text-center transition cursor-pointer ${
              isActive
                ? "border-black bg-gray-100"
                : "border-gray-300 hover:border-black hover:bg-gray-50"
            }`}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full"
            >
              <FileUp size={32} className="mx-auto mb-3 text-gray-600" />
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {isActive ? "Drop your file here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-500">{formats}</p>
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={
            fileType === "image"
              ? "image/*"
              : fileType === "video"
              ? "video/*"
              : "audio/*"
          }
          onChange={(e) => handleFileSelect(e, fileType)}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {step === "auth" ? (
            // Authentication Step
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="bg-black rounded-full p-4">
                    <Lock size={40} className="text-white" />
                  </div>
                </div>
                <h1 className="text-5xl font-bold mb-3">Share Your Story</h1>
                <p className="text-xl text-gray-600">
                  Enter your admin key to submit a story to our community
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <form onSubmit={handleKeySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                    />
                    {keyError && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {keyError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition-colors"
                  >
                    Unlock Story Submission
                  </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                  Don't have an admin key? Contact the administrator to get access.
                </p>
              </div>
            </div>
          ) : (
            // Story Submission Form
            <div className="animate-fade-in">
              <div className="mb-12">
                <h1 className="text-5xl font-bold mb-3">Submit Your Story</h1>
                <p className="text-xl text-gray-600">
                  Share your experience and inspire others in our community
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* School */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    placeholder="Enter your school name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Story Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Give your story a title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Story <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Tell your story... (minimum 10 characters)"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.content.length} characters
                  </p>
                </div>

                {/* File Uploads */}
                <div className="border-t pt-8">
                  <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                    <Upload size={24} />
                    Upload Media (Optional)
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div>
                      {renderFileUploadBox(
                        "image",
                        imageInputRef,
                        "📷 Image",
                        "JPG, PNG, GIF, WebP"
                      )}
                    </div>
                    <div>
                      {renderFileUploadBox(
                        "video",
                        videoInputRef,
                        "🎬 Video",
                        "MP4, WebM, MOV"
                      )}
                    </div>
                    <div>
                      {renderFileUploadBox(
                        "audio",
                        audioInputRef,
                        "🎵 Audio",
                        "MP3, WAV, OGG"
                      )}
                    </div>
                  </div>

                  {/* Upload Summary */}
                  {Object.keys(uploadedFiles).length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                      <p className="text-sm font-semibold text-blue-900">
                        ✓ {Object.keys(uploadedFiles).length} file{Object.keys(uploadedFiles).length !== 1 ? 's' : ''} ready to upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("auth");
                      setFormData({
                        category: "",
                        authorName: "",
                        school: "",
                        title: "",
                        content: "",
                      });
                      setUploadedFiles({});
                    }}
                    className="flex-1 py-3 px-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
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
