import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertEnrollmentSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Get all courses
  app.get("/api/courses", async (req, res, next) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });

  // Get a single course by ID
  app.get("/api/courses/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid course ID" });
      }

      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      next(error);
    }
  });

  // Get courses by category
  app.get("/api/courses/category/:category", async (req, res, next) => {
    try {
      const { category } = req.params;
      const courses = await storage.getCoursesByCategory(category);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  });

  // User enrollments
  app.get("/api/enrollments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const userId = req.user!.id;
      const enrollments = await storage.getUserEnrollments(userId);
      
      // Fetch course details for each enrollment
      const enrichedEnrollments = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourse(enrollment.courseId);
          return {
            ...enrollment,
            course,
          };
        })
      );

      res.json(enrichedEnrollments);
    } catch (error) {
      next(error);
    }
  });

  // Enroll in a course
  app.post("/api/enrollments", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const userId = req.user!.id;
      const result = insertEnrollmentSchema.safeParse({
        ...req.body,
        userId,
      });

      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }

      const { courseId } = result.data;

      // Check if course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Create enrollment
      const enrollment = await storage.createEnrollment({
        userId,
        courseId,
      });

      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  });

  // Update course progress
  app.patch("/api/enrollments/:id/progress", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid enrollment ID" });
      }

      const schema = z.object({
        progress: z.number().min(0).max(100),
      });

      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.format() });
      }

      const { progress } = result.data;

      // Get the enrollment
      const enrollments = await storage.getUserEnrollments(req.user!.id);
      const enrollment = enrollments.find(e => e.id === id);
      
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found or not authorized" });
      }

      // Update progress
      const updatedEnrollment = await storage.updateEnrollmentProgress(id, progress);

      // If progress is 100%, automatically generate a certificate
      if (progress === 100 && !updatedEnrollment.certificateId) {
        const certificateNumber = `${updatedEnrollment.courseId}-${randomUUID().substring(0, 8)}`;
        
        const certificate = await storage.createCertificate({
          userId: updatedEnrollment.userId,
          courseId: updatedEnrollment.courseId,
          certificateNumber,
        });

        // Update enrollment with certificate ID
        await storage.completeEnrollment(id, String(certificate.id));
      }

      res.json(updatedEnrollment);
    } catch (error) {
      next(error);
    }
  });

  // Get user certificates
  app.get("/api/certificates", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "غير مصرح" });
      }

      const userId = req.user!.id;
      const certificates = await storage.getUserCertificates(userId);
      
      // Fetch course details for each certificate
      const enrichedCertificates = await Promise.all(
        certificates.map(async (certificate) => {
          const course = await storage.getCourse(certificate.courseId);
          return {
            ...certificate,
            course,
          };
        })
      );

      res.json(enrichedCertificates);
    } catch (error) {
      next(error);
    }
  });

  // Get a specific certificate
  app.get("/api/certificates/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid certificate ID" });
      }

      const certificate = await storage.getCertificate(id);
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      // Check if user is authorized to view this certificate
      if (req.isAuthenticated() && req.user!.id !== certificate.userId) {
        return res.status(403).json({ message: "Not authorized to view this certificate" });
      }

      const course = await storage.getCourse(certificate.courseId);
      const user = await storage.getUser(certificate.userId);

      if (!course || !user) {
        return res.status(404).json({ message: "Course or user not found" });
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;

      res.json({
        ...certificate,
        course,
        user: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  });

  // Verify a certificate by number
  app.get("/api/certificates/verify/:number", async (req, res, next) => {
    try {
      const { number } = req.params;
      const certificate = await storage.getCertificateByNumber(number);
      
      if (!certificate) {
        return res.status(404).json({ 
          verified: false,
          message: "Certificate not found" 
        });
      }

      const course = await storage.getCourse(certificate.courseId);
      const user = await storage.getUser(certificate.userId);

      if (!course || !user) {
        return res.status(404).json({ 
          verified: false,
          message: "Course or user details not found" 
        });
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;

      res.json({
        verified: true,
        certificate: {
          ...certificate,
          course,
          user: userWithoutPassword,
        }
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
