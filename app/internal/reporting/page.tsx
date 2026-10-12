'use client';

import { useMemo, useState } from 'react';
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

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', purpose: 'A concise summary of the areas that need attention, decisions or follow-up.', source: 'All reporting sources', status: 'partial' },
  { id: 'activity', label: 'Activity', purpose: 'Understand whether people are using FPX and progressing through the sourcing journey.', source: 'GA4 + FPX app events', status: 'partial' },
  { id: 'seo', label: 'SEO', purpose: 'Understand organic visibility and identify pages or search opportunities worth improving.', source: 'Google Search Console + GA4', status: 'connected' },
  { id: 'saw-point', label: 'Saw Point', purpose: 'Measure audience growth and whether Saw Point brings useful attention back to FPX.', source: 'Brevo + Airtable + GA4', status: 'planned' },
  { id: 'email', label: 'Email', purpose: 'Understand which campaigns generate useful engagement and downstream action.', source: 'Brevo + GA4', status: 'planned' },
  { id: 'social', label: 'Social', purpose: 'Identify which topics and post formats get attention so content decisions are evidence-led.', source: 'LinkedIn / social platform analytics', status: 'planned' },
  { id: 'leads', label: 'Leads', purpose: 'Understand whether lead activity is progressing towards activation, requests, quotes and orders.', source: 'Airtable + FPX app + GA4', status: 'planned' },
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

export default function InternalReportingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const active = useMemo(() => tabs.find((tab) => tab.id === activeTab) || tabs[0], [activeTab]);
  const exportPdf = () => window.print();

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
        </div>
      </section>

      <section className={styles.grid}>
        {reportSections[activeTab].map((title, index) => (
          <article className={styles.card} key={title}>
            <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
            <h3>{title}</h3>
            <p>{active.status === 'connected' ? 'This section will populate from the connected reporting source.' : 'This section is ready for the relevant data connection.'}</p>
          </article>
        ))}
      </section>

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
