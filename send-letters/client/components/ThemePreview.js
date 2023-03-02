import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import { Image } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../styles/colors'


const ThemePreview = props => {
  return (
    <TouchableOpacity
      style={styles.containerTheme}
      onPress={props.onPress}
    >
        <Text style={styles.text}>{props.themeName}</Text>
        <Image 
          style={{
            height: undefined, 
            width: '100%',
            aspectRatio: 1,
            resizeMode: "contain"}}
          source={require('../assets/themes/theme1.png')}
        />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerTheme: {
    width: 150,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E2E8F6',
    borderRadius: 20,
    marginTop: 10
  },
  text: {
    fontWeight: "700"
  }
});

export default ThemePreview;