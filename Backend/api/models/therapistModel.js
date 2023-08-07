const admin = require("firebase-admin");
const db = admin.firestore();
const { v4: uuidv4 } = require("uuid");

class Therapist {
  constructor(username, profilePic, keywords) {
    this.userID = uuidv4(); // Auto-generate UUID
    this.username = username;
    this.profilePic = profilePic;
    this.keywords = keywords;
  }

  // Add a new therapist to the Firestore collection
  async save() {
    try {
      const therapistRef = await db.collection("therapists").doc(this.userID);

      // Create a data object with mandatory fields
      const data = {
        userID: this.userID,
        username: this.username,
        keywords: this.keywords,
      };

      // Add the profilePic field only if it is defined
      if (this.profilePic !== undefined) {
        data.profilePic = this.profilePic;
      }

      await therapistRef.set(data);
    } catch (error) {
      throw new Error("Error saving therapist document: " + error.message);
    }
  }

  // Fetch a therapist by their userID from the Firestore collection
  static async getTherapistByID(userID) {
    try {
      const therapistRef = await db.collection("therapists").doc(userID);
      const therapistSnapshot = await therapistRef.get();

      if (therapistSnapshot.exists) {
        const therapistData = therapistSnapshot.data();
        return new Therapist(
          therapistData.username,
          therapistData.profilePic,
          therapistData.keywords
        );
      } else {
        return null; // Therapist not found
      }
    } catch (error) {
      throw new Error("Error fetching therapist document: " + error.message);
    }
  }

  // Fetch all therapists from the Firestore collection
  static async getAllTherapists() {
    try {
      const therapistCollectionRef = await db.collection("therapists");
      const therapistSnapshot = await therapistCollectionRef.get();

      const therapists = therapistSnapshot.docs.map((doc) => {
        const therapistData = doc.data();
        return new Therapist(
          therapistData.username,
          therapistData.profilePic,
          therapistData.keywords
        );
      });

      return therapists;
    } catch (error) {
      throw new Error("Error fetching all therapists: " + error.message);
    }
  }
}

module.exports = Therapist;
