// ملف مخصص لتعاملات API المختلفة
import { apiRequest } from './queryClient';
import { config } from '../config';
import { Course, InsertUser, User } from '@shared/schema';

// دوال للتعامل مع المصادقة
export const authAPI = {
  // تسجيل الدخول
  login: async (username: string, password: string) => {
    const res = await apiRequest('POST', `${config.api.baseUrl}${config.api.endpoints.auth.login}`, { username, password });
    return await res.json() as Omit<User, 'password'>;
  },

  // تسجيل خروج
  logout: async () => {
    await apiRequest('POST', `${config.api.baseUrl}${config.api.endpoints.auth.logout}`);
  },

  // إنشاء حساب جديد
  register: async (userData: InsertUser) => {
    const res = await apiRequest('POST', `${config.api.baseUrl}${config.api.endpoints.auth.register}`, userData);
    return await res.json() as Omit<User, 'password'>;
  },

  // الحصول على معلومات المستخدم الحالي
  getCurrentUser: async () => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.auth.user}`);
    return await res.json() as Omit<User, 'password'>;
  }
};

// دوال للتعامل مع الدورات
export const coursesAPI = {
  // الحصول على جميع الدورات
  getAllCourses: async () => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.courses}`);
    return await res.json() as Course[];
  },

  // الحصول على دورة محددة حسب المعرف
  getCourse: async (id: number) => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.courses}/${id}`);
    return await res.json() as Course;
  },

  // الحصول على الدورات حسب الفئة
  getCoursesByCategory: async (category: string) => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.courses}/category/${category}`);
    return await res.json() as Course[];
  }
};

// دوال للتعامل مع التسجيل في الدورات
export const enrollmentsAPI = {
  // الحصول على جميع التسجيلات للمستخدم الحالي
  getUserEnrollments: async () => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.enrollments}`);
    return await res.json();
  },

  // التسجيل في دورة
  enrollInCourse: async (courseId: number) => {
    const res = await apiRequest('POST', `${config.api.baseUrl}${config.api.endpoints.enrollments}`, { courseId });
    return await res.json();
  },

  // تحديث التقدم في الدورة
  updateProgress: async (enrollmentId: number, progress: number) => {
    const res = await apiRequest('PATCH', `${config.api.baseUrl}${config.api.endpoints.enrollments}/${enrollmentId}/progress`, { progress });
    return await res.json();
  }
};

// دوال للتعامل مع الشهادات
export const certificatesAPI = {
  // الحصول على جميع شهادات المستخدم الحالي
  getUserCertificates: async () => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.certificates}`);
    return await res.json();
  },

  // الحصول على شهادة محددة حسب المعرف
  getCertificate: async (id: number) => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.certificates}/${id}`);
    return await res.json();
  },

  // التحقق من شهادة حسب الرقم
  verifyCertificate: async (certificateNumber: string) => {
    const res = await apiRequest('GET', `${config.api.baseUrl}${config.api.endpoints.certificates}/verify/${certificateNumber}`);
    return await res.json();
  }
};