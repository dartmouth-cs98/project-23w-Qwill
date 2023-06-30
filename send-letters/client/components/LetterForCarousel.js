import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ImageBackground, Image, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Citation: https://dev.to/gedalyakrycer/ohsnap-manage-global-styles-in-react-native-334
// Shadow Citation: https://blog.logrocket.com/applying-box-shadows-in-react-native/

// 390 is the logical width of the largest iPhones before pro max sizes
// https://www.ios-resolution.com/
const IS_BIG_PHONE = wp(100) > 390;

const ITEM_WIDTH = wp('90%');
const SMALL_FONT_SIZE = wp('4%');
const FONT_SIZE = wp('5%');
const BIG_FONT_SIZE = wp('6%');

const LetterForCarousel = props => {
  const letterStatus = props.letterStatus;
  const letterFont = props.letterFont;
  const letterDate = new Date(props.letterDate);


  // toDateString() returns day Month Date Year, so we'll slice off the day and join it all back
  // https://stackoverflow.com/questions/48384163/javascript-remove-day-name-from-date
  const date = letterDate.toDateString().split(' ').slice(1);

  // we'll render the default system font unless a fontID is specified
  const textStyle = letterFont.length === 0 ? {} : {
    fontFamily: letterFont
  };

  return (
    <View style={{margin: 0, flex: 1, zIndex: props.senderAddress}}>
      <ImageBackground 
        style={[styles.imageBackground, styles.shadow2]}
        source={letterStatus === "read" ? require('../assets/openedLetter.png') : require('../assets/letter.png')}>
          <TouchableOpacity 
          style={styles.item}
          onPress={props.onPress}>
            <View style={{position: 'absolute', 
                          flex: 1,
                          left: 0, 
                          bottom: 0, 
                          width: ITEM_WIDTH, 
                          height: ITEM_WIDTH * .7,
                          }}>
              <Image style={styles.dateStamp} source={require('../assets/date_stamp.png')}/>
              <View style={styles.stampTextView}>
                <Text style={[styles.monthYear, styles.shadow]} allowFontScaling={false}>{date[0].toUpperCase()}</Text>
                <Text style={[styles.date, styles.shadow]} allowFontScaling={false}>{date[1]}</Text>
                <Text style={[styles.monthYear, styles.shadow]} allowFontScaling={false}>{date[2]}</Text>
              </View>
            </View>
            <Text style={[styles.letterTextHeader, textStyle]} allowFontScaling={false}>{props.sender}</Text>
            <Text style={[styles.letterTextCenter, textStyle]} allowFontScaling={false}>{props.recipient}</Text>
          </TouchableOpacity>
      </ImageBackground>
    </View>
  )
};

const styles = StyleSheet.create({
    dateStamp: {
      width: ITEM_WIDTH * .5,
      height: ITEM_WIDTH * .7 * .47,
      resizeMode: 'contain',
      position: 'absolute',
      // bottom: IS_BIG_PHONE ? '41%' : '37%',  // 37
      left: '34%',
    },
    stampTextView: {
      position: 'absolute',
      bottom: '64%',
      left: '65.5%',
      alignItems: 'center'
    },
    monthYear: {
      fontSize: SMALL_FONT_SIZE,
      fontFamily: 'LibreBaskerville',
      color: "#074063",
    },
    shadow: {
      shadowOpacity: 1, 
      shadowColor: '#074063', 
      shadowOffset: { width: 0, height: 0}, 
      shadowRadius: 0.6, 
    },
    shadow2: {
      shadowOpacity: .1, 
      shadowColor: "#000000",
      backgroundColor: 'transparent'
    },
    date: {
      fontSize: BIG_FONT_SIZE,
      fontFamily: 'LibreBaskerville',
      color:"#074063",
    },
    imageBackground: {
      alignSelf: 'center',
      width: ITEM_WIDTH * 1.03,
      height: ITEM_WIDTH * 0.89,  // do not change, this is the aspect ratio of the letter png
      // shadowOpacity: .1, 
      // shadowColor: "#000000"
    },
    item : {
      flex: 1, 
      height: ITEM_WIDTH * .7,
      width: ITEM_WIDTH,
      borderRadius: 3, 
      position: 'absolute',
      left: 0, 
      bottom: 0
    },
    letterTextHeader: {
      fontSize: FONT_SIZE,
      position: "absolute",
      left: ITEM_WIDTH * .07,
      top: ITEM_WIDTH * .03
    }, 
    letterTextCenter: {
      fontSize: FONT_SIZE,
      position: "absolute",
      left: ITEM_WIDTH * .39,
      top: ITEM_WIDTH * .27
    }

});

export default LetterForCarousel;