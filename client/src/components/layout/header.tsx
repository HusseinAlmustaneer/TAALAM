import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "@/components/ui/mobile-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-primary font-bold text-2xl">
              تعلّم
            </Link>
            <nav className="hidden md:mr-10 md:flex md:space-x-8 md:space-x-reverse">
              <Link 
                href="/" 
                className={`${location === "/" ? "text-primary" : "text-neutral-700 hover:text-primary"} px-3 py-2 text-sm font-medium`}
              >
                الرئيسية
              </Link>
              <a href="/#courses" className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium">
                الدورات
              </a>
              <a href="#" className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium">
                عن المنصة
              </a>
              <a href="#" className="text-neutral-700 hover:text-primary px-3 py-2 text-sm font-medium">
                تواصل معنا
              </a>
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="hidden md:flex space-x-4 space-x-reverse">
                <Link 
                  href="/dashboard"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${location === "/dashboard" ? "text-white bg-primary" : "text-primary hover:bg-neutral-100"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  لوحة التحكم
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-neutral-700 hover:text-red-600 hover:border-red-600"
                >
                  {logoutMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs ml-2"></span>
                      جاري تسجيل الخروج...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-out-alt ml-2"></i>
                      تسجيل الخروج
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4 space-x-reverse">
                <Link 
                  href="/auth"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/auth?tab=register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}
            <button
              type="button"
              className="md:hidden bg-white p-2 rounded-md text-neutral-700 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={toggleMobileMenu}
              aria-expanded="false"
            >
              <span className="sr-only">فتح القائمة</span>
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isLoggedIn={!!user}
        onLogout={handleLogout}
      />
    </header>
  );
}
