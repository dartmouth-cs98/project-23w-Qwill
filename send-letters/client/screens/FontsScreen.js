import { Text, View } from 'react-native';
import React, {useState, useEffect, useCallback} from "react";
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function FontsScreen() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    'my_nerve': require('../assets/fonts/mynerve.ttf'),
                });

            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setFontsLoaded(true);
            }
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    if (!fontsLoaded) {
        return null;
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            onLayout={onLayoutRootView}>
        <Text style = {{ fontFamily: 'my_nerve' }}>Fonts</Text>
      </View>
    );
  };
