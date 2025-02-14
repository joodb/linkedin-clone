import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 보호된 라우트(protected route)에 대한 인증을 처리하는 함수
export const protectRoute = async (req, res, next) => {
  try {
    // JWT 토큰을 쿠키에서 추출
    const token = req.cookies("jwt-linkedIn");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Not authorized" });
    }

    // JWT를 환경변수에 저장된 시크릿 키로 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // 검증된 토큰에서 userId를 추출하여 DB에서 해당 사용자를 찾기 (비밀번호 필드 제외)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // 요청 객체에 사용자 정보 저장
    next(); // 미들웨어나 라우트 핸들러로 제어를 넘깁니다
  } catch (error) {
    console.log("Error in ProtectRoute: middleware", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
