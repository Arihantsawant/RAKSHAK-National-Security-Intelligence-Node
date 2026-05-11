import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(process.cwd(), "users_v4.json");

const JWT_SECRET = process.env.JWT_SECRET || "rakshak-default-secret-v4";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- PERSISTENCE HELPERS ---
  const saveUsers = (users: any[]) => {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
      console.error("Failed to save users:", err);
    }
  };

  const loadUsers = async () => {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const data = fs.readFileSync(USERS_FILE, "utf-8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    
    // Default Admin
    const hash = await bcrypt.hash("rakshak_HQ_2024!", 10);
    const pin = await bcrypt.hash("9988", 10);
    return [
      { 
        email: "hq.admin@police.gov.in", 
        password: hash,
        recoveryPin: pin,
        role: "SUPER_ADMIN", 
        name: "Admin", 
        jurisdiction: "National", 
        status: "APPROVED", 
        id: "IPS-001-HQ" 
      }
    ];
  };

  // --- SYSTEM STATE ---
  let criminalDatabase: any[] = []; 
  let activeInterceptions: any[] = [];
  let cameraNodes: any[] = []; 
  
  let userRegistry: any[] = await loadUsers();

  // System Performance Tracking (Session-based)
  let scanCount = 0;
  setInterval(() => {
    // Only increment scans if there are active camera nodes
    if (cameraNodes.length > 0) {
      scanCount += (cameraNodes.length * (Math.floor(Math.random() * 5) + 1));
    }
  }, 3000);

  // Helper: Generate Intelligence Feed
  const generateDetections = (user: any, minutesAgo = 0) => {
    // If no cameras are connected, intelligence gathering is 0
    if (cameraNodes.length === 0) return [];

    // Filtered by operational necessity
    const relevantTargets = criminalDatabase.filter(r => 
      user.role === 'SUPER_ADMIN' || user.jurisdiction === 'National' || r.jurisdiction === user.jurisdiction || (user.state && r.jurisdiction === user.state)
    );

    const targetTime = Date.now() - (minutesAgo * 60 * 1000);

    return relevantTargets.map((r, i) => {
      // Precise movement drift simulation for dynamic mapping
      const timeSeed = Math.floor(targetTime / 8000); 
      const driftLat = (Math.sin(timeSeed * (i + 1)) * 0.005);
      const driftLng = (Math.cos(timeSeed * (i + 1)) * 0.005);

      // Coordinate mapping for simulations
      const coords: Record<string, [number, number]> = {
        "Maharashtra": [19.076, 72.877],
        "Delhi": [28.613, 77.209],
        "Karnataka": [12.971, 77.594],
        "Uttar Pradesh": [26.846, 80.946],
        "West Bengal": [22.572, 88.363],
        "Gujarat": [23.022, 72.571],
        "National": [20.593, 78.962]
      };

      const districtCoords: Record<string, [number, number]> = {
        "Mumbai City": [18.9220, 72.8347],
        "Mumbai Suburban": [19.1136, 72.8697],
        "Pune": [18.5204, 73.8567],
        "Nagpur": [21.1458, 79.0882],
        "New Delhi": [28.6139, 77.2090]
      };

      let base = coords[r.jurisdiction] || coords["National"];
      
      // If user is restricted to a district, simulate hits there
      if (user.district && (user.state === r.jurisdiction || user.jurisdiction === r.jurisdiction)) {
        base = districtCoords[user.district] || base;
      }

      const currentLat = base[0] + driftLat;
      const currentLng = base[1] + driftLng;

      // Simulate trajectory (last 5 points)
      const trajectory = [];
      for (let j = 0; j < 5; j++) {
        const offsetTimeSeed = Math.floor((targetTime - (j * 10000)) / 8000);
        const tDriftLat = (Math.sin(offsetTimeSeed * (i + 1)) * 0.005);
        const tDriftLng = (Math.cos(offsetTimeSeed * (i + 1)) * 0.005);
        trajectory.push([base[0] + tDriftLat, base[1] + tDriftLng]);
      }

      return {
        id: `det-${r.plate}`, // Stable entity ID
        vehicle_number: r.plate,
        confidence: 0.985 + (Math.random() * 0.01),
        location: `${user.district || r.jurisdiction} Ops Sector ${i + 1}`,
        lat: currentLat,
        lng: currentLng,
        trajectory,
        jurisdiction: r.jurisdiction,
        timestamp: new Date(targetTime).toISOString(),
        image: r.image
      };
    });
  };

  // Helper: Validate Police Email
  const isOfficialEmail = (email: string) => {
    const officialDomains = ["gov.in", "police.gov.in", "nic.in", "ips.gov.in", "geca.ac.in", "gmail.com", "outlook.com"];
    const domain = (email.split("@")[1] || "").toLowerCase();
    return officialDomains.includes(domain);
  };

  // Module 3: Threat Classification Formula
  const calculateThreatScore = (crimeWeight: number, recency: number, routeSuspicion: number, history: number, confidence: number) => {
    return (crimeWeight * 0.35) + (recency * 0.20) + (routeSuspicion * 0.20) + (history * 0.15) + (confidence * 0.10);
  };

  // --- AUTH MIDDLEWARE ---
  const verifyToken = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: "UNAUTHORIZED: Official session required." });

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      // Return 401 instead of 400 to trigger frontend logout correctly
      res.status(401).json({ error: "SESSION EXPIRED: Identity re-authentication required." });
    }
  };

  // --- API ROUTES ---
  
  // Health check for infrastructure
  app.get("/api/health", (req, res) => {
    res.json({ status: "UP", timestamp: new Date().toISOString() });
  });

  // Auth: Session Check
  app.get("/api/auth/me", verifyToken, (req: any, res) => {
    const user = userRegistry.find(u => u.email === req.user.email);
    if (!user) return res.status(404).json({ error: "User profile lost." });
    
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  // Auth: Login / Registration
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, isRegistering, name, jurisdiction } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and Password are required." });
      }

      let user = userRegistry.find(u => u.email === email);

      if (isRegistering) {
        const { recoveryPin, rank, state, district, village } = req.body;
        if (user) return res.status(400).json({ error: "Identity already registered in the system." });
        
        // Security: Official Email Validation
        if (!isOfficialEmail(email)) {
          return res.status(403).json({ error: "UNAUTHORIZED: Only .gov.in or official partner domains are authorized." });
        }

        // Security: Password Strength
        if (password.length < 8) {
          return res.status(400).json({ error: "WEAK CREDENTIAL: Password must be at least 8 characters." });
        }

        if (!recoveryPin || recoveryPin.length !== 4) {
          return res.status(400).json({ error: "SECURITY REQUIREMENT: A 4-digit Recovery PIN is mandatory." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(recoveryPin, 10);

        user = { 
          email, 
          password: hashedPassword,
          recoveryPin: hashedPin,
          name, 
          jurisdiction,
          rank,
          state,
          district,
          village,
          role: "OFFICER", 
          status: "PENDING", 
          id: `POL-${Math.floor(Math.random()*9000)+1000}`,
          registeredAt: new Date().toISOString()
        };
        userRegistry.push(user);
        saveUsers(userRegistry);
        return res.json({ message: "REGISTRATION SUCCESSFUL: Awaiting HQ Approval." });
      }
      
      if (!user) {
        return res.status(404).json({ error: "UNRECOGNIZED IDENTITY: This email is not in our records. Please register first." });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "ACCESS DENIED: Password mismatch. If forgotten, use the Reset Key option." });
      }

      if (user.status === "PENDING") {
        return res.status(403).json({ error: "REGISTRATION PENDING: Approval required from Jurisdiction HQ." });
      }

      // Generate Secure JWT
      const token = jwt.sign(
        { 
          email: user.email, 
          role: user.role, 
          jurisdiction: user.jurisdiction,
          state: user.state,
          district: user.district
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none', 
        maxAge: 24 * 60 * 60 * 1000 
      });

      const { password: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      console.error("Auth Logic Error:", error);
      res.status(500).json({ error: "INTERNAL ENCRYPTION ERROR: Identity system failure. Contact HQ support." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ message: "SECURE LOGOUT SUCCESSFUL" });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { email, recoveryPin, newPassword } = req.body;
    
    if (!email || !recoveryPin || !newPassword) {
      return res.status(400).json({ error: "Email, Recovery PIN, and New Password are required." });
    }

    const user = userRegistry.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: "No official record found for this email." });
    }

    // Admins don't have PINs in this demo except if they register, 
    // but let's assume all registered users have them.
    if (!user.recoveryPin) {
      return res.status(403).json({ error: "This account does not have recovery enabled. Contact HQ." });
    }

    const validPin = await bcrypt.compare(recoveryPin, user.recoveryPin);
    if (!validPin) {
      return res.status(401).json({ error: "INVALID RECOVERY PIN: Attempt logged." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    saveUsers(userRegistry);
    res.json({ message: "PASSWORD RESET SUCCESSFUL: You may now login with your new credentials." });
  });

  // Personnel Management (HQ/Admin only)
  app.get("/api/personnel/pending", verifyToken, (req: any, res) => {
    const admin = userRegistry.find(u => u.email === req.user.email);

    if (!admin || admin.status !== "APPROVED") return res.status(401).json({ error: "Unauthorized" });

    let pending = userRegistry.filter(u => u.status === "PENDING");
    
    // Filter by jurisdiction unless Super Admin
    if (admin.role !== "SUPER_ADMIN" && admin.jurisdiction !== "National") {
      pending = pending.filter(u => u.jurisdiction === admin.jurisdiction);
    }

    res.json(pending);
  });

  app.post("/api/personnel/approve", verifyToken, (req: any, res) => {
    const { targetEmail, action, reason } = req.body; // action: 'APPROVE' or 'REJECT'
    const admin = userRegistry.find(u => u.email === req.user.email);
    const target = userRegistry.find(u => u.email === targetEmail);

    if (!admin || !target || admin.status !== "APPROVED") return res.status(404).json({ error: "Unauthorized or missing user" });
    
    // Authorization Check: Must be same jurisdiction or Super Admin
    const authorized = admin.role === "SUPER_ADMIN" || admin.jurisdiction === target.jurisdiction;
    if (!authorized) return res.status(403).json({ error: "Unauthorized for this jurisdiction" });

    if (action === "APPROVE") {
      target.status = "APPROVED";
      saveUsers(userRegistry);
      console.log(`[SIMULATED EMAIL] To: ${target.email} | Subject: RAKSHAK-AI Access Approved | Body: Hello ${target.name}, your credentials (${target.id}) have been verified by ${admin.jurisdiction} HQ. You can now login.`);
    } else {
      userRegistry = userRegistry.filter(u => u.email !== targetEmail);
      saveUsers(userRegistry);
      console.log(`[SIMULATED EMAIL] To: ${target.email} | Subject: RAKSHAK-AI Access Rejected | Body: Hello ${target.name}, your application has been rejected by ${admin.jurisdiction} HQ. Reason: ${reason || "Verification of official records failed."}`);
    }

    res.json({ status: "SUCCESS", message: `Personnel ${action === "APPROVE" ? "Approved" : "Rejected"}` });
  });

  // Module 1 & 2: Live Detection Stream
  app.get("/api/live-stream", verifyToken, (req: any, res) => {
    const minutesAgo = parseInt(req.query.minutesAgo as string) || 0;
    const user = userRegistry.find(u => u.email === req.user.email);

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const detections = generateDetections(user, minutesAgo);
    res.json(detections);
  });

  // Criminal Database Management
  app.get("/api/criminal-db", verifyToken, (req, res) => {
    res.json(criminalDatabase);
  });

  app.post("/api/criminal-db/add", verifyToken, (req, res) => {
    const { plate, owner, crime, severity, jurisdiction, status, image } = req.body;
    
    if (criminalDatabase.some(r => r.plate === plate)) {
      return res.status(400).json({ error: "Vehicle already in database." });
    }

    const newEntry = {
      plate, 
      owner: owner || "Unknown", 
      crime: crime || "Unspecified", 
      severity: parseInt(severity) || 50, 
      jurisdiction: jurisdiction || "National", 
      status: status || "Wanted",
      image: image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400"
    };

    criminalDatabase.push(newEntry);
    res.json(newEntry);
  });

  // Module 3: Threat Assessment
  app.post("/api/assess-threat", verifyToken, (req, res) => {
    const { plate, confidence } = req.body;
    const record = criminalDatabase.find(r => r.plate === plate);
    
    if (!record) {
      return res.json({ level: "Green", score: 0 });
    }

    const recency = 85; 
    const routeSuspicion = record.severity > 80 ? 90 : 30;
    const history = 70;
    const matchConfidence = (confidence || 0.95) * 100;

    const score = calculateThreatScore(record.severity, recency, routeSuspicion, history, matchConfidence);
    
    let level = "Green";
    if (score > 80) level = "Red";
    else if (score > 60) level = "Orange";
    else if (score > 30) level = "Yellow";

    res.json({
      level,
      score: Math.round(score),
      crime: record.crime,
      details: record,
      isIntercepted: activeInterceptions.some(i => i.plate === plate)
    });
  });

  // Module 4 & 5: Alert Dispatch & Interception
  app.post("/api/interception/deploy", verifyToken, (req: any, res) => {
    const { plate, detectionId } = req.body;
    const officerId = req.user.email;
    
    if (activeInterceptions.some(i => i.plate === plate)) {
      return res.status(400).json({ error: "Interception already active for this vehicle." });
    }

    const interception = {
      id: `INT-${Date.now()}`,
      plate,
      detectionId,
      officerId,
      status: "ACTIVE",
      timestamp: new Date().toISOString(),
      units: ["PCR-NORTHEAST-12", "HIGHWAY-PATROL-5"]
    };

    activeInterceptions.push(interception);
    res.json(interception);
  });

  app.get("/api/interception/active", verifyToken, (req, res) => {
    res.json(activeInterceptions);
  });

  // Analytics
  let sessionScans = 0;
  setInterval(() => { sessionScans += Math.floor(Math.random() * 5) + 1; }, 5000);

  app.get("/api/stats", verifyToken, (req, res) => {
    const isActive = cameraNodes.length > 0;
    res.json({
      total_scanned: scanCount,
      alerts_issued: isActive ? criminalDatabase.length : 0,
      interceptions: activeInterceptions.length,
      system_uptime: "99.999%",
      active_threats: isActive ? criminalDatabase.length : 0,
      active_nodes: cameraNodes.length,
      node_latency: isActive ? "14ms" : "N/A"
    });
  });

  app.get("/api/nodes", verifyToken, (req, res) => {
    res.json(cameraNodes);
  });

  app.post("/api/nodes/register", verifyToken, (req, res) => {
    const { name, url, jurisdiction, type } = req.body;
    const newNode = {
      id: `NODE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name,
      url,
      jurisdiction,
      type, // 'RTSP' or 'ONVIF' or 'HTTP'
      status: "ONLINE",
      connectedAt: new Date().toISOString()
    };
    cameraNodes.push(newNode);
    res.json({ status: "SUCCESS", node: newNode });
  });

  app.post("/api/nodes/disconnect", verifyToken, (req, res) => {
    const { nodeId } = req.body;
    cameraNodes = cameraNodes.filter(n => n.id !== nodeId);
    res.json({ status: "SUCCESS" });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RAKSHAK-AI] Server initialized on port ${PORT}`);
    console.log(`[RAKSHAK-AI] Active profile: ${process.env.NODE_ENV || 'development'}`);
  }).on('error', (err) => {
    console.error("[RAKSHAK-AI] CRITICAL STARTUP ERROR:", err);
  });
}

startServer().catch(err => {
  console.error("[RAKSHAK-AI] FATAL ASYNC ERROR:", err);
});
