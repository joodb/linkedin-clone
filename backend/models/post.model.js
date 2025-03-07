import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      // 게시물 작성자 - User 컬렉션의 ObjectId를 참조
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String },
    image: { type: String },
    // 좋아요를 누른 사용자들의 배열 - User 컬렉션의 ObjectId 배열
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 댓글 배열 - 중첩 문서(Subdocument) 형태로 저장
    comments: [
      {
        // 댓글 내용
        content: { type: String },

        // 댓글 작성자 - User 컬렉션의 ObjectId 참조
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        // 댓글 작성 시간 - 기본값으로 현재 시간이 자동 설정됨
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  // timestamps: true 옵션으로 createdAt, updatedAt 필드가 자동으로 추가됨
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
