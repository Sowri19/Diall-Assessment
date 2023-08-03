const User = require("../models/userModel");

// Function to upload profile pic to Firebase Storage and get the download URL
async function uploadProfilePic(profilePicBuffer) {
  try {
    const admin = require("firebase-admin");
    const storageBucket = admin.storage().bucket();
    const { v4: uuidv4 } = require("uuid");

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

// Controller to create a new user with profile pic upload (optional)
const createUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    // Check if a file is uploaded
    const profilePicFile = req.file;
    let profilePicUrl = null;
    if (profilePicFile) {
      // Upload the profile pic to Firebase Storage and get the download URL
      profilePicUrl = await uploadProfilePic(profilePicFile.buffer);
    }

    const user = new User(username, profilePicUrl);
    await user.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        userID: user.userID,
        username: user.username,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a user by their userID
const getUserByID = async (req, res, next) => {
  try {
    const { userID } = req.params;

    // Fetch the user from Firestore
    const user = await User.getUserByID(userID);

    if (user) {
      res.status(200).json({
        message: "User fetched successfully.",
        user: {
          userID: user.userID,
          username: user.username,
          profilePic: user.profilePic,
        },
      });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUserByID,
};
