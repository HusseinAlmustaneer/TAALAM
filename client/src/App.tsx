import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CoursePage from "@/pages/course-page";
import CertificatePage from "@/pages/certificate-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
// استيراد مكون مبدل اللغة
import { LanguageSwitcher } from "@/components/ui/language-switcher";

// استيراد صفحة الملف الشخصي
import ProfilePage from "@/pages/profile-page";

// استيراد مكونات الهيدر والفوتر
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// صفحات مؤقتة
const CoursesPage = () => (
  <>
    <Header />
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">الدورات</h1>
      <p className="text-lg mb-4">قائمة الدورات المتاحة ستظهر هنا قريباً.</p>
      <a href="/" className="text-primary hover:underline">العودة للصفحة الرئيسية</a>
    </div>
    <Footer />
  </>
);

const AboutPage = () => (
  <>
    <Header />
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">عن المنصة</h1>
      <p className="text-lg mb-4">منصة تعلم هي منصة تعليمية متخصصة في تقديم دورات تدريبية عالية الجودة باللغة العربية.</p>
      <p className="text-lg mb-4">تهدف المنصة إلى توفير محتوى تعليمي احترافي يساعد المتعلمين على تطوير مهاراتهم في مختلف المجالات.</p>
      <a href="/" className="text-primary hover:underline">العودة للصفحة الرئيسية</a>
    </div>
    <Footer />
  </>
);

const ContactPage = () => (
  <>
    <Header />
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">تواصل معنا</h1>
      <p className="text-lg mb-4">يمكنك التواصل معنا عبر البريد الإلكتروني: info@taallam.com</p>
      <p className="text-lg mb-4">أو عبر الهاتف: +966-123456789</p>
      <a href="/" className="text-primary hover:underline">العودة للصفحة الرئيسية</a>
    </div>
    <Footer />
  </>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/course/:id" component={CoursePage} />
      <ProtectedRoute path="/certificate/:id" component={CertificatePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
