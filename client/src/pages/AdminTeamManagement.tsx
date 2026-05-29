import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2, Edit2, Plus, Upload, X } from "lucide-react";

export default function AdminTeamManagement() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    category: "teacher" as "teacher" | "manager" | "coordinator",
    photoUrl: "",
    description: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive" | "promoted" | "left",
  });

  const [dragActive, setDragActive] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC mutations
  const createMutation = trpc.teamMembers.create.useMutation();
  const updateMutation = trpc.teamMembers.update.useMutation();
  const deleteMutation = trpc.teamMembers.delete.useMutation();
  const getAllQuery = trpc.teamMembers.getAll.useQuery();

  // Authentication check
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setLocation("/admin-login");
    }
    setAuthChecked(true);
  }, [setLocation]);

  // Load team members
  useEffect(() => {
    if (isAuthenticated && getAllQuery.data?.members) {
      setTeamMembers(getAllQuery.data.members);
    }
  }, [isAuthenticated, getAllQuery.data?.members]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminLoginTime");
    setLocation("/admin-login");
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handlePhotoUpload(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const uploadPhotoToS3 = async (file: File): Promise<string> => {
    try {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch (error) {
      toast.error("Failed to upload photo");
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = formData.photoUrl;

      if (photoFile) {
        photoUrl = await uploadPhotoToS3(photoFile);
      }

      const submitData = {
        ...formData,
        photoUrl,
      };

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...submitData,
        });
        toast.success("Team member updated successfully!");
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success("Team member added successfully!");
      }

      getAllQuery.refetch();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(editingId ? "Failed to update team member" : "Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      photoUrl: member.photoUrl || "",
      description: member.description || "",
      email: member.email || "",
      phone: member.phone || "",
      status: member.status || "active",
    });
    setPhotoPreview(member.photoUrl || "");
    setEditingId(member.id);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Team member deleted successfully!");
        getAllQuery.refetch();
      } catch (error) {
        console.error("Error deleting team member:", error);
        toast.error("Failed to delete team member");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      category: "teacher",
      photoUrl: "",
      description: "",
      email: "",
      phone: "",
      status: "active",
    });
    setPhotoPreview("");
    setPhotoFile(null);
    setEditingId(null);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const groupedMembers = {
    teacher: teamMembers.filter((m) => m.category === "teacher"),
    manager: teamMembers.filter((m) => m.category === "manager"),
    coordinator: teamMembers.filter((m) => m.category === "coordinator"),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2">Team Management</h1>
            <p className="text-xl text-gray-600">Add, edit, and manage your team members</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
          >
            Logout
          </button>
        </div>

        {/* Add Team Member Button */}
        <div className="mb-12">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition"
              >
                <Plus className="w-5 h-5" />
                Add Team Member
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold">
                  {editingId ? "Edit Team Member" : "Add New Team Member"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Photo</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-black bg-gray-100"
                        : "border-gray-300 bg-gray-50 hover:border-black"
                    }`}
                  >
                    {photoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-40 w-40 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview("");
                            setPhotoFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-10 h-10 mx-auto text-gray-600 mb-3" />
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Drag and drop your photo here, or click to select
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handlePhotoUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter team member name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Mathematics Teacher, Operations Manager"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="manager">Manager</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="promoted">Promoted</option>
                    <option value="left">Left</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="team.member@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description / Bio
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Write a brief bio or description about this team member"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-ring resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded-lg font-bold text-white bg-black hover:bg-gray-900 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members Grid */}
        <div className="space-y-12">
          {Object.entries(groupedMembers).map(([category, members]: [string, any]) => (
            members.length > 0 && (
              <div key={category}>
                <h2 className="text-3xl font-bold mb-6 capitalize">
                  {category}s <span className="text-gray-500 text-lg">({members.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member: any) => (
                    <div
                      key={member.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                    >
                      {member.photoUrl && (
                        <div className="relative overflow-hidden bg-gray-200 aspect-square">
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                        <p className="text-gray-600 font-semibold mb-3">{member.role}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {member.category}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              member.status === "active"
                                ? "bg-green-100 text-green-700"
                                : member.status === "promoted"
                                ? "bg-blue-100 text-blue-700"
                                : member.status === "left"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                        {member.description && (
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.description}</p>
                        )}
                        <div className="flex gap-2 pt-4 border-t">
                          <button
                            onClick={() => handleEdit(member)}
                            className="flex-1 bg-black hover:bg-gray-900 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
