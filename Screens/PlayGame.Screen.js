import {Component} from "react";
import {View, Dimensions, TouchableOpacity, Text, Button} from "react-native";
import styled from "styled-components/native";
import ModalNative from "react-native-modal";
import {Audio} from 'expo-av';
import {generateRGB, mutateRGB} from "../utils/color";
import {Header} from "../Components/Header";
import { userStore } from '../store/user';

const {height, width} = Dimensions.get("window");

const initState = {
  timeLeft: 12,
  size: 2,
};

class PlayScreen extends Component {
  state = {
    points: 0,
    timeLeft: initState.timeLeft, // init 12s
    rgb: generateRGB(),
    size: initState.size,
    isPause: false,
    // Sound
    soundBackground: null,
    soundTap: null,
    soundTapWrong: null,
    soundTapWhenPause: null,
    soundPause: null,
    soundResume: null,
    soundGameOver: null,
    // Modal
    isLose: false,
  };

  componentWillMount() {
    this.generateNewRound();
    this.initGame();
  }

  async componentDidMount() {
    const [
      soundBackground,
      soundTap,
      soundTapWrong,
      soundTapWhenPause,
      soundPause,
      soundResume,
      soundGameOver
    ] = await Promise.all([
      Audio.Sound.createAsync(
        require('../assets/music/Komiku_BattleOfPogs.mp3')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/tile_tap.wav')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/tile_wrong.wav')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/button.wav')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/pause_in.wav')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/pause_out.wav')
      ),
      Audio.Sound.createAsync(
        require('../assets/sfx/lose.wav')
      ),
    ]);

    await soundBackground.sound.setIsLoopingAsync(true);
    await soundBackground.sound.playAsync();
    this.setState({
      soundBackground: soundBackground.sound,
      soundTap: soundTap.sound,
      soundTapWrong: soundTapWrong.sound,
      soundTapWhenPause: soundTapWhenPause.sound,
      soundPause: soundPause.sound,
      soundResume: soundResume.sound,
      soundGameOver: soundGameOver.sound,
    });
  }

  componentWillUnmount() {
    this.exitDisplay(true);
  }

  async exitDisplay(isClear) {
    clearInterval(this.interval);
    await this.state.soundBackground.pauseAsync();
    await this.state.soundTap.pauseAsync();
    await this.state.soundTapWrong.pauseAsync();
    await this.state.soundTapWhenPause.pauseAsync();
    await this.state.soundPause.pauseAsync();
    await this.state.soundResume.pauseAsync();
    await this.state.soundGameOver.pauseAsync();
    this.setState({
      points: 0,
      timeLeft: initState.timeLeft, // init 12s
      rgb: generateRGB(),
      size: initState.size,
      isPause: false,
      // Sound
      soundBackground: null,
      soundTap: null,
      soundTapWrong: null,
      soundTapWhenPause: null,
      soundPause: null,
      soundResume: null,
      soundGameOver: null,
      // Modal
      isLose: false,
    });

    if (isClear) {
      await this.state.soundBackground.unloadAsync();
      await this.state.soundTap.unloadAsync();
      await this.state.soundTapWrong.unloadAsync();
      await this.state.soundTapWhenPause.unloadAsync();
      await this.state.soundPause.unloadAsync();
      await this.state.soundResume.unloadAsync();
      await this.state.soundGameOver.unloadAsync();
    }
  }

  generateSizeIndex = () => {
    return Math.floor(Math.random() * this.state.size);
  };

  generateNewRound = () => {
    const RGB = generateRGB();
    const mRGB = mutateRGB(RGB);
    const {points, size} = this.state;
    this.setState({
      diffTileIndex: [this.generateSizeIndex(), this.generateSizeIndex()],
      diffTileColor: `rgb(${mRGB.r}, ${mRGB.g}, ${mRGB.b})`,
      rgb: RGB,
      size: Math.min(Math.max(Math.round(Math.sqrt(points)), size), size * 2)
    });
  };

  onTilePress = async (rowIndex, columnIndex) => {
    const {diffTileIndex, points, timeLeft, soundTap, soundTapWrong, soundTapWhenPause} = this.state;
    if (this.state.isPause) {
      await soundTapWhenPause.replayAsync();
      return;
    }
    if (rowIndex === diffTileIndex[0] && columnIndex === diffTileIndex[1]) {
      // good tile
      this.setState({points: points + 1, timeLeft: timeLeft + 3 <= initState.timeLeft ? timeLeft + 3 : initState.timeLeft});
      this.generateNewRound();
      await soundTap.replayAsync();
    } else {
      // wrong tile
      this.setState({timeLeft: timeLeft - 1 >=0 ? timeLeft - 1 : 0});
      await soundTapWrong.replayAsync();
    }
  }

  async changeIsPause() {
    this.setState({isPause: !this.state.isPause});
    if (!this.state.isPause) {
      await this.state.soundPause.replayAsync();
      // Pause
      clearInterval(this.interval);
    } else {
      await this.state.soundResume.replayAsync();
      this.initGame();
    }
  }

  toggleModal() {
    this.setState({isLose: !this.state.isLose});
  }

  initGame() {
    this.interval = setInterval(() => {
      if (this.state.timeLeft - 1 <= 0) {
        this.state.soundGameOver.replayAsync();
        this.setState({isLose: true, timeLeft: 0});
        userStore.setScore(this.state.points);
        clearInterval(this.interval);
      } else {
        this.setState({timeLeft: this.state.timeLeft - 1});
      }
    }, 1000);
  }

  resumeGame() {
    this.setState({isLose: false, timeLeft: initState.timeLeft});
    this.initGame();
  }

  goHome() {
    this.props.navigation.push('Home');
    this.exitDisplay(false);
  }

  render() {
    const {
      rgb,
      size,
      diffTileIndex,
      diffTileColor,
      points,
      timeLeft,
      isPause,
      isLose,
    } = this.state;
    const imagePause = !isPause ? require('../assets/icons/pause.png') : require('../assets/icons/play.png');
    return (
      <Container>
        <TouchableOpacity
          onPress={this.goHome.bind(this)}
          style={{marginLeft: 0}}
        >
          <Header fontSize={70}/>
        </TouchableOpacity>
        <View
          style={{
            height: height / 2.5,
            width: height / 2.5,
            flexDirection: "row"
          }}
        >
          {Array(size)
            .fill(null)
            .map((val, columnIndex) => (
              <View
                style={{flex: 1, flexDirection: "column"}}
                key={columnIndex}
              >
                {Array(size)
                  .fill(null)
                  .map((val, rowIndex) => (
                    <TouchableOpacity
                      key={`${rowIndex}.${columnIndex}`}
                      style={{
                        flex: 1,
                        backgroundColor:
                          rowIndex === diffTileIndex[0] && columnIndex === diffTileIndex[1]
                            ? diffTileColor
                            : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                        margin: 2
                      }}
                      onPress={() => this.onTilePress(rowIndex, columnIndex)}
                    />
                  ))}
              </View>
            ))}
        </View>
        <Footer>
          <FlexCenter>
            <TextWithFontFamily fontSize={50} marginTop={0}>
              {points}
            </TextWithFontFamily>
            <TextWithFontFamily fontSize={20} marginTop={10}>
              Points
            </TextWithFontFamily>

            <FlexVertical marginTop={15}>
              <ImageSmall
                source={require('../assets/icons/trophy.png')}
              />
              <TextWithFontFamily fontSize={15} marginTop={0} style={{marginLeft: 5}}>
                {userStore.getUser.scoreMax}
              </TextWithFontFamily>
            </FlexVertical>
          </FlexCenter>

          <TouchableOpacity onPress={this.changeIsPause.bind(this)}>
            <ImagePlay
              source={imagePause}
            />
          </TouchableOpacity>

          <FlexCenter>
            <TextWithFontFamily fontSize={50} marginTop={0}>
              {timeLeft}
            </TextWithFontFamily>
            <TextWithFontFamily fontSize={20} marginTop={10}>
              Time left
            </TextWithFontFamily>
          </FlexCenter>
        </Footer>

        <ModalNative isVisible={isLose}>
          <ModalContent>
            <TextWithFontFamily
              isCenter
              fontSize={40}
              marginTop={0}
            >
              YOU ARE LOSER!
            </TextWithFontFamily>
            <Divider/>
            <TextWithFontFamily
              isCenter
              fontSize={40}
              marginTop={30}
            >
              {points}
            </TextWithFontFamily>
            <Divider/>

            <FlexVertical marginTop={0} style={{margin: 'auto'}}>
              <TouchableOpacity onPress={this.resumeGame.bind(this)}>
                <Replay
                  source={require('../assets/icons/replay.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.goHome.bind(this)}
                style={{marginLeft: 20}}
              >
                <Replay
                  source={require('../assets/icons/escape-mini.png')}
                />
              </TouchableOpacity>
            </FlexVertical>
          </ModalContent>
        </ModalNative>
      </Container>
    );
  }
}

const ModalContent = styled.View`
`;

const Divider = styled.View`
  width: ${width}px;
  height: 15px;
`;

const Replay = styled.Image`
  height: 55px;
  width: 55px;
  margin: auto;
`;

const ImagePlay = styled.Image`
  height: 55px;
  width: 55px;
  margin-left: 30px;
`;

const ImageSmall = styled.Image`
  width: 15px;
  height: 15px;
`;

const Footer = styled.View`
  position: absolute;
  bottom: 30px;
  left: 0;
  padding: 0 30px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${width}px;
`;

const FlexCenter = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FlexVertical = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
  margin-top: ${p => p.marginTop}px;
`;

const TextWithFontFamily = styled.Text`
  font-family: "dogByte";
  color: #ecf0f1;
  font-size: ${p => p.fontSize}px;
  margin-top: ${p => p.marginTop}px;
  ${p => p.isCenter ? 'margin: auto;' : ''}
`;

const Container = styled.View`
  flex: 1;
  background-color: #0a0a0a;
  justify-content: center;
  align-items: center;
`;

export {PlayScreen};