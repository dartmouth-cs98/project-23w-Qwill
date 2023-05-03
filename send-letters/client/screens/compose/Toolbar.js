// CustomButtonGroup.js
import React from 'react';
import { ButtonGroup } from '@rneui/themed';


const Toolbar = ({ navigation, passedStickerSelected }) => {
    const handlePress = (value) => {
        if (value == 0) { navigation.navigate('ChangeRecipientScreen'); }
        if (value == 1) { navigation.navigate('ChangeFontScreen'); }
        if (value == 2) { navigation.navigate('ChangeThemeScreen'); }
        if (value == 3) { navigation.navigate('ChangeStickerScreen', { passedFunction: passedStickerSelected }); }
    };

    return (
        <ButtonGroup
            buttons={['Recipient', 'Font', 'Theme', 'Sticker']}
            onPress={handlePress}
            containerStyle={{
                marginBottom: 20,
                backgroundColor: '#F9F9FA',
                width: '80%',
                borderRadius: 10,
            }}
        />
    );
}

export default Toolbar;
