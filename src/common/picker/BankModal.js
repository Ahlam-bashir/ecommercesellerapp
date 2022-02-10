import React,{useState,useEffect} from 'react'
import {View,StyleSheet, Modal,TouchableOpacity,Platform,ScrollView, Keyboard} from 'react-native'
import {colors} from '../../theme'
import {Icon,InputText} from '../../common'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import { DIMENS } from '../../constants'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../constants/matcher'
import { encode } from 'base-64'


const BankModal =(props) =>{
    const [form,setValues] = useState(
        {
          AccountNumber:'',
          incorrectAccountNumber:false,
          ConfirmAccountNumber:'',
          incorrectConfirmAccountNumber:false,
          BankName:'',
          incorrectBankName:false,
          BeneficiaryName:'',
          incorrectBeneficiaryName:false,
          IFSCCode:'',
          incorrectIfscCode:false,
          BranchCode:'',
          incorrectBranchCode:false,
          BranchName:'',
          incorrectBranchName:false,
          SwiftCode:'',
          incorrectSwiftCode:false,
          country:'',
          incorrectCountry:false,
          countryId:'',
          userId:''
        })
        useEffect(()=>{
            AsyncStorage.getAllKeys().then((keyArray) => {
                AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                  let myStorage = {};
                  for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                  }
                  fetch(BASE_URL+'SellerBankAccount?sellerId='+myStorage.sellerId, {
                    method: 'GET',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
                    },
                  })
                    .then((response) => response.json())
                    .then((responseJson) => {
                      //Showing response message coming from server 
                      alert(responseJson.message)
                      if(responseJson.BankAccount!==null){
                         
      
                          setValues(prev=>({
                              ...prev,
                              AccountNumber:responseJson.BankAccount.accountNumber,
                              ConfirmAccountNumber:responseJson.BankAccount.accountNumber,
                              BankName:responseJson.BankAccount.bankName,
                              BeneficiaryName:responseJson.BankAccount.beneficiaryName,
                              BranchCode:responseJson.BankAccount.branchCode,
                              BranchName:responseJson.BankAccount.branchName,
                              SwiftCode:responseJson.BankAccount.swiftCode,
                              IFSCCode:responseJson.BankAccount.ifsc,
                              countryId:responseJson.BankAccount.countryId,
                              userId:responseJson.BankAccount.id
      
      
                              
      
                              
                             
                             
      
      
                              
                              
                              
      
      
                          }))
                         
      
                      }
                     
                      
                     // setLoading(false)
                      
                    })
                    .catch((error) => {
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
              
                })})
           
      
        },[])
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
    const update=()=>{
        console.log('hello')
        Keyboard.dismiss()
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              console.log(myStorage.sellerId)
              fetch(BASE_URL+'SellerBankAccount/'+form.userId, {
                method: 'PUT',
                headers:  
                 {   
                     Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
             },
                 body:JSON.stringify(
                  {  
                    "id": form.userId,
                    "userId":myStorage.sellerId,
                    "countryId": 101,
                    "ifsc": form.IFSCCode,
                    "accountNumber": form.AccountNumber,
                    "confirmAccountNumber":form.ConfirmAccountNumber,
                    "bankName":form.BankName,
                    "beneficiaryName":form.BeneficiaryName,
                    "branchName":form.BranchName,  
                    "branchCode":form.BranchCode,
                    "swiftCode":form.SwiftCode           
                 }
                 ),
            })
            .then((response) =>response.json())
            .then((responseJson) => {
                       //Showing response message coming from server 
              console.log(responseJson); 
              if(responseJson.ModelState){
                Object.entries(responseJson.ModelState).forEach(([key, value]) => {
                  console.log(`${key}: ${value}`)
                  if(Object.entries(value).length!==0){
                    if(Platform.OS!=='ios'){
                      ToastAndroid.showWithGravity(
                        value.toString()  + ' ' +   'at'  + ' ' +   key,
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
                  }
                    else{
                      alert( value.toString()  + ' ' +   'at'  + ' ' +   key,
                      )
                    }
                  }
                 
              
              });
              // alert(responseJson.Message)
               //navigation.replace(NAVIGATION_TO_LOGIN_SCREEN)
               }
               else {
                alert(responseJson.message)
               }    
              })
              .catch((error) => {
              //display error message
              
                  console.warn(error);
              });
      
      })})
           

    }
  return(
    <Modal  
    visible={props.visible}
    animationType='fade'
    transparent={true}
    >
    <View style={styles.main}>
    <View style={styles.pickerContainer}>
    <View style={styles.header}> 
    <View style={{width:60,height:2,backgroundColor:colors.colors.gray500,left:120}}/>
            <TouchableOpacity style={{padding:10}} onPress={props.onClose}>
            <Icon  name='clear' size={20} color={colors.colors.gray500}/>
            </TouchableOpacity>            
            </View>
            <ScrollView>
            <View style={{flexDirection:'column',width:'100%'}}>
            <InputText
            main={{flex:0}}
            label='Account Number'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.AccountNumber}
            onChangeText={value=>setValues(prevState=>({
                  ...prevState,
                  AccountNumber:value.trim(),
                  incorrectAccountNumber:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectAccountNumber?'Required Field':''}
            onBlur={()=>checkField('AccountNumber','incorrectAccountNumber',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
            label='Confirm Account Number'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.ConfirmAccountNumber}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                ConfirmAccountNumber:value.trim(),
                incorrectConfirmAccountNumber:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectConfirmAccountNumber?'Required Field':''}
            onBlur={()=>checkField('ConfirmAccountNumber','incorrectConfirmAccountNumber',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
            label='Bank Name'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.BankName}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BankName:value.trim(),
                incorrectBankName:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectBankName?'Required Field':''}
            onBlur={()=>checkField('BankName','incorrectBankName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
            label='Beneficiary Name'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.BeneficiaryName}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BeneficiaryName:value.trim(),
                incorrectBeneficiaryName:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectBeneficiaryName?'Required Field':''}
            onBlur={()=>checkField('BeneficiaryName','incorrectBeneficiaryName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <View style={{flexDirection:'row'}}>
            <InputText
            label='IFSC Code'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.IFSCCode}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                IFSCCode:value.trim(),
                incorrectIfscCode:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectIfscCode?'Required Field':''}
            onBlur={()=>checkField('IFSCCode','incorrectIfscCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
            label='Branch Code'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.BranchCode}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BranchCode:value.trim(),
                incorrectBranchCode:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectBranchCode?'Required Field':''}
            onBlur={()=>checkField('BranchCode','incorrectBranchCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />

            </View>
            <View style={{flexDirection:'row'}}>
            <InputText
            label='Branch Name'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.BranchName}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BranchName:value.trim(),
                incorrectBranchName:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectBranchName?'Required Field':''}
            onBlur={()=>checkField('BranchName','incorrectBranchName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
            label='Swift Code'
            labelStyle={{fontSize:12,height:20}}
            autoCorrect={false}
            value={form.SwiftCode}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                SwiftCode:value.trim(),
                incorrectSwiftCode:false
            })
            )}
            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectSwiftCode?'Required Field':''}
            onBlur={()=>checkField('SwiftCode','incorrectSwiftCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.primary}
            />

            </View>
           
            </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
            <Icon
              name='check'
              size={35}
              onPress={update}
              color={colors.colors.white}

            />
            </View>
     
    </View>
   
    </View>

   


    </Modal>
  )
}
export default BankModal
const styles =StyleSheet.create({
    main:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:colors.colors.transparent,
        marginLeft: 10,
        marginRight: 10,

    },
    pickerContainer:{
        width:'100%',
        height:DIMENS.common.WINDOW_HEIGHT*0.8,
        backgroundColor: colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:16
    },
    header:{
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:8,
        alignSelf:'center'
            
    },
    defaultMargin:{
    marginTop:0, 
    borderBottomWidth :1,
    height:30,
    marginBottom:12
    
    },
    buttonContainer:{
    height:60,
    width:60,
    backgroundColor:colors.colors.primary,
    borderRadius:60/2,
    position:"absolute",
    alignSelf:'flex-end',
    right:24,
    elevation:10,
    alignItems:'center',
    justifyContent:'center',
    bottom:22,   
    },


})