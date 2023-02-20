import * as Font from "expo-font";
const useFonts = async () => {
    await Font.loadAsync({
        'my_nerve': require('../assets/fonts/mynerve.ttf'),
    });
};

export default useFonts;