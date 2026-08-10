import { useDeferredValue, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditActions, type AuditAction, type AuditLog, type PaginatedAuditLogs } from '@shared/schema';
import { CheckCircle2, ChevronLeft, ChevronRight, Download, Eye, FileClock, Search, ShieldAlert, X } from 'lucide-react';

async function fetchLogs(query: string): Promise<PaginatedAuditLogs> {
  const response = await fetch(`/api/admin/audit-logs?${query}`, { credentials: 'include' });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.message || 'Failed to load audit logs');
  return response.json();
}

function actionLabel(action: string) {
  return action.split('.').map(word => word.replace(/_/g, ' ')).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' · ');
}

export default function AdminAuditLog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [action, setAction] = useState('');
  const [outcome, setOutcome] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selected, setSelected] = useState<AuditLog | null>(null);
  const params = new URLSearchParams({ page: String(page), limit: '25' });
  if (deferredSearch) params.set('search', deferredSearch);
  if (action) params.set('action', action);
  if (outcome) params.set('outcome', outcome);
  if (from) params.set('from', new Date(`${from}T00:00:00`).toISOString());
  if (to) params.set('to', new Date(`${to}T23:59:59`).toISOString());
  const queryString = params.toString();
  const query = useQuery({ queryKey: ['/api/admin/audit-logs', queryString], queryFn: () => fetchLogs(queryString), retry: 1 });
  const clearFilters = () => { setSearch(''); setAction(''); setOutcome(''); setFrom(''); setTo(''); setPage(1); };
  const filtersActive = !!(search || action || outcome || from || to);

  return <div className="admin-section-stack">
    <div className="admin-section-header"><div><p className="admin-section-eyebrow">Security & accountability</p><h1>Audit log</h1><p>Immutable record of administrator and content-management activity.</p></div><a className="admin-icon-text-btn primary" href={`/api/admin/audit-logs/export?${queryString}`}><Download /> Export CSV</a></div>
    <section className="audit-filter-card" aria-label="Audit log filters">
      <label className="audit-search"><Search /><span className="sr-only">Search audit logs</span><input value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} placeholder="Search actor, target or ID" /></label>
      <label><span>Action</span><select value={action} onChange={event => { setAction(event.target.value); setPage(1); }}><option value="">All actions</option>{auditActions.map(item => <option key={item} value={item}>{actionLabel(item)}</option>)}</select></label>
      <label><span>Outcome</span><select value={outcome} onChange={event => { setOutcome(event.target.value); setPage(1); }}><option value="">All outcomes</option><option value="success">Success</option><option value="failure">Failure</option></select></label>
      <label><span>From</span><input type="date" value={from} onChange={event => { setFrom(event.target.value); setPage(1); }} /></label>
      <label><span>To</span><input type="date" value={to} onChange={event => { setTo(event.target.value); setPage(1); }} /></label>
      {filtersActive && <button className="audit-clear" onClick={clearFilters}><X /> Clear</button>}
    </section>

    {query.isError && <div className="admin-state-card" role="alert"><ShieldAlert /><h2>Audit log unavailable</h2><p>{query.error.message}</p><button onClick={() => query.refetch()}>Try again</button></div>}
    {query.isLoading && <div className="audit-table-card audit-loading">{Array.from({ length: 8 }).map((_, index) => <div key={index} />)}</div>}
    {query.data && <section className="audit-table-card">
      <div className="audit-table-summary"><span>{query.data.total.toLocaleString()} recorded event{query.data.total === 1 ? '' : 's'}</span><span>90-day retention</span></div>
      {query.data.items.length ? <div className="admin-table-scroll"><table className="audit-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th><th>Outcome</th><th><span className="sr-only">Details</span></th></tr></thead><tbody>{query.data.items.map(log => <tr key={log._id}>
        <td><time dateTime={log.createdAt}>{new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time></td>
        <td><span className="audit-actor">{log.actor.charAt(0).toUpperCase()}</span>{log.actor}</td>
        <td><span className="audit-action">{actionLabel(log.action)}</span></td>
        <td><strong>{log.targetLabel || log.targetType}</strong>{log.targetId && <small>{log.targetId}</small>}</td>
        <td><span className={`audit-outcome ${log.outcome}`}>{log.outcome === 'success' ? <CheckCircle2 /> : <ShieldAlert />}{log.outcome}</span></td>
        <td><button className="audit-detail-btn" onClick={() => setSelected(log)} aria-label={`View details for ${actionLabel(log.action)}`}><Eye /></button></td>
      </tr>)}</tbody></table></div> : <div className="audit-empty"><FileClock /><h2>No audit records found</h2><p>{filtersActive ? 'Try adjusting the active filters.' : 'Administrative activity will appear here.'}</p>{filtersActive && <button onClick={clearFilters}>Clear filters</button>}</div>}
      <div className="audit-pagination"><span>Page {query.data.page} of {query.data.pages}</span><div><button onClick={() => setPage(value => value - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft /></button><button onClick={() => setPage(value => value + 1)} disabled={page >= query.data.pages} aria-label="Next page"><ChevronRight /></button></div></div>
    </section>}

    {selected && <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="audit-detail-title" onClick={event => { if (event.target === event.currentTarget) setSelected(null); }}><div className="admin-modal admin-modal-sm audit-detail-modal"><div className="admin-modal-header"><div><p className="admin-section-eyebrow">Event details</p><h2 id="audit-detail-title" className="admin-modal-title">{actionLabel(selected.action)}</h2></div><button className="admin-modal-close" onClick={() => setSelected(null)} aria-label="Close details"><X /></button></div><dl>
      <div><dt>Timestamp</dt><dd>{new Date(selected.createdAt).toLocaleString()}</dd></div><div><dt>Outcome</dt><dd><span className={`audit-outcome ${selected.outcome}`}>{selected.outcome}</span></dd></div><div><dt>Actor</dt><dd>{selected.actor}</dd></div><div><dt>Target</dt><dd>{selected.targetLabel || selected.targetType}</dd></div>{selected.targetId && <div><dt>Target ID</dt><dd className="mono">{selected.targetId}</dd></div>}<div><dt>Changed fields</dt><dd>{selected.changedFields.length ? selected.changedFields.join(', ') : 'None'}</dd></div><div><dt>Device</dt><dd>{selected.device}</dd></div><div><dt>IP fingerprint</dt><dd className="mono">{selected.ipHash}</dd></div>{selected.message && <div><dt>Note</dt><dd>{selected.message}</dd></div>}
    </dl></div></div>}
  </div>;
}
