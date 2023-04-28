import React from 'react';
import { StyleSheet, Text, Dimensions, View } from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'
import { Image } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../styles/colors'

const screenWidth = Dimensions.get('window').width;


const ThemePreview = props => {
  return (
    <TouchableOpacity
      style={{}}
      onPress={props.onPress}
    >
      {/* <View style={{flexDirection: 'row'}}> */}
        {/* <Text style={styles.text}>{props.themeName}</Text> */}
        <Image 
          style={styles.theme}
          source={props.imageSource}
        />
        <Text style={styles.themeNameText}>{props.themeName}</Text>
        {/* <View style={styles.titleContainer}>
          <Text style={styles.themeNameText}>{props.themeName}</Text>
        </View> */}
        
      {/* </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerTheme: {
    width: screenWidth*.9,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#E2E8F6',
    borderRadius: 20,
    marginTop: 10
  },
  theme: {
    height: undefined, 
    width: screenWidth*.45,
    aspectRatio: 1,
    resizeMode: "contain",
    // marginBottom: "15%"
  },
  titleContainer: {
    height: 180,
    width: screenWidth*.5,
    // justifyContent: "center",
    // justifyContent: 'center', //Centered horizontally
    // alignItems: 'center', //Centered vertically
    // flex:1
    // textAlignVertical: "center"
  },
  themeNameText: {
    fontSize: 18, 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    flex: 1,
    textAlign: "center",
    marginTop: "8%"
  }
});

export default ThemePreview;