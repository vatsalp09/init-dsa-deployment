import swaggerUIPath from "swagger-ui-express";
import swaggerjsonFilePath from "./docs/swagger.json" with { type: "json" };

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

const app = express();
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
  res.send("Welcome to Init DSA Deployment Phase");
})
app.use("/api/v1/auth", authRoutes);
app.use("/api/V1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`)
})
