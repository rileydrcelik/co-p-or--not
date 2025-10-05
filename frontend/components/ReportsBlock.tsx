import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CustomText from './CustomText';
import Report from './Report';

type ReportStatus = "Cop" | "Not";

interface HistoryItem {
  time: string;
  date: string;
  status: ReportStatus;
}

interface ReportsBlockProps {
  copPercentage: number;
  history: HistoryItem[];
}

const ReportsBlock: React.FC<ReportsBlockProps> = ({ copPercentage, history }) => {
  return (
    <View style={styles.historyBox}>
      <CustomText style={styles.copPercent} bold>Cop: {copPercentage}%</CustomText>

      {history.length === 0 ? (
        <CustomText style={{ color: "gray", marginTop: 8 }}>No reports yet.</CustomText>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Report
              time={item.time}
              date={item.date}
              status={item.status}
            />
          )}
        />
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
});

export default ReportsBlock;
