import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { truncate } from '../helpers/stringValidation';

const SelectRecipientButton = (props) => {
    const item = props.userInfo;

    return (
      <View>
        <TouchableOpacity style={styles.friendCircle} onPress={props.onPress} title={item.username}>
          <Text style={styles.friendMidText} allowFontScaling={false}>{(item.name).replace(/["]/g, '')[0]}</Text>
        </TouchableOpacity>
        <Text style={{textAlign: 'center', fontSize: hp('1.4%'), marginBottom: hp("1%")}} allowFontScaling={false}>
          {truncate(item.username.replace(/["]/g, ''), 10)}
        </Text>
      </View>
    );
};

export default SelectRecipientButton;

const styles = StyleSheet.create({
  friendCircle: {
    width: wp('18%'),
    aspectRatio: 1,
    borderRadius: wp('18%'), 
    backgroundColor: "rgba(30,70,147,0.2)",
    marginTop: hp('0.5%'),
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'), 
    marginBottom: hp('0.5%'),
    justifyContent: 'center'
  },
  friendMidText: {
    textAlign: "center",
    fontSize: wp('5%'), 
    color: "#1E4693",
    opacity: 1,
    marginTop: hp('2.8%'), 
    fontWeight: "600",
    fontSize: wp('5.6%'),
    bottom: wp('2.5%')
  }
});
