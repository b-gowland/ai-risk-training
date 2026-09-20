// A client-side route change does not trigger the browser's normal document
// navigation, so keyboard and screen-reader focus otherwise stays on the link
// that was activated. Scenario routes manage their finer-grained phase focus
// in ScenarioPlayer; every other route starts at its main content.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteFocus() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/scenario/')) return;
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
