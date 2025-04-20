import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

// Add types for Express session
declare global {
  namespace Express {
    // Define the User interface for authenticated requests
    interface User {
      id: number;
      username: string;
      email: string;
      name: string;
      role: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

// Password hashing and verification functions
export async function hashPassword(password: string) {
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

// Setup authentication
export function setupAuth(app: Express) {
  // Configure session
  const PgSession = connectPgSimple(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production"
    },
    store: new PgSession({
      pool,
      tableName: "sessions"
    })
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });

  // Authentication middleware
  app.use((req, res, next) => {
    // Add currentUser to all responses for easy access in templates
    res.locals.currentUser = req.user;
    next();
  });

  // Auth routes
  // Registration route
  app.post("/api/register", async (req, res) => {
    try {
      // Check if user exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await hashPassword(req.body.password);

      // Create user
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: req.body.role || "user" // Default role is user
      });

      // Auto login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login after registration failed" });
        }
        return res.status(201).json({ id: user.id, username: user.username, name: user.name, role: user.role });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Registration failed", error: error.message });
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: UserType, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed", error: loginErr.message });
        }
        return res.status(200).json({ id: user.id, username: user.username, name: user.name, role: user.role });
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed", error: err.message });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user route
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user;
    res.status(200).json({ 
      id: user.id, 
      username: user.username, 
      email: user.email,
      name: user.name, 
      role: user.role,
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
      socialLinks: user.socialLinks || {
        twitter: "",
        facebook: "",
        instagram: "",
        linkedin: ""
      }
    });
  });
  
  // Update user profile route
  app.patch("/api/user/profile", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const user = req.user;
      const { name, email, bio, avatarUrl, socialLinks } = req.body;
      
      // Update user in database
      await db.update(users)
        .set({ 
          name, 
          email,
          bio,
          avatarUrl,
          socialLinks: JSON.stringify(socialLinks)
        })
        .where(eq(users.id, user.id));
      
      // Return updated user information
      res.status(200).json({ 
        id: user.id, 
        username: user.username, 
        name: name, 
        email: email,
        role: user.role,
        bio: bio || "",
        avatarUrl: avatarUrl || "",
        socialLinks: socialLinks || {
          twitter: "",
          facebook: "",
          instagram: "",
          linkedin: ""
        }
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
  });

  // Create Admin user on setup if none exists
  createAdminUserIfNeeded();
}

// Helper function to create admin user if none exists
async function createAdminUserIfNeeded() {
  try {
    // Check if we already have an admin user
    const existingUser = await storage.getUserByUsername("miraclemarko");
    
    if (!existingUser) {
      console.log("Creating default admin user...");
      
      // Hash the password
      const hashedPassword = await hashPassword("Blokir123#");
      
      // Create the admin user
      await storage.createUser({
        username: "miraclemarko",
        password: hashedPassword,
        email: "admin@markoai.com",
        name: "Miracle Marko",
        role: "admin"
      });
      
      console.log("Default admin user created successfully.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Admin required middleware
export function isAdmin(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  return res.status(403).send("Admin access required");
}

// Function to check if a user has admin rights
export function userIsAdmin(user: Express.User | null | undefined): boolean {
  return !!user && user.role === "admin";
}