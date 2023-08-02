import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigation";
import { Video } from "expo-av";
import VideoScreen from "./components/VideoScreen";

const App = () => {
  return (
    <NavigationContainer>
      <VideoScreen />
    </NavigationContainer>
  );
};

export default App;
