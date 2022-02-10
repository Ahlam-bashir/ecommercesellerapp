import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default{
    common: {
        WINDOW_WIDTH: screenWidth,
        WINDOW_HEIGHT: screenHeight,
        borderRadius: 2,
        borderWidth: StyleSheet.hairlineWidth,
        iconSize: 23,
        checkboxIconSize: 23,
        textInputHeight: 30,
      },
}