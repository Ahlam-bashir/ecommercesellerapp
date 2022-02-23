import React ,{useState,useEffect}from 'react'
import {View,StyleSheet,TouchableOpacity,Keyboard,ToastAndroid,Platform} from 'react-native'
import {Text,InputText,Loader} from '../../common/';
import { colors } from '../../theme';
import {DIMENS,TYPOGRAPHY} from '../../constants'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../constants/matcher';
import { NAVIGATION_TO_LOGIN_SCREEN } from '../../navigation/routes';
import { RNToasty } from 'react-native-toasty';

const OtpVerification =({navigation,route})=>{
    const userid=route.params.userid
    console.log(userid)
    const [form,setValues] =useState({
        email:'',
        incorrectEmail:false,
        loading:false
        

    })
    const checkField=(fieldKey,fieldErrorKey,fieldValidater)=>{
        if(!fieldValidater(form[fieldKey])){
             setValues(prevState=>({
               ...prevState,
               [fieldErrorKey]:true
             }));
             return false;
        }
        return true;
  
      }
      const checkvalidation=()=>{
        let isValid= true
        isValid=isValid && checkField('email','incorrectEmail',isNonEmptyString)
        return isValid

    }
      const otpVerify=()=>{
        Keyboard.dismiss()
        if(!checkvalidation()){
            return
        }
        const datatoSend={
            "userId" : userid,
            "otp"    : parseInt(form.email)
        }
        setValues(prevState=>({
            ...prevState,
            loading:true,}))
        fetch(BASE_URL+'VerifyMobile', {
            method: 'POST',
            headers: {
               Accept: 'application/json',
              'Content-Type': 'application/json',
            },
        
            body: JSON.stringify(datatoSend),
          })
            .then((response) => response.json())
            .then((responseJson) => {
                 if(responseJson.status==='Invalid OTP'){
                    setValues(prevState=>({
                        ...prevState,
                        loading:false,}))
                        RNToasty.Error({
                          title:responseJson.status,
                          position:'center'
                        })
                        
                  
                 }else{
                    setValues(prevState=>({
                        ...prevState,
                        loading:false,}))
                        RNToasty.Success({
                          title:responseJson.status,
                          position:'center'
                        })
                     
                        navigation.replace(NAVIGATION_TO_LOGIN_SCREEN)
 

                 }
                
              //Showing response message coming from server 
              console.log(JSON.stringify(responseJson));
                 
                
            })
            .catch((error) => {
                setValues(prevState=>({
                    ...prevState,
                    loading:false,}))
                    ToastAndroid.showWithGravity(
                        error.toString(),
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
    
                 
               
            
                
            //display error message
             console.warn(error);
            });    
         

          

       
      
             
      }
      const resendOtp=()=>{
        setValues(prevState=>({
            ...prevState,
            loading:true,}))
        fetch(BASE_URL+'ResendOTP?userId='+userid, {
            method: 'GET',
            headers: {
               Accept: 'application/json',
              'Content-Type': 'application/json',
            },
        
         })
            .then((response) => response.json())
            .then((responseJson) => {
                setValues(prevState=>({
                    ...prevState,
                    loading:false,}))
                      if(Platform.OS!=='ios'){
                        ToastAndroid.showWithGravity(
                          responseJson.status,
                        ToastAndroid.SHORT, //can be SHORT, LONG
                        ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                      );
      
                      }else{
                        alert(responseJson.status)
                      }
                  
              
              //Showing response message coming from server 
              console.log(JSON.stringify(responseJson));
                 
                
            })
            .catch((error) => {
                setValues(prevState=>({
                    ...prevState,
                    loading:false,}))
                    if(Platform.OS!=='ios'){
                      ToastAndroid.showWithGravity(
                        error.toString(),
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
    
                    }else{
                      alert(error.toString())
                    }
    
                 
               
            
                
            //display error message
             console.warn(error);
            });    
       

      }
    

    return(
        <View style={styles.main}>
             
       
          
        <View style={styles.passwordContainer}>
       
            
            <Text type='heading' style={styles.text}>Enter Otp to Verify your Mobile number</Text>
            <InputText
               
               main={{flex: 0,top: 12,}}
               keyboardType='number-pad'
               maxLength={6}
               label='Otp'
               labelStyle={''}
               autoCorrect={false}
               containerStyle={styles.containerStyle} 
               errorMessage={form.incorrectEmail ?'Mandatory field':''}    
               onChangeText={value=>setValues(prevState=>({
                   ...prevState,
                   email:value.trim(),
                   incorrectEmail:false,      
             }))}
             onBlur={()=>checkField('email','incorrectEmail',isNonEmptyString)}
             underlineColorAndroid = {colors.colors.transparent}
            
            />
            <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',top:16}}>
            <Text type='body' style={{fontSize:10}}>Didn't Reciever an Otp? </Text>
            <TouchableOpacity onPress={resendOtp}>
            <Text type='body' style={{fontSize:10,color:colors.colors.primary}}>Resend Otp</Text>
            </TouchableOpacity>
        
        
            </View>
             <TouchableOpacity style={styles.button} onPress={otpVerify}>
          <Text type='subheading' style={{color:colors.colors.white}}>Verify Otp</Text>
        </TouchableOpacity>
                  
       
      
        </View>
        <Loader loading={form.loading}/>
      



    </View>
    )

}
export default OtpVerification
const styles = StyleSheet.create({
    main:{
        flex:1,
        alignItems:'center',
        backgroundColor:colors.colors.white,
        padding:10,
        
   },
   passwordContainer:{
       top:24,
       //backgroundColor:colors.colors.gray300,
       
       



   },
   text:{
       paddingVertical: 10,
       paddingBottom: 12,
   },
   button:{
       backgroundColor: colors.colors.primary,
       //width:'100%',
       height:40,
       alignItems:'center',
       justifyContent:'center',
       top: 28,
       borderRadius:7
               
      
     
     },
     defaultMargin:{
      marginTop:0, 
      borderBottomWidth :1,
      height:30,
      marginBottom:12
    
     //backgroundColor: 'red',
     //width:'100%'
      
      
       // paddingStart: 10,
     // paddingEnd:10,
      
    
    },
    containerStyle: {
      //flex:1,
      backgroundColor: colors.colors.white,
      height: 40,
      borderRadius: 4,
     // top:12,
      shadowColor: colors.colors.gray500,
      
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 1,
      shadowOpacity: 1.0,
      borderWidth:1,
      margin: 2,
      elevation:2,
      borderColor:colors.colors.primaryLight,
      position:'relative',
      zIndex:1,
      marginBottom:14,
      paddingLeft:4
    },
 

})