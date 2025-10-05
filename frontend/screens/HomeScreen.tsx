import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Alert, ActivityIndicator, View, Text } from "react-native";
import * as Location from "expo-location";
import Header from "../components/Header";
import CopButtons from "../components/CopButtons";
import ReportsBlock from "../components/ReportsBlock";
import { fetchNearestStation, createReport, fetchReportsByStation, Station, Report } from "../services/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [hasReported, setHasReported] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [lastReportStatus, setLastReportStatus] = useState<ReportStatus | null>(null);
  const [stationReports, setStationReports] = useState<Report[]>([]);

  // Fetch reports for the current station
  const fetchStationReports = async (stationName: string) => {
    try {
      const response = await fetchReportsByStation(stationName);
      if (response.success) {
        setStationReports(response.data);
      }
    } catch (error) {
      console.error('Error fetching station reports:', error);
    }
  };

  // Get user location and find nearest station
  useEffect(() => {
    const getLocationAndStation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Find nearest station
        const stationResponse = await fetchNearestStation(latitude, longitude);
        if (stationResponse.success) {
          setCurrentStation(stationResponse.data.station);
          // Fetch reports for this station
          await fetchStationReports(stationResponse.data.station.name);
        } else {
          setError('Could not find nearest station');
        }
      } catch (err) {
        console.error('Error getting location or station:', err);
        setError('Error getting your location or finding nearest station');
      } finally {
        setLoading(false);
      }
    };

    getLocationAndStation();
  }, []);

  const getCurrentTimestamp = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return { time, date };
  };

  const report = async (status: ReportStatus) => {
    if (!currentStation || hasReported || reporting) {
      return; // Prevent multiple reports
    }

    try {
      setReporting(true);
      console.log("Reporting:", status, "for station:", currentStation.name);

      // Send report to backend
      const response = await createReport(status === "Cop", currentStation._id);
      
      if (response.success) {
        // Update local state
        const { time, date } = getCurrentTimestamp();
        setHistory([{ time, date, status }, ...history]);
        setTotalReports(totalReports + 1);
        setHasReported(true);
        setLastReportStatus(status);

        if (status === "Cop") {
          setCopCount(copCount + 1);
        }

        // Refresh station reports to get updated data
        if (currentStation) {
          await fetchStationReports(currentStation.name);
        }

        console.log("Report submitted successfully");
      } else {
        Alert.alert("Error", "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert("Error", "Failed to submit report. Please check your connection and try again.");
    } finally {
      setReporting(false);
    }
  };

  // Calculate cop percentage based on station reports
  const calculateCopPercentage = () => {
    if (stationReports.length === 0) return 0;
    
    const copReports = stationReports.filter(report => report.presence === true);
    return Math.round((copReports.length / stationReports.length) * 100);
  };

  const copPercentage = calculateCopPercentage();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A9EFF" />
          <Text style={styles.loadingText}>Finding nearest station...</Text>
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

  if (!currentStation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No station found near your location</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        stationName={currentStation.name} 
        trainLines={currentStation.train_lines} 
      />

      {hasReported && lastReportStatus ? (
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationText}>{lastReportStatus}</Text>
        </View>
      ) : (
        <CopButtons 
          onReport={report} 
          disabled={hasReported || reporting}
          reporting={reporting}
        />
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
  confirmationCard: {
    backgroundColor: "#D3D3D3",
    borderRadius: 12,
    paddingVertical: 60,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmationText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#666666",
    textAlign: "center",
  },
});