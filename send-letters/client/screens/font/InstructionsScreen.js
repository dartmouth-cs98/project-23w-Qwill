import { Text, View, StyleSheet, TouchableOpacity, Dimensions, PixelRatio, Image } from 'react-native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../../styles/colors';
import ButtonBlue from '../../components/ButtonBlue.components';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const FontsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{ alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF" }}>
      <View style={{ flexDirection: "row"}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={{paddingLeft: windowWidth*.015}} name={"arrow-back"} size={normalize(40)} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Create Custom Font</Text>
      </View>
      <View style={styles.line}></View>
      <Text style={styles.centeredText}>To produce your custom font, we need a sample of your handwriting!</Text>
      <Text style={styles.centeredText}>Follow the instructions below and we will handle the rest!</Text>
      <View style={styles.line}></View>
      <View style={styles.listContainer}>
        <Text ordered={true} style={styles.listItem}>
            1. On a plain white sheet of paper and a black pen, write out the alphabet in uppercase letters. Make sure their is enough space between the characters and that they are large enough.
        </Text>
        <Text ordered={true} style={styles.listItem}>
            2. On another line, write the alphabet in lowercase.
        </Text>
        <Text ordered={true} style={styles.listItem}>
            3. Either take a photo of your writing or scan the document and select from camera roll.
        </Text>
      </View>
      <View style={styles.line}></View>
      <Text style={styles.centeredText}>Your sample should look something like this:</Text>
      <Image 
          style={{
            height: undefined,
            width: '80%',
            aspectRatio: 2,
            resizeMode: "contain",
          }}
          source={require('../../assets/exampleSample.png')}
      />
        {/* <View style={{flexDirection: "row"}}>
            <ButtonPrimary
                selected={false}
                title={"Add Font By Camera"}
                onPress={() =>{navigation.navigate("CameraScreen")}}
            />
            <ButtonPrimary
                selected={false}
                title={"Add Font By Image..."}
                onPress={() =>{navigation.navigate("ImagePickerScreen")}}
            />
        </View> */}
        <ButtonBlue style={[styles.btn, styles.shadow]} title="Select your handwriting sample!" onPress={() =>{navigation.navigate("ImagePickerScreen")}}></ButtonBlue>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: windowWidth *.03,
    marginTop: windowHeight *.012
  },
  line: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomColor: COLORS.blue400,
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "90%",
    alignSelf: 'center'
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: 'white',
  },
    listContainer: {
        width: "80%",
        // marginBottom: 20
    },
    listItem: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily: 'JosefinSansBold',
    },
    centeredText: {
      fontFamily: 'JosefinSansBold',
      fontSize: 16,
      textAlign: 'center',
      paddingHorizontal: 15,
      marginTop: 10,
      marginBottom: 10
    },
    btn: {
      width: "80%",
    },
    shadow: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 3,
  },
      
});

