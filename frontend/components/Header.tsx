import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomText from './CustomText';

interface HeaderProps {
  stationName: string;
  trainLines: string[];
}

const Header: React.FC<HeaderProps> = ({ stationName, trainLines }) => {
  const getLineColor = (line: string) => {
    switch (line) {
      case 'G': return 'green';
      case 'M': return 'orange';
      case 'F': return 'darkorange';
      default: return 'gray';
    }
  };

  return (
    <View style={styles.header}>
      <CustomText style={styles.title} bold>{stationName}</CustomText>
      <View style={styles.badges}>
        {trainLines.map((line, index) => (
          <CustomText 
            key={index}
            style={[styles.badge, { backgroundColor: getLineColor(line) }]} 
            bold
          >
            {line}
          </CustomText>
        ))}
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
    color: "white",
    fontSize: 40,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 3,
    textAlign: "center",
  },
});

export default Header;
