import { describe, it, expect } from "vitest";

describe("Admin Email Configuration", () => {
  it("should have ADMIN_EMAIL environment variable set", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    expect(adminEmail).toBeDefined();
    expect(adminEmail).toBe("keon202508@gmail.com");
  });

  it("should be a valid email format", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(adminEmail || "")).toBe(true);
  });

  it("should contain gmail domain", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    expect(adminEmail).toContain("@gmail.com");
  });

  it("should be accessible for notifications", () => {
    const adminEmail = process.env.ADMIN_EMAIL;
    expect(adminEmail).toBeTruthy();
    expect(typeof adminEmail).toBe("string");
    expect(adminEmail?.length).toBeGreaterThan(0);
  });
});
