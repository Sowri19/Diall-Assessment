import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const { width, height } = Dimensions.get("window");

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const bottomTabBarHeight = 79; // Replace this with the actual height of your custom bottom tab bar
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideoFeed = async () => {
      try {
        // Fetch the video feed data from the backend API using axios
        const response = await axios.get("http://localhost:3000/api/videos");
        setVideoFeed(response.data);
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

  const handleVideoPress = () => {
    // Toggle video playback on tap
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const videoHeight = height - bottomTabBarHeight; // Calculate the height of the video container

  useEffect(() => {
    // Autoplay the first video when the component mounts
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  return (
    <View style={styles.container}>
      <SwiperFlatList
        index={currentIndex}
        onChangeIndex={({ index }) => setCurrentIndex(index)}
        data={videoFeed}
        renderItem={({ item }) => (
          <View style={{ ...styles.videoContainer, height: videoHeight }}>
            <Video
              ref={videoRef}
              source={{ uri: item.videoUrl }}
              shouldPlay={currentIndex === item.id && !isPaused}
              resizeMode="cover"
              style={styles.video}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  handleVideoEnd();
                }
              }}
            />
            {currentIndex === item.id && (
              <TouchableOpacity
                onPress={handleVideoPress}
                style={styles.overlay}
              >
                {isPaused && <Text style={styles.playButton}>Play</Text>}
              </TouchableOpacity>
            )}
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  playButton: {
    fontSize: 24,
    color: "#fff",
  },
});

export default WatchPage;
