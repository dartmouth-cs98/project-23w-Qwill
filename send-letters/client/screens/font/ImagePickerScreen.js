import React, { useState, useContext } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { AuthContext } from '../../context/AuthContext';
import { Snackbar } from 'react-native-paper';


export default function ImagePickerScreen() {
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
        console.log(resp);
        
        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios or image is larger than 16mb");
          setSnackMessage("Could not establish connection to the server or image is larger than 16mb");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          setSnackMessage(resp.data.error);
          setSnackIsVisible(true);
        } else if (!resp.data || !resp.data.ok) {
          console.error("Error: the response does not contain the expected fields");
        } else {
          console.log(resp.data);
        }
      } catch (err) {
        console.error(err);
      }

    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={handlePickImagePressed} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

