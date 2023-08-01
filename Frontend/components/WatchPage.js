import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av"; // Import the Video component from Expo
import axios from "axios";

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
        // setting the ket to the video id to without any warnings and tracking of the video issues
        <View key={video.id} style={styles.videoContainer}>
          {currentIndex === videoFeed.indexOf(video) && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => handleVideoEnd()}
            >
              <Video
                source={{ uri: video.videoUrl }}
                shouldPlay
                resizeMode="contain"
                style={styles.video}
                isLooping={false}
                onPlaybackStatusUpdate={(status) => {
                  if (status.didJustFinish) {
                    handleVideoEnd();
                  }
                }}
              />
            </TouchableOpacity>
          )}
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.username}>Username: {video.createdBy}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  video: {
    width: 300,
    height: 200,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: "#666",
  },
});

export default WatchPage;
