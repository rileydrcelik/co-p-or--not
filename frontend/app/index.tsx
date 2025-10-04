import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for bottom nav icons

export default function HomeScreen() {
  const [history, setHistory] = useState([]);
  const [copCount, setCopCount] = useState(0);
  const [totalReports, setTotalReports] = useState(0);

  // Function to get timestamp
  const getCurrentTimestamp = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return { time, date };
  };

  // Handle report
  const report = (status) => {
    const { time, date } = getCurrentTimestamp();
    setHistory([{ time, date, status }, ...history]);
    setTotalReports(totalReports + 1);
    if (status === "Cop") {
      setCopCount(copCount + 1);
    }
  };

  // Calculate Cop percentage
  const copPercentage =
    totalReports > 0 ? Math.round((copCount / totalReports) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Church Avenue</Text>
        <View style={styles.badges}>
          <Text style={[styles.badge, { backgroundColor: "green" }]}>G</Text>
          <Text style={[styles.badge, { backgroundColor: "orange" }]}>M</Text>
          <Text style={[styles.badge, { backgroundColor: "darkorange" }]}>F</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "blue" }]}
          onPress={() => report("Cop")}
        >
          <Text style={styles.buttonText}>Cop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => report("Not")}
        >
          <Text style={styles.buttonText}>Not</Text>
        </TouchableOpacity>
      </View>

      {/* Percentage & History */}
      <View style={styles.historyBox}>
        <Text style={styles.copPercent}>Cop: {copPercentage}%</Text>

        {history.length === 0 ? (
          <Text style={{ color: "gray", marginTop: 8 }}>No reports yet.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <View>
                  <Text style={{ color: "white" }}>{item.time}</Text>
                  <Text style={{ color: "gray", fontSize: 12 }}>{item.date}</Text>
                </View>
                <Text
                  style={{
                    color: item.status === "Cop" ? "skyblue" : "tomato",
                    fontWeight: "bold",
                  }}
                >
                  {item.status}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Ionicons name="menu" size={28} color="white" />
        <Ionicons name="home" size={28} color="white" />
        <Ionicons name="map" size={28} color="white" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1725",
    padding: 12,
  },

  // ---- Header ----
  header: {
    flexDirection: "row",           // title + badges in a row
    alignItems: "center",           // vertically center them
    justifyContent: "space-between",// space between title and badges
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    flexShrink: 1,                  // prevents title from pushing badges off
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",               // allow badges to wrap if needed
    justifyContent: "flex-end",
    gap: 8,
  },

  badge: {
    color: "white",
    fontWeight: "bold",
    fontSize: 40,
    borderRadius: 25, //10
  paddingHorizontal: 18,//15
  paddingVertical: 8, //8
  marginHorizontal: 3, //3
  textAlign: "center",
  },

  // ---- Buttons ----
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 150,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 55,
    fontWeight: "bold",
  },

  // ---- History ----
  historyBox: {
    flex: 1,
    backgroundColor: "#2a2232",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  copPercent: {
    fontSize: 50,
    fontWeight: "bold",
    color: "skyblue",
  },

  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  // ---- Bottom Nav ----
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2a2232",
    paddingVertical: 12,
  },
});
