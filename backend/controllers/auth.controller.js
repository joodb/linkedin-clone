import User from "../models/user.model.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // 디버깅을 위한 로그 추가
    console.log("Received request body:", req.body);

    // 필드 유효성 검사
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // 암호화
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("jwt-linkedIn", token, {
      httpOnly: true, // JavaScript로 쿠키에 접근하는 것을 방지
      maxAge: 3 * 24 * 60 * 60 * 1000, // 쿠키 유효기간 (3일을 밀리초로 변환)
      sameSite: "strict", // 다른 사이트에서 쿠키를 전송하는 것을 방지
      secure: process.env.NODE_ENV === "production", // 중간자 공격(man-in-the-middle attack) 방지
    });

    res.status(201).json({ message: "User created successfully" });

    // TODO: send welcome email
  } catch (error) {
    console.log("Error in signup: ", error);
    res.status(500).json({
      message: "Error in signup",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const login = (req, res) => {
  res.send("login");
};

export const logout = (req, res) => {
  res.send("logout");
};
