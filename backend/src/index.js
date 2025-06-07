import swaggerUIPath from "swagger-ui-express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger JSON manually
const swaggerjsonFilePath = JSON.parse(
  await fs.readFile(path.join(__dirname, "./docs/swagger.json"), "utf-8")
);

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://initdsa.in",
  "https://www.initdsa.in",
  "https://init-dsa.vercel.app",
  "https://www.init-dsa.vercel.app",
  "https://init-dsa-deployment.vercel.app",
  "https://www.init-dsa-deployment.vercel.app",
  "https://testingdomainxyz.shop",
  "https://www.testingdomainxyz.shop"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));

app.get("/", (req, res) => {
  const frontendBase = "https://www.testingdomainxyz.shop";

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Init DSA API - Backend powering real-time code execution and structured DSA learning." />
      <title>🚀 Init DSA API</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f9f9f9;
          padding: 40px;
          line-height: 1.6;
          color: #222;
        }
        h2 {
          color: #1a73e8;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        li::before {
          content: "✅ ";
          margin-right: 6px;
        }
        a {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
        }
        a:hover {
          text-decoration: underline;
        }
        .status {
          margin-top: 20px;
          font-size: 16px;
        }
        .footer {
          margin-top: 32px;
          font-size: 17px;
        }
      </style>
    </head>
    <body>
      <h2>🚀 Welcome to the Init DSA API!</h2>
      <p>This backend powers the <strong>Init DSA</strong> platform — your intelligent companion for mastering Data Structures and Algorithms through live code execution and structured learning.</p>

      <p>🧩 <strong>Key Features:</strong></p>
      <ul>
        <li>User Authentication & Secure Session Management</li>
        <li>Curated Problem Sets with Difficulty Levels</li>
        <li>Real-Time Code Execution Engine</li>
        <li>Submission Tracking & Evaluation</li>
        <li>Playlist-based Learning Progress</li>
      </ul>

      <div class="status">
        🌐 <strong>Status:</strong> Live and Operational<br />
        📅 <strong>Uptime (GMT):</strong> <span id="gmt-time"></span><br />
        🕒 <strong>Uptime (IST):</strong> <span id="ist-time"></span><br />
        📌 <strong>Environment:</strong> ${process.env.NODE_ENV || "development"}
      </div>

      <div class="footer">
        ✨ Ready to take your coding skills to the next level? 
        <a href="${frontendBase}/signup" target="_blank">Create an account</a> or 
        <a href="${frontendBase}/login" target="_blank">log in</a> to start solving real DSA problems with live code execution and tracked progress.<br /><br />
        
        📖 Want to learn more? 
        <a href="${frontendBase}" target="_blank">Visit our website</a> and explore how Init DSA can help you build a strong programming foundation.<br /><br />

        💻🔍 <strong>Happy Coding!</strong>
      </div>

      <script>
        function updateTime() {
          const now = new Date();
          document.getElementById("gmt-time").textContent = now.toUTCString();
          document.getElementById("ist-time").textContent = now.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
          });
        }
        updateTime();
        setInterval(updateTime, 1000);
      </script>
    </body>
    </html>
  `);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(port, () => {
  const localIp = Object.values(os.networkInterfaces())
    .flat()
    .find((iface) => iface?.family === "IPv4" && !iface.internal)?.address;

  const isDev = process.env.NODE_ENV !== "production";
  const baseUrl = isDev
    ? `http://localhost:${port}`
    : process.env.RENDER_EXTERNAL_URL || process.env.BASE_URL || `http://${localIp}:${port}`;

  console.log(`🚀 Server is listening on port ${port}`);
  console.log(`📘 Open Swagger Document: ${baseUrl}/api-docs`);
});
