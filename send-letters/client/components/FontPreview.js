import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Modal, TouchableOpacity, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import findIP from '../helpers/findIP';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Snackbar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../styles/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Title hidding code by GPT4

const FontPreview = props => {

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [displayName, setDisplayName] = useState(props.displayName);

  const [snackMessage, setSnackMessage] = useState("");
  const [snackIsVisible, setSnackIsVisible] = useState(false);
  const onDismissSnack = () => setSnackIsVisible(false);

  const handleTextChange = async (text) => {
    setTitle(text);
  };

  const handleEnterPressed = async () => {
    if (modalVisible && title != displayName) {
      try {
        const resp = await axios.post(findIP()+"/api/updateFontName", { fontID: props.fontID, newName: title });
        
        if (!resp) {  // could not connect to backend
          console.log("ERROR: Could not establish server connection with axios");
          setSnackMessage("Could not establish connection to the server");
          setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
          setSnackMessage(resp.data.error);
          setSnackIsVisible(true);
        } else if (!resp.data || !resp.data.ok) {
          console.error("Error: the response does not contain the expected fields");
        } else {
          // setSnackMessage("Font " + title + " successfully renamed");
          // setSnackIsVisible(true);
          // update the font name on the screen
          setDisplayName(title);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };


  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={() => {setTitle(displayName); setModalVisible(!modalVisible);}}>
              <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
            </TouchableOpacity>

            {
              props.customFont ? (
                <TextInput 
                  style={[styles.modalTitle, props.style, {width: wp("60%")}]} 
                  onChangeText={text => handleTextChange(text)}
                  value={title}
                  onFocus={(event) => {
                    this.textInputRef.setNativeProps({ selection: { start: title.length, end: title.length } });
                  }}
                  ref={(input) => { this.textInputRef = input; }} 
                  onSubmitEditing={() => handleEnterPressed()}
                  onBlur={handleEnterPressed}
                />
              ) : (
                <Text style={[styles.modalTitle, props.style]}>{props.title}</Text>
              )
            }

            <ScrollView>
              <Text style={[styles.modalBody, props.style]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onPress ? props.onPress : () => setModalVisible(true)}
      >
        <Text style={[styles.font, props.style]}>AaBbCc</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer} >
        <Text style={[styles.title, props.style]} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
      {/* <Snackbar
          style={styles.snackbar}
          //SnackBar visibility control
          visible={snackIsVisible}
          onDismiss={() => {setSnackIsVisible(false)}}
          // short dismiss duration
          duration={2000}
          >
            <Text style={styles.snackBarText}>{snackMessage}</Text>
        </Snackbar> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp('25%'),
    aspectRatio: 1,
    borderWidth: wp(".25%"),
    borderRadius: wp('5%'),
    borderStyle: 'dashed',
    borderColor: "#000000",
    justifyContent: "center",
  },
  font: {
    textAlign: "center",
    fontSize: wp('5%'),
    // letterSpacing: -5,
  },
  title: {
    textAlign: "center",
    fontSize: wp('2.5%')
  },
  titleContainer: {
    width: wp('25%'),
    overflow: 'hidden',
  },
  modalView: {
    margin: wp('5%'),
    height: hp('50%'),
    width: wp('90%'),
    backgroundColor: "#E2E8F6",
    borderRadius: wp('5%'),
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22
  },
  closeButton: {
    position: 'absolute', 
    top: hp('4%'),
    left: wp('4%'),
    height: wp('10%'),
    width: wp('10%'),
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: wp('6%'),
    textDecorationLine: 'underline',
    marginBottom: wp('2%'),
  },
  modalBody: {
    fontSize: wp('3.25%'),
  },
  snackBarText: {
    color: COLORS.white,
    textAlign: 'center'
  },
  snackbar: {
    opacity: 0.7,
    alignSelf: 'center',
    width: wp('70%'),
    height: hp('80%'),
    bottom: hp('1.3%'),
    fontSize: wp('4%'),
    borderRadius: wp('4%'),
  },
});

export default FontPreview;
