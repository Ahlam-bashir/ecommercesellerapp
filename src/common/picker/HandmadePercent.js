// React Native Bottom Action Menu
// https://aboutreact.com/react-native-bottom-action-menu/

// import React in our code
import React, {useRef} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';

// import ActionSheet
import ActionSheet from 'react-native-actionsheet';
import { colors } from '../../theme';

const HandmadePercent = (props) => {
 
  var optionArray = [
    '50',
    '60',
    '70',
    '80',
    '90',
    '100',
    
  ];

  

  return (
    <SafeAreaView style={styles.container}>
        <ActionSheet
          ref={props.actionSheet}
          // Title of the Bottom Sheet
          title={'How much Handmade is your Product?'}
          // Options Array to show in bottom sheet
          options={optionArray}
          // Define cancel button index in the option array
          // This will take the cancel option in bottom
          // and will highlight it
          cancelButtonIndex={6}
          // Highlight any specific option
          destructiveButtonIndex={0}
          onPress={(index) => {props.onClick(optionArray[index])
            // Clicking on the option will give you ale
          }}
        />
     
    </SafeAreaView>
  );
};
export default HandmadePercent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingTop: 30,
    backgroundColor: colors.colors.gray100,
    padding: 16,
    //position:'absolute',
    bottom:0
  },
  buttonStyle: {
    width: '100%',
    height: 40,
    padding: 10,
    backgroundColor: '#f5821f',
    marginTop: 30,
  },
  buttonTextStyle: {
    color: 'white',
    textAlign: 'center',
  },
  titleStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
});