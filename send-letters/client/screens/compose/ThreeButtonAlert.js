import { Alert, TouchableOpacity } from "react-native";
import { CommonActions } from '@react-navigation/native';
import { ComposeContext } from '../../context/ComposeStackContext';
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useContext } from 'react';
import findIP from '../../helpers/findIP';

const ThreeButtonAlert = ({ navigation }) => {
    const [letterInfo, setLetterInfo] = useContext(ComposeContext);

    const handleDiscard = async () => {
        console.log('Discard pressed');
        resp = null;
        resp = await axios.post(findIP() + "/api/deleteLetter", letterInfo);

        if (!resp) {  // could not connect to backend
            console.log("ERROR: Could not establish server connection with axios");
            //setSnackMessage("Could not establish connection to the server");
            //setSnackIsVisible(true);
        } else if (resp.data.error) {  // backend error
            //setSnackMessage(resp.data.error);
            //setSnackIsVisible(true);
        } else {
            setLetterInfo({
                letterID: "",
                text: "",
                recipientID: "",
                themeID: "",
                recipientUsername: "",
                fontID: "",
                stickers: []
            });
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            );
        }

    };

    const handleSave = () => {
        console.log('Save pressed');
        setLetterInfo({
            letterID: "",
            text: "",
            recipientID: "",
            themeID: "",
            recipientUsername: "",
            fontID: "",
            stickers: []
        });
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    };

    const threeButtonAlert = () => {
        Alert.alert('Discard or Save', 'Discard or save your draft?', [
            {
                text: 'Discard',
                onPress: () => handleDiscard(),
                style: 'destructive',
            },
            { text: 'Save', onPress: () => handleSave() },
            { text: 'Cancel', onPress: () => console.log('Canceled') },
        ]);
    };

    return (
        <TouchableOpacity onPress={() => {
            threeButtonAlert();
        }}>
            <Ionicons name={"close-outline"} size={40} />
        </TouchableOpacity>
    );
}

export default ThreeButtonAlert;