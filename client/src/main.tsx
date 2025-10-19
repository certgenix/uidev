import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Suppress harmless browser extension errors
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('message channel closed')) {
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('message channel closed')) {
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
