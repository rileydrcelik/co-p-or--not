import React from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from './CustomText';

type ReportStatus = "Cop" | "Not";

interface CopButtonsProps {
  onReport: (status: ReportStatus) => void;
  disabled?: boolean;
  reporting?: boolean;
}

const CopButtons: React.FC<CopButtonsProps> = ({ onReport, disabled = false, reporting = false }) => {
  const handlePress = (status: ReportStatus) => {
    if (!disabled && !reporting) {
      onReport(status);
    }
  };

  const getButtonStyle = (baseColor: string) => {
    if (disabled) {
      return [styles.button, { backgroundColor: "#666666", opacity: 0.5 }];
    }
    if (reporting) {
      return [styles.button, { backgroundColor: baseColor, opacity: 0.7 }];
    }
    return [styles.button, { backgroundColor: baseColor }];
  };

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={getButtonStyle("#4A9EFF")}
        onPress={() => handlePress("Cop")}
        disabled={disabled || reporting}
      >
        {reporting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <CustomText style={styles.buttonText} bold>
            {disabled ? "Reported" : "Cop"}
          </CustomText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={getButtonStyle("#FF6B6B")}
        onPress={() => handlePress("Not")}
        disabled={disabled || reporting}
      >
        {reporting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <CustomText style={styles.buttonText} bold>
            {disabled ? "Reported" : "Not"}
          </CustomText>
        )}
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
