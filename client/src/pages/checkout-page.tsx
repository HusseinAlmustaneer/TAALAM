import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Lock, CreditCard, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [location] = useLocation();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // استخراج معرّف الدورة من الرابط
  const courseId = parseInt(location.split("/").pop() || "0");
  
  // جلب بيانات الدورة
  const { data: course, isLoading: isLoadingCourse } = useQuery<Course>({
    queryKey: ["/api/courses", courseId],
    enabled: courseId > 0,
  });
  
  // التأكد من تسجيل دخول المستخدم
  useEffect(() => {
    if (!user) {
      setLocation(`/auth?redirect=/checkout/${courseId}`);
    }
  }, [user, courseId, setLocation]);
  
  // معلومات بطاقة الدفع
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });
  
  // تحديث معلومات البطاقة
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // تنسيق رقم البطاقة (إضافة مسافات كل 4 أرقام)
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setCardInfo({
        ...cardInfo,
        [name]: formattedValue
      });
      return;
    }
    
    // تنسيق تاريخ الانتهاء (إضافة / بعد الشهر)
    if (name === "expiryDate") {
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = cleanValue;
      
      if (cleanValue.length > 2) {
        formattedValue = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
      }
      
      setCardInfo({
        ...cardInfo,
        [name]: formattedValue
      });
      return;
    }
    
    // باقي الحقول
    setCardInfo({
      ...cardInfo,
      [name]: value
    });
  };
  
  // التحقق من صحة معلومات البطاقة
  const isFormValid = () => {
    return (
      cardInfo.cardNumber.replace(/\s/g, '').length === 16 &&
      cardInfo.cardHolder.length > 3 &&
      cardInfo.expiryDate.length === 5 &&
      cardInfo.cvv.length === 3
    );
  };
  
  // التسجيل في الدورة
  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/enrollments", { courseId });
      return await res.json();
    },
    onSuccess: () => {
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
  
  // إرسال معلومات الدفع
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "خطأ في معلومات الدفع",
        description: "يرجى التأكد من صحة جميع معلومات البطاقة",
        variant: "destructive",
      });
      return;
    }
    
    setProcessing(true);
    
    // محاكاة معالجة الدفع
    setTimeout(() => {
      // تسجيل المستخدم في الدورة بعد نجاح الدفع
      enrollMutation.mutate(courseId);
      
      setProcessing(false);
      setSuccess(true);
      
      // إعادة توجيه المستخدم إلى صفحة الدورة بعد 3 ثوانٍ
      setTimeout(() => {
        setLocation(`/course/${courseId}`);
      }, 3000);
    }, 2000);
  };
  
  // عرض حالة التحميل
  if (isLoadingCourse) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  // التأكد من وجود الدورة
  if (!course) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-neutral-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-800">الدورة غير موجودة</h1>
            <Button 
              onClick={() => setLocation("/courses")}
              className="mt-6"
            >
              العودة إلى الدورات
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">إتمام عملية الدفع</h1>
            
            {success ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-4">تمت عملية الدفع بنجاح!</h2>
                <p className="text-lg text-neutral-600 mb-6">
                  تم تسجيلك بنجاح في دورة "{course.title}"
                </p>
                <p className="text-neutral-500 mb-6">
                  سيتم توجيهك إلى صفحة الدورة خلال لحظات...
                </p>
                <Button 
                  onClick={() => setLocation(`/course/${courseId}`)}
                  className="bg-primary text-white"
                >
                  الذهاب إلى الدورة الآن
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* تفاصيل الدورة */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
                  <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
                  <div className="border-t border-b py-4 my-4">
                    <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                    <p className="text-neutral-600 text-sm mb-2">{course.category}</p>
                    <p className="text-neutral-600 text-sm mb-4">المدة: {course.duration} ساعة</p>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg mt-4">
                    <span>المجموع:</span>
                    <span className="text-primary">{course.price} ريال</span>
                  </div>
                </div>
                
                {/* نموذج الدفع */}
                <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                  <div className="flex items-center mb-6">
                    <Lock className="h-5 w-5 text-primary mr-2" />
                    <h2 className="text-xl font-bold">معلومات الدفع الآمن</h2>
                  </div>
                  
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                      <Label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                        رقم البطاقة
                      </Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={cardInfo.cardNumber}
                          onChange={handleInputChange}
                          placeholder="رقم البطاقة (16 رقم)"
                          className="pr-10 ltr"
                          maxLength={19}
                          required
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardHolder" className="block text-sm font-medium text-neutral-700 mb-1">
                        اسم حامل البطاقة
                      </Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        value={cardInfo.cardHolder}
                        onChange={handleInputChange}
                        placeholder="الاسم كما يظهر على البطاقة"
                        className="ltr"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-1">
                          تاريخ الانتهاء
                        </Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="ltr"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-1">
                          رمز الأمان (CVV)
                        </Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="ltr"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <Button
                        type="submit"
                        className="w-full py-3 bg-primary text-white text-lg font-bold"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري معالجة الدفع...
                          </>
                        ) : (
                          <>إتمام الدفع {course.price} ريال</>
                        )}
                      </Button>
                      <p className="text-xs text-center mt-4 text-neutral-500">
                        بالضغط على "إتمام الدفع" أنت توافق على شروط وأحكام الخدمة وسياسة الخصوصية
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}