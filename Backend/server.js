const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const multer = require("multer");
const upload = multer();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://diallassessment.appspot.com",
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = admin.firestore();
const bucket = admin.storage().bucket();
const lastUsedKeyRef = db.collection("meta").doc("lastUsedKey"); // meta is used to store track the used id's

// Function to upload the video file to Firebase Storage and get the download URL
async function uploadVideoToStorage(file) {
  const filename = Date.now() + "-" + file.originalname;
  const blobStream = bucket.file(filename).createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", async () => {
      try {
        // Get the download URL for the uploaded file
        const [url] = await bucket.file(filename).getSignedUrl({
          action: "read",
          expires: "01-01-2500", // Set a far future expiration date for the URL
        });

        resolve(url);
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
}

// Function to get the next available video key and update the counter
async function getNextVideoKey() {
  const lastUsedKeySnapshot = await lastUsedKeyRef.get();
  let lastUsedKey = lastUsedKeySnapshot.exists
    ? lastUsedKeySnapshot.data().id
    : 0;

  // Increment the last used video key for the next video
  const nextVideoKey = lastUsedKey + 1;

  // Update the last used video key in the database
  await lastUsedKeyRef.set({ id: nextVideoKey });

  // Return the next available video key
  return nextVideoKey;
}

// API endpoint for video uploads
app.post("/api/videos", upload.single("video"), async (req, res) => {
  try {
    const { title, therapistName, createdBy } = req.body;
    const videoUrl = await uploadVideoToStorage(req.file, createdBy);

    // Get the next available video key
    const videoKey = await getNextVideoKey();

    // Save the video data in Firestore database with the custom key named "id"
    const videoData = {
      id: videoKey,
      title,
      therapistName,
      videoUrl,
      createdBy,
      timestamp: admin.firestore.Timestamp.now(),
    };
    // storing the video url in the firestore directly for better accessing the video

    const videoRef = await db.collection("videos").add(videoData);

    // Include the custom video key in the response
    const videoWithKey = { id: videoRef.id, ...videoData };
    res
      .status(201)
      .json({ message: "Video uploaded successfully.", video: videoWithKey });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video." });
  }
});

// Endpoint to get videos
app.get("/api/videos", async (req, res) => {
  try {
    // Fetch all videos from the Firestore collection and order them by timestamp in descending order
    const snapshot = await db
      .collection("videos")
      .orderBy("timestamp", "desc")
      .get();
    const videos = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos." });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
