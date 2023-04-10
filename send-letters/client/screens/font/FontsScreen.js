import { Text, View, StyleSheet, FlatList } from 'react-native';
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontPreview from '../../components/FontPreview';
import ButtonCircle from '../../components/ButtonCircle';
import ButtonPrimary from '../../components/ButtonPrimary';
import fontData from '../../assets/fontData';

const FontsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={{ alignItems: 'center', flex: 1, backgroundColor: "#F0F4FF" }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 20 }}>
          <Text style={styles.titleText}>Fonts</Text>
          <ButtonCircle icon="pencil"></ButtonCircle>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={styles.line}></View>
          <Text>Default Fonts</Text>
          <View style={styles.line}></View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20, marginRight: 20 }}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            data={fontData}
            numColumns={3}
            renderItem={({ item }) =>
              <View style={{ marginLeft: 10, marginRight: 10 }}>
                <FontPreview style={item.style} title={item.title}></FontPreview>
              </View>}
            keyExtractor={(item) => item.title}
          />
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={styles.line}></View>
          <Text>Custom Fonts</Text>
          <View style={styles.line}></View>
        </View>
        <View style={styles.noCustom}>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>You don't have any custom fonts yet.</Text>
          {/* <Text style={{ textAlign: "center", textDecorationLine: 'underline', marginTop: 20 }}>Add a custom font</Text> */}
          <ButtonPrimary
            selected={false}
            title={"Add Font By Camera"}
            onPress={() =>{navigation.navigate("CameraScreen")}}
          />
          <ButtonPrimary
            selected={false}
            title={"Add Font By Image"}
            onPress={() =>{navigation.navigate("ImagePickerScreen")}}
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

export default FontsScreen;

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'JosefinSansBold',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 20,
    marginTop: 5
  },
  icons: {
    marginRight: 10
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
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

