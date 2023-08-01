import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import WatchPage from "../components/WatchPage";
import AskPage from "../components/AskPage";
import SearchPage from "../components/SearchPage";

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState("Watch"); // Store the active tab here

  const renderContent = () => {
    switch (activeTab) {
      case "Watch":
        return <WatchPage />;
      case "Ask":
        return <AskPage />;
      case "Search":
        return <SearchPage />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
