import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface BottomNavigationBarProps {
  currentScreen?: "home" | "stats" | "map";
}

export default function BottomNavigationBar({ currentScreen = "home" }: BottomNavigationBarProps) {
  const router = useRouter();

  const handleNavigation = (screen: string) => {
    switch (screen) {
      case "stats":
        router.push("/stats");
        break;
      case "home":
        router.push("/");
        break;
      case "map":
        router.push("/map");
        break;
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("stats")}
      >
        <Ionicons 
          name="stats-chart" 
          size={28} 
          color={currentScreen === "stats" ? "#4A9EFF" : "white"} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("home")}
      >
        <Ionicons 
          name="home" 
          size={28} 
          color={currentScreen === "home" ? "#4A9EFF" : "white"} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleNavigation("map")}
      >
        <Ionicons 
          name="map" 
          size={28} 
          color={currentScreen === "map" ? "#4A9EFF" : "white"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2a2232",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#3a3242",
  },
  navItem: {
    padding: 8,
    borderRadius: 8,
  },
});
