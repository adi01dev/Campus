import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import { PORT } from './config';
import adminRoutes from './routes/admin';
import facultyRoutes from './routes/faculty';
import queryRoutes from './routes/queryRoutes';
import facultyAttendanceRoutes from "./routes/facultyAttendance";
import studentAttendanceRoutes from "./routes/studentAttendance";
import MoURoutes from './routes/mouRoutes'; 
import path from "path";
import materialRoutes from "./routes/material.routes";
import assignmentRoutes from "./routes/assignment.routes";

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());

// ✅ CORS FIX
app.use(
  cors({
    origin: ['http://localhost:8080'], // your frontend URL(s)
    credentials: true,
  })
);


app.use('/api/faculty', facultyRoutes);



app.use("/api/faculty/attendance", facultyAttendanceRoutes);
app.use("/api/student/attendance", studentAttendanceRoutes);



app.use('/api/admin', adminRoutes);

app.use("/api/queries", queryRoutes);

app.get("/", (_, res) => {
  res.send("Student-Faculty Query API 🚀");
});

app.use("/api/mou", MoURoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});


// routes
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/assignments", assignmentRoutes);

app.use("/api/materials", materialRoutes);

app.use("/api/mou", MoURoutes);

app.use("/api/queries", queryRoutes);

app.get("/", (_req, res) => res.send("CampusConnect Backend Running"));


app.use('/api/auth', authRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
