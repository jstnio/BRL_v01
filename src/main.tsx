import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Failed to find the root element');
} else {
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to render the app:', error);
    rootElement.innerHTML = '<div style="padding: 20px;">Failed to initialize the application. Please check the console for more details.</div>';
  }
}