import * as SplashScreen from "expo-splash-screen";
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContextProvider } from './context/AuthContext';
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
          'MyNerve': require('./assets/fonts/default-fonts/MyNerve_Regular.ttf'),
          'Mulish-Italic': require('./assets/fonts/default-fonts/Mulish-Italic.ttf'),
          'Mulish': require('./assets/fonts/default-fonts/Mulish.ttf'),
          'GloriaHallelujah': require('./assets/fonts/default-fonts/GloriaHallelujah-Regular.ttf'),
          'HomemadeApple': require('./assets/fonts/default-fonts/HomemadeApple-Regular.ttf'),
          'IndieFlower': require('./assets/fonts/default-fonts/Mansalva-Regular.ttf'),
          'JosefinSans': require('./assets/fonts/default-fonts/JosefinSans-Regular.ttf'),
          'JosefinSansBold': require('./assets/fonts/default-fonts/JosefinSans-Bold.ttf'),
          'ShadowsIntoLight': require('./assets/fonts/default-fonts/ShadowsIntoLight-Regular.ttf'),
          'PTSans': require('./assets/fonts/default-fonts/PTSans-Regular.ttf'),
          'Mansalva': require('./assets/fonts/default-fonts/Mansalva-Regular.ttf'),
          'LibreBaskerville': require('./assets/fonts/default-fonts/LibreBaskerville-Regular.ttf'),
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
      <AuthContextProvider>
        <Navigation/>
      </AuthContextProvider>
    </NavigationContainer>
  );
}


