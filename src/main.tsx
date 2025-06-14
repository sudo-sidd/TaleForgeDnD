import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log("main.tsx is executing!");

const rootElement = document.getElementById('root');
console.log("Root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("Creating React root...");
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log("React render called!");
} else {
  console.error("Could not find root element!");
}
