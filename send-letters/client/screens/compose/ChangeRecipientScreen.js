import { AuthContext } from '../../context/AuthContext';
import { ComposeContext } from '../../context/ComposeStackContext';
import { hasRestrictedChar } from '../../helpers/stringValidation';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, FlatList, } from 'react-native';
import axios from 'axios';
import findIP from '../../helpers/findIP';
import React, { useState, useContext, useEffect } from 'react'
import SelectRecipientButton from '../../components/SelectRecipientButton';
import styles from '../../styles/Profile.component.style';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function ChangeRecipientScreen({ navigation }) {
    const [userInfo, setUserInfo] = useContext(AuthContext);
    const [matchingUsers, setMatchingUsers] = useState("");
    const [letterInfo, setLetterInfo] = useContext(ComposeContext);

    const [snackMessage, setSnackMessage] = useState("");
    const [snackIsVisible, setSnackIsVisible] = useState(false);
    const onDismissSnack = () => setSnackIsVisible(false);

    const handleNextPressed = (item) => {
        setLetterInfo({ ...letterInfo, recipientID: item._id, recipientUsername: item.username });
        navigation.goBack(null);
    };

    const handleChangeText = async (text) => {
        const newText = text.toLowerCase();
        const senderID = userInfo.user._id;

        // no need to connect to server if text contains restricted characters
        if (hasRestrictedChar(text) == true) {
            setMatchingUsers([]);
            return;
        }

        try {
            const resp = await axios.post(findIP() + "/api/matchUsers", { senderID, textToMatch: newText, friends: true });

            if (!resp) {  // could not connect to backend
                console.log("ERROR: Could not establish server connection with axios");
                setSnackMessage("Could not establish connection to the server");
                setSnackIsVisible(true);
            } else if (resp.data.error) {  // backend error
                console.error(error);
            } else if (!resp.data || !resp.data.matchingUsers) {
                console.error("Error: the response does not contain the expected fields");
            } else {
                setMatchingUsers(resp.data.matchingUsers);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Displays all friends
    useEffect(() => {
        handleChangeText("");
    }, []);

    // this function renders the users that match the text in the input component
    function renderMatches() {
        if (matchingUsers.length == 0) {
            return <Text style={{ textAlign: 'center' }}>No users found</Text>
        }
        return (
            <View>
                <FlatList
                    nestedScrollEnabled
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: "center" }}
                    data={matchingUsers}
                    numColumns={3}
                    renderItem={({ item }) => <SelectRecipientButton userInfo={item} onPress={() => handleNextPressed(item)} />}
                    keyExtractor={item => item.username}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeview}>
            <Text style={styles.selectTitleText}>Select a recipient</Text>
            <View style={[styles.recipientsContainer]}>
                <View style={styles.inputContainer}>
                    <Input
                        placeholder="enter name or username"
                        autoCompleteType="email"
                        autoCapitalize="none"
                        onChangeText={handleChangeText}
                        inputContainerStyle={{ borderBottomWidth: 0, backgroundColor: 'white', height: wp('8%'), width: wp('85%'), borderRadius: 5}}
                        leftIcon={{ type: 'font-awesome', name: 'search', size: wp('4%'), marginLeft: wp('3%') }}
                    />
                </View>
                <View>
                    {renderMatches()}
                </View>
            </View>
        </SafeAreaView>
    );
};