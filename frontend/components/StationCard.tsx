import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Import train icons
import ATrain from "../assets/train_icons/ATrain";
import BTrain from "../assets/train_icons/BTrain";
import CTrain from "../assets/train_icons/CTrain";
import DTrain from "../assets/train_icons/DTrain";
import ETrain from "../assets/train_icons/ETrain";
import FTrain from "../assets/train_icons/FTrain";
import GTrain from "../assets/train_icons/GTrain";
import JTrain from "../assets/train_icons/JTrain";
import LTrain from "../assets/train_icons/LTrain";
import MTrain from "../assets/train_icons/MTrain";
import NTrain from "../assets/train_icons/NTrain";
import QTrain from "../assets/train_icons/QTrain";
import RTrain from "../assets/train_icons/RTrain";
import WTrain from "../assets/train_icons/WTrain";
import ZTrain from "../assets/train_icons/ZTrain";
import OneTrain from "../assets/train_icons/OneTrain";
import TwoTrain from "../assets/train_icons/TwoTrain";
import ThreeTrain from "../assets/train_icons/ThreeTrain";
import FourTrain from "../assets/train_icons/FourTrain";
import FiveTrain from "../assets/train_icons/FiveTrain";
import SixTrain from "../assets/train_icons/SixTrain";
import SevenTrain from "../assets/train_icons/SevenTrain";

// Interface matching the Report.js database schema
interface Report {
  _id: string;
  presence: boolean; // true = "Cop", false = "Not"
  station: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  reportedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface StationCardProps {
  id: string;
  name: string;
  lines: string[];
  reports: Report[];
}

// Map train lines to their corresponding icon components
const trainIcons: { [key: string]: React.ComponentType<any> } = {
  "1": OneTrain,
  "2": TwoTrain,
  "3": ThreeTrain,
  "4": FourTrain,
  "5": FiveTrain,
  "6": SixTrain,
  "7": SevenTrain,
  "A": ATrain,
  "B": BTrain,
  "C": CTrain,
  "D": DTrain,
  "E": ETrain,
  "F": FTrain,
  "G": GTrain,
  "J": JTrain,
  "L": LTrain,
  "M": MTrain,
  "N": NTrain,
  "Q": QTrain,
  "R": RTrain,
  "W": WTrain,
  "Z": ZTrain,
};

// MBTA line colors and styling
const getLineStyle = (line: string) => {
  const lineStyles: { [key: string]: { backgroundColor: string; textColor: string; displayText: string } } = {
    // Red Line
    "1": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "1" },
    "2": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "2" },
    "3": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "3" },
    
    // Orange Line
    "4": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "4" },
    "5": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "5" },
    "6": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "6" },
    
    // Blue Line
    "7": { backgroundColor: "#003DA5", textColor: "#FFFFFF", displayText: "7" },
    
    // Green Line variants - each shows its specific letter
    "A": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "A" },
    "B": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "B" },
    "C": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "C" },
    "D": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "D" },
    "E": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "E" },
    "F": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "F" },
    "G": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "G" },
    
    // Green Line branches (if they come as full names)
    "Green Line A": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "A" },
    "Green Line B": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "B" },
    "Green Line C": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "C" },
    "Green Line D": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "D" },
    "Green Line E": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "E" },
    "Green Line F": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "F" },
    "Green Line G": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "G" },
    
    // Other lines
    "J": { backgroundColor: "#9C5E31", textColor: "#FFFFFF", displayText: "J" },
    "L": { backgroundColor: "#A626AA", textColor: "#FFFFFF", displayText: "L" },
    "M": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "M" },
    "N": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "N" },
    "Q": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "Q" },
    "R": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "R" },
    "W": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "W" },
    "Z": { backgroundColor: "#9C5E31", textColor: "#FFFFFF", displayText: "Z" },
    
    // Bus lines and other services
    "Blue Line": { backgroundColor: "#003DA5", textColor: "#FFFFFF", displayText: "BL" },
    "Red Line": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "RL" },
    "Orange Line": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "OL" },
    "Green Line": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "GL" },
  };
  
  return lineStyles[line] || { backgroundColor: "#666666", textColor: "#FFFFFF", displayText: line };
};

export default function StationCard({ id, name, lines, reports }: StationCardProps) {
  const getTrainIcon = (line: string) => {
    return trainIcons[line] || null;
  };

  const getVoteColor = (presence: boolean) => {
    return presence ? "#4A9EFF" : "#FF6B6B";
  };

  const formatDateTime = (date: Date) => {
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return { time, date: dateStr };
  };

  return (
    <View style={styles.stationCard}>
      {/* Station Name and Lines */}
      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{name}</Text>
        <View style={styles.linesContainer}>
          {lines.map((line, index) => {
            const TrainIcon = getTrainIcon(line);
            const lineStyle = getLineStyle(line);
            
            return TrainIcon ? (
              <View key={index} style={styles.lineIconContainer}>
                <TrainIcon width={24} height={24} />
              </View>
            ) : (
              <View
                key={index}
                style={[
                  styles.lineBadge,
                  { 
                    backgroundColor: lineStyle.backgroundColor,
                    borderColor: lineStyle.backgroundColor,
                  },
                ]}
              >
                <Text style={[styles.lineText, { color: lineStyle.textColor }]}>
                  {lineStyle.displayText}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Recent Reports */}
      <View style={styles.votesContainer}>
        {reports.length === 0 ? (
          <Text style={styles.noVotesText}>No recent reports</Text>
        ) : (
          reports.map((report, index) => {
            const { time, date } = formatDateTime(report.reportedAt);
            return (
              <View key={report._id} style={styles.voteItem}>
                <Text style={styles.voteTime}>
                  {time} • {date}
                </Text>
                <Text
                  style={[
                    styles.voteStatus,
                    { color: getVoteColor(report.presence) },
                  ]}
                >
                  {report.presence ? "Cop" : "Not"}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stationCard: {
    backgroundColor: "#2a2232",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3242",
  },
  stationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stationName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  linesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  lineIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  lineBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  lineText: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#3a3242",
    marginVertical: 8,
  },
  votesContainer: {
    gap: 6,
  },
  voteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  voteTime: {
    color: "#888888",
    fontSize: 14,
  },
  voteStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  noVotesText: {
    color: "#666666",
    fontSize: 14,
    fontStyle: "italic",
  },
});
