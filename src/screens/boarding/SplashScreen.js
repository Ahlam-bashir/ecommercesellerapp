import React ,{useEffect}from 'react'
import { View ,Image,StyleSheet} from 'react-native';
import {colors} from '../../theme'
import {LIMITS} from '../../constants'
import {Text} from '../../common'
import {NAVIGATION_TO_LOGIN_SCREEN} from '../../navigation/routes'
import AsyncStorage from '@react-native-community/async-storage';
 

const SplashScreen = ({navigation}) =>{
    useEffect(()=>{
        setTimeout(() => {
           // setAnimating(false);
            //Check if user_id is set or not
            //If not then send for Authentication
            //else send to Home Screen
            AsyncStorage.getItem('user').then((value) =>
              navigation.replace(
                value === null ? 'Auth' : 'drawerNavigationRoutes'
              ),
            );
          }, LIMITS.splashScreenWaitTime);  
    },[])
  return(
      <View style={styles.container}>
          <Image 
              source={require('../../assets/images/ucm_logo.jpg')}  
              style={styles.gif}
         />
         <Text type='heading' style={styles.text}>Version 2.2</Text>
          </View>
  )
}
export default SplashScreen;
const styles= StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:colors.colors.white
    },
    gif:{
        width:160,
        height:160, 
        resizeMode:'contain'
    },
    text:{
      position:'absolute',
      bottom:16,
      color:colors.colors.primary
      //alignSelf:'baseline',



    }

})