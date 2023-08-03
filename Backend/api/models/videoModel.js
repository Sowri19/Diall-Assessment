const admin = require("firebase-admin");
const db = admin.firestore();
const { v4: uuidv4 } = require("uuid");

class Video {
  constructor(title, therapistId, userId, userVideo, therapistVideo) {
    this.id = uuidv4(); // Auto-generate UUID for video ID
    this.title = title;
    this.therapistId = therapistId;
    this.userId = userId;
    this.userVideo = userVideo;
    this.therapistVideo = therapistVideo;
    this.createdAt = new Date();
  }

  // Add a new video to the Firestore collection
  async save() {
    try {
      const videoRef = await db.collection("videos").doc(this.id);
      await videoRef.set({
        id: this.id,
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
}

module.exports = Video;
