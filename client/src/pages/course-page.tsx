import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Course, Enrollment } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clock, User, CheckCircle, Award } from "lucide-react";

type EnrollmentWithCourse = Enrollment & { course: Course };

export default function CoursePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/course/:id");
  const courseId = params?.id ? parseInt(params.id) : 0;
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  
  // Fetch course details
  const { data: course, isLoading: isCourseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: courseId > 0,
  });
  
  // Fetch user enrollments to check enrollment status
  const { data: enrollments, isLoading: isEnrollmentsLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["/api/enrollments"],
  });
  
  // Find the current enrollment if exists
  const currentEnrollment = enrollments?.find(
    (enrollment) => enrollment.courseId === courseId
  );
  
  // Update progress state when enrollment data is loaded
  useEffect(() => {
    if (currentEnrollment) {
      setCurrentProgress(currentEnrollment.progress);
    }
  }, [currentEnrollment]);
  
  // Enroll in course mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم تسجيلك في الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل التسجيل",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progress: number) => {
      if (!currentEnrollment) return null;
      
      const res = await apiRequest("PATCH", `/api/enrollments/${currentEnrollment.id}/progress`, {
        progress,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم تحديث التقدم",
        description: "تم تحديث تقدمك في الدورة بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      
      // If completed, check if certificate was generated
      if (currentProgress === 100) {
        queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
        toast({
          title: "مبروك!",
          description: "لقد أكملت الدورة بنجاح وتم إصدار شهادة لك",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تحديث التقدم",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleEnroll = () => {
    enrollMutation.mutate();
  };
  
  const handleUpdateProgress = (newProgress: number) => {
    setCurrentProgress(newProgress);
    updateProgressMutation.mutate(newProgress);
  };
  
  // Format price
  const formatPrice = (price: number | null) => {
    if (price === null) return "مجاناً";
    return `${price} ريال`;
  };
  
  // Loading state
  if (isCourseLoading || isEnrollmentsLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // Error state
  if (!course) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h1>
            <p className="text-neutral-600 mb-6">لم يتم العثور على الدورة المطلوبة</p>
            <Button onClick={() => setLocation("/")}>العودة للصفحة الرئيسية</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="bg-neutral-50 min-h-screen pb-12">
        {/* Course header */}
        <div className="bg-primary pt-10 pb-24 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-2/3">
                <Badge 
                  className={`
                    ${course.category === 'تقنية' ? 'bg-primary/30' : ''}
                    ${course.category === 'تسويق' ? 'bg-green-700/30' : ''}
                    ${course.category === 'إدارة' ? 'bg-amber-700/30' : ''}
                    ${course.category === 'مهارات شخصية' ? 'bg-pink-700/30' : ''}
                    ${course.category === 'تصميم' ? 'bg-purple-700/30' : ''}
                    mb-4
                  `}
                >
                  {course.category}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-blue-100 mb-6">{course.description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 ml-2" />
                    <span>{course.duration} ساعة</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 ml-2" />
                    <span>+١٠٠ طالب مسجل</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 ml-2" />
                    <span>شهادة معتمدة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course content */}
        <div className="container mx-auto px-4 -mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">نظرة عامة على الدورة</h2>
                  <p className="text-neutral-600">
                    {course.description}
                  </p>
                  
                  {currentEnrollment && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">تقدمك في الدورة</h3>
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-neutral-500">نسبة الإكمال</span>
                        <span className="text-sm font-medium">{currentProgress}%</span>
                      </div>
                      <Progress value={currentProgress} className="h-2 mb-4" />
                      
                      {currentEnrollment.completed ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-600 ml-3" />
                          <div>
                            <h4 className="font-medium text-green-800">لقد أكملت هذه الدورة</h4>
                            <p className="text-green-600 text-sm">
                              {currentEnrollment.certificateId ? (
                                <>
                                  <span>يمكنك الآن </span>
                                  <Button
                                    variant="link"
                                    className="p-0 h-auto text-primary text-sm"
                                    onClick={() => setLocation(`/certificate/${currentEnrollment.certificateId}`)}
                                  >
                                    عرض الشهادة
                                  </Button>
                                </>
                              ) : (
                                <span>جار إصدار شهادتك...</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Progress controls
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                          <h4 className="font-medium text-blue-800 mb-3">تحديث التقدم في الدورة</h4>
                          <div className="flex flex-wrap gap-2">
                            {[25, 50, 75, 100].map((progress) => (
                              <Button
                                key={progress}
                                variant={progress <= currentProgress ? "default" : "outline"}
                                onClick={() => handleUpdateProgress(progress)}
                                disabled={updateProgressMutation.isPending}
                                className="text-sm"
                              >
                                {progress}%
                              </Button>
                            ))}
                          </div>
                          <p className="mt-3 text-blue-600 text-sm">
                            عند الوصول إلى 100% سيتم إصدار شهادة إتمام الدورة
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">محتوى الدورة</h2>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((module) => (
                      <div key={module} className="border border-neutral-200 rounded-md p-4">
                        <h3 className="font-medium mb-2">الوحدة {module}: {module === 1 ? 'مقدمة في ' : 'أساسيات '}{course.title}</h3>
                        <div className="text-sm text-neutral-500">
                          {Math.round(course.duration / 5)} دروس • {Math.round(course.duration / 5) * 60} دقيقة
                        </div>
                        <Button 
                          variant="link" 
                          className="px-0 text-primary"
                          disabled={!currentEnrollment}
                        >
                          {currentEnrollment ? "عرض المحتوى" : "سجل في الدورة لعرض المحتوى"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video overflow-hidden rounded-md mb-4">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="text-3xl font-bold text-primary mb-4">
                      {formatPrice(course.price)}
                    </div>
                    
                    {currentEnrollment ? (
                      <div>
                        <Button
                          className="w-full mb-4"
                          disabled={true}
                        >
                          <CheckCircle className="h-4 w-4 ml-2" />
                          مسجل بالفعل
                        </Button>
                        
                        <div className="text-sm text-neutral-600 mb-2">
                          <span className="font-medium">تاريخ التسجيل: </span>
                          {new Date(currentEnrollment.enrolledAt).toLocaleDateString('ar-SA')}
                        </div>
                        
                        <div className="text-sm text-neutral-600">
                          <span className="font-medium">الحالة: </span>
                          {currentEnrollment.completed ? 
                            <span className="text-green-600">مكتملة</span> : 
                            <span className="text-blue-600">قيد التقدم ({currentEnrollment.progress}%)</span>
                          }
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={handleEnroll}
                        disabled={enrollMutation.isPending}
                      >
                        {enrollMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                            جاري التسجيل...
                          </>
                        ) : (
                          "سجل في الدورة"
                        )}
                      </Button>
                    )}
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-sm">
                        <i className="fas fa-check-circle text-green-600 ml-2"></i>
                        <span>دورة كاملة باللغة العربية</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="fas fa-check-circle text-green-600 ml-2"></i>
                        <span>شهادة إتمام معتمدة</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="fas fa-check-circle text-green-600 ml-2"></i>
                        <span>وصول دائم للمحتوى</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="fas fa-check-circle text-green-600 ml-2"></i>
                        <span>محتوى تفاعلي وتمارين عملية</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <h4 className="font-medium mb-2">شارك هذه الدورة</h4>
                      <div className="flex space-x-4 space-x-reverse">
                        <a href="#" className="text-neutral-600 hover:text-primary">
                          <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-primary">
                          <i className="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-primary">
                          <i className="fab fa-linkedin text-xl"></i>
                        </a>
                        <a href="#" className="text-neutral-600 hover:text-primary">
                          <i className="fab fa-whatsapp text-xl"></i>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
