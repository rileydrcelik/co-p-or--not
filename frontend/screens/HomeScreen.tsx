import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // for bottom nav icons
import CustomText from "../components/CustomText";

type ReportStatus = "Cop" | "Not";

interface HistoryItem {
  time: string;
  date: string;
  status: ReportStatus;
}

export default function HomeScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
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
  const report = (status: ReportStatus) => {
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
        <CustomText style={styles.title} bold>Church Avenue</CustomText>
        <View style={styles.badges}>
          <CustomText style={[styles.badge, { backgroundColor: "green" }]} bold>G</CustomText>
          <CustomText style={[styles.badge, { backgroundColor: "orange" }]} bold>M</CustomText>
          <CustomText style={[styles.badge, { backgroundColor: "darkorange" }]} bold>F</CustomText>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "blue" }]}
          onPress={() => report("Cop")}
        >
          <CustomText style={styles.buttonText} bold>Cop</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => report("Not")}
        >
          <CustomText style={styles.buttonText} bold>Not</CustomText>
        </TouchableOpacity>
      </View>

      {/* Percentage & History */}
      <View style={styles.historyBox}>
        <CustomText style={styles.copPercent} bold>Cop: {copPercentage}%</CustomText>

        {history.length === 0 ? (
          <CustomText style={{ color: "gray", marginTop: 8 }}>No reports yet.</CustomText>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <View>
                  <CustomText style={{ color: "white" }}>{item.time}</CustomText>
                  <CustomText style={{ color: "gray", fontSize: 12 }}>{item.date}</CustomText>
                </View>
                <CustomText
                  style={{
                    color: item.status === "Cop" ? "skyblue" : "tomato",
                  }}
                  bold
                >
                  {item.status}
                </CustomText>
              </View>
            )}
          />
        )}
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
    color: "skyblue",
  },

  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
});