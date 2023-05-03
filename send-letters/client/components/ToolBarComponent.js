import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import COLORS from '../styles/colors'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ToolBarComponent = props => {
    if (props.text == "Font") {
        return (
            <View style={styles.container}>
                <View style={{height: 8}}></View>
                <View style={[styles.fontIcon, styles.fontIconUnselected]}>
                    <Text style={styles.fontIconTextUnselected}>Aa</Text>
                </View>
            {/* <Text style={styles.text}>{props.text}</Text> */}
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={{height: 8}}></View>
                <Ionicons
                style={styles.icon}
                name={props.icon}
                size={20}
                >
                </Ionicons>
            {/* <Text style={styles.text}>{props.text}</Text> */}
            </View>
        );
    }
};

const styles = StyleSheet.create({
  icon: {
    alignItems: "center",
    color: "#888989",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 10,
    color: "#888989"
  }, 
  fontIcon: {
    height: 20, 
    width: 20,
    borderRadius: 5,
    borderWidth: 1.2,
    alignItems: 'center'
  },
  fontIconUnselected: {
    borderColor: "#888989"
  },
  fontIconTextUnselected: {
    fontWeight: "400",
    color: "#888989",
    marginTop: 1,
    fontSize: 12
  }
});

export default ToolBarComponent;