const admin = require("firebase-admin");
const Video = require("../models/videoModel");
const db = admin.firestore();

// Function to upload video to Firebase Storage and get the download URL
async function uploadVideo(videoBuffer) {
  try {
    const storageBucket = admin.storage().bucket();

    // Generate a unique filename using the current timestamp
    const videoFilename = Date.now().toString();
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

    // Function to get the next available video key and update the counter
    async function getNextVideoKey() {
      const lastUsedKeyRef = db.collection("lastUsedKeys").doc("videoKey");
      const lastUsedKeySnapshot = await lastUsedKeyRef.get();
      let lastUsedKey = lastUsedKeySnapshot.exists
        ? lastUsedKeySnapshot.data().videoKey
        : 0;

      // Increment the last used video key for the next video
      const nextVideoKey = lastUsedKey + 1;

      // Update the last used video key in the database
      await lastUsedKeyRef.set({ videoKey: nextVideoKey });

      // Return the next available video key as an integer
      return nextVideoKey;
    }

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

    // Get the next available video ID from Firestore
    const nextVideoKey = await getNextVideoKey();
    // We can also choose to use uuid for the for the id, instead I used custom key for id.
    // Save the video data in Firestore database with the custom key named "id"
    const videoData = {
      id: nextVideoKey,
      title,
      therapistId: therapistId || null,
      userId: userId || null,
      userVideo: userVideo || null,
      therapistVideo: therapistVideo || null,
      createdAt: admin.firestore.Timestamp.now(),
    };
    // All the null values are optional here,

    // Create a new video document in Firestore
    const videoRef = await db.collection("videos").add(videoData);

    // Include the custom video key in the response
    const videoWithKey = { id: videoRef.id, ...videoData };
    res
      .status(201)
      .json({ message: "Video created successfully.", video: videoWithKey });
  } catch (error) {
    next(error);
  }
};
// we can use get video by ID in the single profile page of the users/ therapist to retrieve the their video.
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
// Inside your API controller or route
const getAllVideos = async (req, res, next) => {
  try {
    const allVideos = await Video.getAllVideos();
    res.status(200).json({ videos: allVideos });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVideo,
  getVideoByID,
  getAllVideos,
};
