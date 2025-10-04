import {  Text, SafeAreaView, StyleSheet } from "react-native";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Map screen</Text>
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