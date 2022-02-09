const { model, Schema } = require("mongoose");

const chanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "user" }],
  owner: { type: Schema.Types.ObjectId, ref: "user" },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
  },
});

const chanModel = model("chan", chanSchema);

module.exports = chanModel;
