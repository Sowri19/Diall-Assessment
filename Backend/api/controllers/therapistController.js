const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const Therapist = require("../models/therapistModel");

// Function to upload profile pic to Firebase Storage and get the download URL
async function uploadProfilePic(admin, profilePicBuffer) {
  try {
    const storageBucket = admin.storage().bucket();
    const profilePicFilename = uuidv4(); // Generate a unique filename for the profile pic
    const profilePicFileRef = storageBucket.file(profilePicFilename);

    // Upload the profile pic file to the storage bucket
    await profilePicFileRef.save(profilePicBuffer, {
      metadata: {
        contentType: "image/jpeg", // Change the content type as per your image type
      },
    });

    // Get the download URL for the uploaded profile pic
    const downloadUrl = await profilePicFileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Set an expiration date for the URL if needed
    });

    return downloadUrl[0]; // Return the download URL for the profile pic
  } catch (error) {
    throw new Error("Error uploading profile pic: " + error.message);
  }
}

// Controller to create a new therapist
const createTherapist = async (req, res, next) => {
  try {
    const { username, keywords } = req.body;
    let profilePicUrl = null;

    // Check if a file is uploaded
    if (req.file) {
      // Upload the profile pic to Firebase Storage and get the download URL
      profilePicUrl = await uploadProfilePic(admin, req.file.buffer); // Pass the admin object as an argument
    }

    const therapist = new Therapist(username, profilePicUrl, keywords);
    await therapist.save();

    res.status(201).json({
      message: "Therapist created successfully.",
      therapist: {
        userID: therapist.userID,
        username: therapist.username,
        profilePic: therapist.profilePic, // This will be the download URL of the uploaded profile picture
        keywords: therapist.keywords,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a therapist by their userID
const getTherapistByID = async (req, res, next) => {
  try {
    const { userID } = req.params;

    const therapist = await Therapist.getTherapistByID(userID);

    if (therapist) {
      res.status(200).json({
        message: "Therapist fetched successfully.",
        therapist: {
          userID: therapist.userID,
          username: therapist.username,
          profilePic: therapist.profilePic,
          keywords: therapist.keywords,
        },
      });
    } else {
      res.status(404).json({ error: "Therapist not found." });
    }
  } catch (error) {
    next(error);
  }
};

// Controller to fetch all therapists
const getAllTherapists = async (req, res, next) => {
  try {
    const therapists = await Therapist.getAllTherapists();

    res.status(200).json({
      message: "All therapists fetched successfully.",
      therapists: therapists.map((therapist) => ({
        userID: therapist.userID,
        username: therapist.username,
        profilePic: therapist.profilePic,
        keywords: therapist.keywords,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTherapist,
  getTherapistByID,
  getAllTherapists,
};
