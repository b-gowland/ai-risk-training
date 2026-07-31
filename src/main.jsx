import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Homepage from './components/Homepage/Homepage.jsx';
import ScenarioPlayer from './player/ScenarioPlayer.jsx';
import { Privacy } from './pages/Privacy.jsx';
import About from './pages/About.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Homepage />} />
            <Route path="/scenario/:id" element={<ScenarioPlayer />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            {/* Retired surfaces. Kept as redirects so shared links and the
                r/SideProject post do not die. */}
            <Route path="/everyday" element={<Navigate to="/" replace />} />
            <Route path="/everyday/:id" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>
);
