import User from "../models/user.model.js";

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
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education",
    ];

    const updatedData = {};

    // TODO: check profile, banner img => cloudinary

    const _updatedData = allowFields.reduce((acc, field) => {
      if (req.body[field]) {
        acc[field] = req.body[field];
      }
      return acc;
    }, {});

    const user = await User.findOneAndUpdate(
      req.user._id, // 찾을 문서의 ID (현재 로그인한 사용자의 ID)
      { $set: updatedData }, // 업데이트할 데이터
      { new: true } // 옵션: 업데이트된 문서를 반환 (true가 아니면 업데이트 전 문서를 반환)
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Error in updateProfile: ", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
