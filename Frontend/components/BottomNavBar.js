import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const BottomNavBar = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => setActiveTab("Watch")}
      >
        <Text style={styles.tabText}>Watch</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => setActiveTab("Ask")}>
        <Text style={styles.tabText}>Ask</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => setActiveTab("Search")}
      >
        <Text style={styles.tabText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black", // Set the background color to black
    height: 90, // Increase the height to make it taller
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 18, // Increase the font size if needed
    color: "white", // Set the text color to white
  },
});

export default BottomNavBar;
