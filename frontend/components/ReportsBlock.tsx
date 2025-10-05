import React from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import CustomText from './CustomText';
import Report from './Report';

type ReportStatus = "Cop" | "Not";

interface HistoryItem {
  time: string;
  date: string;
  status: ReportStatus;
}

interface StationReport {
  _id: string;
  presence: boolean;
  reportedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportsBlockProps {
  copPercentage: number;
  history: HistoryItem[];
  stationReports?: StationReport[];
}

const ReportsBlock: React.FC<ReportsBlockProps> = ({ copPercentage, history, stationReports = [] }) => {
  return (
    <View style={styles.historyBox}>
      <CustomText style={styles.copPercent} bold>Cop: {copPercentage}%</CustomText>

      {stationReports.length === 0 ? (
        <CustomText style={{ color: "gray", marginTop: 8 }}>No reports yet.</CustomText>
      ) : (
        <View style={styles.recentReportsContainer}>
          <CustomText style={styles.recentReportsTitle} bold>Recent Reports</CustomText>
          <ScrollView 
            style={styles.reportsScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {stationReports.slice(0, 20).map((report, index) => (
              <View key={report._id || index} style={styles.reportItem}>
                <View style={[
                  styles.reportStatusBadge,
                  { backgroundColor: report.presence ? "#FF6B6B" : "#4A9EFF" }
                ]}>
                  <CustomText style={styles.reportStatusText} bold>
                    {report.presence ? "Cop" : "Not"}
                  </CustomText>
                </View>
                <CustomText style={styles.reportTime}>
                  {new Date(report.reportedAt).toLocaleString()}
                </CustomText>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  historyBox: {
    flex: 1,
    backgroundColor: "#2a2232",
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,              // minimal bottom margin
    marginTop: 5,                 // minimal top margin
  },

  copPercent: {
    fontSize: 50,
    color: "skyblue",
  },
  recentReportsContainer: {
    marginTop: 12,
  },
  recentReportsTitle: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
  },
  reportsScrollView: {
    maxHeight: 250,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    gap: 12,
    marginBottom: 8,
  },
  reportStatusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 50,
    alignItems: "center",
  },
  reportStatusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  reportTime: {
    color: "#cccccc",
    fontSize: 14,
    flex: 1,
  },
});

export default ReportsBlock;
