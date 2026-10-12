import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH_VERSION = 'v26.0';

type MetaResult<T> = { data: T | null; error: string | null };

function normaliseToken(value?: string) {
  if (!value) return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
}

async function metaFetch<T>(path: string, token: string): Promise<MetaResult<T>> {
  const joiner = path.includes('?') ? '&' : '?';
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${path}${joiner}access_token=${encodeURIComponent(token)}`;
  const response = await fetch(url, { cache: 'no-store' });
  const json = await response.json();

  if (!response.ok || json.error) {
    return { data: null, error: json.error?.message || `Meta API failed (${response.status})` };
  }

  return { data: json as T, error: null };
}

export async function GET() {
  try {
    const pageId = process.env.META_FACEBOOK_PAGE_ID?.trim();
    const pageToken = normaliseToken(process.env.META_FACEBOOK_PAGE_TOKEN);
    const instagramId = process.env.META_INSTAGRAM_ACCOUNT_ID?.trim();
    const instagramToken = normaliseToken(process.env.META_INSTAGRAM_ACCESS_TOKEN) || pageToken;

    if (!pageId || !pageToken) {
      return NextResponse.json({ error: 'Facebook Meta environment variables are incomplete.' }, { status: 500 });
    }

    const [page, posts, instagram, instagramMedia] = await Promise.all([
      metaFetch<{ id: string; name?: string; fan_count?: number; followers_count?: number }>(
        `${pageId}?fields=id,name,fan_count,followers_count`,
        pageToken,
      ),
      // Keep this request identical to the Graph API Explorer call already verified for FPX.
      // Engagement fields can be added separately once the base post connection is stable.
      metaFetch<{ data?: Array<{ id: string; message?: string; created_time?: string; permalink_url?: string }> }>(
        `${pageId}/posts?fields=id,message,created_time,permalink_url&limit=10`,
        pageToken,
      ),
      instagramId
        ? metaFetch<{ id: string; username?: string; followers_count?: number; media_count?: number }>(
            `${instagramId}?fields=id,username,followers_count,media_count`,
            instagramToken,
          )
        : Promise.resolve({ data: null, error: 'META_INSTAGRAM_ACCOUNT_ID is not configured.' }),
      instagramId
        ? metaFetch<{ data?: Array<{ id: string; caption?: string; media_type?: string; timestamp?: string; permalink?: string; like_count?: number; comments_count?: number }> }>(
            `${instagramId}/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count&limit=10`,
            instagramToken,
          )
        : Promise.resolve({ data: null, error: 'META_INSTAGRAM_ACCOUNT_ID is not configured.' }),
    ]);

    if (!page.data) {
      return NextResponse.json({ error: page.error || 'Unable to load the FPX Facebook Page.' }, { status: 502 });
    }

    const facebookPosts = posts.data?.data || [];
    const instagramPosts = instagramMedia.data?.data || [];

    const instagramRecentEngagement = instagramPosts.reduce(
      (total, post) => total + (post.like_count || 0) + (post.comments_count || 0),
      0,
    );

    return NextResponse.json({
      facebook: {
        page: page.data,
        posts: facebookPosts,
        recentEngagement: 0,
        error: posts.error,
      },
      instagram: {
        account: instagram.data,
        posts: instagramPosts,
        recentEngagement: instagramRecentEngagement,
        error: instagram.error || instagramMedia.error,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Meta reporting error.';
    console.error('Meta reporting error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
