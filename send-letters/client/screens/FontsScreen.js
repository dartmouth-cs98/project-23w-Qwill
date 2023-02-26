import {Text, View, StyleSheet, FlatList} from 'react-native';
import React, {useState, useEffect, useCallback} from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import FontPreview from '../components/FontPreview';
import ButtonCircle from '../components/ButtonCircle';

export default function FontsScreen() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    // Keep the splash screen visible while we fetch resources
    SplashScreen.preventAutoHideAsync();

    useEffect(() => {
        async function prepare() {
            try {
                await Font.loadAsync({
                    'MyNerve': require('../assets/fonts/MyNerve_Regular.ttf'),
                    'GloriaHallelujah': require('../assets/fonts/GloriaHallelujah-Regular.ttf'),
                    'HomemadeApple': require('../assets/fonts/HomemadeApple-Regular.ttf'),
                    'IndieFlower': require('../assets/fonts/Mansalva-Regular.ttf'),
                    'ShadowsIntoLight': require('../assets/fonts/ShadowsIntoLight-Regular.ttf'),
                });

            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setFontsLoaded(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    if (!fontsLoaded) {
        return null;
    }
    return (
        <SafeAreaView style={{alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF"}}>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: "row", justifyContent: 'space-between', marginTop: 20}}
                  onLayout={onLayoutRootView}>
                <Text style={styles.titleText}>Fonts</Text>
                  <ButtonCircle icon="pencil"></ButtonCircle>
            </View>
            <View style={{flexDirection: "row", marginTop: 20}}>
              <View style={styles.line}></View>
              <Text>Default Fonts</Text>
              <View style={styles.line}></View>
            </View>
            <View style={{flexDirection: "row", marginTop: 20, marginLeft: 30}}>
              <FlatList
                data={itemData}
                numColumns={3}
                renderItem={({item}) => <View style={{marginLeft: 10, marginRight: 10}}><FontPreview style={item.style} title={item.title}></FontPreview></View>}
                keyExtractor={(item) => item.alt}
              />
            </View>
            <View style={{flexDirection: "row", marginTop: 20}}>
              <View style={styles.line}></View>
              <Text>Custom Fonts</Text>
              <View style={styles.line}></View>
            </View>
            <View style={styles.noCustom}>
              <Text style={{textAlign: 'center', marginTop: 20}}>You don't have any custom fonts yet.</Text>
              <Text style={{textAlign: "center", textDecorationLine: 'underline', marginTop: 20}}>Add a custom font</Text>
            </View>
          </View>
        </SafeAreaView>
    );
};

const itemData = [
  {
    style:{fontFamily: 'MyNerve'},
    title: "MyNerve"
  },
  {
    style:{fontFamily: 'GloriaHallelujah'},
    title: 'GloriaHallelujah'
  },
  {
    style:{fontFamily: 'HomemadeApple'},
    title: 'HomemadeApple'
  },
  {
    style:{fontFamily: 'IndieFlower'},
    title: 'IndieFlower'
  },
  {
    style:{fontFamily: 'ShadowsIntoLight'},
    title: 'ShadowsIntoLight'
  },
  

];

const styles = StyleSheet.create({
  titleText: {
    fontSize: 40, 
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20
  },
  icons: {
    marginRight: 15
  },
  line: {
    width: 110,
    height: 0,
    borderWidth: 1,
    borderColor: "#737B7D",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 8
  },
  noCustom: {
    width: 312,
    height: 112,
    borderRadius: 20,
    backgroundColor: "#E2E8F6",
    marginTop: 20,
  }
});
