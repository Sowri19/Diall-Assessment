import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";
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

  const pan = new Animated.ValueXY();
  const scrollViewRef = useRef(null);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Allow horizontal and vertical swipes
      return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      pan.setValue({ x: gestureState.dx, y: gestureState.dy });
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) < 10 && Math.abs(gestureState.dy) < 10) {
        // Tap detected, handle it if needed
        return;
      }

      if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
        // Vertical swipe detected
        if (gestureState.dy < -100) {
          // Swipe up threshold reached, move to the next video
          handleVideoEnd();
        }
      }

      // Animated the video card back to its original position after the swipe
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
    onPanResponderGrant: () => {
      pan.setOffset({ x: 0, y: pan.y._value });
      pan.setValue({ x: 0, y: 0 });
    },
  });

  const scrollToNextCard = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: 0,
        y: currentIndex * height,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView} // Added this style to set the background color
        contentContainerStyle={styles.scrollContent}
        {...panResponder.panHandlers}
        showsVerticalScrollIndicator={false} // Removed scroll indicator
        ref={scrollViewRef}
        onScrollEndDrag={scrollToNextCard}
        scrollEventThrottle={1}
        snapToInterval={height}
        decelerationRate="fast"
      >
        {videoFeed.map((video, index) => {
          const isCurrentIndex = currentIndex === index;

          // Calculate the top position for the current video
          const videoTop = index === currentIndex ? pan.y : height;

          return (
            <View key={video.id} style={styles.videoContainer}>
              <Animated.View
                style={[
                  styles.videoWrapper,
                  {
                    top: videoTop,
                    zIndex: isCurrentIndex ? 1 : 0,
                  },
                ]}
              >
                <Video
                  source={{ uri: video.videoUrl }}
                  shouldPlay
                  resizeMode="cover"
                  style={styles.video}
                  isLooping={false}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.didJustFinish) {
                      handleVideoEnd();
                    }
                  }}
                />
                {index === currentIndex && ( // Only show the text overlay for the current video
                  <Animated.View
                    style={[
                      styles.textOverlay,
                      {
                        opacity: pan.y.interpolate({
                          inputRange: [-height, 0, height],
                          outputRange: [0.5, 1, 0.5],
                        }),
                      },
                    ]}
                  >
                    <Text style={styles.videoTitle}>{video.title}</Text>
                    <Text style={styles.username}>
                      Username: {video.createdBy}
                    </Text>
                  </Animated.View>
                )}
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const videoHeight = height - 84; // Adjusted this value to account for the height of the navigation bar

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // fixed the background color here as well
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff", // fixed the background color here as well
  },
  scrollContent: {
    flexGrow: 1,
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: height,
  },
  videoWrapper: {
    width,
    height: videoHeight,
    aspectRatio: width / videoHeight,
    overflow: "hidden",
    position: "absolute",
  },
  video: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  textOverlay: {
    position: "absolute",
    bottom: 50, // Adjust this value as needed to position the text above the navigation bar
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
