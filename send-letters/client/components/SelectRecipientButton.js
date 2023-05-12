import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { truncate } from '../helpers/stringValidation';

const SelectRecipientButton = (props) => {
    const item = props.userInfo;

    return (
      <View>
        <TouchableOpacity style={styles.friendCircle} onPress={props.onPress} title={item.username}>
          <Text style={styles.friendMidText}>{(item.name).replace(/["]/g, '')[0]}</Text>
        </TouchableOpacity>
          <Text style={{textAlign: 'center', fontSize: 12}}>{truncate(item.username.replace(/["]/g, ''), 10)}</Text>
      </View>
    );
};

export default SelectRecipientButton;

const styles = StyleSheet.create({
  friendCircle: {
<<<<<<< HEAD
    height: wp('18%'),
    width: wp('18%'),
    borderRadius: wp('18%'), 
=======
    height: wp('13%'),
    width: wp('13%'),
    borderRadius: wp('8%'), 
>>>>>>> 2e8e2ae1dc838e9e80c34e7b7686951295861972
    backgroundColor: "rgba(30,70,147,0.2)",
    marginTop: hp('0.5%'),
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'), 
    marginBottom: hp('0.5%'),
  },
  friendMidText: {
    textAlign: "center",
    fontSize: wp('5%'), 
    color: "#1E4693",
    opacity: 1,
    marginTop: hp('2.8%'), 
    fontWeight: "600"
  }
});
