import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideoFeed = async () => {
      try {
        // Fetch the video feed data from the backend API using axios
        const response = await axios.get("http://localhost:3000/api/videos");
        setVideoFeed(response.data);
        console.log(response.data); // Verify that videoFeed is populated correctly in console.log
      } catch (error) {
        console.error("Error fetching video feed:", error);
      }
    };

    fetchVideoFeed();
  }, []);

  const handleVideoEnd = () => {
    // Play the next video when the current video ends
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videoFeed.length);
  };
  return (
    <ScrollView style={styles.container}>
      {videoFeed.map((video) => (
        // setting the key to the video id to avoid any warnings and tracking of the video issues
        <View key={video.id} style={styles.videoContainer}>
          {currentIndex === videoFeed.indexOf(video) && (
            <View style={styles.videoWrapper}>
              <Video
                source={{ uri: video.videoUrl }}
                shouldPlay
                resizeMode="cover" // Use "cover" to fill the entire video container
                style={styles.video}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    handleVideoEnd();
                  }
                }}
              />
              <View style={styles.textOverlay}>
                <Text style={styles.videoTitle}>{video.title}</Text>
                <Text style={styles.username}>Username: {video.createdBy}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const videoHeight = height - 64; // Adjust this value to account for the height of the navigation bar

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width, // Use screen width for the video container
    height: videoHeight, // Set a fixed height for the video container
  },
  videoWrapper: {
    width,
    height: videoHeight, // Set a fixed height for the video container
    aspectRatio: width / videoHeight, // Maintain the aspect ratio of the video
    overflow: "hidden", // Hide any content that overflows the container
    position: "relative",
  },
  video: {
    flex: 1,
  },
  textOverlay: {
    position: "absolute",
    bottom: 20, // Adjust this value to position the text above the navigation bar
    left: 20,
    right: 20,
  },
  videoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textShadowColor: "rgba(255, 255, 255, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textShadowColor: "rgba(255, 255, 255, 0.7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default WatchPage;
