const admin = require("firebase-admin");
const db = admin.firestore();
const { v4: uuidv4 } = require("uuid");

class User {
  constructor(username, profilePic) {
    this.userID = uuidv4(); // Auto-generate UUID
    this.username = username;
    this.profilePic = profilePic;
  }

  // Add a new user to the Firestore collection
  async save() {
    try {
      const userRef = await db.collection("users").doc(this.userID);
      await userRef.set({
        userID: this.userID, // Save the userID as a separate field
        username: this.username,
        profilePic: this.profilePic,
      });
    } catch (error) {
      throw new Error("Error saving user document: " + error.message);
    }
  }

  // Fetch a user by their userID from the Firestore collection
  static async getUserByID(userID) {
    try {
      const userRef = await db.collection("users").doc(userID);
      const userSnapshot = await userRef.get();

      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        return new User(userData.username, userData.profilePic);
      } else {
        return null; // User not found
      }
    } catch (error) {
      throw new Error("Error fetching user document: " + error.message);
    }
  }
}

module.exports = User;
