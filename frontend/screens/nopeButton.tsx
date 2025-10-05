//updated code that needs to be tested

import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function NopeButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.notButton} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>Not</Text>
        <Text style={styles.subText}>Your response has been recorded</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notButton: {
    backgroundColor: "#323233cc", 
    borderRadius: 90, //35
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120, // Big button height
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 10, height: 30 },// 0/3
    shadowRadius: 6,
    elevation: 4,

  },
  textContainer: {
    alignItems: "center",
  },
  statusText: {
    color: "#afa9b5ff",
    fontSize: 100, //36
    fontWeight: "bold",
    fontFamily: "Helvetica",
  },
  subText: {
    color: "#8E869A",
    fontSize: 20,
    marginTop: 6,
  },
});







//previous code prototype 1 
/*import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function NopeButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.notButton} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.statusText}>Not</Text>
       
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notButton: {
    backgroundColor: "#4E466E",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 45,
    marginVertical: 20,
  },
  textContainer: {
    alignItems: "center",
  },
  statusText: {
    color: "#ccc",
    fontSize: 28,
    fontWeight: "bold",
  },
  subText: {
    color: "#aaa",
    marginTop: 4,
    fontSize: 14,
  },
});*/
