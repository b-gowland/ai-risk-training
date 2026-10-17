// The Content Security Policy for every page the site serves.
//
// GitHub Pages cannot set response headers, so this goes in a <meta> tag:
// the Vite build adds it to index.html (vite.config.js) and
// build-static-pages.mjs adds it to every static page. A meta policy cannot
// carry frame-ancestors; that needs a header (see ARCHITECTURE.md).
//
// Scripts: this site, and Plausible's analytics script. No inline scripts:
// JSON-LD blocks are data, not script, and are not affected.
// Connections: this site and Plausible's event endpoint, nothing else.
// Styles: inline styles are allowed (the static pages carry their CSS inline
// and React sets style properties), plus Google Fonts' stylesheet.

export const CSP = [
  "default-src 'self'",
  "script-src 'self' https://plausible.io",
  "connect-src 'self' https://plausible.io",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

export const CSP_META = `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`;
