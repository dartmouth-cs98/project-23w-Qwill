import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';

const screenWidth = Dimensions.get('window').width;

const PendingFriendButton = (props) => {
    const item = props.userInfo.requesterInfo;

    return (
        <View style={styles.outerView}>
            <View style={{flexDirection: "row"}}>
                <View style={styles.friendCircle} title={item.username}>
                    <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
                </View>
                <View>
                    <Text style={{textAlign: 'left', fontSize: 11, marginTop: 10, fontWeight: '600'}}>{(item.username).replace(/["]/g, '')} wants to be friends</Text>
                </View>
            </View>
            <View style={{flexDirection: "row", position: "relative", top: -45, left: 100}}>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onAcceptPressed}>
                    <Text style={styles.adText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onDeclinePressed}>
                    <Text style={styles.adText}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PendingFriendButton;


const styles = StyleSheet.create({
    outerView: { 
        backgroundColor: COLORS.friendsButtonBackground,
        marginVertical: '1.5%',
        padding: '3%',
        // flexDirection:'row',
        borderRadius: 20,
        width: "80%",
        aspectRatio: 3
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
        height: 35,
        width: 80,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 10,
        justifyContent: "center",
    },
    adText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#7184B4",
        textAlign: "center"
    }
});