import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PendingFriendButton = (props) => {
    const item = props.userInfo.requesterInfo;
    return (
        <View style={styles.outerView}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.friendCircle} title={item.username}>
                    <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'left', fontSize: wp('3.5%'), marginTop: hp('2%'), fontWeight: '600' }}>{(item.username).replace(/["]/g, '')} wants to be friends</Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", position: "relative", top: -hp('5%'), left: wp('23%') }}>
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
        marginVertical: hp('1.5%'),
        padding: wp('3%'),
        // flexDirection:'row',
        borderRadius: 20,
        width: wp('80%'),
        aspectRatio: 3
    },
    friendCircle: {
        height: hp('8%'),
        width: hp('8%'),
        borderRadius: hp('4%'),
        backgroundColor: "rgba(30,70,147,0.2)",
        marginTop: hp('1%'),
        marginLeft: wp('2%'),
        marginRight: wp('2%'),
        marginBottom: hp('1%'),
    },
    friendMidText: {
        textAlign: "center",
        fontSize: wp('6%'),
        color: "#1E4693",
        opacity: 1,
        marginTop: hp('2.5%'),
        fontWeight: "600"
    },
    sendInviteButton: {
        height: hp('4%'),
        width: wp('23%'),
        borderRadius: 20,
        backgroundColor: COLORS.white,
        marginLeft: wp('3%'),
        marginRight: wp('3%'),
        marginBottom: hp('1%'),
        justifyContent: "center",
    },
    adText: {
        fontSize: wp('3.5%'),
        fontWeight: "500",
        color: "#7184B4",
        textAlign: "center"
    }
});