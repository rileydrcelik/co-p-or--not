import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';

type ReportStatus = "Cop" | "Not";

interface ReportProps {
  time: string;
  date: string;
  status: ReportStatus;
}

const Report: React.FC<ReportProps> = ({ time, date, status }) => {
  return (
    <View style={styles.reportItem}>
      <View>
        <CustomText style={{ color: "white" }}>{time}</CustomText>
        <CustomText style={{ color: "gray", fontSize: 12 }}>{date}</CustomText>
      </View>
      <CustomText
        style={{
          color: status === "Cop" ? "skyblue" : "tomato",
        }}
        bold
      >
        {status}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
});

export default Report;

