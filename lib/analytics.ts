/**
 * Unified Analytics Framework
 * 
 * Fires conversion events to Google Analytics 4, Meta Pixel, and LinkedIn
 * Insight Tag simultaneously. This lets us track ROI across all ad platforms
 * from a single function call instead of scattering pixel-specific code
 * throughout the codebase.
 */

// ---------------------------------------------------------------------------
// Type-safe access to global tracking functions
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    lintrk?: (action: string, data: Record<string, any>) => void;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ga4 = (...args: any[]) => {
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  }
};

const meta = (action: string, event: string, params?: Record<string, any>) => {
  if (typeof window.fbq === 'function') {
    window.fbq(action, event, params);
  }
};

const linkedin = (conversionId?: number) => {
  if (typeof window.lintrk === 'function' && conversionId) {
    window.lintrk('track', { conversion_id: conversionId });
  }
};

// ---------------------------------------------------------------------------
// Public analytics API
// ---------------------------------------------------------------------------

export const analytics = {
  /**
   * Track a lead event (form click, WhatsApp, booking button, etc.)
   * @param source - what the user clicked, e.g. 'whatsapp', 'booking_hero'
   * @param category - campaign grouping, e.g. 'WHX Miami 2026'
   */
  lead(source: string, category: string = 'General') {
    // GA4
    ga4('event', 'generate_lead', {
      event_category: category,
      event_label: source,
    });

    // Meta Pixel
    meta('track', 'Lead', {
      content_name: source,
      content_category: category,
    });

    // LinkedIn — fires a general conversion. Specific conversion IDs
    // can be set up in Campaign Manager and passed here if needed.
    linkedin();
  },

  /**
   * Track a completed quote request submission
   */
  quoteRequest(itemsCount: number, source: string = 'quote_cart') {
    ga4('event', 'purchase', {
      event_category: 'Quote Request',
      event_label: source,
      value: itemsCount,
    });

    meta('track', 'Lead', {
      content_name: 'quote_request',
      content_category: 'Quote Request',
      num_items: itemsCount,
    });

    linkedin();
  },

  /**
   * Track a WhatsApp click
   */
  whatsAppClick(source: string = 'general') {
    ga4('event', 'contact', {
      event_category: 'WhatsApp',
      event_label: source,
      method: 'whatsapp',
    });

    meta('track', 'Contact', {
      content_name: 'whatsapp_click',
      content_category: source,
    });

    linkedin();
  },

  /**
   * Track a confirmed Cal.com booking (from postMessage event)
   */
  bookingConfirmed(source: string = 'whx_miami') {
    ga4('event', 'schedule', {
      event_category: 'Booking',
      event_label: source,
    });

    meta('track', 'Schedule', {
      content_name: 'meeting_booked',
      content_category: source,
    });

    linkedin(28337681);
  },

  /**
   * Track a contact form submission
   */
  contactSubmit(interest: string = 'General Inquiry') {
    ga4('event', 'generate_lead', {
      event_category: 'Contact Form',
      event_label: interest,
    });

    meta('track', 'Lead', {
      content_name: 'contact_form',
      content_category: interest,
    });

    linkedin();
  },
};
