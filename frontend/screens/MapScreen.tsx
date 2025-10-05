import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import CustomText from "../components/CustomText";
import { fetchAllPolylines, PolylineShape } from "../services/api";

// Dark mode map styling
const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

// Route colors for different subway lines
const routeColors = {
  'Red': '#DA020E',
  'Orange': '#FF8C00',
  'Blue': '#003DA5',
  'Green-B': '#00843D',
  'Green-C': '#00843D',
  'Green-D': '#00843D',
  'Green-E': '#00843D',
  // Add more flexible matching
  'red': '#DA020E',
  'orange': '#FF8C00',
  'blue': '#003DA5',
  'green': '#00843D',
};

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [polylines, setPolylines] = useState<{ [routeId: string]: PolylineShape[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error('Location error:', error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchAllPolylines();
        console.log('Polylines response:', response);
        console.log('Polylines data:', response.data);
        setPolylines(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching polylines:', error);
        setErrorMsg('Error loading subway lines');
        setLoading(false);
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.errorText}>{errorMsg}</CustomText>
      </View>
    );
  }

  const getMBTAColorBySuffix = (shapeId: string) => {
    // Remove 'canonical-' prefix to get the suffix
    const suffix = shapeId.replace('canonical-', '');
    console.log(`Shape ID: ${shapeId} -> Suffix: ${suffix}`);
    
    const colorMapping: Record<string, string> = {
      // Green Line branches - all use MBTA Green
      "8000005": "#00843D", // Green-C
      "8000006": "#00843D", // Green-C
      "8000008": "#00843D", // Green-D
      "8000009": "#00843D", // Green-D
      "8000012": "#00843D", // Green-B
      "8000013": "#00843D", // Green-B
      "8000015": "#00843D", // Green-E
      "8000018": "#00843D", // Green-E
      
      // Red Line - MBTA Red
      "899_0005": "#DA020E", // Red
      "931_0009": "#DA020E", // Red
      "931_0010": "#DA020E", // Red
      "933_0009": "#DA020E", // Red
      "933_0010": "#DA020E", // Red
      
      // Orange Line - MBTA Orange
      "903_0008": "#FF8C00", // Orange
      "903_0017": "#FF8C00", // Orange
      "903_0018": "#FF8C00", // Orange
      
      // Blue Line - MBTA Blue
      "946_0013": "#003DA5", // Blue
      "946_0014": "#003DA5", // Blue
    };
    
    const color = colorMapping[suffix] || "#FFFFFF";
    console.log(`Color for ${suffix}: ${color}`);
    return color;
  }

  const renderPolylines = () => {
    const allPolylines: React.ReactElement[] = [];
    
    console.log('Rendering polylines, total routes:', Object.keys(polylines).length);
    
    Object.entries(polylines).forEach(([routeId, shapes]) => {
      console.log(`Route "${routeId}" has ${shapes.length} shapes`);
      console.log(`Color for route "${routeId}":`, routeColors[routeId as keyof typeof routeColors]);
      shapes.forEach((shape, index) => {
        console.log(`Shape ${shape.shape_id} has ${shape.coordinates.length} coordinates`);
        const color = getMBTAColorBySuffix(shape.shape_id) || '#FFFFFF';
        console.log(`Applying color ${color} to shape ${shape.shape_id}`);
        allPolylines.push(
          <Polyline
            key={`${routeId}-${shape.shape_id}-${index}`}
            coordinates={shape.coordinates}
            strokeColor={color}
            strokeWidth={8}
            lineCap="round"
            lineJoin="round"
          />
        );
      });
    });
    
    console.log(`Total polylines to render: ${allPolylines.length}`);
    return allPolylines;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.errorText}>Loading subway lines...</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsPointsOfInterest={false}
        initialRegion={{
          latitude: location?.coords.latitude || 42.3601,
          longitude: location?.coords.longitude || -71.0589,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {renderPolylines()}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    padding: 20,
  },
});