const express = require("express");
const router = express.Router();
const chanModel = require("./../models/chan.model");

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
  try {
    console.log("req.body :>> ", req.body);
    const newChan = await chanModel.create(req.body);
    res.status(201).json(newChan);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    next(error);
  }
});

module.exports = router;
