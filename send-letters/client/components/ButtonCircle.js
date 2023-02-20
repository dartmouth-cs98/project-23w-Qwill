import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


const ButtonCircle = props => {
    return (
        <TouchableOpacity
          style={styles.containerBtn}
          onPress={props.onPress}
        >
            <Ionicons 
                style={styles.icon} 
                name={props.icon}
                size={24}
            >
            </Ionicons>
        </TouchableOpacity>
    );
};


const styles = StyleSheet.create({
    icon: {
        display: "flex",
        alignItems: "center",
        color: "#FFFFFF",
    }, 
    containerBtn: {
        width: 48, 
        height: 48,
        borderRadius: 24,
        backgroundColor: "#7184B4",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
      }
});

export default ButtonCircle;