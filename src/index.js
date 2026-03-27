import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 1. إعداد الثيم العام (المظهر) والخط العربي
const theme = createTheme({
  typography: {
    fontFamily: "Tajawal, sans-serif",
  },
  palette: {
    primary: {
      main: "#1976d2", // اللون الأزرق الأساسي للعيادة
    },
    secondary: {
      main: "#ed6c02", // اللون البرتقالي للمراجعات
    },
  },
  direction: "rtl", // دعم اللغة العربية من اليمين لليسار
});

// 2. ربط التطبيق بالعنصر الجذري في الـ HTML
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

// 3. --- تسجيل الـ Service Worker لتفعيل تطبيق الموبايل (PWA) ---
// يعمل هذا الجزء فقط في بيئة الإنتاج (Production) أو المتصفحات الحديثة
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // تحديد مسار الملف الموجود في مجلد public
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log(
          "✅ Service Worker registered successfully:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}
