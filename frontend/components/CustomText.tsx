import React from 'react';
import { Text, TextProps, StyleSheet, Platform } from 'react-native';

interface CustomTextProps extends TextProps {
  bold?: boolean;
  light?: boolean;
  italic?: boolean;
}

const CustomText: React.FC<CustomTextProps> = ({ 
  style, 
  bold = false, 
  light = false, 
  italic = false, 
  ...props 
}) => {
  const getFontFamily = () => {
    // Use system Helvetica fonts as fallback
    if (Platform.OS === 'ios') {
      if (bold && italic) return 'Helvetica-Bold-Oblique';
      if (bold) return 'Helvetica-Bold';
      if (light && italic) return 'Helvetica-Light-Oblique';
      if (light) return 'Helvetica-Light';
      if (italic) return 'Helvetica-Oblique';
      return 'Helvetica';
    } else {
      // Android fallbacks
      if (bold) return 'sans-serif-medium';
      if (light) return 'sans-serif-light';
      return 'sans-serif';
    }
  };

  return (
    <Text 
      style={[styles.default, { fontFamily: getFontFamily() }, style]} 
      {...props} 
    />
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: Platform.OS === 'ios' ? 'Helvetica' : 'sans-serif',
  },
});

export default CustomText;
