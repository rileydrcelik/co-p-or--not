import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import SearchBar from "../components/SearchBar";
import StationCard from "../components/StationCard";

interface Vote {
  time: string;
  date: string;
  status: "Cop" | "Not";
}

interface Station {
  id: string;
  name: string;
  lines: string[];
  votes: Vote[];
}

// Mock data - replace with real data from your backend
const mockStations: Station[] = [
  {
    id: "1",
    name: "Broad St",
    lines: ["J", "Z"],
    votes: [
      { time: "5:23pm", date: "1/14/2025", status: "Cop" },
      { time: "5:15pm", date: "1/14/2025", status: "Cop" },
      { time: "5:01pm", date: "1/14/2025", status: "Not" },
    ],
  },
  {
    id: "2",
    name: "Church Ave",
    lines: ["F", "G"],
    votes: [
      { time: "4:45pm", date: "1/14/2025", status: "Not" },
      { time: "4:30pm", date: "1/14/2025", status: "Cop" },
    ],
  },
  {
    id: "3",
    name: "Times Sq-42 St",
    lines: ["1", "2", "3", "7", "N", "Q", "R", "W"],
    votes: [
      { time: "4:20pm", date: "1/14/2025", status: "Cop" },
      { time: "4:10pm", date: "1/14/2025", status: "Cop" },
      { time: "4:05pm", date: "1/14/2025", status: "Not" },
      { time: "3:55pm", date: "1/14/2025", status: "Cop" },
    ],
  },
  {
    id: "4",
    name: "Union Sq-14 St",
    lines: ["4", "5", "6", "L", "N", "Q", "R", "W"],
    votes: [
      { time: "3:40pm", date: "1/14/2025", status: "Not" },
      { time: "3:25pm", date: "1/14/2025", status: "Cop" },
    ],
  },
  {
    id: "5",
    name: "Grand Central-42 St",
    lines: ["4", "5", "6", "7"],
    votes: [
      { time: "3:15pm", date: "1/14/2025", status: "Cop" },
      { time: "3:00pm", date: "1/14/2025", status: "Cop" },
      { time: "2:45pm", date: "1/14/2025", status: "Not" },
    ],
  },
];


export default function StatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStations, setFilteredStations] = useState(mockStations);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredStations(mockStations);
    } else {
      const filtered = mockStations.filter((station) =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.lines.some(line => line.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredStations(filtered);
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search stations..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Stations List */}
      <ScrollView style={styles.stationsList} showsVerticalScrollIndicator={false}>
        {filteredStations.map((station) => (
          <StationCard
            key={station.id}
            id={station.id}
            name={station.name}
            lines={station.lines}
            votes={station.votes}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1725",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  stationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
});