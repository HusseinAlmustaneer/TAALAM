import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Course } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CourseCard from "@/components/ui/course-card";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CoursesListPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // جلب جميع الدورات
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });
  
  // تسجيل في دورة
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

  // التعامل مع التسجيل في دورة
  const handleEnroll = (courseId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    enrollMutation.mutate(courseId);
  };
  
  // الحصول على قائمة الفئات الفريدة من الدورات
  const categories = courses
    ? Array.from(new Set(courses.map((course) => course.category)))
    : [];
  
  // تصفية الدورات حسب الفئة المختارة
  const filteredCourses = selectedCategory
    ? courses?.filter((course) => course.category === selectedCategory)
    : courses;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-800 sm:text-4xl mb-4">استكشف دوراتنا</h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              مجموعة متنوعة من الدورات التدريبية المصممة لمساعدتك على تطوير مهاراتك والارتقاء بمستواك المهني
            </p>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === null
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                }`}
              >
                جميع الدورات
              </Button>
              
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-8 bg-neutral-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              ) : filteredCourses && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    isEnrolling={enrollMutation.isPending}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-neutral-500">لا توجد دورات متاحة في هذه الفئة</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}