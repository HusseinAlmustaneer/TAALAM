import { createRoot } from "react-dom/client";
import App from "./App";
import "./css/main.css";
import "./css/certificate.css";

// لاحظ: تم تعيين اتجاه المستند واللغة واستيرادات الخطوط في ملف index.html

createRoot(document.getElementById("root")!).render(<App />);
