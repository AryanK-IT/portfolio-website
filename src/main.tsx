// ─── src/main.tsx ─────────────────────────────────────────────────────────────
// React DOM entry point. Mounts the App component into #root.
// StrictMode enabled for development warnings.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ─── Global styles — import before App so Tailwind base applies first ─────────
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
