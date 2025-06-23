import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import fs from "fs";
import path from "path";
import projectRoutes from "./routes/project.routes";
// import issueRoutes from "./routes/issue.routes";


dotenv.config();

const swaggerJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "config/swagger.json"), "utf8")
);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson, {
    swaggerOptions: {
      withCredentials: true,
    },
  })
);


app.use("/api/projects", projectRoutes);
// app.use("/api/issues", issueRoutes);



export default app;


