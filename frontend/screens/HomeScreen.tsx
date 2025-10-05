
//new code below test 1: success
import React, { useState } from "react";
import { StyleSheet, SafeAreaView,TouchableOpacity, Text } from "react-native";
import Header from "../components/Header";
import CopButtons from "../components/CopButtons";
import ReportsBlock from "../components/ReportsBlock";
import NopeButton from "./nopeButton";
import CopButtonPress from "../components/CopButtonPress";
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
  const [showNopeButton, setShowNopeButton] = useState(false);
const [activeButton, setActiveButton] = useState<null | "Cop" | "Not">(null);

  const stationName = "Church Avenue";
  const trainLines = ["G", "M", "F"];

  const getCurrentTimestamp = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return { time, date };
  };

  const report = (status: ReportStatus) => {
    console.log("Report pressed:", status);

    const { time, date } = getCurrentTimestamp();
    setHistory([{ time, date, status }, ...history]);
    setTotalReports(totalReports + 1);

    if (status === "Cop") {
    setCopCount(copCount + 1);
    setActiveButton("Cop");
  } else if (status === "Not") {
    setActiveButton("Not");
  }
};


  const copPercentage =
    totalReports > 0 ? Math.round((copCount / totalReports) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header stationName={stationName} trainLines={trainLines} />

      {activeButton === "Not" ? (
  <NopeButton onPress={() => setActiveButton(null)} />
) : activeButton === "Cop" ? (
  <CopButtonPress onPress={() => setActiveButton(null)} />
) : (
  <CopButtons onReport={report} />
)}
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
  
});
