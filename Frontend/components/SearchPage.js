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

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("API_URL");
        const therapistData = response.data; // Assuming the response is an array of therapist data

        // Filter therapists whose names start with the search term
        const filteredTherapists = therapistData.filter((therapist) =>
          therapist.name.toLowerCase().startsWith(searchTerm.toLowerCase())
        );

        setSearchResults(filteredTherapists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

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
        {searchResults.map((therapist, index) => (
          <Text key={index} style={styles.therapistName}>
            {therapist.name}
          </Text>
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
  therapistName: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SearchPage;
