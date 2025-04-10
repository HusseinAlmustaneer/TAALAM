import { Course } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type CourseCardProps = {
  course: Course;
  onEnroll?: (courseId: number) => void;
  isEnrolling?: boolean;
};

export default function CourseCard({ course, onEnroll, isEnrolling }: CourseCardProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const formatPrice = (price: number | null) => {
    if (price === null) return "مجاناً";
    return `${price} ريال`;
  };
  
  const handleCourseDetails = (e: React.MouseEvent, courseId: number) => {
    e.preventDefault();
    setLocation(`/course-details/${courseId}`);
  };

  return (
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
              onEnroll ? (
                <Button
                  onClick={() => onEnroll(course.id)}
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
  );
}
