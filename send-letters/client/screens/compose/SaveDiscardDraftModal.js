import { Alert, TouchableOpacity, StyleSheet, View, Modal, Text } from "react-native";
import React, { useContext, useState, useEffect } from 'react';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { ComposeContext } from '../../context/ComposeStackContext';
import ButtonBlue from '../../components/ButtonBlue.components';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SaveDiscardDraftModal = ({ navigation }) => {
    const [letterInfo, setLetterInfo] = useContext(ComposeContext);
    const [saveModalVisible, setSaveModalVisible] = useState(false);

    const handleDiscard = async () => {
        if (letterInfo.letterID != "") {
            const resp = await axios.post(findIP() + "/api/deleteLetter", { letterID: letterInfo.letterID });
            if (!resp) {  // could not connect to backend
                console.log("ERROR: Could not establish server connection with axios");
                setSnackMessage("Could not establish connection to the server");
                setSnackIsVisible(true);
            } else if (resp.data.error) {  // backend error
                setSnackMessage(resp.data.error);
                setSnackIsVisible(true);
            } else if (!resp.data || !resp.data.ok) {
                console.error("Error: the response does not contain the expected fields");
            }
        }
        setSaveModalVisible(false);
        setTimeout(() => {
            setLetterInfo({
                ...letterInfo,
                letterID: "",
                text: "",
                recipientID: "",
                themeID: "",
                recipientUsername: "",
                fontID: "",
                fontName: "",
                customFont: false,
                stickers: [],
                status: ""
            });
            navigation.replace('NavBar', { screen: 'Home', params: { screen: 'Mailbox' } });
        }, 0);
    };

    const handleSave = () => {
        setSaveModalVisible(false);
        setTimeout(() => {
            setLetterInfo({
                ...letterInfo,
                letterID: "",
                text: "",
                recipientID: "",
                themeID: "",
                recipientUsername: "",
                fontID: "",
                fontName: "",
                customFont: false,
                stickers: [],
                status: ""
            });
            navigation.replace('NavBar', { screen: 'Home', params: { screen: 'Mailbox' } });
        }, 0);
    };

    return (
        <View>
            <Modal 
                animationType="slide"
                transparent={true}
                visible={saveModalVisible}
                onRequestClose={() => {setSaveModalVisible(false);}}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSaveModalVisible(false)}>
                            <Ionicons style={styles.icon} name={'close-outline'} size={wp("10%")}></Ionicons>
                        </TouchableOpacity>
                        <Text style={styles.modalTitleText} allowFontScaling={false}>Discard or Save</Text>
                        <Text style={styles.modalText} allowFontScaling={false}>Discard or save your draft?</Text>
                        <ButtonBlue title={"Discard"} style={{marginTop: wp("5%")}} onPress={() => handleDiscard("discard")}/>
                        <ButtonBlue title={"Save"} style={{marginTop: wp("5%")}} onPress={() => handleSave("save")}/>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => {
                setSaveModalVisible(true);
            }}>
                <Ionicons name={"close-outline"} size={40} style={{ marginTop: hp(".9%") }} />
            </TouchableOpacity>
        </View>
    );
}

export default SaveDiscardDraftModal;


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      margin: wp('5%'),
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
    closeButton: {
      position: 'absolute', 
      top: hp('3.5%'),
      left: wp('4%'),
      height: wp('10%'),
      width: wp('10%'),
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitleText: {
      fontSize: wp('6%'),
      fontWeight: "bold",
    },
    modalText: {
      fontSize: wp('3.5%'),
      textAlign: 'center',
      marginTop: hp('1%'),
    },
  });