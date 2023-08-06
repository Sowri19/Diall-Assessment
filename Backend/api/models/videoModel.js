const admin = require("firebase-admin");
const db = admin.firestore();

class Video {
  constructor(id, title, therapistId, userId, userVideo, therapistVideo) {
    this.id = id; // Use the provided ID
    this.title = title;
    this.therapistId = therapistId;
    this.userId = userId;
    this.userVideo = userVideo;
    this.therapistVideo = therapistVideo;
    this.createdAt = new Date();
  }

  // Add a new video to the Firestore collection
  async save() {
    // Check if videoKey is a non-empty integer
    if (!Number.isInteger(this.id) || this.id <= 0) {
      throw new Error(
        "Invalid video key. Video key must be a positive integer."
      );
    }

    try {
      const videoRef = await db.collection("videos").doc(this.id.toString());
      await videoRef.set({
        id: this.id, // Save the ID in the document
        title: this.title,
        therapistId: this.therapistId,
        userId: this.userId,
        userVideo: this.userVideo,
        therapistVideo: this.therapistVideo,
        createdAt: this.createdAt,
      });
    } catch (error) {
      throw new Error("Error saving video document: " + error.message);
    }
  }
  // Fetch a video by its ID from the Firestore collection
  static async getVideoByID(videoID) {
    try {
      const videoRef = await db.collection("videos").doc(videoID);
      const videoSnapshot = await videoRef.get();

      if (videoSnapshot.exists) {
        const videoData = videoSnapshot.data();
        return new Video(
          videoData.title,
          videoData.therapistId,
          videoData.userId,
          videoData.userVideo,
          videoData.therapistVideo
        );
      } else {
        return null; // Video not found
      }
    } catch (error) {
      throw new Error("Error fetching video document: " + error.message);
    }
  }

  // Fetch all videos from the Firestore collection
  static async getAllVideos() {
    try {
      const videosRef = await db.collection("videos").get();
      const allVideos = [];

      videosRef.forEach((videoSnapshot) => {
        const videoData = videoSnapshot.data();

        const video = new Video(
          videoData.id,
          videoData.title,
          videoData.therapistId,
          videoData.userId,
          videoData.userVideo,
          videoData.therapistVideo
        );
        video.createdAt = videoData.createdAt.toDate(); // Convert Firestore Timestamp to Date
        allVideos.push(video);
      });

      return allVideos;
    } catch (error) {
      throw new Error("Error fetching all videos: " + error.message);
    }
  }
}

module.exports = Video;
