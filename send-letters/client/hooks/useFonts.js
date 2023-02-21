import * as Font from "expo-font";
const useFonts = async () => {
    await Font.loadAsync({
        'MyNerve': require('../assets/fonts/MyNerve_Regular.ttf'),
        'GloriaHallelujah': require('../assets/fonts/GloriaHallelujah-Regular.ttf'),
        'HomemadeApple': require('../assets/fonts/HomemadeApple-Regular.ttf'),
        'IndieFlower': require('../assets/fonts/Mansalva-Regular.ttf'),
        'ShadowsIntoLight': require('../assets/fonts/ShadowsIntoLight-Regular.ttf'),
    });
};

export default useFonts;