import { Alert, TouchableOpacity } from "react-native";
import React, { useContext } from 'react';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import { ComposeContext } from '../../context/ComposeStackContext';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ThreeButtonAlert = ({navigation}) => {
    const [letterInfo, setLetterInfo] = useContext(ComposeContext);

    const handleDiscard = async () => {        
        if (letterInfo.letterID == "") {
            // letter was never saved in db
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            );
            return;
        }

        const resp = await axios.post(findIP()+"/api/deleteLetter", { letterID: letterInfo.letterID });
        
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
            console.log("letter deleted successfully");
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    };

    const handleSave = () => {
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
            <Ionicons name={"close-outline"} size={40} style={{marginTop: hp(".9%")}}/>
        </TouchableOpacity>
    );
}

export default ThreeButtonAlert;