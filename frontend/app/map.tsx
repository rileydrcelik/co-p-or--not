import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapScreen from '../screens/MapScreen';
import BottomNavigationBar from '../components/BottomNavigationBar';

export default function MapPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MapScreen />
      </View>
      <BottomNavigationBar currentScreen="map" />
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
