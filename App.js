import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
// Screens
import { HomeScreen } from './Screens/Home.Screen';
import { TopUserScreen } from './Screens/TopUser.Screen';
import { PlayScreen } from './Screens/PlayGame.Screen';

const Stack = createNativeStackNavigator();

function App() {
  const [loaded] = useFonts({
    dogByte: require('./assets/fonts/dogbyte.otf'),
  });

  if (!loaded) return <AppLoading />;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
      >
        <Stack.Screen
          options={{headerShown: false, gestureEnabled: false}}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false, gestureEnabled: false}}
          name="TopUser"
          component={TopUserScreen}
        />
        <Stack.Screen
          options={{headerShown: false, gestureEnabled: false}}
          name="Play"
          component={PlayScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;