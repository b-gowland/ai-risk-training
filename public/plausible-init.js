// Plausible's queue stub: calls made before the analytics script has loaded
// are queued, not lost. Lives in a file, not inline, so the Content Security
// Policy can allow scripts from this site and plausible.io only
// (scripts/lib/csp.mjs). Stripped from LMS packages by build-scorm.mjs.
//
// The app routes with the URL hash (#/scenario/…), so its page tag carries
// data-hash-routing and pageviews are counted per route. The static pages
// are real paths and leave it off.
(function () {
  const p = (window.plausible = window.plausible || function () { (p.q = p.q || []).push(arguments); });
  p.init = p.init || function (i) { p.o = i || {}; };
  p.init(document.currentScript && 'hashRouting' in document.currentScript.dataset
    ? { hashBasedRouting: true }
    : undefined);
})();
