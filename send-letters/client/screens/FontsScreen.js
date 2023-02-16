import { Text, View } from 'react-native';
import React from 'react';
// import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

function FontsScreen() {
  if (!fontsLoaded) {
    return null; //<AppLoading/>
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Fonts</Text>
    </View>
  );
  }

export default FontsScreen;