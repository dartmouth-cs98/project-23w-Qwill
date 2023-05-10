import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, PixelRatio} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ToolBarComponent = props => {
    if (props.text == "Font") {
        return (
            <View style={styles.container}>
                <View style={{height: 8}}></View>
                <View style={[styles.fontIcon, styles.fontIconUnselected]}>
                    <Text style={styles.fontIconTextUnselected}>Aa</Text>
                </View>
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
    fontSize: wp('2.34%'),
    color: "#888989"
  }, 
  fontIcon: {
    height: hp('2.16%'), 
    width: wp('4.67%'),
    borderRadius: wp('1.17%'),
    borderWidth: wp('0.28%'),
    alignItems: 'center'
  },
  fontIconUnselected: {
    borderColor: "#888989"
  },
  fontIconTextUnselected: {
    fontWeight: "400",
    color: "#888989",
    marginTop: hp('0.11%'),
    fontSize: wp('2.8%')
  }
});

export default ToolBarComponent;