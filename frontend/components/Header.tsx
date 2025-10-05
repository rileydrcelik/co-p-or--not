import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';

interface HeaderProps {
  stationName: string;
  trainLines: string[];
}

const Header: React.FC<HeaderProps> = ({ stationName, trainLines }) => {
  // MBTA line colors and styling - same as StationCard
  const getLineStyle = (line: string) => {
    const lineStyles: { [key: string]: { backgroundColor: string; textColor: string; displayText: string } } = {
      // Red Line
      "1": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "1" },
      "2": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "2" },
      "3": { backgroundColor: "#DA020E", textColor: "#FFFFFF", displayText: "3" },
      
      // Orange Line
      "4": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "4" },
      "5": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "5" },
      "6": { backgroundColor: "#ED8B00", textColor: "#FFFFFF", displayText: "6" },
      
      // Blue Line
      "7": { backgroundColor: "#003DA5", textColor: "#FFFFFF", displayText: "7" },
      
      // Green Line variants - each shows its specific letter
      "A": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "A" },
      "B": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "B" },
      "C": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "C" },
      "D": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "D" },
      "E": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "E" },
      "F": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "F" },
      "G": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "G" },
      
      // Green Line full names (fallback)
      "Green Line A": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "A" },
      "Green Line B": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "B" },
      "Green Line C": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "C" },
      "Green Line D": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "D" },
      "Green Line E": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "E" },
      "Green Line F": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "F" },
      "Green Line G": { backgroundColor: "#00843D", textColor: "#FFFFFF", displayText: "G" },
      
      // Other lines
      "J": { backgroundColor: "#996633", textColor: "#FFFFFF", displayText: "J" },
      "L": { backgroundColor: "#A7A9AC", textColor: "#000000", displayText: "L" },
      "M": { backgroundColor: "#FFC72C", textColor: "#000000", displayText: "M" },
      "N": { backgroundColor: "#FCCC0A", textColor: "#000000", displayText: "N" },
      "Q": { backgroundColor: "#FCCC0A", textColor: "#000000", displayText: "Q" },
      "R": { backgroundColor: "#FCCC0A", textColor: "#000000", displayText: "R" },
      "W": { backgroundColor: "#FCCC0A", textColor: "#000000", displayText: "W" },
      "Z": { backgroundColor: "#996633", textColor: "#FFFFFF", displayText: "Z" },
    };
    
    return lineStyles[line] || { backgroundColor: "#666666", textColor: "#FFFFFF", displayText: line };
  };

  return (
    <View style={styles.header}>
      <CustomText style={styles.title} bold>{stationName}</CustomText>
      <View style={styles.badges}>
        {trainLines.map((line, index) => {
          const lineStyle = getLineStyle(line);
          return (
            <View
              key={index}
              style={[
                styles.badge,
                {
                  backgroundColor: lineStyle.backgroundColor,
                  borderColor: lineStyle.backgroundColor,
                },
              ]}
            >
              <CustomText style={[styles.badgeText, { color: lineStyle.textColor }]} bold>
                {lineStyle.displayText}
              </CustomText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",           // title + badges in a row
    alignItems: "center",           // vertically center them
    justifyContent: "space-between",// space between title and badges
    marginTop: 40,                  // larger top margin
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 40,
    flexShrink: 1,                  // prevents title from pushing badges off
  },

  badges: {
    flexDirection: "row",
    flexWrap: "wrap",               // allow badges to wrap if needed
    justifyContent: "flex-end",
    gap: 8,
  },

  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Header;
