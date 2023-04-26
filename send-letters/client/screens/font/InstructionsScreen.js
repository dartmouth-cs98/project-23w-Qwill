import { Text, View, StyleSheet, FlatList, Dimensions, PixelRatio } from 'react-native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonPrimary from '../../components/ButtonCircle';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen


const InstructionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF" }}>
      <Text style={{ textAlign: "center", textDecorationLine: 'underline', marginTop: 20 }}>Here our your instructions. Read carefully!</Text>
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
    </SafeAreaView>
  );
};

export default InstructionsScreen;