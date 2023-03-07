import { Text, View, StyleSheet, Dimensions, ImageBackground, ScrollView} from 'react-native';
import React, { useState, useLayoutEffect, useEffect, useContext } from 'react'
import { Button, Input, Image } from 'react-native-elements';
import ButtonPrimary from '../../components/ButtonPrimary';
import { composeStackGoBack } from '../../helpers/composeStackGoBack';
import { Ionicons } from '@expo/vector-icons';
import { ComposeContext } from '../../context/ComposeStackContext';
import images from '../../assets/imageIndex';
import { SafeAreaView } from 'react-native-safe-area-context';

function ComposeScreen({ navigation, route }) {
  const [letterInfo, setLetterInfo] = useContext(ComposeContext);
  const [text, setText] = useState(letterInfo.text);

  const composeHomeGoBack = () => {
    navigation.navigate('Home');
  };

  const handleNextPressed = () => {
    navigation.push('Preview');
  };


  return ( //todo amanda add fonts
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.titleText}>Make your Letter!</Text>
      <ImageBackground 
        resizeMode={'cover'}
        style={{ flex: 1, width: '100%', height: '95%'}} 
        source={images.themes[letterInfo.themeID]}> 
          <Input
            style={{fontFamily: letterInfo.fontID, marginTop: 20, fontSize: 22}} 
            placeholder={"Start writing your letter!"}
            inputContainerStyle={{borderBottomWidth:0}}
            onChangeText={text => setLetterInfo({...letterInfo, text: text})}
            multiline={true}
          />
      </ImageBackground>
      <View style={{flexDirection: 'row'}}>
        <ButtonPrimary title={"Go back"} selected={true} onPress={() => composeStackGoBack(navigation, composeHomeGoBack)}/>
        <ButtonPrimary title={"Next!"} selected={true} onPress={() => handleNextPressed()}/>
      </View>
    </SafeAreaView>
  );
};

export default ComposeScreen;

const styles = StyleSheet.create({
  inputContainer: {
      
  },
  button: {
      width: 200, 
      marginTop: 10,
  },
  titleText: {
    fontSize: 20, 
    fontFamily: 'JosefinSansBold',
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 10
  },

});
