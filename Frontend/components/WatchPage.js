import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Video } from "expo-av";
import axios from "axios";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const { width, height } = Dimensions.get("window");

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const bottomTabBarHeight = 79; // Replace this with the actual height of your custom bottom tab bar

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

  const videoHeight = height - bottomTabBarHeight; // Calculate the height of the video container

  return (
    <View style={styles.container}>
      <SwiperFlatList
        index={currentIndex}
        onChangeIndex={({ index }) => setCurrentIndex(index)}
        data={videoFeed}
        renderItem={({ item }) => (
          <View style={{ ...styles.videoContainer, height: videoHeight }}>
            <Video
              source={{ uri: item.videoUrl }}
              shouldPlay={currentIndex === item.id}
              resizeMode="cover"
              style={styles.video}
              isLooping={false}
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  handleVideoEnd();
                }
              }}
            />
            {currentIndex === item.id && ( // Only show the text overlay for the current video
              <Animated.View
                style={[
                  styles.textOverlay,
                  {
                    opacity: new Animated.Value(1),
                  },
                ]}
              >
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.username}>Username: {item.createdBy}</Text>
              </Animated.View>
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
  textOverlay: {
    position: "absolute",
    bottom: 50,
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
