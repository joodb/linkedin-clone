// 필요한 패키지 불러오기
import express from "express"; // Express 웹 프레임워크 불러오기
import dotenv from "dotenv"; // 환경변수 관리 패키지 불러오기
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";

import { connectDB } from "./lib/db.js";

// dotenv 설정 초기화
dotenv.config(); // .env 파일의 환경변수를 process.env로 로드

// Express 애플리케이션 생성
const app = express();
// 포트 설정
const PORT = process.env.PORT || 5001;

app.use(express.json()); // parse JSON request body
app.use("/api/v1/auth", authRoutes);
app.use(cookieParser());

// 서버 시작
app.listen(PORT, () => {
  // 서버가 시작되면 콘솔에 메시지 출력
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
