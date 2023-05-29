// CustomButtonGroup.js
import React from 'react';
import { ButtonGroup } from '@rneui/themed';
import { View, Keyboard } from 'react-native';
import ToolBarComponent from '../../components/ToolBarComponent';


const Toolbar = ({ navigation, passedStickerSelected }) => {
    const handlePress = (value) => {
        Keyboard.dismiss();
        if (value == 0) { navigation.navigate('ChangeRecipientScreen'); }
        if (value == 1) { navigation.navigate('ChangeFontScreen'); }
        if (value == 2) { navigation.navigate('ChangeThemeScreen'); }
        if (value == 3) { navigation.navigate('ChangeStickerScreen', { passedFunction: passedStickerSelected }); }
    };

    return (
        <View style={{
            shadowColor: '#171717',
            shadowOffset: {width: -2, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 3,}}>
            <ButtonGroup
                buttons={[
                    <ToolBarComponent text={"Recipient"} icon={"person-outline"}/>,
                    <ToolBarComponent text={"Font"} icon={"person-outline"}/>,
                    <ToolBarComponent text={"Theme"} icon={"clipboard-outline"}/>,
                    <ToolBarComponent text={"Stickers"} icon={"happy-outline"}/>
                ]}
                onPress={handlePress}
                containerStyle={{
                    backgroundColor: "#E2E8F6", 
                    aspectRatio: 7,
                    // borderRadius: 10,
                    // marginBottom: 20,
                }}
            />
        </View>
    );
}

export default Toolbar;
