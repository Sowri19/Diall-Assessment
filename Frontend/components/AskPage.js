import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraMode, setCameraMode] = useState("picture"); // "picture" or "video"

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera && cameraMode === "picture") {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  };

  const recordVideo = async () => {
    if (camera && cameraMode === "video") {
      try {
        const videoData = await camera.recordAsync();
        console.log("Video recorded:", videoData.uri);
      } catch (error) {
        console.error("Error recording video:", error);
      }
    }
  };

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasCameraPermission === false) {
    return <Text> No access to camera </Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={type}
        ratio={"1:1"}
      />

      {/* Flip Camera Button */}
      <TouchableOpacity style={styles.flipCameraButton} onPress={flipCamera}>
        <Ionicons name="ios-camera-reverse" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Record Video Button */}
      <TouchableOpacity style={styles.recordButton} onPress={recordVideo}>
        <Ionicons name="ios-videocam" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Take Picture Button */}
      <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
        <Ionicons name="ios-camera" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Display Captured Image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  flipCameraButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    // backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 50,
  },
  recordButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "red",
    padding: 18,
    borderRadius: 50,
  },
  takePictureButton: {
    position: "absolute",
    bottom: 16,
    // backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 50,
    alignSelf: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
