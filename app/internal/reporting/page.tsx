'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './reporting.module.css';

type TabKey =
  | 'overview'
  | 'activity'
  | 'seo'
  | 'saw-point'
  | 'email'
  | 'social'
  | 'leads'
  | 'website-health';

type Status = 'connected' | 'planned' | 'partial' | 'error';

type Tab = {
  id: TabKey;
  label: string;
  purpose: string;
  source: string;
};

type GscRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };
type GscData = {
  range: { startDate: string; endDate: string };
  comparisonRange: { startDate: string; endDate: string };
  current: { clicks: number; impressions: number; ctr: number; position: number };
  previous: { clicks: number; impressions: number; ctr: number; position: number };
  topQueries: GscRow[];
  topPages: GscRow[];
};

type BrevoStats = {
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

type Campaign = { id: number; name: string; subject: string; sentAt: string; stats: BrevoStats };

type BrevoData = {
  campaigns: Campaign[];
  latestCampaign: Campaign | null;
  recentTotals: { sent: number; delivered: number; opens: number; clicks: number; bounces: number; unsubscribes: number };
  sawPointLists: Array<{ id: number; name: string; subscribers: number }>;
};

type MetaPost = {
  id: string;
  message?: string;
  caption?: string;
  created_time?: string;
  timestamp?: string;
  permalink_url?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
  shares?: { count?: number };
  comments?: { summary?: { total_count?: number } };
  reactions?: { summary?: { total_count?: number } };
};

type MetaData = {
  facebook: {
    page: { id: string; name?: string; fan_count?: number; followers_count?: number };
    posts: MetaPost[];
    recentEngagement: number;
    error?: string | null;
  };
  instagram: {
    account: { id: string; username?: string; followers_count?: number; media_count?: number } | null;
    posts: MetaPost[];
    recentEngagement: number;
    error?: string | null;
  };
};

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', purpose: 'A concise summary of the areas that need attention, decisions or follow-up.', source: 'GSC + Brevo + Facebook + Instagram; GA4 / FPX commercial data pending' },
  { id: 'activity', label: 'Activity', purpose: 'Understand whether people are using FPX and progressing through the sourcing journey.', source: 'GA4 + FPX app events' },
  { id: 'seo', label: 'SEO', purpose: 'Understand organic visibility and identify pages or search opportunities worth improving.', source: 'Google Search Console' },
  { id: 'saw-point', label: 'Saw Point', purpose: 'Measure audience growth and whether Saw Point brings useful attention back to FPX.', source: 'Brevo' },
  { id: 'email', label: 'Email', purpose: 'Understand which campaigns generate useful engagement and downstream action.', source: 'Brevo' },
  { id: 'social', label: 'Social', purpose: 'Identify which topics and post formats get attention so content decisions are evidence-led.', source: 'Facebook + Instagram; LinkedIn pending' },
  { id: 'leads', label: 'Leads', purpose: 'Understand whether lead activity is progressing towards activation, requests, quotes and orders.', source: 'FPX app + GA4' },
  { id: 'website-health', label: 'Website Health', purpose: 'Find technical or content issues that may be reducing marketing performance.', source: 'GSC + GA4 + technical checks' },
];

const reportSections: Record<TabKey, string[]> = {
  overview: ['Current position', 'Key findings', 'Priority issues', 'Recommended actions'],
  activity: ['Usage direction', 'Sourcing journey', 'Drop-off points', 'Recommended actions'],
  seo: ['Organic visibility', 'Page performance', 'Search opportunities', 'Technical search issues'],
  'saw-point': ['Audience growth', 'Issue performance', 'Traffic back to FPX', 'Recommended actions'],
  email: ['Campaign performance', 'Audience response', 'Downstream FPX activity', 'Recommended actions'],
  social: ['Post performance', 'Topics gaining attention', 'Formats gaining attention', 'Content direction'],
  leads: ['Lead movement', 'Re-engagement', 'Activation', 'Request → Quote → Order → Repeat'],
  'website-health': ['Site health', 'Tracking health', 'Pages to improve', 'Pages to review or consolidate'],
};

