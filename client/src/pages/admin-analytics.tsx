import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AnalyticsMetric, AnalyticsSummary } from '@shared/schema';
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Eye, FolderKanban, Mail, MousePointerClick, RefreshCw, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

async function fetchAnalytics(range: number): Promise<AnalyticsSummary> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const response = await fetch(`/api/admin/analytics?range=${range}&timezone=${encodeURIComponent(timezone)}`, { credentials: 'include' });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Failed to load analytics');
  return response.json();
}

const palette = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

function MetricCard({ label, metric, icon, suffix = '' }: { label: string; metric: AnalyticsMetric; icon: React.ReactNode; suffix?: string }) {
  const positive = metric.delta !== null && metric.delta >= 0;
  return (
    <article className="analytics-kpi-card">
      <div className="analytics-kpi-head"><span className="analytics-kpi-icon">{icon}</span><span className={`analytics-delta ${metric.delta === null ? 'neutral' : positive ? 'positive' : 'negative'}`}>
        {metric.delta === null ? 'New' : <>{positive ? <ArrowUpRight /> : <ArrowDownRight />}{Math.abs(metric.delta)}%</>}
      </span></div>
      <div className="analytics-kpi-value">{metric.current.toLocaleString()}{suffix}</div>
      <div className="analytics-kpi-label">{label}</div>
      <div className="analytics-kpi-previous">Previous period: {metric.previous.toLocaleString()}{suffix}</div>
    </article>
  );
}

function RankedList({ title, icon, items, empty }: { title: string; icon: React.ReactNode; items: Array<{ label: string; value: number }>; empty: string }) {
  const max = Math.max(...items.map(item => item.value), 1);
  return (
    <section className="analytics-panel">
      <div className="analytics-panel-title"><span>{icon}</span><h2>{title}</h2></div>
      {items.length ? <div className="analytics-ranked-list">{items.map((item, index) => (
        <div className="analytics-ranked-row" key={`${item.label}-${index}`}>
          <div className="analytics-ranked-meta"><span>{item.label}</span><strong>{item.value.toLocaleString()}</strong></div>
          <div className="analytics-ranked-track" aria-hidden="true"><span style={{ width: `${(item.value / max) * 100}%`, background: palette[index % palette.length] }} /></div>
        </div>
      ))}</div> : <div className="analytics-empty-small">{empty}</div>}
    </section>
  );
}

export default function AdminAnalytics() {
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const query = useQuery({ queryKey: ['/api/admin/analytics', range], queryFn: () => fetchAnalytics(range), retry: 1 });
  const data = query.data;

  return (
    <div className="admin-section-stack">
      <div className="admin-section-header">
        <div><p className="admin-section-eyebrow">Performance overview</p><h1>Portfolio analytics</h1><p>Privacy-safe, first-party traffic and conversion insights.</p></div>
        <div className="analytics-actions" aria-label="Analytics controls">
          <div className="analytics-range" role="group" aria-label="Date range">{([7, 30, 90] as const).map(days => <button key={days} className={range === days ? 'active' : ''} onClick={() => setRange(days)}>{days}D</button>)}</div>
          <button className="admin-icon-text-btn" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? 'spin' : ''} /> Refresh</button>
        </div>
      </div>

      {query.isError && <div className="admin-state-card" role="alert"><Activity /><h2>Analytics unavailable</h2><p>{query.error.message}</p><button onClick={() => query.refetch()}>Try again</button></div>}
      {query.isLoading && <div className="analytics-kpi-grid">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="analytics-kpi-card analytics-skeleton" />)}</div>}

      {data && <>
        <div className="analytics-kpi-grid">
          <MetricCard label="Page views" metric={data.metrics.pageViews} icon={<Eye />} />
          <MetricCard label="Sessions" metric={data.metrics.sessions} icon={<Users />} />
          <MetricCard label="Project clicks" metric={data.metrics.projectClicks} icon={<MousePointerClick />} />
          <MetricCard label="Contact submissions" metric={data.metrics.contacts} icon={<Mail />} />
          <MetricCard label="Conversion rate" metric={data.metrics.conversionRate} suffix="%" icon={<Activity />} />
        </div>

        <section className="analytics-panel analytics-trend-panel">
          <div className="analytics-panel-heading"><div className="analytics-panel-title"><span><BarChart3 /></span><div><h2>Traffic trend</h2><p>Daily views and sessions for the selected period</p></div></div><div className="analytics-legend"><span><i className="views" />Views</span><span><i className="sessions" />Sessions</span></div></div>
          {data.trend.length ? <div className="analytics-chart" aria-label="Daily traffic trend chart">
            <ResponsiveContainer width="100%" height="100%"><AreaChart data={data.trend} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
              <defs><linearGradient id="viewFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.32}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-default)" />
              <XAxis dataKey="date" tickFormatter={value => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-default)', borderRadius: 12, color: 'var(--color-text-heading)' }} />
              <Area type="monotone" dataKey="pageViews" name="Views" stroke="#3b82f6" strokeWidth={2.5} fill="url(#viewFill)" />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke="#8b5cf6" strokeWidth={2} fill="transparent" strokeDasharray="5 4" />
            </AreaChart></ResponsiveContainer>
          </div> : <div className="analytics-empty-chart"><BarChart3 /><p>Traffic data will appear after the first tracked visit.</p></div>}
          <details className="analytics-data-table"><summary>View chart data as a table</summary><div className="admin-table-scroll"><table><thead><tr><th>Date</th><th>Views</th><th>Sessions</th><th>Clicks</th><th>Contacts</th></tr></thead><tbody>{data.trend.map(row => <tr key={row.date}><td>{row.date}</td><td>{row.pageViews}</td><td>{row.sessions}</td><td>{row.projectClicks}</td><td>{row.contacts}</td></tr>)}</tbody></table></div></details>
        </section>

        <div className="analytics-grid-two">
          <RankedList title="Top projects" icon={<FolderKanban />} items={data.topProjects} empty="Project clicks will appear here." />
          <RankedList title="Traffic sources" icon={<Activity />} items={data.sources} empty="Referral sources will appear here." />
        </div>
        <div className="analytics-grid-two">
          <section className="analytics-panel"><div className="analytics-panel-title"><span><Users /></span><h2>Devices</h2></div>{data.devices.length ? <div className="analytics-donut-wrap"><div className="analytics-donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.devices} dataKey="value" nameKey="label" innerRadius={50} outerRadius={74} paddingAngle={3}>{data.devices.map((entry, index) => <Cell key={entry.label} fill={palette[index % palette.length]} />)}</Pie><Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-default)', borderRadius: 12 }} /></PieChart></ResponsiveContainer></div><div className="analytics-pie-legend">{data.devices.map((item, index) => <div key={item.label}><i style={{ background: palette[index % palette.length] }} /><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></div> : <div className="analytics-empty-small">Device data will appear here.</div>}</section>
          <RankedList title="Countries" icon={<Users />} items={data.countries} empty="Country data is unavailable until supported request headers arrive." />
        </div>
        <p className="analytics-updated">Updated {new Date(data.generatedAt).toLocaleString()} · Records automatically expire after 90 days.</p>
      </>}
    </div>
  );
}
