import { useQuery, useMutation } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CourseCard from "@/components/ui/course-card";
import TestimonialCard from "@/components/ui/testimonial-card";
import FeatureCard from "@/components/ui/feature-card";
import CertificateDisplay from "@/components/ui/certificate-display";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم تسجيلك في الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "فشل التسجيل",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (courseId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    enrollMutation.mutate(courseId);
  };

  // Features data
  const features = [
    {
      icon: "fas fa-language",
      title: "محتوى عربي",
      description: "دورات تدريبية مصممة باللغة العربية لتناسب احتياجات المتعلم العربي"
    },
    {
      icon: "fas fa-certificate",
      title: "شهادات معتمدة",
      description: "احصل على شهادات رقمية بعد إتمام كل دورة لتعزيز سيرتك الذاتية"
    },
    {
      icon: "fas fa-clock",
      title: "دورات قصيرة",
      description: "دورات مركزة تمكنك من اكتساب مهارات جديدة في وقت قصير"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "أحمد السعيد",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "\"استفدت كثيراً من دورة برمجة تطبيقات الويب، المحتوى كان مفهوم وسهل الاستيعاب. الآن أستطيع بناء مواقع ويب من الصفر!\""
    },
    {
      name: "سارة العتيبي",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      text: "\"دورة التسويق الرقمي غيرت مسار عملي تماماً. المحتوى عملي والأمثلة واقعية. أنصح بها لكل من يريد دخول مجال التسويق.\""
    },
    {
      name: "محمد القحطاني",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4.5,
      text: "\"أكملت دورة إدارة المشاريع وكانت تجربة ممتازة. استطعت تطبيق ما تعلمته في عملي مباشرة. شكراً لفريق المنصة على هذه الدورة القيمة.\""
    }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Full Image Background */}
        <section className="relative min-h-[80vh] flex items-center text-white overflow-hidden animate-gradient">
          {/* صورة الخلفية */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-700 opacity-80 animate-pulse-slow"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" 
              alt="طلاب يتعلمون عبر الإنترنت"
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          {/* طبقة متحركة فوق الصورة */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0wIDE4aDZ2NmgtNnYtNnptNjAgMGg2djZoLTZ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 z-10"></div>
          
          {/* عناصر زخرفية متحركة */}
          <div className="absolute top-1/4 right-[10%] w-20 h-20 bg-white rounded-full opacity-10 animate-float z-20"></div>
          <div className="absolute bottom-1/4 left-[10%] w-32 h-32 bg-white rounded-full opacity-10 animate-float z-20" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[60%] right-[30%] w-16 h-16 bg-white rounded-full opacity-10 animate-float z-20" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-[20%] left-[20%] w-24 h-24 bg-white rounded-full opacity-10 animate-float z-20" style={{ animationDelay: '2s' }}></div>
          
          {/* المحتوى */}
          <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 z-30">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-lg">
                طوّر مهاراتك مع دورات قصيرة باللغة العربية
              </h1>
              <p className="mt-6 max-w-xl text-xl text-white drop-shadow-lg">
                منصة تعليمية مخصصة للسوق السعودي تقدم دورات تدريبية احترافية مع شهادات معتمدة
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a 
                  href="#courses" 
                  className="inline-flex items-center justify-center rounded-md bg-white px-6 py-4 text-lg font-medium text-primary hover:bg-blue-50 transition-colors shadow-lg"
                >
                  استعرض الدورات
                </a>
                {!user && (
                  <Button
                    onClick={() => setLocation("/auth?tab=register")}
                    className="inline-flex items-center justify-center rounded-md border-2 border-white bg-transparent px-6 py-4 text-lg font-medium text-white hover:bg-white/20 transition-colors shadow-lg"
                  >
                    سجل مجاناً
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* شريط متموج في الأسفل */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-r from-primary to-blue-700 skew-y-3 -mb-8 z-20"></div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">لماذا تختار منصتنا؟</h2>
              <p className="mt-3 text-lg text-neutral-600">مميزات تجعل تجربة التعلم لديك أفضل وأكثر فاعلية</p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="py-12 bg-neutral-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">الدورات المتاحة</h2>
              <p className="mt-3 text-lg text-neutral-600">اختر من بين دوراتنا المتنوعة وابدأ رحلة التعلم</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                // Loading skeleton for courses
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 w-full bg-neutral-200"></div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-16 bg-neutral-200 rounded"></div>
                        <div className="h-6 w-16 bg-neutral-200 rounded"></div>
                      </div>
                      <div className="mt-3 h-6 w-3/4 bg-neutral-200 rounded"></div>
                      <div className="mt-2 h-4 bg-neutral-200 rounded"></div>
                      <div className="mt-1 h-4 bg-neutral-200 rounded"></div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="h-6 w-20 bg-neutral-200 rounded"></div>
                        <div className="h-8 w-24 bg-neutral-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : courses && courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolling={enrollMutation.isPending}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-neutral-500">لا توجد دورات متاحة حالياً</p>
                </div>
              )}
            </div>

            <div className="mt-10 text-center">
              <Button 
                onClick={() => setLocation("/courses")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                عرض جميع الدورات
                <i className="fas fa-arrow-left mr-2"></i>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-800 sm:text-3xl">آراء المتعلمين</h2>
              <p className="mt-3 text-lg text-neutral-600">تجارب حقيقية من متعلمين استفادوا من دوراتنا</p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  name={testimonial.name}
                  image={testimonial.image}
                  rating={testimonial.rating}
                  text={testimonial.text}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Certificate Showcase */}
        <section className="py-12 bg-neutral-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h2 className="text-2xl font-bold sm:text-3xl">احصل على شهادات معتمدة</h2>
                <p className="mt-3 text-lg text-neutral-300">
                  بعد إكمال كل دورة، ستحصل على شهادة رقمية يمكنك مشاركتها مع أصحاب العمل أو إضافتها إلى سيرتك الذاتية
                </p>
                {!user && (
                  <div className="mt-8">
                    <Button
                      onClick={() => setLocation("/auth?tab=register")}
                      className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-neutral-800 bg-white hover:bg-neutral-100"
                    >
                      ابدأ التعلم الآن
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <CertificateDisplay
                  userName="عبدالله محمد الشهري"
                  courseName="برمجة تطبيقات الويب"
                  certificateNumber="WD-2023-12345"
                  issueDate={new Date(2023, 9, 20)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA - يظهر فقط للمستخدمين غير المسجلين */}
        {!user && (
          <section className="py-12 bg-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">ابدأ رحلة التعلم اليوم</h2>
              <p className="mt-3 text-lg text-blue-100 mx-auto max-w-2xl">
                سجل الآن واستفد من الدورات المجانية والمدفوعة المتاحة على منصتنا
              </p>
              <div className="mt-8 flex justify-center">
                <Button
                  onClick={() => setLocation("/auth?tab=register")}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-neutral-100 shadow-md"
                >
                  إنشاء حساب مجاني
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
