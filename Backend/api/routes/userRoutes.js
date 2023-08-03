const express = require("express");
const multer = require("multer");
const upload = multer();

const userController = require("../controllers/userController");

const router = express.Router();

// Route to create a new user with profile pic upload (optional)
router.post("/", upload.single("profilePic"), userController.createUser);

// Route to fetch a user by their userID
router.get("/:userID", userController.getUserByID);

module.exports = router;
