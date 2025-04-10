import { Switch, Route } from "wouter";
import { queryClient, getQueryFn } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
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
import { Course } from "@shared/schema";

// استيراد صفحة الملف الشخصي
import ProfilePage from "@/pages/profile-page";

// استيراد مكونات الهيدر والفوتر
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// صفحات مؤقتة
const CoursesPage = () => {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  return (
    <>
      <Header />
      <main className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">دوراتنا التدريبية</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة متنوعة من الدورات التدريبية المصممة خصيصًا لتلبية احتياجات المتعلمين باللغة العربية
            </p>
          </div>

          {/* أقسام الدورات */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                جميع الدورات
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-neutral-100 transition-colors">
                البرمجة
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-neutral-100 transition-colors">
                التصميم
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-neutral-100 transition-colors">
                إدارة الأعمال
              </button>
              <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-neutral-100 transition-colors">
                اللغات
              </button>
            </div>
          </div>

          {/* قائمة الدورات */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses && courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-110" 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {course.category}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {course.duration} ساعة
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold text-lg">
                        {course.price ? `${course.price} ريال` : 'مجاني'}
                      </span>
                      <a 
                        href={`/auth?redirect=/course/${course.id}`} 
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        الاشتراك الآن
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* استدعاء للعمل */}
          <div className="mt-16 bg-gradient-to-r from-primary/90 to-primary rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-right mb-8 lg:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">
                  ابدأ رحلة التعلم اليوم
                </h2>
                <p className="text-white/90 text-lg max-w-2xl">
                  انضم إلى الآلاف من المتعلمين واحصل على شهادات معتمدة في مختلف المجالات
                </p>
              </div>
              <div className="flex space-x-4 space-x-reverse">
                <a 
                  href="/auth" 
                  className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-neutral-100 transition-colors shadow-sm"
                >
                  تسجيل الدخول
                </a>
                <a 
                  href="/auth?tab=register" 
                  className="px-6 py-3 bg-white/10 text-white font-medium rounded-md border border-white/30 hover:bg-white/20 transition-colors"
                >
                  إنشاء حساب جديد
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const AboutPage = () => (
  <>
    <Header />
    <main className="bg-neutral-50">
      {/* قسم الشعار والمقدمة */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-8">
              <span className="text-primary">تَعلّم</span> - منصة تعليمية متكاملة باللغة العربية
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed mb-10">
              نسعى في منصة تعلّم إلى توفير محتوى تعليمي عربي أصيل وعالي الجودة، يلبي احتياجات المتعلمين في مختلف المجالات ويساعدهم على تطوير مهاراتهم وتحقيق أهدافهم المهنية والشخصية.
            </p>
          </div>
        </div>
      </section>

      {/* قسم رؤيتنا */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">رؤيتنا <span className="text-primary">وقيمنا</span></h2>
              <p className="text-gray-700 mb-6 text-lg">
                نسعى لأن نكون المنصة التعليمية الرائدة في العالم العربي، وأن نساهم في سد الفجوة المعرفية من خلال توفير محتوى تعليمي عربي أصيل وعالي الجودة.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
                  </div>
                  <div className="ms-4">
                    <h3 className="text-lg font-semibold mb-1">التميز الأكاديمي</h3>
                    <p className="text-gray-600">نلتزم بتقديم محتوى تعليمي عالي الجودة يتوافق مع أحدث المعايير التعليمية العالمية.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  </div>
                  <div className="ms-4">
                    <h3 className="text-lg font-semibold mb-1">الإبتكار المستمر</h3>
                    <p className="text-gray-600">نسعى دائمًا لتطوير منصتنا وتحسين تجربة المستخدم من خلال تبني أحدث التقنيات والمنهجيات التعليمية.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div className="ms-4">
                    <h3 className="text-lg font-semibold mb-1">التعلم للجميع</h3>
                    <p className="text-gray-600">نؤمن بأن التعليم حق للجميع، ونعمل على توفير فرص تعليمية متكافئة لجميع شرائح المجتمع.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 relative">
              <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-br-3xl -translate-y-8 -translate-x-8 z-0"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/10 rounded-tl-3xl translate-y-8 translate-x-8 z-0"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center">أرقام <span className="text-primary">وإحصائيات</span></h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">+20,000</div>
                    <p className="text-gray-600">متعلم مسجل</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">+50</div>
                    <p className="text-gray-600">دورة تدريبية</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">+30</div>
                    <p className="text-gray-600">مدرب محترف</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">+5000</div>
                    <p className="text-gray-600">شهادة صادرة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم ميزات المنصة */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">ميزات <span className="text-primary">منصة تَعلّم</span></h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              نوفر العديد من الميزات التي تجعل رحلة التعلم أكثر متعة وفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path><path d="M10 6h8v4h-8V6Z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">محتوى تعليمي متنوع</h3>
              <p className="text-gray-600">
                نقدم مجموعة واسعة من الدورات التدريبية في مختلف المجالات، بدءًا من البرمجة وتطوير الويب وحتى تعلم اللغات وإدارة الأعمال.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M5.5 20H8M12 10v4m-3.5 6h7a5 5 0 0 0 5-5c0-2-3-8-3-8H5s-3 6-3 8a5 5 0 0 0 5 5Z"></path><path d="M9 10V6a3 3 0 0 1 5.83-1"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">خبراء ومدربون محترفون</h3>
              <p className="text-gray-600">
                يقوم بتقديم الدورات نخبة من الخبراء والمدربين المحترفين الذين يمتلكون خبرة عملية واسعة في مجالاتهم.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M12 8v4l3 3"></path><circle cx="12" cy="12" r="10"></circle></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">تعلم بالسرعة المناسبة لك</h3>
              <p className="text-gray-600">
                يمكنك التعلم وفقًا لجدولك الزمني الخاص، والتقدم في الدورات بالسرعة التي تناسبك.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M22 9.5v5c0 2.5-2 4.5-4.5 4.5h-5A9 9 0 0 1 3.17 5.17A9 9 0 0 1 12.5 2h5A4.5 4.5 0 0 1 22 6.5v3"></path><path d="M15 5h.01"></path><path d="M18 5h.01"></path><path d="m14 12-6 6"></path><path d="m15 18-6-6 3-3 6 6"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">تطبيقات عملية</h3>
              <p className="text-gray-600">
                نركز على الجانب العملي في التعليم من خلال مشاريع ومهام تطبيقية تساعدك على ترسيخ المفاهيم وتطوير مهاراتك العملية.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">شهادات معتمدة</h3>
              <p className="text-gray-600">
                بعد إتمام الدورة بنجاح، تحصل على شهادة معتمدة يمكنك إضافتها إلى سيرتك الذاتية وملفك المهني.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-primary"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">دعم ومساعدة مستمرة</h3>
              <p className="text-gray-600">
                نوفر دعمًا فنيًا وأكاديميًا على مدار الساعة للإجابة على أسئلتك واستفساراتك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الدعوة للتسجيل */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلة التعلم مع منصة تَعلّم</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            انضم إلى الآلاف من المتعلمين واكتسب المهارات التي تحتاجها لتطوير مسارك المهني
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth" className="px-8 py-3 bg-white text-primary font-bold rounded-md hover:bg-neutral-100 transition-colors">
              تسجيل الدخول
            </a>
            <a href="/auth?tab=register" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white/10 transition-colors">
              إنشاء حساب جديد
            </a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

const ContactPage = () => {
  return (
    <>
      <Header />
      <main className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">تواصل <span className="text-primary">معنا</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نحن سعداء بالإجابة على استفساراتك ومساعدتك في رحلة التعلم
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* نموذج الاتصال */}
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="أدخل موضوع الرسالة"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="أدخل رسالتك هنا..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-medium py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>
            
            {/* معلومات الاتصال */}
            <div className="space-y-8">
              <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">معلومات الاتصال</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600">info@taallam.com</p>
                      <p className="text-gray-600">support@taallam.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold mb-1">رقم الهاتف</h3>
                      <p className="text-gray-600">+966-123-456-789</p>
                      <p className="text-gray-600">+966-123-456-788</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold mb-1">العنوان</h3>
                      <p className="text-gray-600">طريق الملك عبدالعزيز، حي الياسمين</p>
                      <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6">ساعات العمل</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">الأحد - الخميس:</span>
                    <span className="text-gray-600">9:00 صباحاً - 5:00 مساءً</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">الجمعة:</span>
                    <span className="text-gray-600">مغلق</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">السبت:</span>
                    <span className="text-gray-600">10:00 صباحاً - 2:00 مساءً</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <a href="#" className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
                <a href="#" className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* خريطة جوجل (إطار وهمي) */}
          <div className="mt-16 bg-gray-200 rounded-lg overflow-hidden h-96 shadow-lg">
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-xl font-medium">خريطة موقع المنصة</p>
                <p className="text-sm mt-2">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

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
