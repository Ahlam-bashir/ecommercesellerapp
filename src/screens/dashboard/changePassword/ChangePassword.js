import React ,{useState}from 'react'
import {View,StyleSheet, TouchableOpacity} from 'react-native'
import { InputText ,Icon,Loader, Text} from '../../../common'
import { DIMENS } from '../../../constants'
import {colors} from '../../../theme'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { encode } from 'base-64'
import { BASE_URL } from '../../../constants/matcher'

const ChangePassword =({navigation})=>{
    const [values,formValues]=useState(
        {
            OldPassword:'',
            incorrectOldPassword:false,
            NewPassword:'',
            incorrectNewPassword:false,
            ConfirmNewPassword:'',
            incorrectConfirmNewPassword:false,
           
        }
    )
    const [loading,setLoading] = useState(false)
    const checkField=(fieldKey,fieldErrorKey,fieldValidater)=>{
        if(!fieldValidater(values[fieldKey])){
            formValues(prevState=>({
            ...prevState,
            [fieldErrorKey]:true
            }));
            return false;
        }
        return true;
    
    }
    const checkValidation=()=>{
        let isValid=true
        isValid=isValid  &&   checkField('OldPassword','incorrectOldPassword',isNonEmptyString)
        isValid=isValid  &&   checkField('NewPassword','incorrectNewPassword',isNonEmptyString)
        isValid=isValid  &&   checkField('ConfirmNewPassword','incorrectConfirmNewPassword',isNonEmptyString)
        return isValid
      }  

    const changePassword=()=>{
        if(!checkValidation()){
            return
        }
              
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              console.log(myStorage.sellerId)
              setLoading(true)
              fetch(BASE_URL+'ChangePassword', {
                method: 'POST',
                headers:  
                 {   
                     Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
             },
                 body:JSON.stringify(
                    {
                        "oldPassword":values.OldPassword,
                        "newPassword":values.NewPassword,
                        "confirmPassword":values.ConfirmNewPassword
                    }
                 ),
            })
            .then((response) =>response.json())
            .then((responseJson) => {
                       //Showing response message coming from server 
              console.log(responseJson); 
              setLoading(false)
              alert(responseJson.status)
              
              
             
              })
              .catch((error) => {
                  setLoading(false)
              //display error message
              
                  console.warn(error);
              });
      
      })})
      
      

    }
    return(
        <View style={styles.main}>
            <View>
            <Loader loading={loading}/>
            </View>
            <View style={{backgroundColor:colors.colors.white,padding:12,paddingTop:30,paddingBottom:20}}>
                <View style={{width:'100%',alignItems:'center',paddingBottom:30}}>
                <Icon
                type='materialcommunityicons'
                name='shield-lock-outline'
                size={120}
                color={colors.colors.primary}


                />
                </View>
            <InputText
            main={{flex:0}}
            label='Old Password'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>formValues(prevState=>({
                ...prevState,
                OldPassword:value.trim(),
                incorrectOldPassword:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={values.incorrectOldPassword?'Required Field':''}
            onBlur={()=>checkField('OldPassword','incorrectOldPassword',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
             main={{flex:0}}
            label='New Password'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>formValues(prevState=>({
                ...prevState,
                NewPassword:value.trim(),
                incorrectNewPassword:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={values.incorrectNewPassword?'Required Field':''}
            onBlur={()=>checkField('NewPassword','incorrectNewPassword',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
               main={{flex:0}}
            label='Confirm New Password'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>formValues(prevState=>({
                ...prevState,
                ConfirmNewPassword:value.trim(),
                incorrectConfirmNewPassword:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={values.incorrectConfirmNewPassword?'Required Field':''}
            onBlur={()=>checkField('ConfirmNewPassword','incorrectConfirmNewPassword',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
                <TouchableOpacity style={styles.buttonContainer}  onPress={changePassword}>
           <Text type='subheading' style={{color:colors.colors.white}}>Change Password</Text>
             

           
            </TouchableOpacity>
         
            </View>
            

        </View>
    )
}
export default ChangePassword;
const styles=StyleSheet.create({
    main:{
        flex:1,
        width:DIMENS.common.WINDOW_WIDTH,
        height:'100%',
        padding:16,
        backgroundColor:colors.colors.white,
      // paddingTop:'50%'
      
       //justifyContent:'center'
       

    },
    defaultMargin:{
        marginTop:0, 
        borderBottomWidth :1,
        height:30,
        marginBottom:12
        
        },
    buttonContainer:{
        height:45,
        width:'100%',
        backgroundColor:colors.colors.primary,
        borderRadius:5,
       // position:"absolute",
        alignSelf:'center',
       // right:24,
        elevation:10,
        alignItems:'center',
        justifyContent:'center',
       // bottom:20,
            
        
        
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
            //margin: 4,
            elevation:2,
            borderColor:colors.colors.primaryLight,
            position:'relative',
            zIndex:1,
            marginBottom:18,
            paddingLeft:4
          },

})