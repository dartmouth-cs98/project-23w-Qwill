import {Text, View} from 'react-native';
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
                    'MyNerve': require('../assets/fonts/MyNerve_Regular.ttf'),
                    'GloriaHallelujah': require('../assets/fonts/GloriaHallelujah-Regular.ttf'),
                    'HomemadeApple': require('../assets/fonts/HomemadeApple-Regular.ttf'),
                    'IndieFlower': require('../assets/fonts/Mansalva-Regular.ttf'),
                    'ShadowsIntoLight': require('../assets/fonts/ShadowsIntoLight-Regular.ttf'),
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
              onLayout={onLayoutRootView}>
            <Text style={{fontFamily: 'MyNerve'}}>MyNerve</Text>
            <Text style={{fontFamily: 'GloriaHallelujah'}}>GloriaHallelujah</Text>
            <Text style={{fontFamily: 'HomemadeApple'}}>HomemadeApple</Text>
            <Text style={{fontFamily: 'IndieFlower'}}>IndieFlower</Text>
            <Text style={{fontFamily: 'ShadowsIntoLight'}}>ShadowsIntoLight</Text>

        </View>
    );
};
