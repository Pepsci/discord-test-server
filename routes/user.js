const express = require("express");
const router = express.Router();
const userModel = require("./../models/user.model");
const { isAuthenticated } = require("./../middlewares/jwt.middleware");
// const { modelNames } = require("mongoose");
const uploader = require("./../config/cloudinary");
const jwt = require("jsonwebtoken");

// this route is prefixed with "/user"

// get the user info
router.get("/", isAuthenticated, async (req, res, next) => {
  console.log("token", req.payload);
  try {
    const user = await userModel.findById(req.payload._id);
    const userTofront = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };
    res.status(200).json(userTofront);
  } catch (error) {
    next(error);
  }
});

// delete the user account
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    console.log("deleted user is", deletedUser);
    res.status(200).json({ msg: "successfully deleted user account" });
  } catch (error) {
    next(error);
  }
});

// update user info
router.patch(
  "/:id",
  uploader.single("avatar"),
  isAuthenticated,
  async (req, res, next) => {
    const avatar = req.file?.path || undefined;
    console.log(req.file);
    console.log("what is avatar ?? ===> ", avatar);
    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          avatar: avatar,
        },
        { new: true }
      );

      const payload = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      };

      // à la place de payload, mettre le user sans le mdp
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });
      // renvoyer en front
      res.status(200).json({ payload, authToken });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
