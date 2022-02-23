import AsyncStorage from '@react-native-community/async-storage'
import { encode } from 'base-64'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import {Image,View} from 'react-native'
import { BASE_URL } from '../../constants/matcher'

const ImageComponent=(props)=>{
   
    const [image,setImages]=useState()
    useEffect(async()=>{
       await AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              
              fetch(BASE_URL+'AllProductImages/'+props.sellerId+'?productId='+props.productId, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
         
                },
              })
                .then((response) => response.json())
                .then((responseJson) => {
                    
                  //setLoading(false)
                  //Showing response message coming from server 
                 
                 
                  setImages(responseJson.mainImage)
                  
                  //images.push(responseJson.mainImage)
                  
                         
                  
                })
                .catch((error) => {
                 
                //display error message
                if(Platform.OS!=='ios'){
                  ToastAndroid.showWithGravity(
                    error.toString(),
                  ToastAndroid.SHORT, //can be SHORT, LONG
                  ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                );
            
                }else{
                  alert(error.toString())
                }
              
              
                
                });
           
        
             
            })
          });
    



    },[props])
    return(
        <View>
            <Image
              style={{width:'100%',height:'100%',resizeMode:'contain'}}
              source={{uri:image}}
            />
        </View>
    )

}
export default ImageComponent