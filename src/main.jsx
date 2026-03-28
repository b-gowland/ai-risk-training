import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { Homepage } from './components/Homepage/Homepage.jsx'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary.jsx'

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
      </Routes>
    </HashRouter>
  </StrictMode>
)
