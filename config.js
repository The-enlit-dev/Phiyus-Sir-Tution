/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — edit this file to update contact details.
 * ─────────────────────────────────────────────────────────────
 *
 *  Leave a value as an empty string ('') if it isn't available yet.
 *  Empty values are shown as clearly marked placeholders while
 *  `showPlaceholders` is true, or hidden entirely when it is false.
 *
 *  How the enquiry form is delivered (first available option wins):
 *    1. formEndpoint  — a form service URL (e.g. Formspree, Getform,
 *                       Basin). Enquiries are POSTed as JSON.
 *    2. whatsapp      — opens WhatsApp with the enquiry pre-written.
 *    3. email         — opens the visitor's email app, pre-filled.
 */
window.SITE_CONFIG = {
  tutorName: 'Piyush',

  // Phone number shown on the site, e.g. '+91 98765 43210'
  phone: '',

  // WhatsApp number in international format, digits only, e.g. '919876543210'
  whatsapp: '',

  // Contact email, e.g. 'hello@example.com'
  email: '',

  // Optional form service endpoint, e.g. 'https://formspree.io/f/xxxxxxx'
  formEndpoint: '',

  // Area shown publicly. Keep it general — no exact address needed.
  location: 'Thane, Maharashtra',

  // Path or URL to a profile photograph, e.g. 'assets/piyush.jpg'
  photo: '',

  // Optional line about availability/hours, e.g. 'Mon–Sat, 4 pm – 8 pm'
  hours: '',

  // Show dashed placeholders for missing details (useful while setting up).
  // Set to false before going live to hide anything not yet filled in.
  showPlaceholders: true,
};
