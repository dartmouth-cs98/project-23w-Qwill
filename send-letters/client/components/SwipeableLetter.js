import React, { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, Dimensions, PixelRatio, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
        if (animatedValue._value > windowWidth*.5) {
          Animated.timing(animatedValue, {
            toValue: windowWidth,
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

  // const deleteOpacity = animatedValue.interpolate({
  //   inputRange: [0, windowWidth * 0.8],
  //   outputRange: [0, 1],
  //   extrapolate: 'clamp',
  // });

  return (
    <View style={styles.swipeableLetterContainer} onRelease={handleDraftPress()}>
    <Ionicons name="trash-outline" size={60} color="white" style={{marginLeft: "10%"}}/>
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
    width: windowWidth * 0.8,
    aspectRatio: 0.8,
    backgroundColor: 'red',
    overflow: 'hidden',
    justifyContent: "center"
  },
  swipeableLetter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth * 1.6,
    aspectRatio: 0.8,
    backgroundColor: '#FDFEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
  delete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    width: windowWidth * 0.2,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SwipeableLetter;
