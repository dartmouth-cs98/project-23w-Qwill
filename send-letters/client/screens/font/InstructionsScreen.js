import { Text, View, StyleSheet, TouchableOpacity, Dimensions, PixelRatio, Button, Image } from 'react-native';
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../../styles/colors';
import ButtonPrimary from '../../components/ButtonPrimary';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext } from '../../context/AuthContext';
import { Snackbar } from 'react-native-paper';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const FontsScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [userInfo, setUserInfo] = useContext(AuthContext);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);


  const handlePickImagePressed = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      let base64image = result.assets[0].base64;

      // make server request
      try {
        const resp = await axios.post(findIP()+"/api/createCustomFont", { userID: userInfo.user._id, handwritingImage: base64image });
        
        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios or image is larger than 16mb");
          setSnackMessage("Could not establish connection to the server or image is larger than 16mb");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          setSnackMessage(resp.data.error);
          setSnackIsVisible(true);
        } else if (!resp.data || !resp.data.message) {
          console.error("Error: the response does not contain the expected fields");
        } else {
          console.log(resp.data);
          setSnackMessage(resp.data.message);
          setSnackIsVisible(true);
        }
      } catch (err) {
        console.error(err);
      }

    }
  };



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
      <View style={{flexDirection: "column"}}>
        <ButtonPrimary
            selected={false}
            title={"Add Font By Camera"}
            onPress={() =>{navigation.navigate("CameraScreen")}}
        />
        <Button title="Select image from camera roll" onPress={handlePickImagePressed}/>
      </View>
      {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}

      <Snackbar
        style={styles.snackbar}
        //SnackBar visibility control
        visible={snackIsVisible}
        onDismiss={() => {setSnackIsVisible(false)}}
        // short dismiss duration
        duration={2000}
      >
        <Text style={styles.snackBarText}>{snackMessage}</Text>
      </Snackbar>
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
    snackBarText: {
      color: COLORS.white,
      textAlign: 'center'
    },
    snackbar: {
      opacity: 0.7,
      alignSelf: 'center',
      width: windowWidth * .7,
      bottom: 10,
      fontSize: 30,
      borderRadius: 20,
    }
});

