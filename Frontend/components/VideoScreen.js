// VideoScreen.js
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import TabNavigation from "../TabNavigation";

const { height } = Dimensions.get("window");
const videoScreenHeight = height - 84;

const VideoScreen = () => {
  return (
    <View style={[styles.container, { height: videoScreenHeight }]}>
      <TabNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VideoScreen;
