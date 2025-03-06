import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestedConnection = async (req, res) => {
  try {
    const currentUsers = await User.find(req.user._id).select("connections");

    const suggestedUsers = await User.find({
      _id: { $ne: req.user._id, $nin: currentUsers.connections },
    })
      .select("name username profilePicture headline")
      .limit(3);

    res.json(suggestedUsers);
  } catch (error) {
    console.error("Error in getSuggestedConnection: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getPublicProfile: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowFields = [
      "name",
      "username",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = allowFields.reduce((acc, field) => {
      if (req.body[field]) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    // profile, banner img => cloudinary
    // 프로필 이미지가 요청 데이터에 포함되어 있는지 확인
    if (req.body.profilePicture) {
      // Cloudinary 서비스를 사용하여 이미지 업로드
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      // 업로드 성공 후 반환된 보안 URL을 업데이트 데이터에 저장
      updatedData.profilePicture = result.secure_url;
    }
    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updatedData.bannerImg = result.secure_url;
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id }, // 올바른 형식으로 _id를 지정
      { $set: updatedData }, // 업데이트할 데이터
      { new: true } // 옵션: 업데이트된 문서를 반환 (true가 아니면 업데이트 전 문서를 반환)
    ).select("-password");

    console.log("req.user._id: ", req.user._id);
    res.json(user);
  } catch (error) {
    console.error("Error in updateProfile: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
