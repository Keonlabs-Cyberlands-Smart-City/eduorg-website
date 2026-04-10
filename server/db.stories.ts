import { eq, and } from "drizzle-orm";
import { stories, type InsertStory, type Story } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all approved stories
 */
export async function getAllApprovedStories(): Promise<Story[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(stories)
    .where(eq(stories.status, "approved"))
    .orderBy(stories.createdAt);
}

/**
 * Get stories by category
 */
export async function getStoriesByCategory(category: string): Promise<Story[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(stories)
    .where(and(eq(stories.status, "approved"), eq(stories.category, category as any)))
    .orderBy(stories.createdAt);
}

/**
 * Get featured stories
 */
export async function getFeaturedStories(limit: number = 6): Promise<Story[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(stories)
    .where(and(eq(stories.status, "approved"), eq(stories.featured, "yes")))
    .orderBy(stories.createdAt)
    .limit(limit);
}

/**
 * Get single story by ID
 */
export async function getStoryById(id: number): Promise<Story | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(stories)
    .where(eq(stories.id, id));
  return result[0];
}

/**
 * Create new story
 */
export async function createStory(data: InsertStory): Promise<Story | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(stories).values(data);
    const id = result[0].insertId as number;
    const created = await getStoryById(id);
    return created || null;
  } catch (error) {
    console.error("Error creating story:", error);
    return null;
  }
}

/**
 * Update story
 */
export async function updateStory(id: number, data: Partial<InsertStory>): Promise<Story | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(stories).set(data).where(eq(stories.id, id));
    const updated = await getStoryById(id);
    return updated || null;
  } catch (error) {
    console.error("Error updating story:", error);
    return null;
  }
}

/**
 * Delete story
 */
export async function deleteStory(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(stories).where(eq(stories.id, id));
    return true;
  } catch (error) {
    console.error("Error deleting story:", error);
    return false;
  }
}

/**
 * Get all stories (admin view)
 */
export async function getAllStoriesAdmin(): Promise<Story[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(stories).orderBy(stories.createdAt);
}

/**
 * Get pending stories for moderation
 */
export async function getPendingStories(): Promise<Story[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(stories)
    .where(eq(stories.status, "pending"))
    .orderBy(stories.createdAt);
}

/**
 * Increment story views
 */
export async function incrementStoryViews(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  try {
    const story = await getStoryById(id);
    if (story) {
      await db
        .update(stories)
        .set({ views: (story.views || 0) + 1 })
        .where(eq(stories.id, id));
    }
  } catch (error) {
    console.error("Error incrementing story views:", error);
  }
}
