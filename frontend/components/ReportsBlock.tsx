import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import CustomText from './CustomText';

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
            <View style={styles.historyItem}>
              <View>
                <CustomText style={{ color: "white" }}>{item.time}</CustomText>
                <CustomText style={{ color: "gray", fontSize: 12 }}>{item.date}</CustomText>
              </View>
              <CustomText
                style={{
                  color: item.status === "Cop" ? "skyblue" : "tomato",
                }}
                bold
              >
                {item.status}
              </CustomText>
            </View>
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

  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
});

export default ReportsBlock;
