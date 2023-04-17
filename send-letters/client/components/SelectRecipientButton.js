import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

const SelectRecipientButton = (props) => {
    const item = props.userInfo;

    return (
      <View>
        <TouchableOpacity style={styles.friendCircle} onPress={props.onPress} title={item.username}>
          <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
        </TouchableOpacity>
          <Text style={{textAlign: 'center', fontSize: 12}}>{(item.username).replace(/["]/g, '')}</Text>
      </View>
    );
};

export default SelectRecipientButton;


const styles = StyleSheet.create({ 
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
      }
});