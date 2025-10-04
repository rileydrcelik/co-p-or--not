import React, { useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import Header from "../components/Header";
import CopButtons from "../components/CopButtons";
import ReportsBlock from "../components/ReportsBlock";

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
  
  // Station configuration
  const stationName = "Church Avenue";
  const trainLines = ["G", "M", "F"];

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
      <Header stationName={stationName} trainLines={trainLines} />
      <CopButtons onReport={report} />
      <ReportsBlock copPercentage={copPercentage} history={history} />
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