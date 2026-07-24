import { useState } from "react";
import LandingPage from "./Landingpage"; // تأكد من مطابقة حالة الأحرف في اسم الملف لديك
import LoginPage from "./LoginPage";
import RegisterPage from "./Registerpage";
import ProjectsPage from "./Projectspage"; 

function App() {
  // الحالات التراتبية للموقع: 
  // 'landing' (الافتراضية) أو 'login' أو 'register' أو 'projects'
  const [currentPage, setCurrentPage] = useState("landing");

  // 1. عرض صفحة الواجهة الرئيسية (Landing Page)
  if (currentPage === "landing") {
    return <LandingPage onNavigate={(page) => setCurrentPage(page)} />;
  }

  // 2. عرض صفحة إنشاء الحساب (Register)
  if (currentPage === "register") {
    return (
      <RegisterPage 
        onNavigate={(page) => setCurrentPage(page || "login")} // تم تحسينها لتقبل التوجيه المرن
      />
    );
  }

  // 3. عرض صفحة إدارة المشاريع الذكية الحقيقية (ProjectsPage)
  if (currentPage === "projects") {
  return <ProjectsPage onNavigate={(page) => setCurrentPage(page)} />;

  }

  // 4. عرض صفحة تسجيل الدخول (Login) كحالة افتراضية أخيرة
  return (
    <LoginPage 
      onNavigate={(page) => setCurrentPage(page || "register")} 
      onLoginSuccess={() => setCurrentPage("projects")} 
    />
  );
}

export default App;