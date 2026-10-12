import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CampaignStats = {
  sent?: number;
  delivered?: number;
  uniqueViews?: number;
  viewed?: number;
  uniqueClicks?: number;
  clickers?: number;
  hardBounces?: number;
  softBounces?: number;
  unsubscriptions?: number;
  opensRate?: number;
};

type Campaign = {
  id: number;
  name?: string;
  subject?: string;
  status?: string;
  sentDate?: string;
  scheduledAt?: string;
  createdAt?: string;
  statistics?: { globalStats?: CampaignStats; campaignStats?: CampaignStats[] };
};

type ContactList = {
  id: number;
  name?: string;
  totalSubscribers?: number;
  uniqueSubscribers?: number;
};

async function brevoFetch(path: string, apiKey: string) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    headers: { 'api-key': apiKey, accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Brevo API failed (${response.status}): ${text}`);
  }

  return response.json();
}

function statsFor(campaign: Campaign): CampaignStats {
  return campaign.statistics?.globalStats || campaign.statistics?.campaignStats?.[0] || {};
}

export async function GET() {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'BREVO_API_KEY is not configured.' }, { status: 500 });
    }

    const [campaignResponse, listResponse] = await Promise.all([
      brevoFetch('/emailCampaigns?status=sent&statistics=globalStats&limit=20&offset=0&sort=desc', apiKey),
      brevoFetch('/contacts/lists?limit=50&offset=0&sort=desc', apiKey),
    ]);

    const campaigns = ((campaignResponse.campaigns || []) as Campaign[]).map((campaign) => ({
      id: campaign.id,
      name: campaign.name || campaign.subject || `Campaign ${campaign.id}`,
      subject: campaign.subject || '',
      sentAt: campaign.sentDate || campaign.scheduledAt || campaign.createdAt || '',
      stats: statsFor(campaign),
    }));

    const lists = (listResponse.lists || []) as ContactList[];
    const sawPointLists = lists
      .filter((list) => /saw\s*point/i.test(list.name || ''))
      .map((list) => ({
        id: list.id,
        name: list.name || `List ${list.id}`,
        subscribers: list.totalSubscribers ?? list.uniqueSubscribers ?? 0,
      }));

    const recentTotals = campaigns.reduce(
      (acc, campaign) => {
        const stats = campaign.stats;
        acc.sent += stats.sent || 0;
        acc.delivered += stats.delivered || 0;
        acc.opens += stats.uniqueViews || stats.viewed || 0;
        acc.clicks += stats.uniqueClicks || stats.clickers || 0;
        acc.bounces += (stats.hardBounces || 0) + (stats.softBounces || 0);
        acc.unsubscribes += stats.unsubscriptions || 0;
        return acc;
      },
      { sent: 0, delivered: 0, opens: 0, clicks: 0, bounces: 0, unsubscribes: 0 },
    );

    return NextResponse.json({
      campaigns,
      latestCampaign: campaigns[0] || null,
      recentTotals,
      sawPointLists,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Brevo error.';
    console.error('Brevo reporting error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
