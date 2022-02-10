import React, { useContext } from 'react'
import { View ,StyleSheet,Image, Alert, SafeAreaView} from 'react-native'
import {DrawerItem,DrawerItemList,DrawerContentScrollView} from '@react-navigation/drawer'
import {colors} from '../../theme'
import AsyncStorage from '@react-native-community/async-storage'
import { NAVIGATION_TO_LOGIN_SCREEN } from '../../navigation/routes'
import { Text } from '..'
import { UserContext } from '../context/userContext'

const CustomSideBarMenu=(props)=>{
    //  const [user,setUser] = useContext(UserContext)
      //console.log('logouyt'+user.email)
    return(
       
        <View style={styles.sideMenuContainer}>
            <View style={styles.imageContainer}>
                <Image style={styles.image}
                source={require('../../assets/images/logoWhite.png')}/>
            </View>

       <View style={styles.divider}/>
               <DrawerContentScrollView {...props}>
            <DrawerItemList {...props}/>
            <DrawerItem
            label={({color})=>
            <Text style={{color:colors.colors.white,fontFamily:'Muli-Regular',fontSize:14}}>Logout</Text>}
            onPress={()=>{
                props.navigation.toggleDrawer();
                Alert.alert('Logout','Are you sure you want to logout?',[
                    {
                        text:'Cancel',
                        onPress:()=>{
                            return null
                        },
                    },
                    {
                        text:'Confirm',
                        onPress:() =>{
                            AsyncStorage.clear();
                       //     console.warn('user'+user.email)
                            props.navigation.replace('Auth')
                        },
                    },
                ],
                {cancelable:false})
            }}
            />


        </DrawerContentScrollView>
        </View>
      
    )

}
export default CustomSideBarMenu
const styles=StyleSheet.create({
    sideMenuContainer:{
        height:'100%',
        width:'100%',
        backgroundColor:colors.colors.primary,
      
    },
    imageContainer:{
        flexDirection:'row',
        //justifyContent:'flex-start'
      //  padding:15,
        alignItems:'center',
       // height:'20%'
        justifyContent:'center',
        backgroundColor:colors.colors.primary,
        paddingTop:26

    },
    image:{
        height:150,
        width:200,
        resizeMode:'contain',
        alignSelf:'center',
    },
    divider:{
        height:1,
        backgroundColor: colors.colors.white,
        marginHorizontal:20,
        marginTop:8,
    }
})