function StatusBadge({ status }: { status: Status }) {
  const copy = { connected: 'Connected', partial: 'In progress', planned: 'Connection planned', error: 'Connection error' }[status];
  return <span className={`${styles.status} ${styles[status]}`}>{copy}</span>;
}

function formatNumber(value?: number) {
  return new Intl.NumberFormat('en-NZ').format(Math.round(value || 0));
}

function percentChange(current: number, previous: number) {
  if (!previous) return current ? 'New' : '0%';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
}

function cleanError(message?: string) {
  if (!message) return '';
  if (/unrecognised IP address/i.test(message)) {
    return 'Brevo is blocking the Vercel request under Authorised IP security. Update Brevo Security → Authorised IPs, then refresh this page.';
  }
  if (/pages_read_user_content|Page Public Content Access/i.test(message)) {
    return 'Facebook post reporting is unavailable because the Meta app does not currently have permission to read Page post content.';
  }
  return message.replace(/\s+/g, ' ').trim();
}

function postEngagement(post?: MetaPost) {
  if (!post) return 0;
  return (
    (post.like_count || 0) +
    (post.comments_count || 0) +
    (post.shares?.count || 0) +
    (post.comments?.summary?.total_count || 0) +
    (post.reactions?.summary?.total_count || 0)
  );
}

function topPost(posts: MetaPost[]) {
  return [...posts].sort((a, b) => postEngagement(b) - postEngagement(a))[0];
}

function postLabel(post?: MetaPost) {
  const text = post?.message || post?.caption || 'Post';
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
}

function pagePath(row?: GscRow) {
  return row?.keys?.[0]?.replace(/^https?:\/\/[^/]+/, '') || '/';
}

