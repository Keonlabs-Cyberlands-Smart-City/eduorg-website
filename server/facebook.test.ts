import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFacebookPosts, getFormattedFacebookPosts, formatFacebookPost } from "./facebook";

// Mock fetch
global.fetch = vi.fn();

describe("Facebook Feed Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should export required functions", () => {
    expect(typeof getFacebookPosts).toBe("function");
    expect(typeof getFormattedFacebookPosts).toBe("function");
    expect(typeof formatFacebookPost).toBe("function");
  });

  it("should handle missing credentials gracefully", async () => {
    // Clear environment variables
    delete process.env.VITE_FACEBOOK_PAGE_ID;
    delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    const posts = await getFacebookPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(0);
  });

  it("should format Facebook post correctly", () => {
    const mockPost = {
      id: "123456",
      message: "Test message",
      story: "Test story",
      picture: "https://example.com/image.jpg",
      link: "https://facebook.com/post/123",
      created_time: "2026-04-08T10:00:00+0000",
      permalink_url: "https://facebook.com/page/posts/123",
      type: "photo",
    };

    const formatted = formatFacebookPost(mockPost);

    expect(formatted.id).toBe("123456");
    expect(formatted.title).toBe("Test message");
    expect(formatted.content).toBe("Test message");
    expect(formatted.image).toBe("https://example.com/image.jpg");
    expect(formatted.link).toBe("https://facebook.com/post/123");
    expect(formatted.type).toBe("photo");
    expect(formatted.date instanceof Date).toBe(true);
  });

  it("should handle posts without message", () => {
    const mockPost = {
      id: "123456",
      story: "Test story only",
      created_time: "2026-04-08T10:00:00+0000",
      type: "status",
    };

    const formatted = formatFacebookPost(mockPost);

    expect(formatted.title).toBe("Test story only");
    expect(formatted.content).toBe("Test story only");
  });

  it("should handle posts with no content", () => {
    const mockPost = {
      id: "123456",
      created_time: "2026-04-08T10:00:00+0000",
      type: "link",
    };

    const formatted = formatFacebookPost(mockPost);

    expect(formatted.title).toBe("Facebook Post");
    expect(formatted.content).toBe("");
  });
});
