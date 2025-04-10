import { useQuery } from "@tanstack/react-query";
import { Course, Enrollment, Certificate } from "@shared/schema";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import CertificateDisplay from "@/components/ui/certificate-display";

type EnrollmentWithCourse = Enrollment & { course: Course };
type CertificateWithCourse = Certificate & { course: Course };

export default function DashboardPage() {
  const { user } = useAuth();
  
  const { data: enrollments, isLoading: isEnrollmentsLoading } = useQuery<EnrollmentWithCourse[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user,
  });
  
  const { data: certificates, isLoading: isCertificatesLoading } = useQuery<CertificateWithCourse[]>({
    queryKey: ["/api/certificates"],
    enabled: !!user,
  });
  
  // Calculate statistics
  const totalEnrollments = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.completed).length || 0;
  const totalCertificates = certificates?.length || 0;
  
  // Calculate total learning hours
  const totalHours = enrollments?.reduce((total, enrollment) => {
    const courseHours = enrollment.course.duration;
    const completedHours = Math.floor((courseHours * enrollment.progress) / 100);
    return total + completedHours;
  }, 0) || 0;

  return (
    <>
      <Header />
      <main>
        <div className="bg-primary pt-8 pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">مرحباً، {user?.firstName} {user?.lastName}</h1>
            <p className="mt-2 text-blue-100">استمر في التعلم واكتساب المهارات الجديدة</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-800">لوحة التحكم</h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <i className="fas fa-book text-primary"></i>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-sm font-medium text-neutral-500">الدورات المسجلة</h3>
                    <p className="text-2xl font-bold text-neutral-800">{totalEnrollments}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="fas fa-graduation-cap text-green-600"></i>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-sm font-medium text-neutral-500">الدورات المكتملة</h3>
                    <p className="text-2xl font-bold text-neutral-800">{completedCourses}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <i className="fas fa-certificate text-amber-600"></i>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-sm font-medium text-neutral-500">الشهادات</h3>
                    <p className="text-2xl font-bold text-neutral-800">{totalCertificates}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="fas fa-clock text-purple-600"></i>
                  </div>
                  <div className="mr-4">
                    <h3 className="text-sm font-medium text-neutral-500">ساعات التعلم</h3>
                    <p className="text-2xl font-bold text-neutral-800">{totalHours}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6">دوراتي</h2>

            {isEnrollmentsLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500">جاري تحميل الدورات...</p>
              </div>
            ) : !enrollments || enrollments.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-neutral-400 text-4xl mb-3">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-2">لم تسجل في أي دورة بعد</h3>
                <p className="text-neutral-500 mb-4">استعرض الدورات المتاحة وابدأ رحلة التعلم</p>
                <Link href="/#courses">
                  <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                    استعرض الدورات
                  </a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={enrollment.course.imageUrl} 
                          alt={enrollment.course.title} 
                          className="h-16 w-16 object-cover rounded" 
                        />
                        <div className="mr-4">
                          <h3 className="font-medium text-neutral-800">{enrollment.course.title}</h3>
                          <p className="text-sm text-neutral-500">
                            {enrollment.completed ? "تم الإكمال" : enrollment.progress > 0 ? "قيد التقدم" : "بدأت حديثاً"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <span className="text-sm text-neutral-500">{enrollment.progress}٪</span>
                          <div className="w-24 h-2 bg-neutral-200 rounded-full mr-2">
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="mt-2">
                          {enrollment.completed && enrollment.certificateId ? (
                            <Link href={`/certificate/${enrollment.certificateId}`}>
                              <a className="text-sm text-primary">عرض الشهادة</a>
                            </Link>
                          ) : (
                            <Link href={`/course/${enrollment.courseId}`}>
                              <a className="text-sm text-primary">متابعة الدورة</a>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-6">شهاداتي</h2>

            {isCertificatesLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-neutral-500">جاري تحميل الشهادات...</p>
              </div>
            ) : !certificates || certificates.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-neutral-300 rounded-lg">
                <div className="text-neutral-400 text-4xl mb-3">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-2">لا توجد شهادات بعد</h3>
                <p className="text-neutral-500 mb-4">أكمل دوراتك للحصول على شهادات</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="border border-neutral-200 rounded-lg p-4">
                    <CertificateDisplay
                      userName={`${user?.firstName} ${user?.lastName}`}
                      courseName={certificate.course.title}
                      certificateNumber={certificate.certificateNumber}
                      issueDate={new Date(certificate.issueDate)}
                      compact={true}
                    />
                    <div className="mt-4 flex justify-between">
                      <Link href={`/certificate/${certificate.id}`}>
                        <a className="text-sm text-primary">عرض</a>
                      </Link>
                      <a href="#" className="text-sm text-green-600">تحميل</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
