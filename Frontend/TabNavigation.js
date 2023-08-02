// TabNavigation.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WatchPage from "./components/WatchPage";
import SearchPage from "./components/SearchPage";
import AskPage from "./components/AskPage";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Watch" component={WatchPage} />
      <Tab.Screen name="Ask" component={AskPage} />
      <Tab.Screen name="Search" component={SearchPage} />
    </Tab.Navigator>
  );
};

export default TabNavigation;
