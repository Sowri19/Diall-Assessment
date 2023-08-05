import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Video, Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (video.current && record) {
      setIsPlaying(true);
      await video.current.playAsync();
    }
  };

  const pauseRecordedVideo = async () => {
    if (video.current && record) {
      setIsPlaying(false);
      await video.current.pauseAsync();
    }
  };

  const goBackToPreview = () => {
    setRecord(null);
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

  return (
    <View style={styles.container}>
      {record ? (
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: record }}
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
          {isPlaying ? (
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={pauseRecordedVideo}
            >
              <Ionicons name="pause" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.playButton}
              onPress={playRecordedVideo}
            >
              <Ionicons name="play" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.backButton} onPress={goBackToPreview}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={type}
            ratio="4:3"
          />
          <View style={styles.buttons}>
            {!isRecording ? (
              <>
                <TouchableOpacity style={styles.button} onPress={flipCamera}>
                  <Ionicons name="camera-reverse" size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={takeVideo}>
                  <Ionicons name="videocam" size={24} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.button} onPress={stopVideo}>
                <Ionicons name="stop" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Text style={styles.recordingTimeText}>
                Recording: {15 - recordingProgress} seconds left
              </Text>
            </View>
          )}
        </View>
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
  },
  camera: {
    flex: 1,
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  video: {
    flex: 1,
    alignSelf: "center",
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 10,
  },
  button: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  pauseButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  playButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});
