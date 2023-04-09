import * as SplashScreen from "expo-splash-screen";
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/auth';
import Navigation from './components/Navigation';
import React, { useState, useEffect, useCallback } from "react";

export default function App() {
  SplashScreen.preventAutoHideAsync();
  
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'MyNerve': require('./assets/fonts/MyNerve_Regular.ttf'),
          'Mulish-Italic': require('./assets/fonts/Mulish-Italic.ttf'),
          'Mulish': require('./assets/fonts/Mulish.ttf'),
          'GloriaHallelujah': require('./assets/fonts/GloriaHallelujah-Regular.ttf'),
          'HomemadeApple': require('./assets/fonts/HomemadeApple-Regular.ttf'),
          'IndieFlower': require('./assets/fonts/Mansalva-Regular.ttf'),
          'JosefinSans': require('./assets/fonts/JosefinSans-Regular.ttf'),
          'JosefinSansBold': require('./assets/fonts/JosefinSans-Bold.ttf'),
          'ShadowsIntoLight': require('./assets/fonts/ShadowsIntoLight-Regular.ttf'),
          'PTSans': require('./assets/fonts/PTSans-Regular.ttf'),
          'Mansalva': require('./assets/fonts/Mansalva-Regular.ttf'),
          'LibreBaskerville': require('./assets/fonts/LibreBaskerville-Regular.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }
    prepare();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  onLayoutRootView().catch((e) => console.error(e))

  return (
    
    <NavigationContainer contentStyle={{ backgroundColor: '#F0F4FF' }}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </NavigationContainer>
  );
}