export default function InternalReportingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [gsc, setGsc] = useState<GscData | null>(null);
  const [brevo, setBrevo] = useState<BrevoData | null>(null);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const active = useMemo(() => tabs.find((tab) => tab.id === activeTab) || tabs[0], [activeTab]);
  const exportPdf = () => window.print();

  useEffect(() => {
    let cancelled = false;

    async function loadSource(name: string, url: string) {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Unable to load ${name}.`);
        return data;
      } catch (error) {
        if (!cancelled) {
          setErrors((current) => ({ ...current, [name]: cleanError(error instanceof Error ? error.message : `Unable to load ${name}.`) }));
        }
        return null;
      }
    }

    async function loadReporting() {
      const [gscData, brevoData, metaData] = await Promise.all([
        loadSource('Google Search Console', '/api/internal/reporting/gsc'),
        loadSource('Brevo', '/api/internal/reporting/brevo'),
        loadSource('Meta', '/api/internal/reporting/meta'),
      ]);
      if (!cancelled) {
        setGsc(gscData as GscData | null);
        setBrevo(brevoData as BrevoData | null);
        setMeta(metaData as MetaData | null);
        setLoading(false);
      }
    }

    loadReporting();
    return () => { cancelled = true; };
  }, []);

  const latest = brevo?.latestCampaign || null;
  const sawPointLatest = brevo?.campaigns.find((campaign) => /saw\s*point/i.test(`${campaign.name} ${campaign.subject}`)) || null;
  const emailCampaign = activeTab === 'saw-point' ? sawPointLatest : latest;
  const emailOpens = emailCampaign?.stats.uniqueViews || emailCampaign?.stats.viewed || 0;
  const emailClicks = emailCampaign?.stats.uniqueClicks || emailCampaign?.stats.clickers || 0;
  const facebookFollowers = meta?.facebook.page.followers_count ?? meta?.facebook.page.fan_count ?? 0;
  const instagramFollowers = meta?.instagram.account?.followers_count || 0;
  const bestFacebookPost = topPost(meta?.facebook.posts || []);
  const bestInstagramPost = topPost(meta?.instagram.posts || []);
  const legacyPages = gsc?.topPages.filter((row) => /\/(about-us-3|our-services|inventory-management-system|pruned-and-unpruned-radiata-pine)(?:$|[?#])/i.test(pagePath(row))) || [];

  function tabStatus(tab: TabKey): Status {
    if (loading) return 'partial';
    if (tab === 'seo') return gsc ? 'connected' : errors['Google Search Console'] ? 'error' : 'partial';
    if (tab === 'email' || tab === 'saw-point') return brevo ? 'connected' : errors.Brevo ? 'error' : 'partial';
    if (tab === 'social') return errors.Meta && !meta ? 'error' : 'partial';
    if (tab === 'activity' || tab === 'overview' || tab === 'website-health') return 'partial';
    if (tab === 'leads') return 'planned';
    return 'partial';
  }

  function renderOverview() {
    return (
      <section className={styles.grid}>
        <article className={styles.card}><div className={styles.cardNumber}>SEO</div><h3>{gsc ? `${formatNumber(gsc.current.clicks)} organic clicks` : 'Search Console unavailable'}</h3><p>{gsc ? `${percentChange(gsc.current.clicks, gsc.previous.clicks)} vs previous 28 days` : errors['Google Search Console'] || 'Loading live data...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>EMAIL</div><h3>{brevo ? `${formatNumber(brevo.recentTotals.clicks)} campaign clicks` : 'Brevo unavailable'}</h3><p>{brevo ? 'Brevo is connected. Period-standardised reporting still needs to be added.' : errors.Brevo || 'Loading live data...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>FACEBOOK</div><h3>{meta ? `${formatNumber(facebookFollowers)} followers` : 'Facebook unavailable'}</h3><p>{meta?.facebook.error ? cleanError(meta.facebook.error) : meta ? `${formatNumber(meta.facebook.recentEngagement)} engagements across ${meta.facebook.posts.length} available posts` : errors.Meta || 'Loading live data...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>INSTAGRAM</div><h3>{meta?.instagram.account ? `${formatNumber(instagramFollowers)} followers` : 'Instagram unavailable'}</h3><p>{meta?.instagram.account ? `${formatNumber(meta.instagram.recentEngagement)} likes/comments across the latest ${meta.instagram.posts.length} posts` : cleanError(meta?.instagram.error || errors.Meta) || 'Loading live data...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>SAW POINT</div><h3>{brevo ? (brevo.sawPointLists.length === 1 ? `${formatNumber(brevo.sawPointLists[0].subscribers)} subscribers` : 'Subscriber lists available') : 'Brevo unavailable'}</h3><p>{brevo ? (brevo.sawPointLists.length ? brevo.sawPointLists.map((list) => `${list.name}: ${formatNumber(list.subscribers)}`).join(' | ') : 'No Brevo list with “Saw Point” in its name was detected.') : errors.Brevo || 'Loading live data...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>COMMERCIAL FUNNEL</div><h3>Not connected yet</h3><p>GA4 and FPX request → quote → order → repeat data are still required before Overview is complete.</p></article>
      </section>
    );
  }

  function renderSeo() {
    return (
      <>
        <section className={styles.grid}>
          <article className={styles.card}><div className={styles.cardNumber}>01</div><h3>{gsc ? `${formatNumber(gsc.current.clicks)} clicks` : 'Organic clicks'}</h3><p>{gsc ? `${percentChange(gsc.current.clicks, gsc.previous.clicks)} vs previous 28 days` : errors['Google Search Console'] || 'Loading...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>02</div><h3>{gsc ? `${formatNumber(gsc.current.impressions)} impressions` : 'Impressions'}</h3><p>{gsc ? `${percentChange(gsc.current.impressions, gsc.previous.impressions)} vs previous 28 days` : errors['Google Search Console'] || 'Loading...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>03</div><h3>{gsc ? `${(gsc.current.ctr * 100).toFixed(2)}% CTR` : 'CTR'}</h3><p>{gsc ? `Previous ${(gsc.previous.ctr * 100).toFixed(2)}%` : 'Loading...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>04</div><h3>{gsc ? `${gsc.current.position.toFixed(2)} avg. position` : 'Average position'}</h3><p>{gsc ? `Previous ${gsc.previous.position.toFixed(2)}` : 'Loading...'}</p></article>
        </section>
        {gsc && <section className={styles.grid}>
          <article className={styles.card}><div className={styles.cardNumber}>TOP QUERIES</div><h3>{gsc.topQueries[0]?.keys?.[0] || 'No query data yet'}</h3><p>{gsc.topQueries.slice(0, 5).map((row) => `${row.keys?.[0] || 'Unknown'} · ${row.clicks || 0} clicks · ${row.impressions || 0} impr. · pos ${(row.position || 0).toFixed(1)}`).join(' | ')}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>TOP PAGES</div><h3>{pagePath(gsc.topPages[0])}</h3><p>{gsc.topPages.slice(0, 5).map((row) => `${pagePath(row)} · ${row.clicks || 0} clicks · ${row.impressions || 0} impr.`).join(' | ')}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>LEGACY URL CHECK</div><h3>{legacyPages.length ? `${legacyPages.length} legacy URL${legacyPages.length === 1 ? '' : 's'} still visible` : 'No known legacy URL in top pages'}</h3><p>{legacyPages.length ? legacyPages.map((row) => `${pagePath(row)} · ${row.clicks || 0} clicks`).join(' | ') : 'Top GSC pages do not currently show the known legacy URLs.'}</p></article>
        </section>}
      </>
    );
  }

  function renderEmail() {
    if (!brevo) {
      return <section className={styles.grid}><article className={styles.card}><div className={styles.cardNumber}>BREVO</div><h3>Campaign data unavailable</h3><p>{errors.Brevo || 'Connecting to Brevo...'}</p></article></section>;
    }

    if (activeTab === 'saw-point' && !sawPointLatest) {
      return <section className={styles.grid}><article className={styles.card}><div className={styles.cardNumber}>SAW POINT</div><h3>No Saw Point campaign identified</h3><p>Brevo is connected, but none of the returned campaigns matched “Saw Point” by campaign name or subject.</p></article></section>;
    }

    return (
      <section className={styles.grid}>
        <article className={styles.card}><div className={styles.cardNumber}>01</div><h3>{emailCampaign?.name || 'No campaign loaded'}</h3><p>{emailCampaign?.subject || emailCampaign?.sentAt || '—'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>02</div><h3>{emailCampaign ? `${formatNumber(emailCampaign.stats.delivered)} delivered` : '—'}</h3><p>{emailCampaign ? `${formatNumber(emailCampaign.stats.sent)} sent · ${formatNumber((emailCampaign.stats.hardBounces || 0) + (emailCampaign.stats.softBounces || 0))} bounces` : 'No campaign data available.'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>03</div><h3>{emailCampaign ? `${formatNumber(emailOpens)} opens` : '—'}</h3><p>{emailCampaign?.stats.opensRate ? `${emailCampaign.stats.opensRate.toFixed(2)}% open rate` : emailCampaign ? 'Latest available campaign engagement' : 'No campaign data available.'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>04</div><h3>{emailCampaign ? `${formatNumber(emailClicks)} clicks` : '—'}</h3><p>{emailCampaign ? `${formatNumber(emailCampaign.stats.unsubscriptions)} unsubscribes` : 'No campaign data available.'}</p></article>
        {activeTab === 'saw-point' && <article className={styles.card}><div className={styles.cardNumber}>SUBSCRIBER LISTS</div><h3>{brevo.sawPointLists.length === 1 ? `${formatNumber(brevo.sawPointLists[0].subscribers)} subscribers` : `${brevo.sawPointLists.length} matching lists`}</h3><p>{brevo.sawPointLists.length ? brevo.sawPointLists.map((list) => `${list.name}: ${formatNumber(list.subscribers)}`).join(' | ') : 'No matching Saw Point list detected in Brevo.'}</p></article>}
      </section>
    );
  }

  function renderSocial() {
    return (
      <section className={styles.grid}>
        <article className={styles.card}><div className={styles.cardNumber}>FACEBOOK</div><h3>{meta ? `${formatNumber(facebookFollowers)} followers` : 'Facebook unavailable'}</h3><p>{meta?.facebook.error ? cleanError(meta.facebook.error) : meta ? `${formatNumber(meta.facebook.recentEngagement)} engagements across ${meta.facebook.posts.length} available posts` : errors.Meta || 'Loading...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>FB TOP AVAILABLE POST</div><h3>{bestFacebookPost ? postLabel(bestFacebookPost) : 'Post performance unavailable'}</h3><p>{bestFacebookPost ? `${postEngagement(bestFacebookPost)} measured engagements · ${bestFacebookPost.created_time || ''}` : cleanError(meta?.facebook.error) || 'No Facebook post data returned.'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>INSTAGRAM</div><h3>{meta?.instagram.account ? `${formatNumber(instagramFollowers)} followers` : 'Instagram unavailable'}</h3><p>{meta?.instagram.account ? `${formatNumber(meta.instagram.account.media_count)} media · ${formatNumber(meta.instagram.recentEngagement)} likes/comments across latest ${meta.instagram.posts.length} posts` : cleanError(meta?.instagram.error || errors.Meta) || 'Loading...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>IG TOP AVAILABLE POST</div><h3>{bestInstagramPost ? postLabel(bestInstagramPost) : 'Post performance unavailable'}</h3><p>{bestInstagramPost ? `${postEngagement(bestInstagramPost)} measured engagements · ${bestInstagramPost.timestamp || ''}` : cleanError(meta?.instagram.error) || 'No Instagram post data returned.'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>LINKEDIN</div><h3>Pending approval</h3><p>Community Management API access request is still under LinkedIn review.</p></article>
      </section>
    );
  }

  function renderWebsiteHealth() {
    return (
      <section className={styles.grid}>
        <article className={styles.card}><div className={styles.cardNumber}>SEARCH HEALTH</div><h3>{gsc ? `${formatNumber(gsc.current.impressions)} impressions` : 'GSC unavailable'}</h3><p>{gsc ? `Organic visibility is ${percentChange(gsc.current.impressions, gsc.previous.impressions)} vs the previous 28 days.` : errors['Google Search Console'] || 'Loading...'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>LEGACY URLS</div><h3>{gsc ? (legacyPages.length ? `${legacyPages.length} needs review` : 'No known legacy URL in top pages') : 'Waiting for GSC'}</h3><p>{legacyPages.length ? legacyPages.map((row) => pagePath(row)).join(' | ') : 'Known legacy URLs will be surfaced here when they appear in GSC top-page data.'}</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>TRACKING HEALTH</div><h3>GA4 still pending</h3><p>GSC is connected, but GA4 access is still required before website tracking health can be assessed properly.</p></article>
        <article className={styles.card}><div className={styles.cardNumber}>TECHNICAL CHECKS</div><h3>Not fully connected</h3><p>Indexing, URL Inspection, sitemap and broader technical checks still need to be added to the reporting endpoint.</p></article>
      </section>
    );
  }

  function renderStandardCards() {
    if (activeTab === 'overview') return renderOverview();
    if (activeTab === 'seo') return renderSeo();
    if (activeTab === 'email' || activeTab === 'saw-point') return renderEmail();
    if (activeTab === 'social') return renderSocial();
    if (activeTab === 'website-health') return renderWebsiteHealth();

    return (
      <section className={styles.grid}>
        {reportSections[activeTab].map((title, index) => (
          <article className={styles.card} key={title}>
            <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
            <h3>{title}</h3>
            <p>This section is waiting for its remaining data source.</p>
          </article>
        ))}
      </section>
    );
  }

  function reportOutput() {
    if (activeTab === 'seo' && gsc) {
      const positionImproved = gsc.current.position < gsc.previous.position;
      return {
        findings: `Organic clicks are ${percentChange(gsc.current.clicks, gsc.previous.clicks)} and impressions are ${percentChange(gsc.current.impressions, gsc.previous.impressions)} vs the previous 28 days. Average position ${positionImproved ? 'improved' : 'declined'} from ${gsc.previous.position.toFixed(2)} to ${gsc.current.position.toFixed(2)}.`,
        recommendation: legacyPages.length ? `Review and redirect or consolidate ${legacyPages.map((row) => pagePath(row)).join(', ')} while protecting the pages currently gaining search visibility.` : 'Protect the pages currently gaining visibility and focus optimisation on high-impression queries with weak CTR or positions just outside the top results.',
        success: 'Clicks, CTR and qualified organic landing-page traffic improve without losing current rankings.',
        failure: 'Impressions rise but clicks/CTR weaken, or key landing pages lose position after changes.',
        next: legacyPages.length ? 'Verify the legacy URL redirects/canonicals and review the strongest current landing pages.' : 'Review the highest-impression queries and landing pages for the next SEO action.',
        timing: 'Review again after the next settled 28-day Search Console window.',
      };
    }

    if ((activeTab === 'email' || activeTab === 'saw-point') && errors.Brevo) {
      return {
        findings: 'Brevo data is unavailable because the API request is being blocked by Brevo Authorised IP security.',
        recommendation: 'Resolve the Brevo API security setting first. Do not interpret the missing metrics as zero performance.',
        success: 'The Brevo endpoint returns live campaign and list data without a 401 error.',
        failure: 'The endpoint continues to return an authorised-IP or authentication error.',
        next: 'Update Brevo Security → Authorised IPs for API access, then refresh this report.',
        timing: 'Recheck immediately after the Brevo security change.',
      };
    }

    if (activeTab === 'social') {
      return {
        findings: meta?.facebook.error ? 'Instagram basic reporting is available. Facebook Page basics load, but Facebook post reporting is blocked by missing Meta permission.' : 'Facebook and Instagram basic reporting are available; LinkedIn remains pending.',
        recommendation: meta?.facebook.error ? 'Fix the Meta permission for Facebook post content before using Facebook engagement figures for decisions.' : 'Use post-level engagement to identify repeatable topics and formats, then add reach/impressions when permissions allow.',
        success: 'All social sources return post-level data and the report can identify genuine top-performing content.',
        failure: 'A source returns only account-level numbers or permission errors while being labelled as fully connected.',
        next: meta?.facebook.error ? 'Resolve the Facebook Page post-reading permission and retest the Meta endpoint.' : 'Continue monitoring Instagram/Facebook while LinkedIn access is reviewed.',
        timing: 'Review after permissions change or at the next marketing catch-up.',
      };
    }

    return {
      findings: 'This report area is not complete enough yet for a reliable finding.',
      recommendation: 'Finish the required data connection before using this section for decisions.',
      success: 'The required source returns trustworthy data and the metrics have a defined reporting period.',
      failure: 'Missing or failed sources are shown as zero or as connected.',
      next: 'Complete the remaining connection or data-source work.',
      timing: 'Review as soon as the missing source is available.',
    };
  }

  const output = reportOutput();
  const currentStatus = tabStatus(activeTab);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>FPX INTERNAL</div>
          <h1>Marketing Reporting</h1>
          <p>Data is gathered here so each meeting can focus on findings, decisions and the next action rather than raw platform reporting.</p>
        </div>
        <button className={styles.exportButton} onClick={exportPdf} type="button">Export / Save PDF</button>
      </header>

      <nav className={styles.tabs} aria-label="Reporting categories">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.reportHeader}>
        <div>
          <div className={styles.reportTitleRow}>
            <h2>{active.label}</h2>
            <StatusBadge status={currentStatus} />
          </div>
          <p>{active.purpose}</p>
        </div>
        <div className={styles.sourceCard}>
          <span>Data source</span>
          <strong>{active.source}</strong>
          {loading && <small>Connecting live sources...</small>}
        </div>
      </section>

      {renderStandardCards()}

      <section className={styles.decisionSection}>
        <div className={styles.decisionHeader}>
          <div><span className={styles.sectionLabel}>REPORT OUTPUT</span><h2>What we do with the data</h2></div>
          <p>Reporting should finish with a decision or a clear reason to keep monitoring. Raw numbers are supporting evidence, not the final output.</p>
        </div>
        <div className={styles.decisionGrid}>
          <div><strong>Findings</strong><span>{output.findings}</span></div>
          <div><strong>Recommendation</strong><span>{output.recommendation}</span></div>
          <div><strong>Success</strong><span>{output.success}</span></div>
          <div><strong>Failure</strong><span>{output.failure}</span></div>
          <div><strong>Next step</strong><span>{output.next}</span></div>
          <div><strong>Review timing</strong><span>{output.timing}</span></div>
        </div>
      </section>

      <footer className={styles.footerNote}><strong>Reporting rule:</strong> Only include information that helps explain performance, identify a problem, support a decision or determine the next action.</footer>
    </main>
  );
}
