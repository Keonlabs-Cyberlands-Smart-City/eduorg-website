import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { sendContactFormEmail, sendConfirmationEmail } from "./email";
import { getFormattedFacebookPosts } from "./facebook";
import { 
  getFeaturedTestimonials, 
  getAllTestimonialsAdmin, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  getTestimonialById 
} from "./db.testimonials";

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

  testimonials: router({
    // Get featured testimonials for homepage
    getFeatured: publicProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(20).default(6),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const limit = input?.limit || 6;
          const testimonials = await getFeaturedTestimonials(limit);
          return {
            success: true,
            testimonials,
          };
        } catch (error) {
          console.error("Error fetching featured testimonials:", error);
          return {
            success: false,
            testimonials: [],
          };
        }
      }),

    // Get all testimonials (admin)
    getAll: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        return {
          success: false,
          testimonials: [],
          message: "Unauthorized",
        };
      }
      try {
        const testimonials = await getAllTestimonialsAdmin();
        return {
          success: true,
          testimonials,
        };
      } catch (error) {
        console.error("Error fetching all testimonials:", error);
        return {
          success: false,
          testimonials: [],
        };
      }
    }),

    // Create testimonial (admin)
    create: protectedProcedure
      .input(
        z.object({
          studentName: z.string().min(1),
          studentRole: z.string().min(1),
          quote: z.string().min(1),
          story: z.string().optional(),
          photoUrl: z.string().optional(),
          program: z.string().optional(),
          impact: z.string().optional(),
          rating: z.number().min(1).max(5).default(5),
          featured: z.enum(["yes", "no"]).default("no"),
          status: z.enum(["active", "inactive"]).default("active"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        try {
          const testimonial = await createTestimonial(input);
          return {
            success: true,
            testimonial,
            message: "Testimonial created successfully",
          };
        } catch (error) {
          console.error("Error creating testimonial:", error);
          return {
            success: false,
            message: "Failed to create testimonial",
          };
        }
      }),

    // Update testimonial (admin)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          studentName: z.string().optional(),
          studentRole: z.string().optional(),
          quote: z.string().optional(),
          story: z.string().optional(),
          photoUrl: z.string().optional(),
          program: z.string().optional(),
          impact: z.string().optional(),
          rating: z.number().min(1).max(5).optional(),
          featured: z.enum(["yes", "no"]).optional(),
          status: z.enum(["active", "inactive"]).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        try {
          const { id, ...data } = input;
          const testimonial = await updateTestimonial(id, data);
          return {
            success: true,
            testimonial,
            message: "Testimonial updated successfully",
          };
        } catch (error) {
          console.error("Error updating testimonial:", error);
          return {
            success: false,
            message: "Failed to update testimonial",
          };
        }
      }),

    // Delete testimonial (admin)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        try {
          const deleted = await deleteTestimonial(input.id);
          return {
            success: deleted,
            message: deleted ? "Testimonial deleted successfully" : "Failed to delete testimonial",
          };
        } catch (error) {
          console.error("Error deleting testimonial:", error);
          return {
            success: false,
            message: "Failed to delete testimonial",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
