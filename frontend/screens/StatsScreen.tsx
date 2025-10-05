import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import SearchBar from "../components/SearchBar";
import StationCard from "../components/StationCard";
import { fetchAllReports, fetchAllStations, Report, Station } from "../services/api";

// Interface for processed reports with Date objects (for StationCard compatibility)
interface ProcessedReport {
  _id: string;
  presence: boolean;
  station: {
    _id: string;
    name: string;
    train_lines: string[];
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
  reports: ProcessedReport[];
}




export default function StatsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<StationWithReports[]>([]);
  const [filteredStations, setFilteredStations] = useState<StationWithReports[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations and reports from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both stations and reports in parallel
        const [stationsResponse, reportsResponse] = await Promise.all([
          fetchAllStations(),
          fetchAllReports(1, 100) // Get first 100 reports
        ]);
        
        if (stationsResponse.success && reportsResponse.success) {
          // Group reports by station
          const reportsByStation = new Map<string, ProcessedReport[]>();
          
          reportsResponse.data.forEach(report => {
            if (report.station && report.station.name) {
              const stationName = report.station.name;
              if (!reportsByStation.has(stationName)) {
                reportsByStation.set(stationName, []);
              }
              
              // Convert string dates to Date objects
              const reportWithDateObjects: ProcessedReport = {
                ...report,
                reportedAt: new Date(report.reportedAt),
                createdAt: new Date(report.createdAt),
                updatedAt: new Date(report.updatedAt)
              };
              
              reportsByStation.get(stationName)!.push(reportWithDateObjects);
            }
          });
          
          // Sort reports by date
          reportsByStation.forEach(reports => {
            reports.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
          });
          
          // Create station objects with their reports
          const stationsWithReports: StationWithReports[] = stationsResponse.data.map(station => ({
            id: station._id,
            name: station.name,
            lines: station.train_lines || [],
            reports: reportsByStation.get(station.name) || []
          }));
          
          setStations(stationsWithReports);
          setFilteredStations(stationsWithReports);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter((station) =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.lines.some(line => line.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredStations(filtered);
    }
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Loading stations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {filteredStations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stations found</Text>
          </View>
        ) : (
          filteredStations.map((station) => (
            <StationCard
              key={station.id}
              id={station.id}
              name={station.name}
              lines={station.lines}
              reports={station.reports}
            />
          ))
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
  },
});