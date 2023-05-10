import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const handleDraftPress = () => {
  console.log("Yup")
}

const SwipeableLetter = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        Animated.event([null, { dx: animatedValue }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      onPanResponderRelease: () => {
        if (animatedValue._value > wp('50%')) {
          Animated.timing(animatedValue, {
            toValue: wp('100%'),
            duration: 300,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeableLetterContainer} onRelease={handleDraftPress()}>
      <Ionicons name="trash-outline" size={wp('14%')} color="white" style={{marginLeft: wp('10%')}}/>
      <Animated.View
        style={[
          styles.swipeableLetter,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
        {...panResponder.panHandlers}
      >
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  swipeableLetterContainer: {
    position: 'relative',
    width: wp('80%'),
    aspectRatio: 0.8,
    backgroundColor: 'red',
    overflow: 'hidden',
    justifyContent: "center"
  },
  swipeableLetter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp('160%'),
    aspectRatio: 0.8,
    backgroundColor: '#FDFEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: wp('4.2%'), // Assuming font size is 4.2% of screen width
  },
  delete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: wp('20%'),
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SwipeableLetter;
