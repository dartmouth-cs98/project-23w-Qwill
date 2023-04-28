import { Text, View, StyleSheet, FlatList, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontPreview from '../../components/FontPreview';
import ButtonCircle from '../../components/ButtonCircle';
import fontData from '../../assets/fontData';
import Ionicons from '@expo/vector-icons/Ionicons';

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
      <View style={[styles.header, styles.shadowLight]}></View>
      <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: windowHeight *.02 }}>
        <Text style={styles.titleText}>Fonts</Text>
        {/* <ButtonCircle icon="pencil"></ButtonCircle> */}
        <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate("InstructionsScreen") }}>
          <Ionicons name="pencil-outline" size={normalize(40)} ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", marginTop: windowHeight *.04 }}>
        <View style={styles.line}></View>
        <Text style={{fontSize: normalize(12),}}>Custom Fonts</Text>
        <View style={styles.line}></View>
      </View>
      <View style={styles.noCustom}>
        <Text style={{ textAlign: 'center', marginTop: windowHeight *.02, fontSize: normalize(12) }}>You don't have any custom fonts yet.</Text>
        <Text style={{ textAlign: 'center', marginTop: windowHeight *.02, marginBottom: windowHeight *.02,textDecorationLine: 'underline', fontSize: normalize(12) }} onPress={() => navigation.navigate("InstructionsScreen")}>Add Custom Font</Text>
      </View>
      <View style={{ flexDirection: "row", marginTop: windowHeight *.02 }}>
        <View style={styles.line}></View>
        <Text style={{fontSize: normalize(12) }}>Default Fonts</Text>
        <View style={styles.line}></View>
      </View>
      <View style={{ marginTop: windowHeight *.02, marginLeft: windowWidth *.06, marginRight: windowWidth *.06 }}>
        <FlatList
          contentContainerStyle={{ justifyContent: 'space-between'}}
          data={fontData}
          numColumns={3}
          renderItem={({ item }) =>
            <View style={{ marginLeft: windowWidth *.025, marginRight: windowWidth *.025, marginBottom: windowHeight*.01}}>
            {/* <View> */}
              <FontPreview style={item.style} title={item.title}></FontPreview>
            </View>}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#BDCCF2",
    width: "100%",
    height: "20%"
  },
  shadowLight: {
    shadowColor: '#171717',
    shadowOffset: {height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: normalize(50),
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: windowWidth *.04,
    marginTop: windowHeight *.008
  },
  line: {
    width: windowWidth * .3,
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginLeft: windowWidth *.02,
    marginRight: windowWidth *.02,
    marginTop: normalize(7)
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: 'white',
  },
  btn: {
    width: "18%",
  },
});

