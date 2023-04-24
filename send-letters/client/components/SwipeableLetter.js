import React, { useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View, Dimensions, PixelRatio } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const scale = windowWidth / 390; // Scale factor for font size on 390 width screen

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const SwipeableLetter = () => {
  const [showDelete, setShowDelete] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        Animated.event([null, { dx: animatedValue }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      onPanResponderRelease: () => {
        if (animatedValue._value > 50) {
          setShowDelete(true);
        } else {
          setShowDelete(false);
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const deleteOpacity = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.swipeableLetterContainer}>
        <Animated.View
          style={[
            styles.swipeableLetter,
            {
              transform: [{ translateX: animatedValue }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* <Text style={styles.text}>Letter</Text> */}
        </Animated.View>
        {showDelete && (
            <Animated.View style={[styles.delete, { opacity: deleteOpacity }]}>
                <Ionicons style={{marginTop: windowHeight*.14, marginLeft: windowWidth*.08}} name={"trash-outline"} size={60} color={'white'}> </Ionicons>
            </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeableLetterContainer: {
    position: 'relative',
    width: windowWidth*.6,
    aspectRatio: .8,
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  swipeableLetter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth*.8,
    aspectRatio: .8,
    // height: 400,
    backgroundColor: '#FDFEF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
//   delete: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     height: 50,
//     width: 50,
//     backgroundColor: 'red',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: -1,
//   },
//   deleteText: {
//     color: 'white',
//     fontSize: 18,
//   },
});

export default SwipeableLetter;
