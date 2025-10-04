import { View, Text, SafeAreaView, StyleSheet } from "react-native";

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Stats</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1725",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
  },
});