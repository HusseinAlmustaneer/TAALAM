import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Loader2 } from "lucide-react";

export default function CourseDetailsPage() {
  const [, params] = useParams();
  const courseId = parseInt(params.id);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) {
        throw new Error("فشل في تحميل بيانات الدورة");
      }
      return res.json();
    },
  });

  return (
    <>
      <Header />
      <main className="py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ أثناء تحميل الدورة</h2>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : "خطأ غير معروف"}
              </p>
              <Link
                href="/courses"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                العودة إلى قائمة الدورات
              </Link>
            </div>
          ) : course ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* صورة الدورة والمعلومات الأساسية */}
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {course.title}
                      </h1>
                      <p className="text-white/90">
                        {course.category}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">وصف الدورة</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-xl font-bold mb-4">ما الذي ستتعلمه في هذه الدورة</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-primary mt-1 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>فهم العناصر الأساسية والمتقدمة في مجال {course.category}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-primary mt-1 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>اكتساب المهارات اللازمة للعمل في مشاريع حقيقية</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-primary mt-1 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>تطبيق المفاهيم النظرية من خلال تمارين وأمثلة عملية</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="w-5 h-5 text-primary mt-1 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>الحصول على شهادة معتمدة عند إتمام الدورة</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-6">
                      <h3 className="text-xl font-bold mb-4">محتوى الدورة</h3>
                      <div className="space-y-3">
                        <div className="border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                            <h4 className="font-semibold">الوحدة 1: مقدمة في {course.title}</h4>
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                            <h4 className="font-semibold">الوحدة 2: المفاهيم الأساسية</h4>
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                            <h4 className="font-semibold">الوحدة 3: التطبيقات العملية</h4>
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-md">
                          <div className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer">
                            <h4 className="font-semibold">الوحدة 4: المشروع النهائي</h4>
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* معلومات التسجيل وتفاصيل الدورة */}
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-primary">
                        {course.price ? `${course.price} ريال` : 'مجاني'}
                      </span>
                    </div>
                    <Link 
                      href={`/auth?redirect=/course/${course.id}`}
                      className="block w-full bg-primary text-center text-white font-bold py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      التسجيل في الدورة
                    </Link>
                  </div>

                  <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-bold mb-4">تفاصيل الدورة</h3>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">المدة</span>
                        <p className="font-medium">{course.duration} ساعة</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">المستوى</span>
                        <p className="font-medium">جميع المستويات</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">التصنيف</span>
                        <p className="font-medium">{course.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">عدد الطلاب</span>
                        <p className="font-medium">150+</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-primary ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                      <div>
                        <span className="text-sm text-gray-500">اللغة</span>
                        <p className="font-medium">العربية</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-4">تتضمن هذه الدورة</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>محاضرات فيديو</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>تمارين تطبيقية</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>اختبارات تقييمية</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>شهادة معتمدة</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>دعم فني ومتابعة</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">لم يتم العثور على الدورة</h2>
              <p className="text-gray-600 mb-6">
                هذه الدورة غير متوفرة أو تم حذفها
              </p>
              <Link
                href="/courses"
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                العودة إلى قائمة الدورات
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}