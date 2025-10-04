import React, { useState, useEffect } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import CustomText from "../components/CustomText";

const lightModeStyle = [
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [
      {"visibility": "off"}
    ]
  },
];

const darkModeStyle = [
  {
    "featureType": "all",
    "elementType": "labels",
    "stylers": [
      {"visibility": "off"}
    ]
  },
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#212121" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#424242" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#000000" }]
  }
];


export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  if (errorMsg) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.text}>{errorMsg}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        style={styles.map}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        showsCompass={false}
        toolbarEnabled={false}
        customMapStyle={colorScheme === 'dark' ? darkModeStyle : lightModeStyle}
        initialRegion={{
          latitude: location ? location.coords.latitude : 42.3601,
          longitude: location ? location.coords.longitude : -71.0589,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 1,
    padding: 0,
    margin: 0,
  },
  map: {
    flex: 1,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});