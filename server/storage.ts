import { 
  users, type User, type InsertUser,
  courses, type Course, type InsertCourse,
  enrollments, type Enrollment, type InsertEnrollment,
  certificates, type Certificate, type InsertCertificate
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { randomUUID } from "crypto";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserEmail(userId: number, email: string): Promise<void>;
  updateUserPhone(userId: number, phone: string): Promise<void>;
  updateUserPassword(userId: number, password: string): Promise<void>;
  
  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  // Enrollment operations
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment>;
  completeEnrollment(id: number, certificateId: string): Promise<Enrollment>;
  
  // Certificate operations
  getCertificate(id: number): Promise<Certificate | undefined>;
  getUserCertificates(userId: number): Promise<Certificate[]>;
  getCertificateByNumber(number: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private enrollments: Map<number, Enrollment>;
  private certificates: Map<number, Certificate>;
  
  sessionStore: session.SessionStore;

  private userIdCounter: number;
  private courseIdCounter: number;
  private enrollmentIdCounter: number;
  private certificateIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.enrollments = new Map();
    this.certificates = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.enrollmentIdCounter = 1;
    this.certificateIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize some sample courses
    this.initializeCourses();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, phone: null };
    this.users.set(id, user);
    return user;
  }

  async updateUserEmail(userId: number, email: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, email };
    this.users.set(userId, updatedUser);
  }

  async updateUserPhone(userId: number, phone: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, phone };
    this.users.set(userId, updatedUser);
  }

  async updateUserPassword(userId: number, password: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, password };
    this.users.set(userId, updatedUser);
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.category === category,
    );
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Enrollment methods
  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      (enrollment) => enrollment.userId === userId && enrollment.courseId === courseId,
    );
  }

  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.userId === userId,
    );
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentIdCounter++;
    const enrollment: Enrollment = { 
      ...insertEnrollment, 
      id, 
      progress: 0, 
      completed: false, 
      enrolledAt: new Date(),
      certificateId: undefined,
      completedAt: undefined
    };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    
    const updatedEnrollment = { 
      ...enrollment, 
      progress,
      completed: progress === 100,
      completedAt: progress === 100 ? new Date() : enrollment.completedAt
    };
    
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  async completeEnrollment(id: number, certificateId: string): Promise<Enrollment> {
    const enrollment = this.enrollments.get(id);
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    
    const updatedEnrollment = { 
      ...enrollment, 
      completed: true,
      progress: 100,
      certificateId,
      completedAt: new Date()
    };
    
    this.enrollments.set(id, updatedEnrollment);
    return updatedEnrollment;
  }

  // Certificate methods
  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async getUserCertificates(userId: number): Promise<Certificate[]> {
    return Array.from(this.certificates.values()).filter(
      (certificate) => certificate.userId === userId,
    );
  }
  
  async getCertificateByNumber(number: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      (certificate) => certificate.certificateNumber === number,
    );
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateIdCounter++;
    const certificate: Certificate = { 
      ...insertCertificate, 
      id,
      issueDate: new Date()
    };
    this.certificates.set(id, certificate);
    return certificate;
  }
  
  private initializeCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        title: "برمجة تطبيقات الويب",
        description: "تعلم أساسيات تطوير تطبيقات الويب باستخدام HTML وCSS وJavaScript",
        category: "تقنية",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        duration: 12,
        price: null // Free
      },
      {
        title: "التسويق الرقمي",
        description: "استراتيجيات التسويق الرقمي الفعالة لبناء علامتك التجارية",
        category: "تسويق",
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
        duration: 8,
        price: 199
      },
      {
        title: "مهارات إدارة المشاريع",
        description: "تعلم كيفية إدارة المشاريع بكفاءة باستخدام منهجيات حديثة",
        category: "إدارة",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40",
        duration: 10,
        price: 249
      },
      {
        title: "مهارات العرض والتقديم",
        description: "تعلم فن الإلقاء وتقديم العروض بثقة أمام الجمهور",
        category: "مهارات شخصية",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
        duration: 6,
        price: 149
      },
      {
        title: "تصميم واجهات المستخدم",
        description: "مبادئ وأساسيات تصميم واجهات المستخدم الجذابة وسهلة الاستخدام",
        category: "تصميم",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
        duration: 14,
        price: 199
      },
      {
        title: "أساسيات الذكاء الاصطناعي",
        description: "مقدمة في الذكاء الاصطناعي وتطبيقاته العملية",
        category: "تقنية",
        imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
        duration: 16,
        price: 299
      }
    ];
    
    // Add all courses
    sampleCourses.forEach(course => {
      this.createCourse(course);
    });
  }
}

export const storage = new MemStorage();
