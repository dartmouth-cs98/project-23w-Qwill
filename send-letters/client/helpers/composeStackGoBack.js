// This function will be used across the compose stack as the onPress function for the back button.
// If we can go back in the stack, the behavior will always be the same, but in the case that we can't
// go back in the nav, we'll use a screen-specific callback (specified in the screen code).
export function composeStackGoBack(navigation, callback) {
    if (navigation.canGoBack()) {
        navigation.goBack();
    }
    else {
        callback();
    };
}