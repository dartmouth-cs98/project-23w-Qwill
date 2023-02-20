import { Text, View } from 'react-native';
import React, { useState } from "react";
import AppLoading from 'expo-app-loading';
import useFonts from '../hooks/useFonts';

function FontsScreen() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const LoadFonts = async() => {
        await useFonts();
    };
    console.log(fontsLoaded);
    if (!fontsLoaded) {
        return(
            <AppLoading
                startAsync={LoadFonts}
                onFinish={() => setFontsLoaded(true)}
                onError={console.warn}
            />
        )
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style = {{ fontFamily : 'my_nerve'}}>Fonts</Text>
      </View>
    );
  };

export default FontsScreen;