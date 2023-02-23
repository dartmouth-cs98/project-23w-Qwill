import * as React from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import UnopenedLetter from "./UnopenedLetter";

// Citation: from https://github.com/dohooo/react-native-reanimated-carousel/blob/main/exampleExpo/src/pages/parallax/index.tsx

const SLIDER_WIDTH = Dimensions.get('window').width;

const LetterCarousel = props => {
  const progressValue = useSharedValue(0);
  const baseOptions = {
      vertical: false,
      width: SLIDER_WIDTH,
      height: SLIDER_WIDTH * 0.7,
    };

  return (
    <View>
      <Carousel
        {...baseOptions}
        style={{alignContent:'center'}}
        loop
        pagingEnabled={true}
        snapEnabled={true}
        onProgressChange={(_, absoluteProgress) =>
          (progressValue.value = absoluteProgress)
        }
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 65,
        }}
        data={props.data}
        renderItem={props.renderItem}
      />
      {!!progressValue && (
        <View
          style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 100,
                alignSelf: "center",
            }}
        >
          {props.data.map((letter, index) => {
            return (
              <PaginationItem
                backgroundColor={"#525475"}
                animValue={progressValue}
                index={index}
                key={index}
                isRotate={false}
                length={props.data.length}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const PaginationItem = props => {
  const { animValue, index, length, backgroundColor, isRotate } = props;
  const width = 10;

  const animStyle = useAnimatedStyle(() => {
    let inputRange = [index - 1, index, index + 1];
    let outputRange = [-width, 0, width];

    if (index === 0 && animValue?.value > length - 1) {
      inputRange = [length - 1, length, length + 1];
      outputRange = [-width, 0, width];
    }

    return {
      transform: [
        {
          translateX: interpolate(
            animValue?.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  }, [animValue, index, length]);
  return (
    <View
      style={{
        backgroundColor: "white",
        width,
        height: width,
        borderRadius: 50,
        overflow: "hidden",
        transform: [
          {
            rotateZ: isRotate ? "90deg" : "0deg",
          },
        ],
      }}
    >
      <Animated.View
        style={[
          {
            borderRadius: 50,
            backgroundColor,
            flex: 1,
          },
          animStyle,
        ]}
      />
    </View>
  );
};

export default LetterCarousel;