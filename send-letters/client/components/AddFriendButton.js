import { COLORS } from '../styles/colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const AddFriendButton = (props) => {
    const item = props.userInfo;

    return (
        <View style={styles.outerView}>
            <View style={styles.friendCircle} title={item.username}>
                <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
            </View>
            <View style={{marginLeft: "4%", marginTop: "1%"}}>
                <Text style={{textAlign: 'left', fontSize: 12, fontWeight: '600'}}>{(item.username).replace(/["]/g, '')}</Text>
                <Text style={{textAlign: 'left', fontSize: 11, color: "#7184B4"}}>{"Already on Qwill"}</Text>
            </View>
            <View style={{marginLeft: "20%"}}>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onPress}>
                    {item.friendStatus == "non-friends" ?
                        <View style={{flexDirection: "row", alignSelf: "center"}}>
                            <Ionicons style={styles.icon} name={'add-outline'} size={normalize(16)}></Ionicons>
                            <Text style={styles.sendInviteText}>Send Invite</Text>
                        </View>
                        :
                        <Text style={styles.sendInviteText}>Request Sent</Text>
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
        marginVertical: hp('1.5%'),
        padding: wp('3%'),
        flexDirection:'row',
        borderRadius: wp('3%'),
        width: wp('80%'),
        aspectRatio: 5,
    },
    friendCircle: {
        width: wp('15%'),
        aspectRatio: 1,
        borderRadius: wp('100%'),
        backgroundColor: "rgba(30,70,147,0.2)",
    },
    friendMidText: {
        textAlign: "center",
        fontSize: wp('3.5%'),
        color: "#1E4693",
        opacity: 1,
        marginTop: hp('28%'),
        fontWeight: "600",
    },
    sendInviteButton: {
        width: wp('60%'),
        aspectRatio: 3,
        borderRadius: wp('20%'),
        backgroundColor: COLORS.white,
        marginTop: hp('4%')
    },
    sendInviteText: {
        fontSize: wp('2.5%'),
        color: "#7184B4",
        textAlign: 'center',
        marginTop: hp('9%')
    },
    icon: {
        display: "flex",
        alignItems: "center",
        color: "#1E4693",
        marginTop: hp('6%'),
      }
});