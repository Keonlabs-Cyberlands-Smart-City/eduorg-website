import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialsByProgram,
  getTestimonialById,
} from "./db.testimonials";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(async () => null),
}));

describe("Testimonials Database", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export all required functions", () => {
    expect(typeof getAllTestimonials).toBe("function");
    expect(typeof getFeaturedTestimonials).toBe("function");
    expect(typeof getTestimonialsByProgram).toBe("function");
    expect(typeof getTestimonialById).toBe("function");
  });

  it("should handle missing database connection gracefully", async () => {
    const testimonials = await getAllTestimonials();
    expect(Array.isArray(testimonials)).toBe(true);
    expect(testimonials.length).toBe(0);
  });

  it("should handle featured testimonials query", async () => {
    const testimonials = await getFeaturedTestimonials(6);
    expect(Array.isArray(testimonials)).toBe(true);
  });

  it("should handle program filter query", async () => {
    const testimonials = await getTestimonialsByProgram("Bootcamp");
    expect(Array.isArray(testimonials)).toBe(true);
  });

  it("should handle single testimonial query", async () => {
    const testimonial = await getTestimonialById(1);
    expect(testimonial === undefined || testimonial === null).toBe(true);
  });
});
