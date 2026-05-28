import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FacebookFeed from "@/components/FacebookFeed";
import TestimonialsSection from "@/components/TestimonialsSection";
import ParallaxHero from "@/components/ParallaxHero";
import FAQSection from "@/components/FAQSection";
import NewsletterForm from "@/components/NewsletterForm";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const programs = [
  { name: "Bootcamps", desc: "Academic intensive programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Main page image_d0d55fa9.jpg", link: "/bootcamp" },
  { name: "Sports", desc: "Games and physical activities", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/sports images_52357345.jpg", link: "/sports" },
  { name: "Clubs", desc: "ICT, literacy and social clubs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Chess club image_e4319a63.jpg", link: "/clubs" },
  { name: "Outreach Visits", desc: "Community engagement programs", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/managers 1_88b8b087.jpg", link: "/outreach" },
  { name: "Day-in Visits", desc: "Daily school engagement", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/day in images 2_ced30474.jpg", link: "/dayin" },
  { name: "Library", desc: "Books and resources", img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663455556448/epjCjfnCCf8LFtGtGELo3e/Library image_54c70572.jpg", link: "/library" },
];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", role: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const sendEmailMutation = trpc.email.sendContactForm.useMutation();
  const getAllTeamQuery = trpc.teamMembers.getAll.useQuery();
  const updateMutation = trpc.teamMembers.update.useMutation() as any;

  // Load team members
  useEffect(() => {
    if (getAllTeamQuery.data?.members) {
      setTeamMembers(getAllTeamQuery.data.members);
    }
  }, [getAllTeamQuery.data?.members]);

  // Check if user is admin
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    setIsAdmin(auth === "true");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Save to Firebase
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        createdAt: new Date(),
        status: "new",
        replied: false
      });

      // Send emails via tRPC
      const result = await sendEmailMutation.mutateAsync({
        name,
        email,
        message,
      });

      if (result.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(result.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setEditFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setEditLoading(true);
    try {
      await updateMutation.mutateAsync({
        id: editingMember.id,
        name: editFormData.name,
        role: editFormData.role,
        description: editFormData.description,
      });
      toast.success("Team member updated successfully!");
      getAllTeamQuery.refetch();
      setIsEditDialogOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error("Failed to update team member");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <ParallaxHero>
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Make learning fun and engaging</h1>
          <p className="text-xl text-gray-200 mb-8">Daily activities, bootcamps, clubs and more</p>
        </div>
      </ParallaxHero>

      {/* PROGRAMS SECTION */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center" style={{color: '#dbea06', fontWeight: '900'}}>Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog, idx) => (
              <Link key={idx} href={prog.link}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                  <img src={prog.img} alt={prog.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900">{prog.name}</h3>
                    <p className="text-gray-600 mt-2">{prog.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{color: '#dbea06', fontWeight: '900', backgroundColor: '#e07f10'}}>Our Team</h2>

          {/* Teachers */}
          <h3 className="text-2xl font-semibold mb-4">Teachers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {teamMembers.filter(m => m.category === 'teacher' && m.status === 'active').length > 0 ? (
              teamMembers.filter(m => m.category === 'teacher' && m.status === 'active').map((teacher) => (
                <TeamMemberCard
                  key={teacher.id}
                  member={teacher}
                  isAdmin={isAdmin}
                  onEdit={handleEditMember}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No teachers available</p>
            )}
          </div>

          {/* Managers */}
          <h3 className="text-2xl font-semibold mb-4">Managers</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {teamMembers.filter(m => m.category === 'manager' && m.status === 'active').length > 0 ? (
              teamMembers.filter(m => m.category === 'manager' && m.status === 'active').map((manager) => (
                <TeamMemberCard
                  key={manager.id}
                  member={manager}
                  isAdmin={isAdmin}
                  onEdit={handleEditMember}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No managers available</p>
            )}
          </div>

          {/* Club Coordinators */}
          <h3 className="text-2xl font-semibold mb-4">Club Coordinators</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.filter(m => m.category === 'coordinator' && m.status === 'active').length > 0 ? (
              teamMembers.filter(m => m.category === 'coordinator' && m.status === 'active').map((coordinator) => (
                <TeamMemberCard
                  key={coordinator.id}
                  member={coordinator}
                  isAdmin={isAdmin}
                  onEdit={handleEditMember}
                />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No coordinators available</p>
            )}
          </div>
        </div>
      </section>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Input
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* FAQ SECTION */}
      <FAQSection />

      {/* NEWSLETTER SECTION */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
        <NewsletterForm />
      </section>

      {/* TESTIMONIALS SECTION */}
      <TestimonialsSection />

      {/* FACEBOOK FEED SECTION */}
      <FacebookFeed />

      {/* CONTACT SECTION */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

// Team Member Card Component
function TeamMemberCard({
  member,
  isAdmin,
  onEdit,
}: {
  member: any;
  isAdmin: boolean;
  onEdit: (member: any) => void;
}) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center hover:shadow-lg transition relative group">
      {member.photoUrl && (
        <img src={member.photoUrl} alt={member.name} className="w-full h-40 object-cover rounded-lg mb-3" />
      )}
      <h4 className="font-bold text-lg">{member.name}</h4>
      <p className="text-gray-600">{member.role}</p>
      {member.description && (
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{member.description}</p>
      )}
      
      {/* Edit button for admins */}
      {isAdmin && (
        <button
          onClick={() => onEdit(member)}
          className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
          title="Edit team member"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
