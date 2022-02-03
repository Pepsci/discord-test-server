const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "user" },
    content: String,
    chan: { type: Schema.Types.ObjectId, ref: "chan" },
  },
  { timestamps: true }
);

const messageModel = model("message", messageSchema);

module.exprots = messageModel;
