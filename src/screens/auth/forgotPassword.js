import React,{useState} from 'react'
import {View,StyleSheet,TouchableOpacity,Keyboard,ToastAndroid,Platform} from 'react-native'
import {Text,InputText,Loader} from '../../common/';
import { colors } from '../../theme';
import {DIMENS,TYPOGRAPHY} from '../../constants'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../constants/matcher';

const forgotPassword =({navigation})=>{
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
        isValid=isValid && checkField('email','incorrectEmail',isEmailValid)
        return isValid

    }
 
      const resetPassword =()=>{
        Keyboard.dismiss()
        if(!checkvalidation()){
            return
        }
        const datatoSend={
            "username":form.email.toString(),
            
        }
        setValues(prevState=>({
            ...prevState,
            loading:true,}))
        fetch(BASE_URL+'ForgotPassword', {
            method: 'POST',
            headers: {
               Accept: 'application/json',
              'Content-Type': 'application/json',
            },
        
            body: JSON.stringify(datatoSend),
          })
            .then((response) => response.json())
            .then((responseJson) => {
              //Showing response message coming from server 
              console.log(JSON.stringify(responseJson));
              if(responseJson.status==='200'){
                setValues(prevState=>({
                    ...prevState,
                    loading:false,}))
                    if(Platform.OS!=='ios'){
                       
                ToastAndroid.showWithGravity(
                  responseJson.extra+'to your registered email',
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
                    }else{
                      alert(responseJson.extra+'to your registered email')
                    }
              
                navigation.goBack();
              }
              else{
                setValues(prevState=>({
                    ...prevState,
                    loading:false,}))
                    if(Platform.OS!=='ios'){
                      ToastAndroid.showWithGravity(
                        responseJson.extra,
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
                    }else{
                      alert(responseJson.extra)
                    }
               
               
               // navigation.goBack();

              }
                 
                
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
           
                
                <Text type='heading' style={styles.text}>Enter your registered Email to reset your password</Text>
                <InputText
                   label='Email'
                   main={{flex: 0,top: 12,}}
                   keyboardType='email-address'
                   label='Email'
                   labelStyle={''}
                   autoCorrect={false}
                   containerStyle={styles.containerStyle} 
                   underlineColorAndroid = {colors.colors.transparent}
                
                   errorMessage={form.incorrectEmail ?'Email should not be blank':''}    
                   onChangeText={value=>setValues(prevState=>({
                       ...prevState,
                       email:value.trim(),
                       incorrectEmail:false,      
                 }))}
                 onBlur={()=>checkField('email','incorrectEmail',isEmailValid)}
                
                />
                 <TouchableOpacity style={styles.button} onPress={resetPassword}>
              <Text  type='subheading' style={{color:colors.colors.white}}>Reset Password</Text>
            </TouchableOpacity>
                      
           
          
            </View>
            <Loader loading={form.loading}/>
          
    


        </View>
    )

}
export default forgotPassword;
const styles = StyleSheet.create({
    main:{
         flex:1,
         alignItems:'center',
         backgroundColor:colors.colors.white,
         paddingStart:14,
         paddingEnd:14
         
    },
    passwordContainer:{
        top:16,
       
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
        top: 20,
        borderRadius:7,
                
       
      
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