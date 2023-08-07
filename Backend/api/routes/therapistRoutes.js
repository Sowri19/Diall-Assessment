const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const therapistController = require("../controllers/therapistController");

// Route to create a new therapist with profile pic upload (optional)
router.post(
  "/",
  upload.single("profilePic"),
  therapistController.createTherapist
);

// Route to fetch a therapist by their userID
router.get("/:userID", therapistController.getTherapistByID);

// Route to fetch all therapists
router.get("/", therapistController.getAllTherapists);

module.exports = router;
