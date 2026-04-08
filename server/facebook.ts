/**
 * Facebook Feed Integration Service
 * Fetches posts from Facebook page using Graph API
 */

export interface FacebookPost {
  id: string;
  message?: string;
  story?: string;
  picture?: string;
  link?: string;
  created_time: string;
  permalink_url?: string;
  type: string;
}

export interface FacebookFeedResponse {
  data: FacebookPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
}

/**
 * Fetch posts from Facebook page
 * Requires FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN environment variables
 */
export async function getFacebookPosts(limit: number = 10): Promise<FacebookPost[]> {
  try {
    const pageId = process.env.VITE_FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      console.warn("Facebook credentials not configured. Set VITE_FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.");
      return [];
    }

    const url = `https://graph.facebook.com/v18.0/${pageId}/posts`;
    const params = new URLSearchParams({
      fields: "id,message,story,picture,link,created_time,permalink_url,type",
      limit: limit.toString(),
      access_token: accessToken,
    });

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      console.error(`Facebook API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: FacebookFeedResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    return [];
  }
}

/**
 * Format Facebook post for display
 */
export function formatFacebookPost(post: FacebookPost) {
  return {
    id: post.id,
    title: post.message?.split("\n")[0] || post.story || "Facebook Post",
    content: post.message || post.story || "",
    image: post.picture,
    link: post.link || post.permalink_url,
    date: new Date(post.created_time),
    type: post.type,
  };
}

/**
 * Get formatted Facebook posts
 */
export async function getFormattedFacebookPosts(limit: number = 10) {
  const posts = await getFacebookPosts(limit);
  return posts.map(formatFacebookPost);
}
