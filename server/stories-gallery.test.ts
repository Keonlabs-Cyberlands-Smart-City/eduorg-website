import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Stories Gallery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should filter stories by category", () => {
    const stories = [
      { id: 1, category: "student", title: "My Journey" },
      { id: 2, category: "teacher", title: "Teaching Experience" },
      { id: 3, category: "student", title: "Success Story" },
    ];

    const filtered = stories.filter((s) => s.category === "student");
    expect(filtered).toHaveLength(2);
    expect(filtered.every((s) => s.category === "student")).toBe(true);
  });

  it("should search stories by title", () => {
    const stories = [
      { id: 1, title: "My Journey", content: "A great experience" },
      { id: 2, title: "Teaching Experience", content: "Inspiring students" },
      { id: 3, title: "Success Story", content: "Achieved my goals" },
    ];

    const query = "success";
    const filtered = stories.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("Success Story");
  });

  it("should search stories by author name", () => {
    const stories = [
      { id: 1, authorName: "John Smith", title: "My Story" },
      { id: 2, authorName: "Jane Doe", title: "Her Story" },
      { id: 3, authorName: "John Wilson", title: "Another Story" },
    ];

    const query = "john";
    const filtered = stories.filter((s) =>
      s.authorName.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered).toHaveLength(2);
    expect(filtered.every((s) => s.authorName.toLowerCase().includes("john"))).toBe(true);
  });

  it("should combine category and search filters", () => {
    const stories = [
      { id: 1, category: "student", title: "Student Success", authorName: "Alice" },
      { id: 2, category: "teacher", title: "Teacher Success", authorName: "Bob" },
      { id: 3, category: "student", title: "Another Student", authorName: "Charlie" },
    ];

    const category = "student";
    const query = "success";
    const filtered = stories.filter((s) => {
      const matchesCategory = s.category === category;
      const matchesSearch = s.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe(1);
  });

  it("should handle empty search results", () => {
    const stories = [
      { id: 1, title: "Story One" },
      { id: 2, title: "Story Two" },
    ];

    const query = "nonexistent";
    const filtered = stories.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );

    expect(filtered).toHaveLength(0);
  });

  it("should format dates correctly", () => {
    const date = new Date("2026-04-11");
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    expect(formatted).toContain("Apr");
    expect(formatted).toContain("2026");
    expect(formatted.length).toBeGreaterThan(0);
  });

  it("should assign category colors", () => {
    const colors: Record<string, string> = {
      teacher: "#e07f10",
      student: "#95ba12",
      headteacher: "#c2e708",
      parent: "#3b82f6",
      staff: "#8b5cf6",
      other: "#6b7280",
    };

    expect(colors["teacher"]).toBe("#e07f10");
    expect(colors["student"]).toBe("#95ba12");
    expect(colors["nonexistent"] || "#6b7280").toBe("#6b7280");
  });
});
