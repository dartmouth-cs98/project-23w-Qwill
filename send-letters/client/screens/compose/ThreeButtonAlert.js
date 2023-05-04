import { Alert, TouchableOpacity } from "react-native";
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ThreeButtonAlert = ({navigation}) => {

    const handleDiscard = () => {
        console.log('Discard pressed');

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    };

    const handleSave = () => {
        console.log('Save pressed');
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        );
    };

    const threeButtonAlert = () => {
        Alert.alert('Discard or Save', 'Discard or save your draft?', [
            {
                text: 'Discard',
                onPress: () => handleDiscard(),
                style: 'destructive',
            },
            { text: 'Save', onPress: () => handleSave() },
            { text: 'Cancel', onPress: () => console.log('Canceled') },
        ]);
    };

    return (
        <TouchableOpacity onPress={() => {
            threeButtonAlert();
        }}>
            <Ionicons name={"close-outline"} size={40} />
        </TouchableOpacity>
    );
}

export default ThreeButtonAlert;