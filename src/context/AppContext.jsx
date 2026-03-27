import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc, // أضفنا getDoc لجلب البيانات مباشرة من السيرفر للتأمين
  query,
  orderBy,
} from "firebase/firestore";
import { requestForToken } from "../firebase";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("clinic_user");
    return saved ? JSON.parse(saved) : null;
  });

  // 1. الاستماع للتغييرات في الطابور
  useEffect(() => {
    const q = query(collection(db, "queue"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQueue(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("clinic_user", JSON.stringify(user));
    else localStorage.removeItem("clinic_user");
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem("doctorName");
  };

  // 2. إضافة مريض جديد
  const addToQueue = async (patientName, doctorName) => {
    const token = await requestForToken();
    await addDoc(collection(db, "queue"), {
      name: patientName,
      doctorName: doctorName,
      status: "waiting",
      isFollowUp: false,
      diagnosis: "",
      fcmToken: token || "",
      createdAt: Date.now(),
    });
  };

  // 3. تحديث حالة المريض (استدعاء أو نتائج جاهزة)
  const updatePatientStatus = async (
    patientId,
    newStatus,
    isFollowUp = false,
    doctorName = null,
  ) => {
    try {
      const patientRef = doc(db, "queue", patientId);
      const updateData = {
        status: newStatus,
        isFollowUp: isFollowUp,
        lastUpdate: Date.now(),
      };
      if (doctorName) updateData.doctorName = doctorName;

      await updateDoc(patientRef, updateData);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. إنهاء الكشف (الإصلاح الجذري هنا)
  const finishConsultation = async (
    patientId,
    needsTests,
    notes,
    doctorName,
  ) => {
    try {
      const patientRef = doc(db, "queue", patientId);

      // جلب نسخة المريض من الداتابيز مباشرة لضمان الحصول على الاسم الصحيح
      const patientSnap = await getDoc(patientRef);
      const patientData = patientSnap.exists() ? patientSnap.data() : null;
      const realPatientName = patientData?.name || "مريض غير مسجل";

      const finalDoctorName =
        doctorName || localStorage.getItem("doctorName") || "طبيب مناوب";

      if (needsTests) {
        // حالة الفحوصات: نحدث الحالة ونحفظ الملاحظات (Diagnosis) في مستند المريض الحالي
        await updateDoc(patientRef, {
          status: "waiting_results",
          diagnosis: notes || "", // حفظ الملاحظات حتى لا تضيع
          isFollowUp: false,
          lastUpdate: Date.now(),
        });
      } else {
        // حالة الإنهاء النهائي: نسجل في مجموعة history أولاً
        await addDoc(collection(db, "history"), {
          patientId: patientId,
          patientName: realPatientName, // الاسم الحقيقي من السيرفر
          diagnosis: notes || "لا توجد ملاحظات",
          doctorName: finalDoctorName,
          date: Date.now(),
          status: "completed",
        });

        // الحذف من الطابور بعد نجاح التسجيل في السجل
        await deleteDoc(patientRef);
      }
      return true;
    } catch (error) {
      console.error("خطأ تقني في إنهاء المقابلة:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        queue,
        user,
        login,
        logout,
        addToQueue,
        updatePatientStatus,
        finishConsultation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
