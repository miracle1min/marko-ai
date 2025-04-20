import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set dark mode as default
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');

createRoot(document.getElementById("root")!).render(<App />);
