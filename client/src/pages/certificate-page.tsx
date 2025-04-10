import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CertificateDisplay from "@/components/ui/certificate-display";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, CheckCircle, Link as LinkIcon } from "lucide-react";
import { User, Course } from "@shared/schema";

type CertificateWithDetails = {
  id: number;
  userId: number;
  courseId: number;
  certificateNumber: string;
  issueDate: string;
  course: Course;
  user: Omit<User, "password">;
};

export default function CertificatePage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/certificate/:id");
  const certificateId = params?.id;
  const certificateRef = useRef<HTMLDivElement>(null);
  
  // Fetch certificate details
  const { data: certificate, isLoading } = useQuery<CertificateWithDetails>({
    queryKey: [`/api/certificates/${certificateId}`],
    enabled: !!certificateId,
  });
  
  // Format certificate number for display
  const formattedCertificateNumber = (number: string) => {
    return number.toUpperCase();
  };
  
  // Handle certificate download
  const handleDownload = () => {
    // This is just a mock function to show a toast notification
    toast({
      title: "تم تحميل الشهادة",
      description: "تم تحميل الشهادة بصيغة PDF",
    });
  };
  
  // Handle share certificate
  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "تم نسخ الرابط",
      description: "تم نسخ رابط الشهادة إلى الحافظة",
    });
  };
  
  // Loading state
  if (isLoading) {
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
  if (!certificate) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ</h1>
            <p className="text-neutral-600 mb-6">لم يتم العثور على الشهادة المطلوبة</p>
            <Button onClick={() => setLocation("/dashboard")}>العودة للوحة التحكم</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="bg-neutral-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">شهادة إتمام الدورة</h1>
            <p className="text-neutral-600">
              تهانينا على إكمال دورة {certificate.course.title}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                  <span className="text-green-600 font-medium">شهادة معتمدة</span>
                </div>
                <div className="text-sm text-neutral-500">
                  رقم الشهادة: {formattedCertificateNumber(certificate.certificateNumber)}
                </div>
              </div>
              
              <div ref={certificateRef}>
                <CertificateDisplay
                  userName={`${certificate.user.firstName} ${certificate.user.lastName}`}
                  courseName={certificate.course.title}
                  certificateNumber={certificate.certificateNumber}
                  issueDate={new Date(certificate.issueDate)}
                />
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleDownload}
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 ml-2" />
                  تحميل الشهادة
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center"
                >
                  <LinkIcon className="h-4 w-4 ml-2" />
                  مشاركة الشهادة
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">تفاصيل الشهادة</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">اسم المتعلم</h3>
                      <p className="text-neutral-800">{certificate.user.firstName} {certificate.user.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">اسم الدورة</h3>
                      <p className="text-neutral-800">{certificate.course.title}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">تاريخ الإصدار</h3>
                      <p className="text-neutral-800">
                        {new Date(certificate.issueDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">مدة الدورة</h3>
                      <p className="text-neutral-800">{certificate.course.duration} ساعة</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">رقم التحقق</h3>
                    <p className="text-neutral-800">{formattedCertificateNumber(certificate.certificateNumber)}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-200">
                    <h3 className="font-medium mb-2">التحقق من صحة الشهادة</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      يمكن التحقق من صحة هذه الشهادة عن طريق رقم التحقق أو عبر مسح رمز QR من خلال موقعنا
                    </p>
                    <div className="bg-neutral-100 p-4 rounded-md flex items-center">
                      <div className="bg-white p-2 rounded">
                        <div className="w-24 h-24 flex items-center justify-center">
                          <span className="text-xs text-center text-neutral-500">رمز QR</span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <p className="text-sm text-neutral-600 mb-2">
                          امسح الرمز أو أدخل رقم التحقق في صفحة التحقق من الشهادات
                        </p>
                        <Button variant="link" className="h-auto p-0 text-primary">
                          الانتقال إلى صفحة التحقق
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-10">
            <h3 className="text-lg font-medium mb-4">استمر في التعلم مع المزيد من الدورات</h3>
            <Button onClick={() => setLocation("/#courses")}>استعرض الدورات المتاحة</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
