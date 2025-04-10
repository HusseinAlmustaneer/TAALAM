import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold mb-4">تعلّم</h3>
            <p className="text-neutral-400">منصة تعليمية مخصصة للسوق السعودي تقدم دورات تدريبية احترافية مع شهادات معتمدة</p>
            <div className="mt-4 flex space-x-4 space-x-reverse">
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-400 hover:text-white">
                  الرئيسية
                </Link>
              </li>
              <li>
                <a href="/#courses" className="text-neutral-400 hover:text-white">الدورات</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">عن المنصة</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">تواصل معنا</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white">سياسة الخصوصية</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">الفئات</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white">تقنية</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">تسويق</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">إدارة</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">تصميم</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">مهارات شخصية</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-envelope text-neutral-400 ml-2"></i>
                <a href="mailto:info@taallam.sa" className="text-neutral-400 hover:text-white">info@taallam.sa</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-neutral-400 ml-2"></i>
                <a href="tel:+966XXXXXXXXX" className="text-neutral-400 hover:text-white">+966 XX XXX XXXX</a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-neutral-400 ml-2"></i>
                <span className="text-neutral-400">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-700 text-center">
          <p className="text-neutral-400">&copy; {new Date().getFullYear()} تعلّم. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
