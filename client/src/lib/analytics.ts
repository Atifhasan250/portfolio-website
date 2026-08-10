const SESSION_KEY = 'portfolio_analytics_session';
const LAST_ACTIVITY_KEY = 'portfolio_analytics_last_activity';
const SESSION_TIMEOUT = 30 * 60 * 1000;

type PublicEvent = {
  type: 'page_view' | 'project_click';
  path: string;
  referrer?: string;
  projectId?: string;
  projectLabel?: string;
  utmSource?: string;
  utmCampaign?: string;
};

function analyticsAllowed(): boolean {
  if (typeof window === 'undefined' || window.location.pathname.startsWith('/admin')) return false;
  const privacyNavigator = navigator as Navigator & { globalPrivacyControl?: boolean };
  return navigator.doNotTrack !== '1' && !privacyNavigator.globalPrivacyControl;
}

function newSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID().replace(/-/g, '_');
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random().toString(36).slice(2)}`;
}

export function getAnalyticsSession(): string | null {
  if (!analyticsAllowed()) return null;
  const now = Date.now();
  const lastActivity = Number(sessionStorage.getItem(LAST_ACTIVITY_KEY) || 0);
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId || now - lastActivity > SESSION_TIMEOUT) {
    sessionId = newSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  sessionStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  return sessionId;
}

export function trackAnalytics(event: PublicEvent): void {
  const sessionId = getAnalyticsSession();
  if (!sessionId) return;
  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: [{ ...event, sessionId }] }),
    keepalive: true,
  }).catch(() => undefined);
}

export function trackPageView(path: string): void {
  const params = new URLSearchParams(window.location.search);
  trackAnalytics({
    type: 'page_view', path, referrer: safeReferrer(),
    utmSource: params.get('utm_source') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
  });
}

export function trackProjectClick(projectId: string, projectLabel: string): void {
  trackAnalytics({ type: 'project_click', path: window.location.pathname, referrer: safeReferrer(), projectId, projectLabel });
}

function safeReferrer(): string | undefined {
  if (!document.referrer) return undefined;
  try { return new URL(document.referrer).hostname.slice(0, 180); } catch { return undefined; }
}
