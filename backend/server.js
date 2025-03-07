// 필요한 패키지 불러오기
import express from "express"; // Express 웹 프레임워크 불러오기
import dotenv from "dotenv"; // 환경변수 관리 패키지 불러오기
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";

import { connectDB } from "./lib/db.js";

// dotenv 설정 초기화
dotenv.config(); // .env 파일의 환경변수를 process.env로 로드

// Express 애플리케이션 생성
const app = express();
// 포트 설정
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: `5mb` })); // HTTP 요청의 본문(body) 크기 제한
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

// 서버 시작
app.listen(PORT, () => {
  // 서버가 시작되면 콘솔에 메시지 출력
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
