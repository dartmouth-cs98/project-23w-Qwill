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
            <View style={{marginLeft: wp("4%"), marginTop: "1%"}}>
                <Text style={{textAlign: 'left', fontSize: 12, fontWeight: '600'}}>{(item.username).replace(/["]/g, '')}</Text>
                <Text style={{textAlign: 'left', fontSize: 11, color: "#7184B4"}}>{"Already on Qwill"}</Text>
            </View>
            <View style={{marginLeft: wp("8%"), justifyContent: "center"}}>
                <TouchableOpacity style={styles.sendInviteButton} onPress={props.onPress}>
                    {item.friendStatus == "non-friends" ?
                        <View style={{flexDirection: "row", alignSelf: "center"}}>
                            <Text style={styles.sendInviteText}>Send Invite</Text>
                            {/* <Ionicons style={styles.icon} name={'add-outline'} size={16}></Ionicons> */}
                        </View>
                        :
                        <Text style={styles.sendInviteText}>Unsend Request</Text>
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
        marginVertical: hp('1%'),
        padding: wp('2.5%'),
        flexDirection:'row',
        borderRadius: wp('3%'),
        width: wp('80%'),
        aspectRatio: 4,
    },
    friendCircle: {
        width: wp('15%'),
        aspectRatio: 1,
        borderRadius: wp('100%'),
        backgroundColor: "rgba(30,70,147,0.2)",
        justifyContent: "center",
    },
    friendMidText: {
        textAlign: "center",
        fontSize: wp('5%'),
        color: "#1E4693",
        opacity: 1,
        fontWeight: "600",
    },
    sendInviteButton: {
        width: wp('25%'),
        aspectRatio: 3,
        borderRadius: wp('20%'),
        backgroundColor: COLORS.white,
        justifyContent: "center",
    },
    sendInviteText: {
        fontSize: wp('3%'),
        color: "#7184B4",
        textAlign: 'center',
    },
    icon: {
        display: "flex",
        alignItems: "center",
        color: "#1E4693",
      }
});