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
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const forwardScrollDuration = 500; // Set the duration in milliseconds

const WatchPage = () => {
  const [videoFeed, setVideoFeed] = useState([]);
  const currentIndex = useRef(0);
  const swiperRef = useRef(null);

  const bottomTabBarHeight = 79;

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

  const handleSharePress = async (videoUrl) => {
    try {
      await Share.share({
        message: videoUrl,
      });
    } catch (error) {
      console.error("Error sharing video:", error);
    }
  };

  const VideoItem = ({ item, index, handleSharePress }) => {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
      (async () => {
        try {
          await videoRef.current.playAsync();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      })();
    }, []);

    const handleVideoTap = async () => {
      if (videoRef.current) {
        try {
          const videoStatus = await videoRef.current.getStatusAsync();
          if (videoStatus.isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
          } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
          }
        } catch (error) {
          console.error("VideoTap error", error);
        }
      }
    };

    return (
      <TouchableOpacity onPress={handleVideoTap}>
        {/* Video Player */}
        <Video
          ref={videoRef}
          source={{ uri: item.videoUrl }}
          resizeMode="cover"
          style={styles.video}
          isLooping={true}
        />
        {/* Play Icon */}
        {!isPlaying && (
          <View style={styles.videoOverlay}>
            <Ionicons name="play" size={90} color="white" />
          </View>
        )}
        {/* Rest of your component */}
        <TouchableOpacity
          style={{ ...styles.iconContainer, bottom: 16, right: 16 }}
          onPress={() => handleSharePress(item.videoUrl)}
        >
          <Ionicons name="paper-plane-outline" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.iconContainer, bottom: 90, right: 16 }}
          onPress={() => {}}
        >
          <Ionicons name="bookmark-outline" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.iconContainer, bottom: 164, right: 16 }}
          onPress={() => {}}
        >
          <Ionicons name="chatbubble-outline" size={35} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.iconContainer, bottom: 230, right: 16 }}
          onPress={() => {}}
        >
          <Ionicons name="heart-outline" size={35} color="#fff" />
        </TouchableOpacity>
        <View style={styles.therapistNameContainer}>
          <Text style={styles.therapistName}>{item.therapistName}</Text>
          <Text style={styles.therapistName}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }) => (
    <VideoItem item={item} index={index} handleSharePress={handleSharePress} />
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
    aspectRatio: width / (height - 79),
  },
  iconContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
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
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
});

export default WatchPage;
