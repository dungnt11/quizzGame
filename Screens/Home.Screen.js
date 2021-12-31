import * as React from "react";
import {Image, TouchableOpacity} from "react-native";
import styled from 'styled-components/native';

import {Header} from "../Components/Header";
import {Audio} from "expo-av";

function HomeScreen({navigation}) {
  const [soundActive, setSoundActive] = React.useState(true);
  const [soundBackground, setSoundBackground] = React.useState();
  
  async function playNow() {
    navigation.push('Play');
    await soundBackground.sound.unloadAsync();
  }

  const imageSource = soundActive
    ? require("../assets/icons/speaker-on.png")
    : require("../assets/icons/speaker-off.png");

  async function toggleSound() {
    setSoundActive(!soundActive);
    if (soundActive) {
      // pause
      await soundBackground.sound.pauseAsync();
    } else {
      await soundBackground.sound.playAsync();
    }
  }

  React.useEffect(() => {
    let soundBackground;
    (async () => {
      soundBackground = await Audio.Sound.createAsync(
        require('../assets/music/Komiku_Mushrooms.mp3')
      );
      setSoundBackground(soundBackground);
      await soundBackground.sound.setIsLoopingAsync(true);
      await soundBackground.sound.playAsync();
    })();
  }, []);

  return (
    <Container>
      <Header/>
      <TouchableOpacity onPress={playNow}>
        <PlayButton>
          <WrapperFlex>
            <Image
              style={{width: 60, height: 60}}
              source={require("../assets/icons/play_arrow.png")}
            />
            <PlayText>PLAY!</PlayText>
          </WrapperFlex>
        </PlayButton>
      </TouchableOpacity>

      <WrapperFlex>
        <ImageTrophy
          source={require("../assets/icons/trophy.png")}
        />
        <TextTrophy>Hi-score: 0</TextTrophy>
      </WrapperFlex>

      <WrapperFlex>
        <ImageTrophy
          source={require("../assets/icons/leaderboard.png")}
        />
        <TextTrophy>Leoderboard</TextTrophy>
      </WrapperFlex>

      <TeamCoder>
        CodeBy D&M
      </TeamCoder>

      <Information>
        <TouchableOpacity onPress={toggleSound}>
          <SoundIcon source={imageSource}/>
        </TouchableOpacity>
      </Information>
    </Container>
  );
}

const TeamCoder = styled.Text`
  font-size: 18.5px;
  font-family: "dogByte";
  color: #ecf0f1;
  position: absolute;
  left: 15px;
  bottom: 25.5px;
`;

const Information = styled.View`
  position: absolute;
  right: 15px;
  bottom: 12.5px;
`;

const SoundIcon = styled.Image`
  width: 45px;
  height: 45px;
`;

const WrapperFlex = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
`;

const TextTrophy = styled.Text`
  font-size: 28.5px;
  font-family: "dogByte";
  color: #ecf0f1;
  margin-top: 5px;
`;

const ImageTrophy = styled.Image`
  height: 45px;
  width: 45px;
  margin-right: 12.5px;
`;

const PlayButton = styled.View`
  margin-top: 5px;
`;

const PlayText = styled.Text`
  font-family: 'dogByte';
  font-size: 45px;
  color: #ecf0f1;
  text-transform: uppercase;
  margin-left: 15px;
`;

const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #000;
`;


export {HomeScreen};