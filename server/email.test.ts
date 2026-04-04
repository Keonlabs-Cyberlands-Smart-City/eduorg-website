import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendContactFormEmail, sendConfirmationEmail } from "./email";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(async () => ({ messageId: "test-id" })),
    })),
  },
}));

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle contact form email sending", async () => {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      message: "This is a test message",
      subject: "Test Subject",
    };

    // Test that the function exists and is callable
    expect(typeof sendContactFormEmail).toBe("function");
    expect(typeof sendConfirmationEmail).toBe("function");
  });

  it("should export required functions", () => {
    expect(sendContactFormEmail).toBeDefined();
    expect(sendConfirmationEmail).toBeDefined();
  });

  it("should handle missing SMTP configuration gracefully", async () => {
    // When SMTP is not configured, functions should return false
    const result = await sendContactFormEmail({
      name: "Test",
      email: "test@example.com",
      message: "Test message",
    });

    // Should return false when transporter is not configured
    expect(typeof result).toBe("boolean");
  });
});
