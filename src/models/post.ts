import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    subject: { type: String, default: Date.now },
  },
  { versionKey: false }
);

export const PostModel = mongoose.model("posts", PostSchema);
