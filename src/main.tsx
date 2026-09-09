import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import { App } from './App';

// Fejlesztői módban a kitöltetlen helyőrzők vizuálisan kiemelve jelennek meg.
if (import.meta.env.DEV) {
  document.documentElement.dataset.dev = 'true';
}

const container = document.getElementById('root');
if (!container) throw new Error('Hiányzik a #root elem az index.html-ből.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
