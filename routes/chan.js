const express = require("express");
const router = express.Router();
const chanModel = require("./../models/chan.model");
const Message = require("../models/message.model");
const uploader = require("./../config/cloudinary");

// this route is prefixed with chan !!

router.get("/", async (req, res, next) => {
  try {
    const chansList = await chanModel.find().populate("owner");
    console.log(chansList);
    res.status(200).json(chansList);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { name, owner } = req.body;
  const image = `https://avatars.dicebear.com/api/identicon/${name}.svg`;
  try {
    const newChan = await chanModel.create({ name, owner, image });
    res.status(201).json(newChan);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);
    const chan = await chanModel.findById(req.params.id).populate("owner");
    res.status(200).json(chan);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", uploader.single("image"), async (req, res, next) => {
  const image = req.file?.path || undefined;

  try {
    const updateChan = await chanModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image },
      { new: true }
    );
    res.status(200).json(updateChan);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleteChan = await chanModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deleteChan);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/messages", async (req, res, next) => {
  try {
    const prevMessages = await Message.find({ chan: req.params.id }).populate(
      "author"
    );
    res.status(200).json(prevMessages);
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error" });
    next(e);
  }
});

module.exports = router;
