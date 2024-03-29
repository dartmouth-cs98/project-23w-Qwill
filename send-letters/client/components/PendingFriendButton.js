import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { truncate } from '../helpers/stringValidation';

const PendingFriendButton = (props) => {
    const item = props.userInfo.requesterInfo;
    return (
        <View style={styles.outerView}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.friendCircle} title={item.username}>
                    <Text style={styles.friendMidText} allowFontScaling={false}>{(item.name).replace(/["]/g, '')[0]}</Text>
                </View>
                <View>
                    <Text style={{ textAlign: 'left', fontSize: wp('3.5%'), marginLeft: wp('1%'),marginTop: hp('1.5%'), fontWeight: '600' }} allowFontScaling={false}>
                        {truncate(item.username.replace(/["]/g, ''), 10)} wants to be friends
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", position: "relative", top: -hp('3.5%'), left: wp('18%') }}>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onAcceptPressed}>
                    <Text style={styles.adText} allowFontScaling={false}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onDeclinePressed}>
                    <Text style={styles.adText} allowFontScaling={false}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PendingFriendButton;

const styles = StyleSheet.create({
    outerView: {
        backgroundColor: COLORS.friendsButtonBackground,
        marginVertical: hp('1%'),
        padding: wp('3%'),
        borderRadius: wp("3%"),
        width: wp('80%'),
        aspectRatio: 3,
        borderColor: "#CACED7",
        borderWidth: wp('0.23%'),
    },
    friendCircle: {
        width: wp('15%'),
        aspectRatio: 1,
        borderRadius: wp('15%'),
        backgroundColor: "rgba(30,70,147,0.2)",
        marginTop: hp('1%'),
        marginLeft: wp('2%'),
        marginRight: wp('2%'),
        marginBottom: hp('1%'),
        justifyContent: "center",
    },
    friendMidText: {
        textAlign: "center",
        fontSize: wp('4.5%'),
        color: "#1E4693",
        opacity: 1,
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
        borderColor: "#CACED7",
        borderWidth: wp('0.23%'),
    },
    adText: {
        fontSize: wp('3.5%'),
        fontWeight: "500",
        color: "#7184B4",
        textAlign: "center",
    }
});