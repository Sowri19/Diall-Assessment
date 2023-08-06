const express = require("express");
const multer = require("multer");
const upload = multer();

const videoController = require("../controllers/videoController");

const router = express.Router();

// Route to create a new video with optional video uploads
router.post(
  "/",
  upload.fields([{ name: "userVideo" }, { name: "therapistVideo" }]),
  videoController.createVideo
);
// Route to fetch all videos
router.get("/", videoController.getAllVideos);

// Route to fetch a video by its ID
router.get("/:videoID", videoController.getVideoByID);

module.exports = router;
