import { NextResponse } from 'next/server';
import { createSign } from 'node:crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri?: string;
};

type SearchRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

function base64Url(input: string) {
  return Buffer.from(input).toString('base64url');
}

async function getGoogleAccessToken(credentials: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const tokenUri = credentials.token_uri || 'https://oauth2.googleapis.com/token';
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: tokenUri,
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key).toString('base64url');
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google OAuth failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error('Google OAuth did not return an access token.');
  return data.access_token;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateRange(days: number, offsetDays = 3) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - offsetDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

function previousRange(startDate: string, days: number) {
  const end = new Date(`${startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

async function querySearchConsole(
  siteUrl: string,
  accessToken: string,
  body: Record<string, unknown>,
) {
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Search Console API failed (${response.status}): ${text}`);
  }

  return (await response.json()) as { rows?: SearchRow[] };
}

function totals(result: { rows?: SearchRow[] }) {
  const row = result.rows?.[0] || {};
  return {
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  };
}

export async function GET() {
  try {
    const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:fpx.nz';

    if (!rawCredentials) {
      return NextResponse.json({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not configured.' }, { status: 500 });
    }

    const credentials = JSON.parse(rawCredentials) as ServiceAccount;
    if (!credentials.client_email || !credentials.private_key) {
      return NextResponse.json({ error: 'Google service-account credentials are incomplete.' }, { status: 500 });
    }

    const accessToken = await getGoogleAccessToken(credentials);
    const currentRange = dateRange(28);
    const priorRange = previousRange(currentRange.startDate, 28);

    const [currentResult, previousResult, queryResult, pageResult, trendResult] = await Promise.all([
      querySearchConsole(siteUrl, accessToken, { ...currentRange, type: 'web', rowLimit: 1 }),
      querySearchConsole(siteUrl, accessToken, { ...priorRange, type: 'web', rowLimit: 1 }),
      querySearchConsole(siteUrl, accessToken, {
        ...currentRange,
        type: 'web',
        dimensions: ['query'],
        rowLimit: 10,
      }),
      querySearchConsole(siteUrl, accessToken, {
        ...currentRange,
        type: 'web',
        dimensions: ['page'],
        rowLimit: 10,
      }),
      querySearchConsole(siteUrl, accessToken, {
        ...currentRange,
        type: 'web',
        dimensions: ['date'],
        rowLimit: 100,
      }),
    ]);

    return NextResponse.json({
      siteUrl,
      range: currentRange,
      comparisonRange: priorRange,
      current: totals(currentResult),
      previous: totals(previousResult),
      topQueries: queryResult.rows || [],
      topPages: pageResult.rows || [],
      daily: trendResult.rows || [],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Search Console error.';
    console.error('GSC reporting error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
