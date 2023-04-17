import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';

const screenWidth = Dimensions.get('window').width;

const AddFriendButton = (props) => {
    const item = props.userInfo;

    return (
        <View style={styles.outerView}>
            <View style={styles.friendCircle} title={item.username}>
                <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
            </View>
            <View>
                <Text style={{textAlign: 'left', fontSize: 12}}>{(item.username).replace(/["]/g, '')}</Text>
                <Text style={{textAlign: 'left', fontSize: 12}}>{"Already on Qwill"}</Text>
            </View>
            <View>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onPress}>
                    {item.friendStatus == "non-friends" ?
                        <Text>Send Invite</Text>
                        :
                        <Text>Request Sent</Text>
                    }
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AddFriendButton;


const styles = StyleSheet.create({
    outerView: { 
        backgroundColor: COLORS.friendsButtonBackground,
        marginVertical: '1.5%',
        padding: '3%',
        flexDirection:'row',
        borderRadius: '40%',
        width: screenWidth/1.25,
    },
    friendCircle: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: "rgba(30,70,147,0.2)",
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    friendMidText: {
        textAlign: "center",
        fontSize: 20,
        color: "#1E4693",
        opacity: 1,
        marginTop: 21,
        fontWeight: "600"
    },
    sendInviteButton: {
        height: 40,
        width: 70,
        borderRadius: 5,
        backgroundColor: COLORS.white,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
});