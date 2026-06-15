import { router, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";

export const storyKeyRequestRouter = router({
  requestKey: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(2),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Notify admin about the key request
        const emailContent = `
New Story Access Key Request

Name: ${input.name}
Email: ${input.email}
Message: ${input.message || "No message provided"}

To approve this request, reply to this email with the access key.
The user will receive the key and can then submit their story.
        `;

        const success = await notifyOwner({
          title: "Story Access Key Request",
          content: emailContent,
        });

        if (success) {
          return {
            success: true,
            message: "Request sent successfully! The admin will respond with your access key.",
          };
        } else {
          return {
            success: false,
            message: "Failed to send request. Please try again later.",
          };
        }
      } catch (error) {
        console.error("Error processing key request:", error);
        return {
          success: false,
          message: "An error occurred. Please try again.",
        };
      }
    }),
});
