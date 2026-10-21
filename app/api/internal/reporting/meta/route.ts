import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GRAPH_VERSION = 'v26.0';
const FACEBOOK_GRAPH = 'https://graph.facebook.com';
const INSTAGRAM_GRAPH = 'https://graph.instagram.com';

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

type InstagramAccount = {
  id: string;
  user_id?: string;
  username?: string;
  followers_count?: number;
  media_count?: number;
  account_type?: string;
};

type InstagramPost = {
  id: string;
  caption?: string;
  media_type?: string;
  timestamp?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
};

type InstagramLoadResult = {
  account: InstagramAccount | null;
  posts: InstagramPost[];
  error: string | null;
  mode: 'instagram-login' | 'facebook-login';
};

function normaliseToken(value?: string) {
  if (!value) return '';
  return value
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^['"]|['"]$/g, '')
    .replace(/\s+/g, '');
}

async function graphFetch<T>(host: string, path: string, token: string): Promise<MetaResult<T>> {
  const cleanPath = path.replace(/^\//, '');
  const url = `${host}/${GRAPH_VERSION}/${cleanPath}`;
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}` },
  });

  let json: any;
  try {
    json = await response.json();
  } catch {
    return { data: null, error: `Meta API returned a non-JSON response (${response.status}).` };
  }

  const metaError = json?.error as MetaError | undefined;
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

function facebookFetch<T>(path: string, token: string) {
  return graphFetch<T>(FACEBOOK_GRAPH, path, token);
}

function instagramFetch<T>(path: string, token: string) {
  return graphFetch<T>(INSTAGRAM_GRAPH, path, token);
}

async function resolveFacebookPageToken(configuredToken: string, pageId: string) {
  const identity = await facebookFetch<{ id?: string; name?: string }>('me?fields=id,name', configuredToken);
  if (identity.data?.id === pageId) {
    return {
      token: configuredToken,
      source: 'configured-page-token' as const,
      identity: identity.data,
    };
  }

  const accounts = await facebookFetch<{
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

async function loadInstagramWithInstagramLogin(token: string): Promise<InstagramLoadResult> {
  const profile = await instagramFetch<InstagramAccount>(
    'me?fields=id,user_id,username,followers_count,media_count,account_type',
    token,
  );

  if (!profile.data) {
    return {
      account: null,
      posts: [],
      error: profile.error,
      mode: 'instagram-login',
    };
  }

  const media = await instagramFetch<{ data?: InstagramPost[] }>(
    'me/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count&limit=10',
    token,
  );

  const accountId = profile.data.user_id || profile.data.id;
  return {
    account: { ...profile.data, id: accountId },
    posts: media.data?.data || [],
    error: media.error,
    mode: 'instagram-login',
  };
}

async function loadInstagramWithFacebookLogin(
  pageToken: string,
  instagramId?: string,
): Promise<InstagramLoadResult> {
  if (!instagramId) {
    return {
      account: null,
      posts: [],
      error: 'No Instagram professional account could be resolved from the FPX Facebook Page.',
      mode: 'facebook-login',
    };
  }

  const [profile, media] = await Promise.all([
    facebookFetch<InstagramAccount>(
      `${instagramId}?fields=id,username,followers_count,media_count`,
      pageToken,
    ),
    facebookFetch<{ data?: InstagramPost[] }>(
      `${instagramId}/media?fields=id,caption,media_type,timestamp,permalink,like_count,comments_count&limit=10`,
      pageToken,
    ),
  ]);

  return {
    account: profile.data,
    posts: media.data?.data || [],
    error: profile.error || media.error,
    mode: 'facebook-login',
  };
}

export async function GET() {
  try {
    const pageId = process.env.META_FACEBOOK_PAGE_ID?.trim();
    const configuredFacebookToken = normaliseToken(process.env.META_FACEBOOK_PAGE_TOKEN);
    const configuredInstagramId = process.env.META_INSTAGRAM_ACCOUNT_ID?.trim();
    const configuredInstagramToken = normaliseToken(process.env.META_INSTAGRAM_ACCESS_TOKEN);

    if (!pageId || !configuredFacebookToken) {
      return NextResponse.json({ error: 'Facebook Meta environment variables are incomplete.' }, { status: 500 });
    }

    const resolvedFacebook = await resolveFacebookPageToken(configuredFacebookToken, pageId);
    const pageToken = resolvedFacebook.token;

    // Keep Facebook Page basics separate from Instagram account discovery so a missing
    // Instagram permission can never break Facebook reporting.
    const [page, posts, instagramLink] = await Promise.all([
      facebookFetch<{ id: string; name?: string; fan_count?: number; followers_count?: number }>(
        `${pageId}?fields=id,name,fan_count,followers_count`,
        pageToken,
      ),
      facebookFetch<{ data?: Array<{ id: string; message?: string; created_time?: string; permalink_url?: string }> }>(
        `${pageId}/posts?fields=id,message,created_time,permalink_url&limit=10`,
        pageToken,
      ),
      facebookFetch<{ instagram_business_account?: { id?: string } }>(
        `${pageId}?fields=instagram_business_account`,
        pageToken,
      ),
    ]);

    if (!page.data) {
      return NextResponse.json({
        error: page.error || 'Unable to load the FPX Facebook Page.',
        diagnostics: {
          facebookTokenResolution: resolvedFacebook.source,
          facebookTokenIdentity: resolvedFacebook.identity,
        },
      }, { status: 502 });
    }

    const linkedInstagramId = instagramLink.data?.instagram_business_account?.id?.trim();
    const facebookInstagramId = linkedInstagramId || configuredInstagramId;

    // Meta currently supports two different Instagram products:
    // 1) Instagram Login: instagram_business_* permissions + graph.instagram.com + Instagram user token.
    // 2) Facebook Login: instagram_basic/pages_* permissions + graph.facebook.com + Facebook/Page token.
    // Try the explicitly configured Instagram Login token first. If it is absent or invalid,
    // fall back to the Page-linked Facebook Login route.
    let instagramResult: InstagramLoadResult;
    let directInstagramError: string | null = null;

    if (configuredInstagramToken) {
      const directInstagramResult = await loadInstagramWithInstagramLogin(configuredInstagramToken);
      directInstagramError = directInstagramResult.error;

      instagramResult = directInstagramResult.account
        ? directInstagramResult
        : await loadInstagramWithFacebookLogin(pageToken, facebookInstagramId);
    } else {
      instagramResult = await loadInstagramWithFacebookLogin(pageToken, facebookInstagramId);
    }

    const instagramPosts = instagramResult.posts;
    const instagramRecentEngagement = instagramPosts.reduce(
      (total, post) => total + (post.like_count || 0) + (post.comments_count || 0),
      0,
    );

    let instagramError = instagramResult.error;
    if (!instagramResult.account && !configuredInstagramToken) {
      instagramError = `${instagramError || 'Instagram access failed.'} No separate Instagram Login token is configured.`;
    } else if (!instagramResult.account && directInstagramError) {
      instagramError = `Instagram Login failed: ${directInstagramError}. Facebook-linked fallback also failed: ${instagramResult.error || 'unknown error'}.`;
    }

    return NextResponse.json({
      facebook: {
        page: page.data,
        posts: posts.data?.data || [],
        recentEngagement: 0,
        error: posts.error,
      },
      instagram: {
        account: instagramResult.account,
        posts: instagramPosts,
        recentEngagement: instagramRecentEngagement,
        error: instagramError,
      },
      diagnostics: {
        facebookTokenResolution: resolvedFacebook.source,
        facebookTokenIdentity: resolvedFacebook.identity,
        instagramLoginTokenConfigured: Boolean(configuredInstagramToken),
        instagramModeUsed: instagramResult.mode,
        instagramLinkDiscoveryError: instagramLink.error,
        instagramAccountSource: instagramResult.mode === 'instagram-login'
          ? 'instagram-login-me'
          : linkedInstagramId
            ? 'facebook-page-link'
            : configuredInstagramId
              ? 'configured-id-fallback'
              : 'none',
        resolvedInstagramAccountId: instagramResult.account?.id || facebookInstagramId || null,
        directInstagramError,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Meta reporting error.';
    console.error('Meta reporting error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
