const express = require("express");
const router = express.Router();
const chanModel = require("./../models/chan.model");
const Message = require("../models/message.model");

// this route is prefixed with chan !!

router.get("/", async (req, res, next) => {
  try {
    const chansList = await chanModel.find().populate("owner");
    res.status(200).json(chansList);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newChan = await chanModel.create(req.body);
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
