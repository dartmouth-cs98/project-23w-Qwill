import * as Font from 'expo-font';

// this helper functions helps load in the customFont object received from the backend
export default async function loadCustomFont(customFont) {
    if (!Font.isLoaded(customFont.name)) {
        await Font.loadAsync({ [customFont.name]: customFont.downloadLink });
        // add to custom font index
        
    }
};
