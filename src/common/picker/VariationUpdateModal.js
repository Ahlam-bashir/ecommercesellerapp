import React,{useState,useEffect} from 'react'
import {View,StyleSheet, Modal,TouchableOpacity,Platform,ScrollView, Keyboard} from 'react-native'
import {colors} from '../../theme'
import {Icon,InputText,Text} from '../../common'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import { DIMENS ,TYPOGRAPHY} from '../../constants'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../constants/matcher'
import { encode } from 'base-64'

const VariationUpdateModal =(props)=>{
    console.log('prps'+props.variationId)
    const varId=props.variationId
    const [form,setform]= useState({
        price:'',
        incorrectPrice:false,
        stock:'',
        incorrectStock:false,
        extraInfo:'',
        sku:null,
        productId:null,
       

          
    }
    
        
    )
    const checkField=(fieldKey,fieldErrorKey,fieldValidater)=>{
        if(!fieldValidater(form[fieldKey])){
             setform(prevState=>({
               ...prevState,
               [fieldErrorKey]:true
             }));
             return false;
        }
        return true;
    
      }
    useEffect(()=>{
      //  console.log(form.variationId)
        if(varId!==null){
            console.log(form.variationId)
            AsyncStorage.getAllKeys().then((keyArray) => {
                AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                  let myStorage = {};
                  for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                  }
                  fetch(BASE_URL+'ProductVariation/'+props.variationId, {
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
                       console.log(responseJson.ProductVariation)
                      if(responseJson){
                         
      
                          setform(prev=>({
                              ...prev,
                              price:responseJson.ProductVariation.price,
                              stock:responseJson.ProductVariation.stock,
                              extraInfo:responseJson.ProductVariation.extraInfo,
                              sku:responseJson.ProductVariation.SKU,
                              productId:responseJson.ProductVariation.productId
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
           
      
        }
       
    },[props])
    const checkValidation=()=>{
        let isValid=true
        isValid=isValid  &&   checkField('price','incorrectPrice',isNonEmptyString)
        isValid=isValid  &&   checkField('stock','incorrectStock',isNonEmptyString)
         return isValid
      }  
    const VariationUpdate=()=>{
        Keyboard.dismiss()
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
              fetch(BASE_URL+'VariationsGroup/'+props.variationId, {
                method: 'PUT',
                headers:  
                 {   
                     Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
             },
                 body:JSON.stringify(
                  
                    {
                        "variationColorId":"",
                        "variationSizeId":"",
                        "productId":form.productId,
                        "stock":form.stock,
                        "price":form.price,
                        "SKU":form.sku,
                        "extraInfo":form.extraInfo /* Optional */
                    }    
                 
                 ),
            })
            .then((response) =>response.json())
            .then((responseJson) => {
                       //Showing response message coming from server 
              console.log(responseJson); 
              if(responseJson.status!=='400'){
                alert(responseJson.extra)
              }
              else{
                  alert('Product not Updated, Try Again')
              }
             
             
            
              // alert(responseJson.Message)
               //navigation.replace(NAVIGATION_TO_LOGIN_SCREEN)
               
              })
              .catch((error) => {
              //display error message
              
                  console.warn(error);
              });
      
      })})
           


    }
   
    return (
        <Modal
         visible={props.visible}
         transparent={true}
         animationType={'fade'}
        >
        <View style={styles.main}>
            <View style={styles.pickerContainer}>
                <View style={styles.header}>
                    <Text type='subheading'>Update Variation</Text>
                    <TouchableOpacity style={{padding:10}} onPress={props.onClose}>
                    <Icon  name='clear' size={20} color={colors.colors.gray500}/>
                    </TouchableOpacity>            
                    

                </View>
                <View>
                <InputText
                    main={{flex:0}}
                    label='Stock'
                    value={form.stock.toString()}
                    labelStyle={{fontSize:12,height:20}}
                    autoCorrect={false}
                   
                    onChangeText={value=>setform(prevState=>({
                           ...prevState,
                            stock:value.trim(),
                           incorrectStock:false
                   })
                    )}
                    containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                    errorMessage={form.incorrectStock?'Required Field':''}
                    onBlur={()=>checkField('stock','incorrectStock',isNonEmptyString)}
                    underlineColorAndroid = {colors.colors.primary}
            />
            <InputText
                main={{flex:0}}
                label='Price($)'
                labelStyle={TYPOGRAPHY.caption}
                autoCorrect={false}
                containerStyle={{}}
                value={form.price.toString()}
                keyboardType='number-pad'
                onChangeText={value=>setform(prevState=>({
                 ...prevState,
                 price:value.trim(),
                 incorrectPrice:false
           })
            )}
            underlineColorAndroid = {colors.colors.primary}

            containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
         
            errorMessage={form.incorrectPrice?'MandatoryField':""}
            onBlur={()=>checkField('price','incorrectPrice',isNonEmptyString)}
    
         
            />
              <InputText  
               
               label='Additional Information(optional)'
               labelStyle={TYPOGRAPHY.caption}
               autoCorrect={false}
               containerStyle={{}}
               underlineColorAndroid = {colors.colors.primary}
               main={{flex:0}}
               value={form.extraInfo}
               containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
               onChangeText={value=>setform(prevState=>({
                   ...prevState,
                   extraInfo:value.trim(),
                 })
             )}
              
           />
          
           
                </View>
                <View style={styles.buttonContainer}>
            <Icon
              name='check'
              size={24}
              onPress={VariationUpdate}
              color={colors.colors.white}

            />
        </View>
            </View>
        </View>
        </Modal>
    )
}
export default VariationUpdateModal
const styles = StyleSheet.create({
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
        height:350,
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
        marginBottom:24,
        alignSelf:'center'
             //   backgroundColor:colors.colors.primary
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
             bottom:16,
             
      
            
         },


})