import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Helvetica-Regular': require('../assets/fonts/helvetica/Helvetica.ttf'),
    'Helvetica-Bold': require('../assets/fonts/helvetica/Helvetica-Bold.ttf'),
    'Helvetica-Light': require('../assets/fonts/helvetica/helvetica-light.ttf'),
    'Helvetica-Oblique': require('../assets/fonts/helvetica/Helvetica-Oblique.ttf'),
    'Helvetica-Bold-Oblique': require('../assets/fonts/helvetica/Helvetica-Bold-Oblique.ttf'),
    'Helvetica-Light-Oblique': require('../assets/fonts/helvetica/Helvetica-Light-Oblique.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
    if (loaded) {
      console.log('Fonts loaded successfully');
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded) {
    return null;
  }

  return <Stack />;
}
