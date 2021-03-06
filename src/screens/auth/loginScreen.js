import React, { useState, useContext, useEffect } from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Keyboard, ScrollView, ToastAndroid, Platform, KeyboardAvoidingView } from 'react-native';
import { DIMENS, TYPOGRAPHY } from '../../constants'
import NetInfo from '@react-native-community/netinfo'
import { isNonEmptyString, isEmailValid, isPhoneNumberValid, isNumber, isPasswordValid } from '../../utils'
import { colors } from '../../theme'
import { Text, InputText, Loader,Icon } from '../../common'
import { NAVIGATION_TO_FORGOTPASSWORD, NAVIGATION_TO_SIGNUP_SCREEN } from '../../navigation/routes';
import { saveseller } from '../../utils/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../constants/matcher';
import { RNToasty } from 'react-native-toasty';


const loginScreen = ({ navigation }) => {
    const [offline, setoffline] = useState(false)
    const [hidden,setHidden]=useState(true)
    const [form, setValues] = useState({
        email: '',
        incorrectEmail: false,
        emailError:'',
        password: '',
        incorrectPassword: false,
    })

    const [indicator, setIndicator] = useState(false)
    const checkField = (fieldKey, fieldErrorKey, fieldValidater) => {
        if (!fieldValidater(form[fieldKey])) {
            setValues(prevState => ({
                ...prevState,
                [fieldErrorKey]: true
            }));
            return false;
        }
        return true;

    }
    useEffect(() => {
        NetInfo.addEventListener(state => {
          
          
            setoffline(state.isConnected)
        });
    }, [offline])
    const checkvalidation = () => {
        let isValid = true
        isValid = isValid && checkField('email', 'incorrectEmail',isNonEmptyString)
       
        isValid = isValid && checkField('password', 'incorrectPassword', isNonEmptyString)
        return isValid

    }
    const login = () => {
        Keyboard.dismiss()
        if(!isNonEmptyString(form.email)){
            setValues(prevState=>({
                ...prevState,
                emailError:'Mandatory field',
               
                incorrectEmail:true,      
            }))


        }else if(!isNonEmptyString(form.email) || !isEmailValid(form.email)){
            setValues(prevState=>({
                ...prevState,
                emailError:'Email should be valid',
               
                incorrectEmail:true,      
            }))
            return


        }
        if (!checkvalidation()) {
            return
        }
        const datatoSend = {
            "email": form.email.toString(),
            "password": form.password.toString()
        }
            setIndicator(true)
            if (offline === true) {
                fetch(BASE_URL + 'Login', {
                method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify(datatoSend),
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        if (responseJson.status === 'loggedIn') {
                            setIndicator(false)
                            //Showing response message coming from server 
                            console.log(JSON.stringify(responseJson));
                            saveseller(JSON.stringify(responseJson.data.id))
                            AsyncStorage.setItem('data',JSON.stringify(responseJson.data))
                            AsyncStorage.setItem('user', JSON.stringify(datatoSend))
                           
                            AsyncStorage.setItem('email', form.email)
                            AsyncStorage.setItem('password', form.password)
                            navigation.replace('drawerNavigationRoutes')
                        }
                        else {
                            setIndicator(false)
                            RNToasty.Error({
                                title:responseJson.Message,
                                position:'center'
                            })
                           
                           
                        }
                    })
                    .catch((error) => {
                    setIndicator(false)
                    RNToasty.Error({
                        title:'Something went wrong',
                        position:'center'
                    })
                    console.warn(error);
                });
        } 
        else {
            setIndicator(false)
            RNToasty.Show({
                title:'Make sure you have internet connection',
                position:'center'
            })
           
        }
    }

    return(
        
        <View style={styles.container}>  
        <View style={styles.bigCircle}/> 
        <View style={styles.centerView}>          
        <View style={styles.authBox}>
            <Loader  loading={indicator}/>
            <View style={styles.logoBox}>
                   <Image 
                    style={{resizeMode:'cover',width:100,height:100}}
                    source={require('../../assets/images/ucm_logo.jpg')}/>
            </View>
            <Text type='heading'>Login</Text>
        <View style={{minHeight:'30%',justifyContent:'center',marginTop:16}}>
            <InputText
                keyboardType='email-address'
                label='Email'
                labelStyle={''}
                autoCorrect={false}
                containerStyle={styles.containerStyle}
                errorMessage={form.incorrectEmail ?form.emailError:''}    
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    email:value.trim(),
                    incorrectEmail:false,      
                }))}
                onBlur={()=>{
                    if(!isNonEmptyString(form.email)){
                        setValues(prevState=>({
                            ...prevState,
                            emailError:'Mandatory field',
                           
                            incorrectEmail:true,      
                        }))


                    }else if(!isNonEmptyString(form.email) || !isEmailValid(form.email)){
                        setValues(prevState=>({
                            ...prevState,
                            emailError:'Email should be valid',
                           
                            incorrectEmail:true,      
                        }))


                    }
                   // checkField('email','incorrectEmail',isEmailValid)
                }
                } 
                underlineColorAndroid = {colors.colors.transparent}
            />
             
            <InputText
                label='Password'
                labelStyle={''}
                secureTextEntry={hidden}       
                autoCorrect={false}
                contextMenuHidden={true}
              
                containerStyle={styles.containerStyle} 
                 errorMessage={form.incorrectPassword ?'Password should not be blank':''}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    password:value.trim(),
                    incorrectPassword:false,      
                }))}

                onBlur={()=>{           
                    checkField('password','incorrectPassword',isNonEmptyString)
                }}
                underlineColorAndroid = {colors.colors.transparent}
            />
              <TouchableOpacity  
               onPress={()=>hidden?setHidden(false):setHidden(true)} 
               style={{bottom:42,alignSelf:'flex-end', zIndex:1,position:'absolute',right:10}}>
          <Icon
        
            type='feather'
            name={hidden?'eye-off':'eye'}
            color={colors.colors.primary}
           
            />
            </TouchableOpacity>
           
        </View>   
        <TouchableOpacity  style={{width:'100%',height:40,backgroundColor:colors.colors.primary,marginTop: 12,alignItems:'center',justifyContent:'center',borderRadius:7}} onPress={login}>
        <Text type='subheading' style={{color:colors.colors.white ,padding: 5,alignSelf: 'center',}}>Login</Text>
        </TouchableOpacity>
       <View style={{flexDirection:'row',marginTop:20 ,alignItems:'center',justifyContent:'space-between'}}>
        <View style={{height:0.5,width:'40%',backgroundColor:colors.colors.gray400}}/> 
        <Text type='subheading' style={{alignSelf: 'center',color:colors.colors.gray500,fontSize: 12,}}>OR</Text>
        <View style={{height:0.5,width:'40%',backgroundColor:colors.colors.gray400}}/>
       </View>
       <View style={{flexDirection:'row',marginTop:20,alignItems:'center',justifyContent:'center'}}>
        <Text type='subheading' style={{color:colors.colors.black,fontSize: 10,}}>Dont have an account?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_TO_SIGNUP_SCREEN)}>
        <Text type='subheading' style={{color:colors.colors.primary,fontSize: 10,paddingHorizontal: 2}}>Register Now</Text>
        </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',marginTop:6,alignItems:'center',justifyContent:'center'}}>
        <Text type='subheading' style={{color:colors.colors.black,fontSize: 10,}}>Forgot password?</Text>
        <TouchableOpacity onPress={()=>navigation.navigate(NAVIGATION_TO_FORGOTPASSWORD)}>
        <Text type='subheading' style={{color:colors.colors.primary,fontSize: 10,paddingHorizontal: 2,}}>Reset Here</Text>
        </TouchableOpacity>
        </View>
        </View>
     
     
        </View> 
        </View>       
    )
}
export default loginScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    bigCircle: {
        width: DIMENS.common.WINDOW_WIDTH * 0.7,
        height: DIMENS.common.WINDOW_HEIGHT * 0.7,
        backgroundColor: colors.colors.primary,
        position: 'absolute',
        right: DIMENS.common.WINDOW_WIDTH * 0.25,
        top: -50,
        left: -30,
        borderRadius: 1000
    },
    centerView: {
        width: '100%',
        top: '16%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    authBox: {
        width: '80%',
        backgroundColor: colors.colors.white,
        borderRadius: 20,
        alignSelf: 'center',
        paddingHorizontal: 14,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    logoBox: {
        width: 100,
        height: 100,
        backgroundColor: colors.colors.white,
        borderRadius: 1000,
        alignSelf: 'center',
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        top: -50,
        marginBottom: -50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    }, 
    inputContainer: {
        marginTop: 0,
        borderBottomWidth: 1,
        height: 30

    },
    containerStyle: {
        //flex:1,
        backgroundColor: colors.colors.transparent,
        height: 40,
        borderRadius: 4,
       // top:12,
        shadowColor: colors.colors.gray500,
        
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowRadius: 0.5,
        shadowOpacity: 1.0,
        borderWidth:1,
        margin: 2,
        elevation:1,
        borderColor:colors.colors.primaryLight,
        position:'relative',
        zIndex:1,
        marginBottom:6,
        paddingLeft:4
      },
      

})
