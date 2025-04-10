import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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
          الرئيسية
        </Link>
        <a href="/#courses" onClick={onClose} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100">
          الدورات
        </a>
        <a href="#" onClick={onClose} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100">
          عن المنصة
        </a>
        <a href="#" onClick={onClose} className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-primary hover:bg-neutral-100">
          تواصل معنا
        </a>
        <div className="mt-3 space-y-2">
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard"
                className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={onClose}
              >
                لوحة التحكم
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full text-neutral-700 hover:text-red-600 hover:border-red-600"
              >
                <i className="fas fa-sign-out-alt ml-2"></i>
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
              <Link href="/auth?tab=register">
                <a onClick={onClose} className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  إنشاء حساب
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
