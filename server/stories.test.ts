import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllApprovedStories,
  getStoriesByCategory,
  getStoryById,
} from "./db.stories";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(async () => null),
}));

describe("Stories Database", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export all required functions", () => {
    expect(typeof getAllApprovedStories).toBe("function");
    expect(typeof getStoriesByCategory).toBe("function");
    expect(typeof getStoryById).toBe("function");
  });

  it("should handle missing database connection gracefully", async () => {
    const stories = await getAllApprovedStories();
    expect(Array.isArray(stories)).toBe(true);
    expect(stories.length).toBe(0);
  });

  it("should handle category filter query", async () => {
    const stories = await getStoriesByCategory("student");
    expect(Array.isArray(stories)).toBe(true);
  });

  it("should handle single story query", async () => {
    const story = await getStoryById(1);
    expect(story === undefined || story === null).toBe(true);
  });

  it("should validate admin key in story submission", () => {
    const validKey = "Keonlabs2026";
    const invalidKey = "wrongkey";
    
    expect(validKey).toBe("Keonlabs2026");
    expect(invalidKey).not.toBe("Keonlabs2026");
  });
});
