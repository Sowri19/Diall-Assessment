// TabNavigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WatchPage from "./components/WatchPage";
import SearchPage from "./components/SearchPage";
import AskPage from "./components/AskPage";
import WatchIcon from "./icons/WatchIcon";
import AskIcon from "./icons/AskIcon";
import SearchIcon from "./icons/SearchIcon";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Hide tab labels
        tabBarStyle: { backgroundColor: "black" }, // Set the background color of the tab bar
        tabBarActiveTintColor: "#fff", // Change the color of the active tab icon
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)", // Change the color of inactive tab icons
      }}
    >
      <Tab.Screen
        name="Watch"
        component={WatchPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <WatchIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ask"
        component={AskPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AskIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
