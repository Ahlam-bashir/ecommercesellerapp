import React from 'react'
import {View,StyleSheet} from 'react-native'
import LottieView from 'lottie-react-native' 
import AnimatedLoader from 'react-native-animated-loader'
import { colors } from '../../theme'
const Loader = (props) =>{

    return(
        <View style={styles.container}>
            <AnimatedLoader
            visible={props.loading}
            animationStyle={{width:100,height:100}}
            overlayColor={colors.colors.transparent}
            speed={1}
            
            
               
            />
           
        </View>
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
    }
})