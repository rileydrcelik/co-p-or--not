import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatsScreen from '../screens/StatsScreen';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function StatsPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <StatsScreen />
      </View>
      <BottomNavigationBar currentScreen="stats" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1725",
  },
  content: {
    flex: 1,
  },
});
