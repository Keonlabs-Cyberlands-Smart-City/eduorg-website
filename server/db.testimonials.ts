import { eq, and } from "drizzle-orm";
import { testimonials, type InsertTestimonial, type Testimonial } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all active testimonials
 */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.status, "active"))
    .orderBy(testimonials.createdAt);
}

/**
 * Get featured testimonials (for homepage display)
 */
export async function getFeaturedTestimonials(limit: number = 6): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.status, "active"), eq(testimonials.featured, "yes")))
    .orderBy(testimonials.createdAt)
    .limit(limit);
}

/**
 * Get testimonials by program
 */
export async function getTestimonialsByProgram(program: string): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.status, "active"), eq(testimonials.program, program)))
    .orderBy(testimonials.createdAt);
}

/**
 * Get single testimonial by ID
 */
export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.id, id));
  return result[0];
}

/**
 * Create new testimonial
 */
export async function createTestimonial(data: InsertTestimonial): Promise<Testimonial | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(testimonials).values(data);
    const id = result[0].insertId as number;
    const created = await getTestimonialById(id);
    return created || null;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return null;
  }
}

/**
 * Update testimonial
 */
export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>): Promise<Testimonial | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(testimonials).set(data).where(eq(testimonials.id, id));
    const updated = await getTestimonialById(id);
    return updated || null;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return null;
  }
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return false;
  }
}

/**
 * Get all testimonials (admin view)
 */
export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(testimonials).orderBy(testimonials.createdAt);
}
