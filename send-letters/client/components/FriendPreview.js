import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UnopenedLetterSmall from './UnopenedLetterSmall';

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
        height: 94,
        width: 312,
        backgroundColor: "#97ACE2",
        borderRadius: 20,
        marginBottom: 15
    },
    shadow: {
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    profilePicture: {
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: "#000000",
        position: "absolute",
        left: 18,
        top: 11
    },
    username: {
        fontSize: 11,
        position: "absolute",
        top: 72,
        left: 18
    },
    letterContainer: {
        position:"absolute", 
        left:100, 
        top: 0
    }
});

export default FriendPreview;