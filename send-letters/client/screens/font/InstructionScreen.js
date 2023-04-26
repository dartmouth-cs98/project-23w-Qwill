import { Text, View, StyleSheet, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../../styles/colors';
import ButtonPrimary from '../../components/ButtonPrimary';

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
      <View style={{ flexDirection: "row", marginTop: windowHeight *.02 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons style={{paddingLeft: windowWidth*.015}} name={"arrow-back"} size={normalize(40)} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Create Custom Font</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.listContainer}>
        <Text ordered={true} style={styles.listItem}>
            1. On a plain white sheet of paper and a black pen, write out the alphabet in uppercase letters. Make sure their is enough space between the characters and that they are large enough.
        </Text>
        <Text ordered={true} style={styles.listItem}>
            2. On another line, right the alphabet in lowercase.
        </Text>
        <Text ordered={true} style={styles.listItem}>
            3. Either take a photo of your writing or scan the document and select from camera roll and we will do the rest!
        </Text>
        </View>
        <View style={{flexDirection: "row"}}>
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
        </View>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: normalize(30),
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
  noCustom: {
    width: "80%",
    // height: windowHeight *.12,
    // aspectRatio: 4,
    // height: "30%",
    borderRadius: 20,
    backgroundColor: "#E2E8F6",
    marginTop: windowHeight *.02,
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
        flex: 1,
        width: "80%"
    },
    listItem: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 8,
        // textAlign: "left"
    },
});

