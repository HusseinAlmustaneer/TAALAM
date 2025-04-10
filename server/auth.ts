import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, registerSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "taallamplatformsecret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Register request received:", req.body);
      
      // التحقق من البيانات باستخدام مخطط التسجيل
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        console.log("Validation errors:", result.error.format());
        return res.status(400).json({ 
          success: false,
          errors: result.error.format() 
        });
      }

      // استخراج البيانات المدخلة بعد التحقق منها
      const { username, email, password, firstName, lastName } = result.data;
      
      console.log(`Processing registration for user: ${username}, email: ${email}`);

      // التحقق من عدم وجود مستخدم بنفس اسم المستخدم
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        console.log(`Username ${username} already exists`);
        return res.status(400).json({ 
          success: false,
          message: "اسم المستخدم موجود بالفعل",
          field: "username"
        });
      }

      // التحقق من عدم وجود مستخدم بنفس البريد الإلكتروني
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        console.log(`Email ${email} already exists`);
        return res.status(400).json({ 
          success: false,
          message: "البريد الإلكتروني مستخدم بالفعل",
          field: "email"
        });
      }

      // تشفير كلمة المرور وإنشاء المستخدم
      const hashedPassword = await hashPassword(password);
      console.log("Password hashed, creating user record");
      
      const user = await storage.createUser({
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      console.log(`User created successfully with ID: ${user.id}`);

      // تسجيل الدخول تلقائيًا بعد إنشاء الحساب
      req.login(user, (err) => {
        if (err) {
          console.error("Error during automatic login:", err);
          return next(err);
        }
        
        // إزالة كلمة المرور من الاستجابة
        const { password, ...userWithoutPassword } = user;
        console.log("Registration complete, user logged in");
        res.status(201).json({
          success: true,
          user: userWithoutPassword
        });
      });
    } catch (error: any) {
      console.error("Error during registration:", error);
      res.status(500).json({ 
        success: false,
        message: error.message || "حدث خطأ أثناء إنشاء الحساب"
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received:", { username: req.body.username });
    
    // التحقق من بيانات تسجيل الدخول باستخدام مخطط التحقق
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      console.log("Login validation errors:", result.error.format());
      return res.status(400).json({ 
        success: false, 
        errors: result.error.format() 
      });
    }
    
    passport.authenticate("local", (err: Error, user: SelectUser) => {
      if (err) {
        console.error("Error during authentication:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("Authentication failed: Invalid credentials");
        return res.status(401).json({ 
          success: false, 
          message: "اسم المستخدم أو كلمة المرور غير صحيحة" 
        });
      }

      console.log(`User ${user.username} authenticated successfully`);
      
      req.login(user, (err) => {
        if (err) {
          console.error("Error during login session creation:", err);
          return next(err);
        }
        
        // إزالة كلمة المرور من الاستجابة
        const { password, ...userWithoutPassword } = user;
        console.log("Login successful, session created");
        
        res.json({
          success: true,
          user: userWithoutPassword
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      console.log("Unauthenticated request to /api/user");
      return res.status(401).json({ 
        success: false,
        message: "غير مصرح" 
      });
    }
    
    // إزالة كلمة المرور من الاستجابة
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    console.log(`User data requested for ${userWithoutPassword.username}`);
    
    res.json({
      success: true,
      user: userWithoutPassword
    });
  });
}
