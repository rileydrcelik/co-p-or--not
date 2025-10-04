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

// Interface for grouped station data with train lines
interface StationWithReports {
  
  id: string;
  name: string;
  lines: string[];
  reports: Report[];
}

// Mock data matching the database schema - replace with real data from your backend
const mockReports: Report[] = [
  {
    _id: "1",
    presence: true,
    station: {
      name: "Broad St",
      coordinates: { latitude: 40.7012, longitude: -73.9954 }
    },
    reportedAt: new Date("2025-01-14T22:23:00Z"),
    createdAt: new Date("2025-01-14T22:23:00Z"),
    updatedAt: new Date("2025-01-14T22:23:00Z")
  },
  {
    _id: "2",
    presence: true,
    station: {
      name: "Broad St",
      coordinates: { latitude: 40.7012, longitude: -73.9954 }
    },
    reportedAt: new Date("2025-01-14T22:15:00Z"),
    createdAt: new Date("2025-01-14T22:15:00Z"),
    updatedAt: new Date("2025-01-14T22:15:00Z")
  },
  {
    _id: "3",
    presence: false,
    station: {
      name: "Broad St",
      coordinates: { latitude: 40.7012, longitude: -73.9954 }
    },
    reportedAt: new Date("2025-01-14T22:01:00Z"),
    createdAt: new Date("2025-01-14T22:01:00Z"),
    updatedAt: new Date("2025-01-14T22:01:00Z")
  },
  {
    _id: "4",
    presence: false,
    station: {
      name: "Church Ave",
      coordinates: { latitude: 40.6455, longitude: -73.9795 }
    },
    reportedAt: new Date("2025-01-14T21:45:00Z"),
    createdAt: new Date("2025-01-14T21:45:00Z"),
    updatedAt: new Date("2025-01-14T21:45:00Z")
  },
  {
    _id: "5",
    presence: true,
    station: {
      name: "Church Ave",
      coordinates: { latitude: 40.6455, longitude: -73.9795 }
    },
    reportedAt: new Date("2025-01-14T21:30:00Z"),
    createdAt: new Date("2025-01-14T21:30:00Z"),
    updatedAt: new Date("2025-01-14T21:30:00Z")
  },
  {
    _id: "6",
    presence: true,
    station: {
      name: "Times Sq-42 St",
      coordinates: { latitude: 40.7589, longitude: -73.9851 }
    },
    reportedAt: new Date("2025-01-14T21:20:00Z"),
    createdAt: new Date("2025-01-14T21:20:00Z"),
    updatedAt: new Date("2025-01-14T21:20:00Z")
  },
  {
    _id: "7",
    presence: true,
    station: {
      name: "Times Sq-42 St",
      coordinates: { latitude: 40.7589, longitude: -73.9851 }
    },
    reportedAt: new Date("2025-01-14T21:10:00Z"),
    createdAt: new Date("2025-01-14T21:10:00Z"),
    updatedAt: new Date("2025-01-14T21:10:00Z")
  },
  {
    _id: "8",
    presence: false,
    station: {
      name: "Times Sq-42 St",
      coordinates: { latitude: 40.7589, longitude: -73.9851 }
    },
    reportedAt: new Date("2025-01-14T21:05:00Z"),
    createdAt: new Date("2025-01-14T21:05:00Z"),
    updatedAt: new Date("2025-01-14T21:05:00Z")
  },
  {
    _id: "9",
    presence: true,
    station: {
      name: "Times Sq-42 St",
      coordinates: { latitude: 40.7589, longitude: -73.9851 }
    },
    reportedAt: new Date("2025-01-14T20:55:00Z"),
    createdAt: new Date("2025-01-14T20:55:00Z"),
    updatedAt: new Date("2025-01-14T20:55:00Z")
  },
  {
    _id: "10",
    presence: false,
    station: {
      name: "Union Sq-14 St",
      coordinates: { latitude: 40.7357, longitude: -73.9909 }
    },
    reportedAt: new Date("2025-01-14T20:40:00Z"),
    createdAt: new Date("2025-01-14T20:40:00Z"),
    updatedAt: new Date("2025-01-14T20:40:00Z")
  },
  {
    _id: "11",
    presence: true,
    station: {
      name: "Union Sq-14 St",
      coordinates: { latitude: 40.7357, longitude: -73.9909 }
    },
    reportedAt: new Date("2025-01-14T20:25:00Z"),
    createdAt: new Date("2025-01-14T20:25:00Z"),
    updatedAt: new Date("2025-01-14T20:25:00Z")
  },
  {
    _id: "12",
    presence: true,
    station: {
      name: "Grand Central-42 St",
      coordinates: { latitude: 40.7518, longitude: -73.9769 }
    },
    reportedAt: new Date("2025-01-14T20:15:00Z"),
    createdAt: new Date("2025-01-14T20:15:00Z"),
    updatedAt: new Date("2025-01-14T20:15:00Z")
  },
  {
    _id: "13",
    presence: true,
    station: {
      name: "Grand Central-42 St",
      coordinates: { latitude: 40.7518, longitude: -73.9769 }
    },
    reportedAt: new Date("2025-01-14T20:00:00Z"),
    createdAt: new Date("2025-01-14T20:00:00Z"),
    updatedAt: new Date("2025-01-14T20:00:00Z")
  },
  {
    _id: "14",
    presence: false,
    station: {
      name: "Grand Central-42 St",
      coordinates: { latitude: 40.7518, longitude: -73.9769 }
    },
    reportedAt: new Date("2025-01-14T19:45:00Z"),
    createdAt: new Date("2025-01-14T19:45:00Z"),
    updatedAt: new Date("2025-01-14T19:45:00Z")
  }
];

// Station to train lines mapping (this would come from a separate API or database table)
const stationLinesMap: { [key: string]: string[] } = {
  "Broad St": ["J", "Z"],
  "Church Ave": ["F", "G"],
  "Times Sq-42 St": ["1", "2", "3", "7", "N", "Q", "R", "W"],
  "Union Sq-14 St": ["4", "5", "6", "L", "N", "Q", "R", "W"],
  "Grand Central-42 St": ["4", "5", "6", "7"]
};

// Group reports by station and add train lines
const groupReportsByStation = (reports: Report[]): StationWithReports[] => {
  const stationMap = new Map<string, StationWithReports>();
  
  reports.forEach(report => {
    const stationName = report.station.name;
    
    if (!stationMap.has(stationName)) {
      stationMap.set(stationName, {
        id: stationName.toLowerCase().replace(/\s+/g, '-'),
        name: stationName,
        lines: stationLinesMap[stationName] || [],
        reports: []
      });
    }
    
    stationMap.get(stationName)!.reports.push(report);
  });
  
  // Sort reports by reportedAt date (most recent first)
  stationMap.forEach(station => {
    station.reports.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
  });
  
  return Array.from(stationMap.values());
};

const mockStations = groupReportsByStation(mockReports);


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
            reports={station.reports}
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