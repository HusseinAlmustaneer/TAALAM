import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Award, Settings, LogOut } from "lucide-react";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
};

export default function MobileMenu({ isOpen, onClose, isLoggedIn, onLogout }: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden" id="mobile-menu">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link 
          href="/" 
          className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
          onClick={onClose}
        >
          الرأيسية
        </Link>
        <Link 
          href="/courses" 
          onClick={onClose} 
          className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
        >
          الدورات
        </Link>
        <Link 
          href="/about" 
          onClick={onClose} 
          className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
        >
          عن المنصة
        </Link>
        <Link 
          href="/contact" 
          onClick={onClose} 
          className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100"
        >
          تواصل معنا
        </Link>
        <div className="mt-3 space-y-2">
          {isLoggedIn ? (
            <>
              <div className="border rounded-md p-2 bg-gray-50 mb-3">
                <Link 
                  href="/profile"
                  className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  onClick={onClose}
                >
                  <User className="ml-2 h-5 w-5" />
                  معلومات الحساب
                </Link>
                
                <Link 
                  href="/dashboard"
                  className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  onClick={onClose}
                >
                  <BookOpen className="ml-2 h-5 w-5" />
                  دوراتي
                </Link>
                
                <Link 
                  href="/dashboard?tab=certificates"
                  className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  onClick={onClose}
                >
                  <Award className="ml-2 h-5 w-5" />
                  شهاداتي
                </Link>
                
                <Link 
                  href="/profile?tab=security"
                  className="w-full flex items-center px-4 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                  onClick={onClose}
                >
                  <Settings className="ml-2 h-5 w-5" />
                  إعدادات الأمان
                </Link>
              </div>
              
              <Link 
                href="/dashboard"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                <BookOpen className="ml-2 h-5 w-5" />
                إستكمال الدورات
              </Link>
              
              <Button
                variant="outline"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex justify-center items-center text-red-600 hover:text-red-700 hover:border-red-600 hover:bg-red-50"
              >
                <LogOut className="ml-2 h-5 w-5" />
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link 
                href="/auth"
                className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                تسجيل الدخول
              </Link>
              <Link 
                href="/auth?tab=register"
                className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
