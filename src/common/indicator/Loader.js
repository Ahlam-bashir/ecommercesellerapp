import React from 'react'
import {View,StyleSheet} from 'react-native'
import LottieView from 'lottie-react-native' 
import AnimatedLoader from 'react-native-animated-loader'
import { colors } from '../../theme'
import { ActivityIndicator } from 'react-native'
import { Modal } from 'react-native'
const Loader = (props) =>{
    const {loading, ...attributes} = props;

    return(
        <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={true}
            color={colors.colors.primary}
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
    )

}
export default Loader
const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#F5FCFF',
        position:'absolute',
        alignSelf:'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040',
      },
      activityIndicatorWrapper: {
        backgroundColor: colors.colors.white,
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      },
      activityIndicator: {
        alignItems: 'center',
        height: 80,
      },
})