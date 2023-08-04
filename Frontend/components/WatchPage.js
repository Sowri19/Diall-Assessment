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
const forwardScrollDuration = 500; // Set the duration in milliseconds

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const currentIndex = useRef(0);
  const swiperRef = useRef(null);

  const bottomTabBarHeight = 79;
  const videoRef = useRef(null);

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

  const handleSwipe = ({ index }) => {
    currentIndex.current = index;
    console.log("currentIndex", currentIndex.current);
  };

  const endSwipe = ({ index }) => {
    if (index === videoFeed.length - 1) {
      currentIndex.current = 0;
      console.log("EndIndex", currentIndex.current);
      swiperRef.current.scrollToIndex({
        index: 0,
        animated: false,
        viewPosition: 1,
      });
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={{ ...styles.videoContainer, height: videoHeight }}>
      {/* Video Player */}
      <Video
        ref={videoRef}
        source={{ uri: item.videoUrl }}
        shouldPlay={currentIndex.current === index}
        resizeMode="cover"
        style={styles.video}
        isLooping={true}
      />

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => handleSharePress(item.videoUrl)}
      >
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>

      <View style={styles.therapistNameContainer}>
        <Text style={styles.therapistName}>{item.therapistName}</Text>
        <Text style={styles.therapistName}>{item.title}</Text>
      </View>
    </View>
  );

  const videoHeight = height - bottomTabBarHeight;

  return (
    <View style={styles.container}>
      <SwiperFlatList
        ref={swiperRef}
        index={currentIndex.current}
        onChangeIndex={handleSwipe}
        data={videoFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        vertical={true}
        showPagination={false}
        onMomentumScrollEnd={endSwipe}
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
