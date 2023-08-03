const admin = require("firebase-admin");
const Video = require("../models/videoModel");

// Function to upload video to Firebase Storage and get the download URL
async function uploadVideo(videoBuffer) {
  try {
    const storageBucket = admin.storage().bucket();
    const { v4: uuidv4 } = require("uuid");

    const videoFilename = uuidv4(); // Generate a unique filename for the video
    const videoFileRef = storageBucket.file(videoFilename);

    // Upload the video file to the storage bucket
    await videoFileRef.save(videoBuffer, {
      metadata: {
        contentType: "video/mp4", // Changed the content type as per your video type
      },
    });

    // Get the download URL for the uploaded video
    const downloadUrl = await videoFileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500", // Set an expiration date for the URL if needed
    });

    return downloadUrl[0]; // Return the download URL for the video
  } catch (error) {
    throw new Error("Error uploading video: " + error.message);
  }
}

// Controller to create a new video with optional video uploads
const createVideo = async (req, res, next) => {
  try {
    const { title, therapistId, userId } = req.body;

    // Check if video uploads are provided
    const userVideoFile = req.files["userVideo"];
    const therapistVideoFile = req.files["therapistVideo"];

    let userVideo = null;
    let therapistVideo = null;

    if (userVideoFile) {
      // Upload the user video to Firebase Storage and get the download URL
      userVideo = await uploadVideo(userVideoFile[0].buffer); // Access the first file in the array
    }

    if (therapistVideoFile) {
      // Upload the therapist video to Firebase Storage and get the download URL
      therapistVideo = await uploadVideo(therapistVideoFile[0].buffer); // Access the first file in the array
    }

    // Check if any of the optional fields are missing and set them to null
    const video = new Video(
      title,
      therapistId || null,
      userId || null,
      userVideo || null,
      therapistVideo || null
    );
    await video.save();

    res.status(201).json({
      message: "Video created successfully.",
      video: {
        id: video.id,
        title: video.title,
        therapistId: video.therapistId,
        userId: video.userId,
        userVideo: video.userVideo,
        therapistVideo: video.therapistVideo,
        createdAt: video.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controller to fetch a video by its ID
const getVideoByID = async (req, res, next) => {
  try {
    const { videoID } = req.params;

    // Fetch the video from Firestore
    const video = await Video.getVideoByID(videoID);

    if (video) {
      res.status(200).json({
        message: "Video fetched successfully.",
        video: {
          id: video.id,
          title: video.title,
          therapistId: video.therapistId,
          userId: video.userId,
          userVideo: video.userVideo,
          therapistVideo: video.therapistVideo,
          createdAt: video.createdAt,
        },
      });
    } else {
      res.status(404).json({ error: "Video not found." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideoByID,
};
