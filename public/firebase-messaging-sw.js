/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyDcnjZlOwAySVHodWIC_CZcHESPK6koGkE",
  authDomain: "mogabaltak-app.firebaseapp.com",
  projectId: "mogabaltak-app",
  storageBucket: "mogabaltak-app.firebasestorage.app",
  messagingSenderId: "312936177326",
  appId: "1:312936177326:web:19347d4c74446b5053173f",
  measurementId: "G-T1LPQBG841",
});

const messaging = firebase.messaging();

// استقبال التنبيه لما المتصفح يكون مقفول أو في الخلفية
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  globalThis.registration.showNotification(notificationTitle, notificationOptions);
});
