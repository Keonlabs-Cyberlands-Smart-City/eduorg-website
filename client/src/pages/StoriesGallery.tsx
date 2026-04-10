import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoriesGallery from "@/components/StoriesGallery";

export default function StoriesGalleryPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#e07f10" }}>
              Community Stories
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover inspiring stories from our community members including teachers, students, parents, and staff. 
              Share your experiences and celebrate the impact of our programs.
            </p>
          </div>

          {/* Stories Gallery */}
          <StoriesGallery />
        </div>
      </div>
      <Footer />
    </>
  );
}
