import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Note: The document direction, language, and font imports are set in index.html

createRoot(document.getElementById("root")!).render(<App />);
