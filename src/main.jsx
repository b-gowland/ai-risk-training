import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Homepage } from './components/Homepage/Homepage.jsx'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx'
import { EverydayApp } from './everyday/EverydayApp.jsx'
import { Privacy } from './pages/Privacy.jsx'
import { NotFound } from './pages/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/scenario/:id" element={
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        } />
        <Route path="/everyday" element={<EverydayApp />} />
        <Route path="/everyday/" element={<EverydayApp />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Catch-all. Without it an unmatched hash renders a blank page. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
