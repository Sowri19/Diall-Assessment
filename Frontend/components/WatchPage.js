import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Share,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const { width, height } = Dimensions.get("window");

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bottomTabBarHeight = 79; // Replace this with the actual height of your custom bottom tab bar
  const videoRef = useRef(null);
  const lastLoggedIndexRef = useRef(currentIndex);

  // This loads all the videos in the array when the component is rendered
  useEffect(() => {
    const fetchVideoFeed = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/videos");
        setVideoFeed(response.data);
      } catch (error) {
        console.error("Error fetching video feed:", error);
      }
    };
    fetchVideoFeed();
  }, []);

  // Pause the video when the user swipes to a different video
  const handleSwipe = ({ index }) => {
    setCurrentIndex(index); // SwiperFlatList automatically updates the currentIndex when the user swipes

    // Log the current index when it changes
    if (index !== lastLoggedIndexRef.current) {
      console.log("Current Index:", index);
      lastLoggedIndexRef.current = index;
    }
  };

  // Calculate the height of the video container
  const videoHeight = height - bottomTabBarHeight;

  // Function to handle the share button press
  const handleSharePress = async (videoUrl) => {
    try {
      await Share.share({
        message: videoUrl,
      });
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SwiperFlatList
        index={currentIndex}
        onChangeIndex={handleSwipe}
        data={videoFeed}
        renderItem={({ item, index }) => (
          <View style={{ ...styles.videoContainer, height: videoHeight }}>
            {/* Video Player */}
            <Video
              ref={videoRef}
              source={{ uri: item.videoUrl }}
              shouldPlay={currentIndex === index}
              resizeMode="cover"
              style={styles.video}
              isLooping={true}
            />

            {/* Share Button */}
            {currentIndex === index && (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => handleSharePress(item.videoUrl)}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            )}

            {/* Therapist Name */}
            {currentIndex === index && (
              <View style={styles.therapistNameContainer}>
                <Text style={styles.therapistName}>{item.therapistName}</Text>
                <Text style={styles.therapistName}>{item.title}</Text>
              </View>
            )}

            {/* Play/Pause Overlay */}
            {/* (Code for play/pause overlay here if needed) */}
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        vertical={true}
        showPagination={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width,
    aspectRatio: width / (height - 79), // Adjusted this value to account for the height of the bottom tab bar
  },
  shareButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  therapistNameContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  therapistName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WatchPage;
