import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Providers } from './providers.tsx';

createRoot(document.getElementById('root')!).render(
  <Router>
    <Providers>
      <App />
    </Providers>
  </Router>,
);
