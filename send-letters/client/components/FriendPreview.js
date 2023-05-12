import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UnopenedLetterSmall from './UnopenedLetterSmall';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const FriendPreview = props => {
    return (
        <View style={[styles.container, styles.shadow]}>
            <View style={styles.profilePicture}></View>
            <Text style={styles.username}>{props.username}</Text>
            <View style={styles.letterContainer}>
                <UnopenedLetterSmall sender="Tommy Rogers" senderAddress="Some Address" recipient="Tate Toussaint" recipientAddress="Some Other Address"></UnopenedLetterSmall>
            </View> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: hp('12%'),
        width: hp('12%'),
        backgroundColor: "#97ACE2",
        borderRadius: 20,
        marginBottom: hp('2%')
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    profilePicture: {
        height: hp('7%'),
        width: hp('7%'),
        borderRadius: hp('3.5%'),
        backgroundColor: "#000000",
        position: "absolute",
        left: wp('5.8%'),
        top: hp('1.5%')
    },
    username: {
        fontSize: hp('1.8%'),
        position: "absolute",
        top: hp('7.8%'),
        left: wp('17.2%')
    },
    letterContainer: {
        position:"absolute", 
        left: wp('32%'), 
        top: 0
    }
});

export default FriendPreview;
