import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Camera } from "expo-camera";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function App() {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [userRecord, setRecord] = useState(null);
  const [therapistRecord, setTherapistRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const navigation = useNavigation();
  const [isPopupVisible, setPopupVisible] = useState(false);

  const randomMessages = [
    "I code with passion",
    "I want to work with diall app",
    "coidng is fun",
  ];
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * randomMessages.length);
    return randomMessages[randomIndex];
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const audioStatus = await Audio.requestPermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingProgress((prevProgress) => prevProgress + 1);
      }, 1000);

      if (recordingProgress >= 15) {
        stopVideo();
      }

      return () => clearInterval(interval);
    }
  }, [isRecording, recordingProgress]);

  const takeVideo = async () => {
    if (camera && !isRecording) {
      setIsRecording(true);
      const data = await camera.recordAsync({ maxDuration: 15 });
      setRecord(data.uri);
      console.log(data.uri);
      setIsRecording(false);
      setRecordingProgress(0);
    }
  };

  const stopVideo = () => {
    if (camera && isRecording) {
      camera.stopRecording();
      setIsRecording(false);
      setRecordingProgress(0);
    }
  };

  const playRecordedVideo = async () => {
    if (video.current && userRecord) {
      setIsPlaying(true);
      await video.current.playAsync();
    }
  };

  const pauseRecordedVideo = async () => {
    if (video.current && userRecord) {
      setIsPlaying(false);
      await video.current.pauseAsync();
    }
  };

  const goBackToPreview = () => {
    setRecord(null);
  };

  const handleVideoUpload = async () => {
    if (videoTitle.trim() === "") {
      alert("Title is mandatory. Please enter a title for the video.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", videoTitle);

      // Optional fields
      const therapistId = null; // Initialize to null or the actual therapistId value
      const userId = null; // Initialize to null or the actual userId value

      // Optional fields
      if (therapistId) {
        formData.append("therapistId", therapistId);
      }
      if (userId) {
        formData.append("userId", userId);
      }

      // Upload user video if available
      if (userRecord) {
        formData.append("userVideo", {
          uri: userRecord,
          type: "video/mp4",
          name: "user-video-file.mp4",
        });
      }

      // Upload therapist video if available
      if (therapistRecord) {
        formData.append("therapistRecord", {
          uri: therapistRecord.uri,
          type: "video/mp4",
          name: "therapist-video-file.mp4",
        });
      }

      // Make a POST request to your Node.js server endpoint to create the video
      const response = await fetch("http://192.168.5.48:3000/api/videos/", {
        method: "POST",
        body: formData,
      });

      // Check if the response was successful (status code 2xx)
      if (response.ok) {
        const data = await response.json();
        console.log("Upload response:", data);
        // Navigate to the Watch page after successful upload

        navigation.navigate("Watch");
      } else {
        console.error("Error uploading video:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }

  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const handleTap = () => {
    if (isPopupVisible) {
      setPopupVisible(false);
    }
  };

  const showPopup = () => {
    setPopupVisible(true);
  };
  return (
    <View style={styles.container}>
      {userRecord ? (
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: userRecord }}
            resizeMode="cover" // Set resizeMode to cover to make the video take full screen
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          {isPlaying ? (
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={pauseRecordedVideo}
            >
              <Ionicons name="pause" size={54} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.playButton}
              onPress={playRecordedVideo}
            >
              <Ionicons name="play" size={54} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleVideoUpload}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={goBackToPreview}>
            <Ionicons name="close-outline" size={54} color="#fff" />
          </TouchableOpacity>

          {/* Title Input Overlay */}
          <View style={styles.titleOverlay}>
            <TextInput
              style={[styles.titleInput, { color: "#fff" }]}
              placeholder="Enter Video Title (Max 40 characters)"
              placeholderTextColor="#fff"
              textAlignVertical="top"
              value={videoTitle}
              onChangeText={setVideoTitle}
              maxLength={40}
              autoFocus
            />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.cameraContainer}
            onPress={handleTap}
          >
            <Camera
              ref={(ref) => setCamera(ref)}
              style={styles.camera}
              type={type}
              ratio="4:3"
            />
            <TouchableOpacity
              style={styles.popupButton}
              onPress={showPopup}
              activeOpacity={0.8}
            >
              <Ionicons
                name="information-circle-outline"
                size={44}
                color="#fff"
              />
            </TouchableOpacity>
            {!isRecording ? (
              <>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={flipCamera}
                >
                  <Ionicons name="camera-reverse" size={34} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.takeStopVideoButton}
                  onPress={takeVideo}
                >
                  <Ionicons
                    name="radio-button-off-outline"
                    size={124}
                    color="#fff"
                  />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.takeStopVideoButton}
                onPress={stopVideo}
              >
                <Ionicons name="stop" size={124} color="#fff" />
              </TouchableOpacity>
            )}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingTimeText}>
                  Recording: {15 - recordingProgress} seconds left
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
      {isPopupVisible && (
        <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
          <View style={styles.popupContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setPopupVisible(false)}
            >
              <Ionicons name="close" size={44} color="#fff" />
            </TouchableOpacity>
            {/* Display random message in the popup */}
            <Text style={styles.popupText}>{getRandomMessage()}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  flipButton: {
    position: "absolute",
    top: 56,
    right: 20,
    padding: 12,
    borderRadius: 50,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  takeStopVideoButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    padding: 12,
    borderRadius: 50,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    position: "absolute",
    top: 36,
    left: 16,
    padding: 12,
    borderRadius: 50,
  },
  pauseButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 12,
    borderRadius: 50,
  },
  playButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 12,
    borderRadius: 50,
  },
  sendButton: {
    position: "absolute",
    bottom: 26,
    right: 26,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 34,
  },
  recordingIndicator: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  recordingTimeText: {
    color: "#fff",
    fontSize: 16,
  },
  titleOverlay: {
    position: "absolute",
    top: 150,
    left: 60,
    right: 60,
    padding: 10,
    borderRadius: 50,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleInput: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  popupButton: {
    position: "absolute",
    top: 130,
    right: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  closeButton: {
    position: "absolute",
    top: 70,
    right: 370,
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupText: {
    color: "#fff",
    fontSize: 18,
  },
});
