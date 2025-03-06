import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// 보호된 라우트(protected route)에 대한 인증을 처리하는 함수
export const protectRoute = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // 디버깅용

    // 쿠키에서 정확한 이름으로 토큰 가져오기
    const token = req.cookies["jwt-linkedIn"]; // 객체 속성으로 접근

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 사용자 정보 가져오기
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user; // req 객체에 user 정보 추가
    next(); // 미들웨어나 라우트 핸들러로 제어를 넘깁니다
  } catch (error) {
    console.error("Error in ProtectRoute: ", error.message);
    res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};
