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

interface Vote {
  time: string;
  date: string;
  status: "Cop" | "Not";
}

interface StationCardProps {
  id: string;
  name: string;
  lines: string[];
  votes: Vote[];
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

export default function StationCard({ id, name, lines, votes }: StationCardProps) {
  const getTrainIcon = (line: string) => {
    return trainIcons[line] || null;
  };

  const getVoteColor = (status: "Cop" | "Not") => {
    return status === "Cop" ? "#4A9EFF" : "#FF6B6B";
  };

  return (
    <View style={styles.stationCard}>
      {/* Station Name and Lines */}
      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{name}</Text>
        <View style={styles.linesContainer}>
          {lines.map((line, index) => {
            const TrainIcon = getTrainIcon(line);
            return TrainIcon ? (
              <View key={index} style={styles.lineIconContainer}>
                <TrainIcon width={24} height={24} />
              </View>
            ) : (
              <View
                key={index}
                style={[
                  styles.lineBadge,
                  { backgroundColor: "#666666" },
                ]}
              >
                <Text style={styles.lineText}>{line}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Recent Votes */}
      <View style={styles.votesContainer}>
        {votes.length === 0 ? (
          <Text style={styles.noVotesText}>No recent votes</Text>
        ) : (
          votes.map((vote, index) => (
            <View key={index} style={styles.voteItem}>
              <Text style={styles.voteTime}>
                {vote.time} • {vote.date}
              </Text>
              <Text
                style={[
                  styles.voteStatus,
                  { color: getVoteColor(vote.status) },
                ]}
              >
                {vote.status}
              </Text>
            </View>
          ))
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
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  lineText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
