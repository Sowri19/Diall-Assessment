import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import Video from "react-native-video";

const VideoListScreen = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch the video data from the backend API
    axios
      .get("http://localhost:3000/api/videos")
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching videos:", error);
      });
  }, []);

  // Function to handle video item press
  const handleVideoPress = (videoUrl) => {
    // You can use any logic here to handle playing the video
    console.log("Video URL:", videoUrl);
    // For example, you could navigate to a separate screen for video playback
    // Or you could use the Video component in this screen itself to play the video
  };

  return (
    <View>
      <Text>Video List</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoUrl}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleVideoPress(item.videoUrl)}>
            <Video
              source={{ uri: item.videoUrl }}
              style={{ width: 300, height: 200 }}
              controls={true}
            />
            <Text>Title: {item.title}</Text>
            <Text>Therapist Name: {item.therapistName}</Text>
            <Text>Timestamp: {item.timestamp._seconds}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default VideoListScreen;
