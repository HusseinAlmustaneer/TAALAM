import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "@/components/ui/mobile-menu";
import { User, Settings, BookOpen, Award, LogOut } from "lucide-react";

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
              <div className="hidden md:flex items-center space-x-4 space-x-reverse">
                <Link 
                  href="/dashboard"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${location === "/dashboard" ? "text-white bg-primary" : "text-primary hover:bg-neutral-100"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  <BookOpen className="ml-2 w-4 h-4" />
                  دوراتي
                </Link>

                {/* قائمة المستخدم المنسدلة */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1">
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex cursor-pointer items-center">
                        <User className="ml-2 h-4 w-4" />
                        <span>معلومات الحساب</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex cursor-pointer items-center">
                        <BookOpen className="ml-2 h-4 w-4" />
                        <span>دوراتي</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard?tab=certificates" className="flex cursor-pointer items-center">
                        <Award className="ml-2 h-4 w-4" />
                        <span>شهاداتي</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=security" className="flex cursor-pointer items-center">
                        <Settings className="ml-2 h-4 w-4" />
                        <span>إعدادات الأمان</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      disabled={logoutMutation.isPending}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      {logoutMutation.isPending ? (
                        <>
                          <span className="ml-2 h-4 w-4 animate-spin">⏳</span>
                          <span>جاري تسجيل الخروج...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="ml-2 h-4 w-4" />
                          <span>تسجيل الخروج</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
