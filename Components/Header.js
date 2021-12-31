import {StatusBar} from "react-native";
import styled from "styled-components/native";

const Header = ({ fontSize = 70 }) => {
  return (
    <WrapperFlex>
      <StatusBar barStyle="light-content"/>
      <Color fontSize={fontSize} color="#E64C3C">c</Color>
      <Color fontSize={fontSize} color="#E57E31">o</Color>
      <Color fontSize={fontSize} color="#F1C431">l</Color>
      <Color fontSize={fontSize} color="#68CC73">o</Color>
      <Color fontSize={fontSize} color="#3998DB">r</Color>
      <Color fontSize={fontSize} color="#ecf0f1">quiz</Color>
    </WrapperFlex>
  );
}

const WrapperFlex = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 30px;
`;

const Color = styled.Text`
  font-family: 'dogByte';
  font-size: ${p => p.fontSize}px;
  color: ${p => p.color};
`;

export { Header };