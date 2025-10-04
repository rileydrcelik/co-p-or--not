import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CustomText from './CustomText';

type ReportStatus = "Cop" | "Not";

interface CopButtonsProps {
  onReport: (status: ReportStatus) => void;
}

const CopButtons: React.FC<CopButtonsProps> = ({ onReport }) => {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "blue" }]}
        onPress={() => onReport("Cop")}
      >
        <CustomText style={styles.buttonText} bold>Cop</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={() => onReport("Not")}
      >
        <CustomText style={styles.buttonText} bold>Not</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,             // reduced vertical margin for more compact layout
  },

  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    paddingVertical: 100,         // reduced from 150 to make buttons shorter
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 55,
  },
});

export default CopButtons;
