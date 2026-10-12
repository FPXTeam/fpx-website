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

type Tab = {
  id: TabKey;
  label: string;
  purpose: string;
  source: string;
  status: 'connected' | 'planned' | 'partial';
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
type BrevoData = {
  campaigns: Array<{ id: number; name: string; subject: string; sentAt: string; stats: BrevoStats }>;
  latestCampaign: { id: number; name: string; subject: string; sentAt: string; stats: BrevoStats } | null;
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
  { id: 'overview', label: 'Overview', purpose: 'A concise summary of the areas that need attention, decisions or follow-up.', source: 'GSC + Brevo + Facebook + Instagram', status: 'connected' },
  { id: 'activity', label: 'Activity', purpose: 'Understand whether people are using FPX and progressing through the sourcing journey.', source: 'GA4 + FPX app events', status: 'partial' },
  { id: 'seo', label: 'SEO', purpose: 'Understand organic visibility and identify pages or search opportunities worth improving.', source: 'Google Search Console', status: 'connected' },
  { id: 'saw-point', label: 'Saw Point', purpose: 'Measure audience growth and whether Saw Point brings useful attention back to FPX.', source: 'Brevo', status: 'connected' },
  { id: 'email', label: 'Email', purpose: 'Understand which campaigns generate useful engagement and downstream action.', source: 'Brevo', status: 'connected' },
  { id: 'social', label: 'Social', purpose: 'Identify which topics and post formats get attention so content decisions are evidence-led.', source: 'Facebook + Instagram; LinkedIn pending', status: 'partial' },
  { id: 'leads', label: 'Leads', purpose: 'Understand whether lead activity is progressing towards activation, requests, quotes and orders.', source: 'FPX app + GA4', status: 'planned' },
  { id: 'website-health', label: 'Website Health', purpose: 'Find technical or content issues that may be reducing marketing performance.', source: 'GSC + GA4 + technical checks', status: 'partial' },
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

function StatusBadge({ status }: { status: Tab['status'] }) {
  const copy = { connected: 'Connected', partial: 'In progress', planned: 'Connection planned' }[status];
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

function postLabel(post?: MetaPost) {
  const text = post?.message || post?.caption || 'Post';
  return text.length > 110 ? `${text.slice(0, 107)}...` : text;
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
          setErrors((current) => ({ ...current, [name]: error instanceof Error ? error.message : `Unable to load ${name}.` }));
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

  const latest = brevo?.latestCampaign;
  const latestOpens = latest?.stats.uniqueViews || latest?.stats.viewed || 0;
  const latestClicks = latest?.stats.uniqueClicks || latest?.stats.clickers || 0;
  const sawPointSubscribers = brevo?.sawPointLists.reduce((sum, list) => sum + list.subscribers, 0) || 0;
  const facebookFollowers = meta?.facebook.page.followers_count ?? meta?.facebook.page.fan_count ?? 0;
  const instagramFollowers = meta?.instagram.account?.followers_count || 0;

  function renderStandardCards() {
    if (activeTab === 'overview') {
      return (
        <section className={styles.grid}>
          <article className={styles.card}><div className={styles.cardNumber}>SEO</div><h3>{gsc ? `${formatNumber(gsc.current.clicks)} organic clicks` : 'Search Console'}</h3><p>{gsc ? `${percentChange(gsc.current.clicks, gsc.previous.clicks)} vs previous 28 days` : errors['Google Search Console'] || 'Loading live data...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>EMAIL</div><h3>{brevo ? `${formatNumber(brevo.recentTotals.clicks)} recent clicks` : 'Brevo'}</h3><p>{brevo ? `${formatNumber(brevo.recentTotals.delivered)} delivered across recent campaigns` : errors.Brevo || 'Loading live data...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>FACEBOOK</div><h3>{meta ? `${formatNumber(facebookFollowers)} followers` : 'Facebook'}</h3><p>{meta ? `${formatNumber(meta.facebook.recentEngagement)} engagements across the latest ${meta.facebook.posts.length} posts` : errors.Meta || 'Loading live data...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>INSTAGRAM</div><h3>{meta?.instagram.account ? `${formatNumber(instagramFollowers)} followers` : 'Instagram'}</h3><p>{meta?.instagram.account ? `${formatNumber(meta.instagram.recentEngagement)} likes/comments across the latest ${meta.instagram.posts.length} posts` : meta?.instagram.error || errors.Meta || 'Loading live data...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>SAW POINT</div><h3>{brevo ? `${formatNumber(sawPointSubscribers)} subscribers` : 'Subscriber audience'}</h3><p>{brevo ? (brevo.sawPointLists.length ? brevo.sawPointLists.map((list) => list.name).join(', ') : 'No Brevo list with “Saw Point” in its name was detected.') : errors.Brevo || 'Loading live data...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>LATEST CAMPAIGN</div><h3>{latest?.name || 'No campaign loaded'}</h3><p>{latest ? `${formatNumber(latestOpens)} opens · ${formatNumber(latestClicks)} clicks` : errors.Brevo || 'Loading live data...'}</p></article>
        </section>
      );
    }

    if (activeTab === 'seo') {
      return (
        <>
          <section className={styles.grid}>
            <article className={styles.card}><div className={styles.cardNumber}>01</div><h3>{gsc ? `${formatNumber(gsc.current.clicks)} clicks` : 'Organic clicks'}</h3><p>{gsc ? `${percentChange(gsc.current.clicks, gsc.previous.clicks)} vs previous 28 days` : errors['Google Search Console'] || 'Loading...'}</p></article>
            <article className={styles.card}><div className={styles.cardNumber}>02</div><h3>{gsc ? `${formatNumber(gsc.current.impressions)} impressions` : 'Impressions'}</h3><p>{gsc ? `${percentChange(gsc.current.impressions, gsc.previous.impressions)} vs previous 28 days` : errors['Google Search Console'] || 'Loading...'}</p></article>
            <article className={styles.card}><div className={styles.cardNumber}>03</div><h3>{gsc ? `${(gsc.current.ctr * 100).toFixed(2)}% CTR` : 'CTR'}</h3><p>{gsc ? `Previous ${(gsc.previous.ctr * 100).toFixed(2)}%` : 'Loading...'}</p></article>
            <article className={styles.card}><div className={styles.cardNumber}>04</div><h3>{gsc ? `${gsc.current.position.toFixed(2)} avg. position` : 'Average position'}</h3><p>{gsc ? `Previous ${gsc.previous.position.toFixed(2)}` : 'Loading...'}</p></article>
          </section>
          {gsc && <section className={styles.grid}>
            <article className={styles.card}><div className={styles.cardNumber}>TOP QUERIES</div><h3>{gsc.topQueries[0]?.keys?.[0] || 'No query data yet'}</h3><p>{gsc.topQueries.slice(0, 5).map((row) => `${row.keys?.[0] || 'Unknown'} · ${row.clicks || 0} clicks`).join(' | ')}</p></article>
            <article className={styles.card}><div className={styles.cardNumber}>TOP PAGES</div><h3>{gsc.topPages[0]?.keys?.[0]?.replace(/^https?:\/\/[^/]+/, '') || 'No page data yet'}</h3><p>{gsc.topPages.slice(0, 5).map((row) => `${row.keys?.[0]?.replace(/^https?:\/\/[^/]+/, '') || '/'} · ${row.clicks || 0} clicks`).join(' | ')}</p></article>
          </section>}
        </>
      );
    }

    if (activeTab === 'email' || activeTab === 'saw-point') {
      return (
        <section className={styles.grid}>
          <article className={styles.card}><div className={styles.cardNumber}>01</div><h3>{latest?.name || 'Latest campaign'}</h3><p>{latest ? latest.subject || latest.sentAt : errors.Brevo || 'Loading Brevo...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>02</div><h3>{formatNumber(latest?.stats.delivered)} delivered</h3><p>{formatNumber(latest?.stats.sent)} sent · {formatNumber((latest?.stats.hardBounces || 0) + (latest?.stats.softBounces || 0))} bounces</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>03</div><h3>{formatNumber(latestOpens)} opens</h3><p>{latest?.stats.opensRate ? `${latest.stats.opensRate.toFixed(2)}% open rate` : 'Latest campaign engagement'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>04</div><h3>{formatNumber(latestClicks)} clicks</h3><p>{formatNumber(latest?.stats.unsubscriptions)} unsubscribes</p></article>
          {activeTab === 'saw-point' && <article className={styles.card}><div className={styles.cardNumber}>SUBSCRIBERS</div><h3>{formatNumber(sawPointSubscribers)} subscribers</h3><p>{brevo?.sawPointLists.length ? brevo.sawPointLists.map((list) => `${list.name}: ${formatNumber(list.subscribers)}`).join(' | ') : 'No matching Saw Point list detected in Brevo.'}</p></article>}
        </section>
      );
    }

    if (activeTab === 'social') {
      return (
        <section className={styles.grid}>
          <article className={styles.card}><div className={styles.cardNumber}>FACEBOOK</div><h3>{meta ? `${formatNumber(facebookFollowers)} followers` : 'Facebook'}</h3><p>{meta ? `${formatNumber(meta.facebook.recentEngagement)} recent post engagements` : errors.Meta || 'Loading...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>FB TOP POST</div><h3>{postLabel(meta?.facebook.posts[0])}</h3><p>{meta?.facebook.posts[0]?.created_time || meta?.facebook.error || 'Latest available Facebook post'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>INSTAGRAM</div><h3>{meta?.instagram.account ? `${formatNumber(instagramFollowers)} followers` : 'Instagram'}</h3><p>{meta?.instagram.account ? `${formatNumber(meta.instagram.account.media_count)} media · ${formatNumber(meta.instagram.recentEngagement)} recent engagements` : meta?.instagram.error || errors.Meta || 'Loading...'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>IG TOP POST</div><h3>{postLabel(meta?.instagram.posts[0])}</h3><p>{meta?.instagram.posts[0]?.timestamp || meta?.instagram.error || 'Latest available Instagram post'}</p></article>
          <article className={styles.card}><div className={styles.cardNumber}>LINKEDIN</div><h3>Pending approval</h3><p>Community Management API access request is still under LinkedIn review.</p></article>
        </section>
      );
    }

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
            <StatusBadge status={active.status} />
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
          <div><strong>Findings</strong><span>What changed or stood out?</span></div>
          <div><strong>Recommendation</strong><span>What should we do about it?</span></div>
          <div><strong>Success</strong><span>What result means the action worked?</span></div>
          <div><strong>Failure</strong><span>What result means we change or stop?</span></div>
          <div><strong>Next step</strong><span>What happens after approval?</span></div>
          <div><strong>Review timing</strong><span>Report back when enough data is available.</span></div>
        </div>
      </section>

      <footer className={styles.footerNote}><strong>Reporting rule:</strong> Only include information that helps explain performance, identify a problem, support a decision or determine the next action.</footer>
    </main>
  );
}
