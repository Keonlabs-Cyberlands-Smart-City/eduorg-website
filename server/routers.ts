import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { sendContactFormEmail, sendConfirmationEmail } from "./email";
import { getFormattedFacebookPosts } from "./facebook";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  email: router({
    sendContactForm: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          message: z.string().min(1),
          subject: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Send email to admin
          const adminEmailSent = await sendContactFormEmail(input);
          
          // Send confirmation email to user
          const confirmationSent = await sendConfirmationEmail(input.email, input.name);
          
          return {
            success: true,
            adminEmailSent,
            confirmationSent,
            message: "Your message has been sent successfully!",
          };
        } catch (error) {
          console.error("Error sending contact form:", error);
          return {
            success: false,
            message: "Failed to send message. Please try again.",
          };
        }
      }),
  }),

  social: router({
    getFacebookPosts: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(50).default(10),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const limit = input?.limit || 10;
          const posts = await getFormattedFacebookPosts(limit);
          return {
            success: true,
            posts,
            message: posts.length > 0 ? "Posts fetched successfully" : "No Facebook credentials configured",
          };
        } catch (error) {
          console.error("Error fetching Facebook posts:", error);
          return {
            success: false,
            posts: [],
            message: "Failed to fetch Facebook posts",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
