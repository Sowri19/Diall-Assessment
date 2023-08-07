import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation(); // Get the navigation object
  const isFocused = useIsFocused(); // Check if the component is focused

  const fetchData = async (searchTerm) => {
    try {
      const response = await axios.get(
        "http://192.168.5.48:3000/api/therapists/",
        {
          params: {
            search: searchTerm,
          },
        }
      );
      const therapistData = response.data.therapists;

      // Filter therapists whose names start with the search term
      const filteredTherapists = therapistData.filter((therapist) =>
        therapist.username.toLowerCase().startsWith(searchTerm.toLowerCase())
      );

      setSearchResults(filteredTherapists);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm, isFocused]); // Fetch data when searchTerm or component focus changes

  const handleAskPress = () => {
    // Navigate to the "Ask" page when the "Ask" button is pressed
    navigation.navigate("Ask");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for your therapist"
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {/* Clear Button (x mark) */}
        {searchTerm.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearSearch}
          >
            <Ionicons name="close" size={24} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      {/* Display the search results */}
      <View style={styles.resultsContainer}>
        {searchResults.map((therapist) => (
          <View key={therapist.userID} style={styles.therapistItem}>
            <View style={styles.therapistInfo}>
              <Text style={styles.therapistName}>{therapist.username}</Text>
              <Text style={styles.therapistKeywords}>{therapist.keywords}</Text>
            </View>
            <TouchableOpacity style={styles.askButton} onPress={handleAskPress}>
              <Text style={styles.askButtonText}>Ask</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // White background
    paddingTop: 80,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 50,
    backgroundColor: "#f4f4f4", // Light grey
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center",
  },
  clearButton: {
    padding: 8,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  therapistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  therapistKeywords: {
    fontSize: 14,
    color: "#888",
  },
  askButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  askButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SearchPage;
