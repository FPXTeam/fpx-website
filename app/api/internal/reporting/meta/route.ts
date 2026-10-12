import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH_VERSION = 'v26.0';

type MetaError = {
  message?: string;
  code?: number;
  error_subcode?: number;
};

type MetaResult<T> = {
  data: T | null;
  error: string | null;
  errorCode?: number;
  errorSubcode?: number;
};

function normaliseToken(value?: string) {
  if (!value) return '';
  return value
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/\s+/g, '');
}

async function metaFetch<T>(path: string, token: string): Promise<MetaResult<T>> {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${path}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  const metaError = json.error as MetaError | undefined;

  if (!response.ok || metaError) {
    return {
      data: null,
      error: metaError?.message || `Meta API failed (${response.status})`,
      errorCode: metaError?.code,
      errorSubcode: metaError?.error_subcode,
    };
  }

  return { data: json as T, error: null };
}

async function resolveFacebookPageToken(configuredToken: string, pageId: string) {
  const identity = await metaFetch<{ id?: string; name?: string }>('me?fields=id,name', configuredToken);
  if (identity.data?.id === pageId) {
    return {
      token: configuredToken,
      source: 'configured-page-token' as const,
      identity: identity.data,
    };
  }

  const accounts = await metaFetch<{
    data?: Array<{ id?: string; name?: string; access_token?: string }>;
  }>('me/accounts?fields=id,name,access_token&limit=100', configuredToken);

  const page = accounts.data?.data?.find((item) => item.id === pageId && item.access_token);
  if (page?.access_token) {
    return {
      token: normaliseToken(page.access_token),
      source: 'resolved-from-user-token' as const,
      identity: { id: page.id, name: page.name },
    };
  }

  return {
    token: configuredToken,
    source: 'configured-token-unresolved' as const,
    identity: identity.data || null,
  };
}

export async function GET() {
  try {
    const pageId = process.env.META_FACEBOOK_PAGE_ID?.trim();
    const configuredFacebookToken = normaliseToken(process.env.META_FACEBOOK_PAGE_TOKEN);
    const configuredInstagramId = process.env.META_INSTAGRAM_ACCOUNT_ID?.trim();

    if (!pageId || !configuredFacebookToken) {
      return NextResponse.json({ error: 'Facebook Meta environment variables are incomplete.' }, { status: 500 });
    }

    const resolvedFacebook = await resolveFacebookPageToken(configuredFacebookToken, pageId);
    const pageToken = resolvedFacebook.token;
    const instagramToken = normaliseToken(process.env.META_INSTAGRAM_ACCESS_TOKEN) || pageToken;

    // Resolve the Instagram professional account from the Facebook Page itself instead
    // of trusting a hard-coded/stale Instagram account ID.
    const page = await metaFetch<{
      id: string;
      name?: string;
      fan_count?: number;
      followers_count?: number;
      instagram_business_account?: { id?: string };
    }>(
      `${pageId}?fields=id,name,fan_count,followers_count,instagram_business_account`,
      pageToken,
    );

    if (!page.data) {
      return NextResponse.json({
        error: page.error || 'Unable to load the FPX Facebook Page.',
        diagnostics: {
          facebookTokenResolution: resolvedFacebook.source,
          facebookTokenIdentity: resolvedFacebook.identity,
        },
      }, { status: 502 });
    }

    const linkedInstagramId = page.data.instagram_business_account?.id?.trim();
    const instagramId = linkedInstagramId || configuredInstagramId;

    const [posts, instagram, instagramMedia] = await Promise.all([
      metaFetch<{ data?: Array<{ id: string; message?: string; created_time?: string; permalink_url?: string }> }>(
        `${pageId}/posts?fields=id,message,created_time,permalink_url&limit=10`,
        pageToken,
      ),
      instagramId
        ? metaFetch<{ id: string; username?: string; followers_count?: number; media_count?: number }>(
            `${instagramId}?fields=id,username,followers_count,media_count`,
            instagramToken,
          )
        : Promise.resolve({ data: null, error: 'No Instagram professional account is linked to the FPX Facebook Page.' }),
      instagramId
        ? metaFetch<{ data?: Array<{ id: string; caption?: string; media_type?: string; timestamp?: string; permalink?: string; like_count?: number; comments_count?: number }> }>(
            `${instagramId}/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count&limit=10`,
            instagramToken,
          )
        : Promise.resolve({ data: null, error: 'No Instagram professional account is linked to the FPX Facebook Page.' }),
    ]);

    const facebookPosts = posts.data?.data || [];
    const instagramPosts = instagramMedia.data?.data || [];

    const instagramRecentEngagement = instagramPosts.reduce(
      (total, post) => total + (post.like_count || 0) + (post.comments_count || 0),
      0,
    );

    return NextResponse.json({
      facebook: {
        page: {
          id: page.data.id,
          name: page.data.name,
          fan_count: page.data.fan_count,
          followers_count: page.data.followers_count,
        },
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
      diagnostics: {
        facebookTokenResolution: resolvedFacebook.source,
        facebookTokenIdentity: resolvedFacebook.identity,
        instagramUsesSeparateToken: Boolean(normaliseToken(process.env.META_INSTAGRAM_ACCESS_TOKEN)),
        instagramAccountSource: linkedInstagramId ? 'facebook-page-link' : configuredInstagramId ? 'configured-env-fallback' : 'none',
        resolvedInstagramAccountId: instagramId || null,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Meta reporting error.';
    console.error('Meta reporting error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
