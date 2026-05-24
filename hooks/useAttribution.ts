/**
 * useAttribution — Captures UTM parameters and ad click IDs on entry.
 *
 * Stores them in sessionStorage so they persist across page navigations
 * within the same browsing session, but don't carry over to future visits.
 * This lets us attribute quote requests, contact submissions, and WhatsApp
 * clicks to the specific LinkedIn/Meta/Google ad campaign that drove them.
 */

import { useEffect } from 'react';

// The keys we capture from the URL query string
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',    // Google Ads click ID
  'msclkid',  // Microsoft Ads click ID
  'li_fat_id', // LinkedIn first-party ad tracking cookie
] as const;

const STORAGE_KEY = 'smith_attribution';

export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  msclkid?: string;
  li_fat_id?: string;
  landing_page?: string;
  captured_at?: string;
}

/**
 * Call this hook once at the app root. It reads query params on the first
 * render and persists them to sessionStorage.
 */
export function useAttribution(): void {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const data: AttributionData = {};
      let hasAny = false;

      for (const key of UTM_KEYS) {
        const value = params.get(key);
        if (value) {
          (data as any)[key] = value;
          hasAny = true;
        }
      }

      // Only overwrite existing attribution if we actually found new UTM params.
      // This prevents wiping the data when the user navigates to a non-UTM page.
      if (hasAny) {
        data.landing_page = window.location.pathname;
        data.captured_at = new Date().toISOString();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // sessionStorage may be unavailable in rare privacy modes — silently ignore
    }
  }, []);
}

/**
 * Retrieve stored attribution data (call from anywhere).
 */
export function getAttribution(): AttributionData | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AttributionData) : null;
  } catch {
    return null;
  }
}

/**
 * Format attribution data as a readable string to append to emails / DB records.
 * Returns null if there is no attribution data.
 */
export function formatAttribution(): string | null {
  const data = getAttribution();
  if (!data) return null;

  const lines: string[] = [];
  if (data.utm_source)   lines.push(`Source: ${data.utm_source}`);
  if (data.utm_medium)   lines.push(`Medium: ${data.utm_medium}`);
  if (data.utm_campaign) lines.push(`Campaign: ${data.utm_campaign}`);
  if (data.utm_content)  lines.push(`Content: ${data.utm_content}`);
  if (data.utm_term)     lines.push(`Term: ${data.utm_term}`);
  if (data.landing_page) lines.push(`Landing Page: ${data.landing_page}`);
  if (data.captured_at)  lines.push(`First Visit: ${data.captured_at}`);

  return lines.length > 0
    ? `\n--- Campaign Attribution ---\n${lines.join('\n')}`
    : null;
}
