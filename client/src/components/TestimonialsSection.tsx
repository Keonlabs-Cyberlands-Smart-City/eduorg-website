import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  studentName: string;
  studentRole: string;
  quote: string;
  story: string | null;
  photoUrl: string | null;
  program: string | null;
  impact: string | null;
  rating: number | null;
  featured: "yes" | "no" | null;
  status: "active" | "inactive" | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isLoading: queryLoading } = trpc.testimonials.getFeatured.useQuery({
    limit: 6,
  });

  useEffect(() => {
    if (data?.testimonials) {
      setTestimonials(data.testimonials);
      setIsLoading(false);
    }
  }, [data]);

  if (isLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading testimonials...</div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No testimonials available yet</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full">
      {/* Carousel Container */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left: Student Photo */}
          <div className="flex items-center justify-center">
            {currentTestimonial.photoUrl ? (
              <img
                src={currentTestimonial.photoUrl}
                alt={currentTestimonial.studentName}
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">👤</div>
                  <p>No photo available</p>
                </span>
              </div>
            )}
          </div>

          {/* Right: Testimonial Content */}
          <div className="flex flex-col justify-center">
            {/* Rating */}
            {currentTestimonial.rating && (
              <div className="flex gap-1 mb-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            )}

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl font-semibold mb-6 italic text-gray-700">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Student Info */}
            <div className="mb-6">
              <h3 className="text-lg font-bold" style={{ color: "#e07f10" }}>
                {currentTestimonial.studentName}
              </h3>
              <p className="text-gray-600">{currentTestimonial.studentRole}</p>
              {currentTestimonial.program && (
                <p className="text-sm text-gray-500 mt-2">
                  Program: <span className="font-semibold">{currentTestimonial.program}</span>
                </p>
              )}
            </div>

            {/* Story */}
            {currentTestimonial.story && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentTestimonial.story}
              </p>
            )}

            {/* Impact */}
            {currentTestimonial.impact && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <p className="text-sm font-semibold text-green-700">Impact:</p>
                <p className="text-green-600">{currentTestimonial.impact}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} style={{ color: "#e07f10" }} />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} style={{ color: "#e07f10" }} />
            </button>
          </>
        )}
      </div>

      {/* Carousel Indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition ${
                index === currentIndex
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {testimonials.length > 1 && (
        <div className="text-center mt-4 text-sm text-gray-500">
          {currentIndex + 1} / {testimonials.length}
        </div>
      )}
    </div>
  );
}
