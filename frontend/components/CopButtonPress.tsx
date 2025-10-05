import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

interface CopButtonPressProps {
  onPress: () => void;
}

export default function CopButtonPress({ onPress }: CopButtonPressProps) {
  return (
    <TouchableOpacity style={styles.copButton} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>Cop</Text>
        <Text style={styles.subText}>Your response has been recorded</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  copButton: {
    backgroundColor: "#323233cc", // same as NopeButton
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 10, height: 30 },
    shadowRadius: 6,
    elevation: 4,
  },
  textContainer: {
    alignItems: "center",
  },
  statusText: {
    color: "#afa9b5ff",
    fontSize: 100,
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  subText: {
    color: "#8E869A",
    fontSize: 20,
    marginTop: 6,
  },
});