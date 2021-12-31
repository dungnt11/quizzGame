import {Text, View} from "react-native";

function TopUserScreen({ navigation }) {
  function goHelloScreen() {
    navigation.push('Home');
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Top User</Text>
      <Text onPress={goHelloScreen}>Go Hello screen</Text>
    </View>
  );
}

export { TopUserScreen };