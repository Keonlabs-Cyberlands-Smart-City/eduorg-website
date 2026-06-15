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
import {
  getAllApprovedStories,
  getStoriesByCategory,
  createStory,
  updateStory,
  deleteStory,
  getPendingStories,
} from "./db.stories";
import {
  getAllTeamMembers,
  getTeamMembersByCategory,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./db";
import { storyKeyRequestRouter } from "./routers/storyKeyRequest";

export const appRouter = router({
  storyKeyRequest: storyKeyRequestRouter,
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

  stories: router({
    // Get all approved stories
    getAll: publicProcedure.query(async () => {
      try {
        const allStories = await getAllApprovedStories();
        return {
          success: true,
          stories: allStories,
        };
      } catch (error) {
        console.error("Error fetching stories:", error);
        return {
          success: false,
          stories: [],
        };
      }
    }),

    // Get stories by category
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        try {
          const categoryStories = await getStoriesByCategory(input.category);
          return {
            success: true,
            stories: categoryStories,
          };
        } catch (error) {
          console.error("Error fetching stories by category:", error);
          return {
            success: false,
            stories: [],
          };
        }
      }),

    // Submit new story (with admin key validation)
    submit: publicProcedure
      .input(
        z.object({
          adminKey: z.string(),
          category: z.enum(["teacher", "student", "headteacher", "parent", "staff", "other"]),
          authorName: z.string().min(1),
          school: z.string().min(1),
          title: z.string().min(1),
          content: z.string().min(1),
          imageUrl: z.string().optional(),
          videoUrl: z.string().optional(),
          audioUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Validate admin key
        if (input.adminKey !== "Keonlabs2026") {
          return {
            success: false,
            message: "Invalid admin key",
          };
        }

        try {
          const { adminKey, ...storyData } = input;
          const story = await createStory({
            ...storyData,
            status: "pending",
          });
          return {
            success: true,
            story,
            message: "Story submitted successfully. It will be reviewed by admins.",
          };
        } catch (error) {
          console.error("Error submitting story:", error);
          return {
            success: false,
            message: "Failed to submit story",
          };
        }
      }),

    // Approve story (admin)
    approve: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        try {
          const story = await updateStory(input.id, { status: "approved" });
          return {
            success: true,
            story,
            message: "Story approved successfully",
          };
        } catch (error) {
          console.error("Error approving story:", error);
          return {
            success: false,
            message: "Failed to approve story",
          };
        }
      }),

    // Reject story (admin)
    reject: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          return {
            success: false,
            message: "Unauthorized",
          };
        }
        try {
          const story = await updateStory(input.id, { status: "rejected" });
          return {
            success: true,
            story,
            message: "Story rejected successfully",
          };
        } catch (error) {
          console.error("Error rejecting story:", error);
          return {
            success: false,
            message: "Failed to reject story",
          };
        }
      }),

    // Get pending stories (admin)
    getPending: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        return {
          success: false,
          stories: [],
          message: "Unauthorized",
        };
      }
      try {
        const pending = await getPendingStories();
        return {
          success: true,
          stories: pending,
        };
      } catch (error) {
        console.error("Error fetching pending stories:", error);
        return {
          success: false,
          stories: [],
        };
      }
    }),

    // Delete story (admin)
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
          const deleted = await deleteStory(input.id);
          return {
            success: deleted,
            message: deleted ? "Story deleted successfully" : "Failed to delete story",
          };
        } catch (error) {
          console.error("Error deleting story:", error);
          return {
            success: false,
            message: "Failed to delete story",
          };
        }
      }),
  }),

  teamMembers: router({
    // Get all active team members
    getAll: publicProcedure.query(async () => {
      try {
        const members = await getAllTeamMembers();
        return {
          success: true,
          members,
        };
      } catch (error) {
        console.error("Error fetching team members:", error);
        return {
          success: false,
          members: [],
        };
      }
    }),

    // Get team members by category
    getByCategory: publicProcedure
      .input(z.object({ category: z.enum(["teacher", "manager", "coordinator"]) }))
      .query(async ({ input }) => {
        try {
          const members = await getTeamMembersByCategory(input.category);
          return {
            success: true,
            members,
          };
        } catch (error) {
          console.error("Error fetching team members by category:", error);
          return {
            success: false,
            members: [],
          };
        }
      }),

    // Create team member (admin only)
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          category: z.enum(["teacher", "manager", "coordinator"]),
          photoUrl: z.string().optional(),
          description: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
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
          const result = await createTeamMember(input);
          return {
            success: true,
            message: "Team member created successfully",
            memberId: (result as any)?.insertId,
          };
        } catch (error) {
          console.error("Error creating team member:", error);
          return {
            success: false,
            message: "Failed to create team member",
          };
        }
      }),

    // Update team member (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          role: z.string().optional(),
          photoUrl: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(["active", "inactive", "promoted", "left"]).optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
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
          const result = await updateTeamMember(id, data);
          return {
            success: true,
            message: "Team member updated successfully",
          };
        } catch (error) {
          console.error("Error updating team member:", error);
          return {
            success: false,
            message: "Failed to update team member",
          };
        }
      }),

    // Delete team member (admin only)
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
          const result = await deleteTeamMember(input.id);
          return {
            success: true,
            message: "Team member deleted successfully",
          };
        } catch (error) {
          console.error("Error deleting team member:", error);
          return {
            success: false,
            message: "Failed to delete team member",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
