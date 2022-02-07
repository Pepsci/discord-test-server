const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
  },
  chans: [{ type: Schema.Types.ObjectId, ref: "chan" }],
  isConnected: {
    type: Boolean,
    default: false,
  },
  savedMessages: [{ type: Schema.Types.ObjectId, ref: "message" }],
});

const userModel = model("user", userSchema);

module.exports = userModel;
