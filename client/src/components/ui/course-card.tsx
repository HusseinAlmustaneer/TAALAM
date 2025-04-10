import { useState } from "react";
import { Course } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CreditCard } from "lucide-react";

type CourseCardProps = {
  course: Course;
  onEnroll?: (courseId: number) => void;
  isEnrolling?: boolean;
};

export default function CourseCard({ course, onEnroll, isEnrolling }: CourseCardProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  
  // التحقق من وجود اشتراك للمستخدم في هذه الدورة
  const { data: enrollments } = useQuery<{userId: number; courseId: number; id: number; progress: number}[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!user, // تعطيل الاستعلام إذا لم يكن المستخدم مسجل دخول
  });

  // التحقق من وجود اشتراك في الدورة الحالية
  const isEnrolled = enrollments?.some((enrollment) => enrollment.courseId === course.id) || false;
  
  const formatPrice = (price: number | null) => {
    if (price === null) return "مجاناً";
    return `${price} ريال`;
  };
  
  const handleCourseDetails = (e: React.MouseEvent, courseId: number) => {
    e.preventDefault();
    setLocation(`/course-details/${courseId}`);
  };

  const handleEnrollClick = () => {
    if (course.price === null) {
      // إذا كانت الدورة مجانية، اعرض مربع حوار التأكيد
      setConfirmDialogOpen(true);
    } else {
      // إذا كانت الدورة مدفوعة، اعرض مربع حوار الدفع
      setPaymentDialogOpen(true);
    }
  };

  const handleFreeEnrollConfirm = () => {
    setConfirmDialogOpen(false);
    if (onEnroll) {
      onEnroll(course.id);
    }
  };

  const handlePaymentRedirect = () => {
    setPaymentDialogOpen(false);
    setLocation(`/checkout/${course.id}`);
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="h-full w-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <span className={`
              px-2 py-1 text-xs font-semibold rounded
              ${course.category === 'تقنية' ? 'bg-primary/10 text-primary' : ''}
              ${course.category === 'تسويق' ? 'bg-green-100 text-green-800' : ''}
              ${course.category === 'إدارة' ? 'bg-amber-100 text-amber-800' : ''}
              ${course.category === 'مهارات شخصية' ? 'bg-pink-100 text-pink-800' : ''}
              ${course.category === 'تصميم' ? 'bg-purple-100 text-purple-800' : ''}
            `}>
              {course.category}
            </span>
            <span className="text-neutral-500 text-sm">{course.duration} ساعة</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold text-neutral-800">{course.title}</h3>
          <p className="mt-2 text-neutral-600 line-clamp-2">{course.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-primary font-bold">{formatPrice(course.price)}</span>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={(e) => handleCourseDetails(e, course.id)}
                className="px-3 py-1 bg-white border border-primary text-primary rounded-md hover:bg-primary/5"
              >
                تفاصيل الدورة
              </button>
              
              {user ? (
                isEnrolled ? (
                  <Link 
                    href={`/course/${course.id}`}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center"
                  >
                    <span className="ml-1">&#10003;</span> مسجل بالفعل
                  </Link>
                ) : onEnroll ? (
                  <Button
                    onClick={handleEnrollClick}
                    disabled={isEnrolling}
                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    {isEnrolling ? "جاري التسجيل..." : "التسجيل"}
                  </Button>
                ) : (
                  <Link 
                    href={`/course-details/${course.id}`}
                    className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 inline-block"
                  >
                    الدخول للدورة
                  </Link>
                )
              ) : (
                <Link 
                  href={`/auth?redirect=/course/${course.id}`}
                  className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90 inline-block"
                >
                  التسجيل
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مربع حوار تأكيد التسجيل للدورات المجانية */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              تأكيد التسجيل
            </DialogTitle>
            <DialogDescription className="text-center">
              هل أنت متأكد من رغبتك في التسجيل في دورة "{course.title}"؟
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="mb-2 font-bold text-lg">تفاصيل الدورة:</p>
            <p>المدة: {course.duration} ساعة</p>
            <p>الفئة: {course.category}</p>
            <p className="text-primary font-bold">السعر: مجاناً</p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleFreeEnrollConfirm}
              className="bg-primary text-white"
            >
              تأكيد التسجيل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* مربع حوار الدفع للدورات المدفوعة */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              تفاصيل الدفع
            </DialogTitle>
            <DialogDescription className="text-center">
              الدورة التي اخترتها تتطلب دفع رسوم التسجيل
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="mb-2 font-bold text-lg">تفاصيل الدورة:</p>
            <p>الاسم: {course.title}</p>
            <p>المدة: {course.duration} ساعة</p>
            <p>الفئة: {course.category}</p>
            <p className="text-primary font-bold">السعر: {formatPrice(course.price)}</p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handlePaymentRedirect}
              className="bg-primary text-white"
            >
              الانتقال لصفحة الدفع
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
