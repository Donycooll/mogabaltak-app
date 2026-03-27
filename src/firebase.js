import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

// بيانات مشروعك من Firebase Console
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// تشغيل Firebase
const app = initializeApp(firebaseConfig);

// تصدير قاعدة البيانات لاستخدامها في الصفحات
export const db = getFirestore(app);

export const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BLgM0wk9r1UChZp6SWnWzHavClP1bjemR9ImleGKAduyH_8OFgHmsr7wzW1RzxbYWqAxPZEMf4h43XVRH16MICQ",
    });
    if (currentToken) {
      console.log("Token found:", currentToken);
      // هنا سنقوم لاحقاً بحفظ هذا التوكن في Firestore مع بيانات المريض
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one.",
      );
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

// دالة إرسال التنبيه (تستدعى من صفحة الدكتور)
export const sendNotification = async (targetToken, patientName) => {
  if (!targetToken) return;

  const message = {
    notification: {
      title: "🔔 دورك الآن!",
      body: `يا ${patientName}، الطبيب في انتظارك الآن. تفضل بالدخول.`,
    },
    to: targetToken, // التوكن الخاص بجهاز المريض
  };
  console.log("Preparing message:", message);

  try {
    // ملاحظة: لإرسال التنبيه مباشرة من المتصفح نحتاج "مفتاح الخادم" (Server Key)
    // أو استخدام Firebase Functions (وهو الأفضل للأمان)
    // حالياً سنقوم بتجربة إرسال تنبيه داخلي (Local Notification) للتأكد من التفاعل
    console.log("Sending notification to:", patientName);

    // إشعار داخلي في حال كان المتصفح مفتوحاً
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🔔 تنبيه العيادة", {
        body: `يا ${patientName}، دورك قد حان!`,
        icon: "/logo192.png",
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
