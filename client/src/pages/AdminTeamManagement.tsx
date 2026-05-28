import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      // For now, we'll use a data URL since we don't have direct S3 access in the client
      // In production, you'd upload to S3 via the server
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

      // Upload photo if a new file was selected
      if (photoFile) {
        photoUrl = await uploadPhotoToS3(photoFile);
      }

      const submitData = {
        ...formData,
        photoUrl,
      };

      if (editingId) {
        // Update existing team member
        await updateMutation.mutateAsync({
          id: editingId,
          ...submitData,
        });
        toast.success("Team member updated successfully!");
      } else {
        // Create new team member
        await createMutation.mutateAsync(submitData);
        toast.success("Team member added successfully!");
      }

      // Refresh team members list
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage your team members</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Add Team Member Button */}
        <div className="mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Photo</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    {photoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview("");
                            setPhotoFile(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Drag and drop your photo here, or click to select
                        </p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter team member name"
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Mathematics Teacher, Operations Manager"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="promoted">Promoted</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="team.member@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description / Bio
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Write a brief bio or description about this team member"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.role}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? (
                      "Update Member"
                    ) : (
                      "Add Member"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members by Category */}
        <div className="space-y-8">
          {/* Teachers */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Teachers ({groupedMembers.teacher.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMembers.teacher.length > 0 ? (
                groupedMembers.teacher.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No teachers added yet</p>
              )}
            </div>
          </div>

          {/* Managers */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managers ({groupedMembers.manager.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMembers.manager.length > 0 ? (
                groupedMembers.manager.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No managers added yet</p>
              )}
            </div>
          </div>

          {/* Coordinators */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coordinators ({groupedMembers.coordinator.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedMembers.coordinator.length > 0 ? (
                groupedMembers.coordinator.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No coordinators added yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Team Member Card Component
function TeamMemberCard({
  member,
  onEdit,
  onDelete,
}: {
  member: any;
  onEdit: (member: any) => void;
  onDelete: (id: number) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "promoted":
        return "bg-blue-100 text-blue-800";
      case "left":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      {member.photoUrl && (
        <img
          src={member.photoUrl}
          alt={member.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{member.role}</p>

        {member.description && (
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{member.description}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(member.status)}`}>
            {member.status}
          </span>
        </div>

        {member.email && (
          <p className="text-xs text-gray-500 mb-1">📧 {member.email}</p>
        )}
        {member.phone && (
          <p className="text-xs text-gray-500 mb-3">📱 {member.phone}</p>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(member)}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(member.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
