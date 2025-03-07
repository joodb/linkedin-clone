import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
  try {
    const notification = await Notification.find({
      recipient: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content images");

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error in getUserNotifications: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const notificationId = req.params.id;
  try {
    // 특정 ID의 알림을 찾아 읽음 상태로 업데이트
    // 1. _id가 notificationId와 일치하고
    // 2. recipient가 현재 로그인한 사용자(req.user._id)와 일치하는 알림만 업데이트
    // 3. { new: true }로 업데이트 후의 문서를 반환받음
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    console.error("Error in markNotificationAsRead: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;

  try {
    await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleteNotification: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};
