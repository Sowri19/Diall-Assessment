// Required dependencies
const express = require("express");
const bodyParser = require("body-parser"); // body-parser for parsing application/json
const cors = require("cors"); // CORS for cross-origin resource sharing
const admin = require("firebase-admin"); // firebase admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // connecting the service account key to the backend
const multer = require("multer");
const upload = multer(); // multer for parsing multipart/form-data

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://diall-assessment.appspot.com", // connecting the storage bucket to the backend
});

// Initializing Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Define Firestore database reference
const db = admin.firestore();

const bucket = admin.storage().bucket();

// Function to upload the video file to Firebase Storage
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

    blobStream.on("finish", () => {
      const videoUrl = `gs://${bucket.name}/${filename}`;
      resolve(videoUrl);
    });

    blobStream.end(file.buffer);
  });
}

// API endpoint for video uploads
app.post("/api/videos", upload.single("video"), async (req, res) => {
  try {
    const { title, therapistName, createdBy } = req.body;
    const videoUrl = await uploadVideoToStorage(req.file, createdBy);

    // Save the videoUrl in Firestore database
    const videoData = {
      title,
      therapistName,
      videoUrl,
      createdBy,
      timestamp: admin.firestore.Timestamp.now(),
    };
    const videoRef = await db.collection("videos").add(videoData);

    res.status(201).json({ message: "Video uploaded successfully." });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video." });
  }
});

// Endpoint to get videos
app.get("/api/videos", async (req, res) => {
  try {
    // Fetch videos from the Firestore collection
    const snapshot = await db
      .collection("videos")
      .orderBy("timestamp", "desc")
      .get();
    const videos = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title,
        therapistName: data.therapistName,
        videoUrl: data.videoUrl,
        createdBy: data.createdBy,
        timestamp: data.timestamp,
      });
    });
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
