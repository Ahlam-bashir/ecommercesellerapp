import React, { useState ,useRef} from 'react'
import { View,StyleSheet,Platform, ScrollView, TouchableOpacity, Keyboard ,CheckBox, ToastAndroid,Linking, SafeAreaView, KeyboardAvoidingView} from 'react-native';
import {DIMENS, SPACING,TYPOGRAPHY} from '../../constants'
import {colors} from '../../theme'
import {Text,InputText,Loader,Icon,PickerModal,SubscriptionModal} from '../../common'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import { NAVIGATION_TO_LOGIN_SCREEN, NAVIGATION_TO_OTP_VERIFICATION } from '../../navigation/routes';
import Country from '../../constants/data/country.json'
import { BASE_URL } from '../../constants/matcher';
import {Picker} from '@react-native-community/picker'


const registerScreen = ({navigation}) =>{
  const [modalVisible,setModalVisible]=useState(false)
  const [subModalVisible,setSubmodalvisible] = useState(false)
  const [countries,setCountries] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [subscriptionData,setSubscriptoionData] = useState(["Basic","Gold","Silver"])
  const [selectedData,setSelectedData] = useState('Select Subscription')
  const [countryName,setCountryName] = useState('Select Country')
  const [stateName,setStateName] = useState('Select State')
  const [countryid,setcountryId] = useState('')
  const [subscriptionid,setsubscriptionId] = useState(null)
  const [stateid,setdstateId] = useState('')
  const [search,setSearch]=useState('')
  const [form,setValues] = useState(
    {
      firstName:'',
      incorrectFirstName:false,
      lastname:'',
      incorrectLastName:false,
      email:'',
      incorrectEmail:false,
      confirmEmail:'',
      incorrectConfirmEmail:false,
      phoneNumber:'',
      incorrectPhone:false,
      mobile:'',
      incorrectMobile:false,
      streetName:'',
      incorrectStreetName:false,
      buildingName:'',
      incorrectbuildingName:false,
      city:'',
      incorrectcity:false,
      country:'',
      incorrectCountry:false,
      state:'',
      incorrectState:false,
      subscription:'',
      incorrectSubsciption:false,
      pincode:'',
      incorrectPincode:false,
      isSelected:false

    })
    const [loading,setLoading] = useState(false)
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
      let isValid=true
       isValid=isValid  &&   checkField('firstName','incorrectFirstName',isNonEmptyString)
       isValid=isValid  &&   checkField('lastname','incorrectLastName',isNonEmptyString)
       isValid=isValid  &&   checkField('email','incorrectEmail',isEmailValid)
       isValid=isValid  &&   checkField('confirmEmail','incorrectConfirmEmail',isEmailValid)
       isValid=isValid  &&   checkField('phoneNumber','incorrectPhone',isPhoneNumberValid)
       isValid=isValid  &&   checkField('mobile','incorrectMobile',isPhoneNumberValid)
       isValid=isValid  &&   checkField('streetName','incorrectStreetName',isNonEmptyString)
       isValid=isValid  &&   checkField('buildingName','incorrectbuildingName',isNonEmptyString)
       isValid=isValid  &&   checkField('city','incorrectcity',isNonEmptyString)
     //  isValid=isValid  &&   checkField('country','incorrectCountry',isNonEmptyString)
     //  isValid=isValid  &&   checkField('state','incorrectState',isNonEmptyString)
       isValid=isValid  &&   checkField('pincode','incorrectPincode',isNonEmptyString)
        
       return isValid
      }
  const onSignup =()=>{
    Keyboard.dismiss()
   if(!checkvalidation()){

     
        return
    }
    if(stateName==='Select State' || countryName==='Select Country'){
      if(Platform.OS!=='ios'){
        ToastAndroid.showWithGravity(
          'Country or state field is mandatory',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
   
      }
      else{
        alert('Country or state field is mandatory')
      }
    
      return
    }
    
      if(form.email !== form.confirmEmail){
        if(Platform.OS!=='ios'){
          ToastAndroid.showWithGravity(
            'email and confirm email doesnt match',
            ToastAndroid.SHORT, //can be SHORT, LONG
            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
          );
      
        }else{
          alert('email and confirm email doesnt match',
          )
        }
              return
      }
      if(subscriptionid==null){
        if(Platform.OS!=='ios'){
          ToastAndroid.showWithGravity(
            'Please select subscription',
            ToastAndroid.SHORT, //can be SHORT, LONG
            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
          );
     
        }
        else{
          alert('Please select subscription')
        }
        return
  
      }
 const datatoSend=
 {
    "firstName": form.firstName.toString(),
    "lastName": form.lastname.toString(),
    "email":form.email.toString(),
    "confirmEmail":form.confirmEmail.toString(),
    "phoneNumber": form.phoneNumber.toString(),
    "mobile": form.mobile.toString(),
    "streetName": form.streetName.toString(),
    "buildingName": form.buildingName.toString(),
    "city": form.city.toString(),
    "country_id": countryid.toString(),
    "state_id":stateid.toString(),
    "pincode": form.pincode.toString(),
    "roleId":"0",
    "acceptTc": form.isSelected,
    "subscriptionId" :subscriptionid.toString()
  }
  setLoading(true)
  fetch(BASE_URL+'SellerRegister', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(datatoSend),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      setLoading(false)
             console.log(responseJson)
         if(responseJson.status){
           alert(responseJson.status)
           navigation.replace(NAVIGATION_TO_OTP_VERIFICATION,{'userid':responseJson.data.id})

         }else if(responseJson.ModelState){
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
          alert(responseJson.Message)
         }
      //Showing response message coming from server 
        console.log(responseJson);
    })
    .catch((error) => {
      setLoading(false)
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
        
     
    //console.warn('wait')

  }
  const countryList=()=>{
      setModalVisible(true)
      setLoading(false)
      setCountries(Country)
      setFilteredDataSource(Country)
     // setLoading(false) 
  }
  const stateList=()=>{
    if(countryid === ''){
      if(Platform.OS!=='ios'){
        ToastAndroid.showWithGravity(
          'Plz select Country first',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
      }else{
        alert('Select Country first')
      }
     
      return
    }
    setModalVisible(true)
    /// setLoading(true)
    fetch(BASE_URL+'State?country='+countryid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Showing response message coming from server 
        console.log(responseJson);
        setCountries(responseJson)
        setFilteredDataSource(responseJson)
        console.log(countries)
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

  }
   const onChange = (item)=>{
      console.log(item)       
      setModalVisible(false)
      if(item.countryName)
      {
        setCountryName(item.countryName)
        setcountryId(item.id)
        setCountries([])

      }else
      {
        setStateName(item.stateName)
      //  setcountryId(item.countryId)
        setdstateId(item.id)
        setCountries([])
   }
  }
  const subscriptionList=()=>{
    setSubmodalvisible(true)
    fetch(BASE_URL+'Subscriptions', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Showing response message coming from server 
        console.log(responseJson);
        setSubscriptoionData(responseJson)
        
      })
      .catch((error) => {
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
    
   
      //display error message
       console.warn(error);
      });

    
  
}
const onSubChange = (item)=>{
  console.log(item)       
  setSubmodalvisible(false)
  setSelectedData(item.title)
  setsubscriptionId(item.id)
  
}
const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = countries.filter(
      function (item) {
        let itemData=''
        let textData=''
       if(item.countryName){

         itemData = item.countryName
          ? item.countryName.toUpperCase()
          : ''.toUpperCase();
         textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
       }else{
         itemData = item.stateName
        ? item.stateName.toUpperCase()
        : ''.toUpperCase();
      textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;

       }
    });
    setCountries(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setCountries(filteredDataSource);
    setSearch(text);
  }
};

  return(
      <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <Loader loading={loading}/>
        <PickerModal
                 visible={modalVisible}
                 onSelect={(item)=>onChange(item)}
                 item={countries}
                 onClose={()=>setModalVisible(false)}
                 searchFilterFunction={(text)=>searchFilterFunction(text)}
                 searchText={search}


                 
                 
             />
               <SubscriptionModal
                 visible={subModalVisible}
                 item={subscriptionData}
                 onSelect={(item)=>onSubChange(item)}
                 onClose={()=>setSubmodalvisible(false)}
                 
             />
               <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
            <Icon
              name="arrowleft"
              color={colors.colors.primary}
              size={25}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />
           <Text type='heading' style={styles.headerText}>Register As UCM Seller</Text>
           </View>
          
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        
        >
      
      <ScrollView style={{marginBottom:70}}
      contentContainerStyle={{ flexGrow: 1 }}
      >
          <View style={styles.centerView}>
            <View style={styles.fieldContainer}>
            <InputText
            label='First Name'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                  ...prevState,
                  firstName:value.trim(),
                  incorrectFirstName:false
            })
            )}
            containerStyle={styles.containerStyle}

          //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectFirstName?'FirstName should not be blank':''}
            onBlur={()=>checkField('firstName','incorrectFirstName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
               <InputText
            label='Last Name'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

          //  containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectLastName?'LastName should not be blank':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              lastname:value.trim(),
              incorrectLastName:false,      
        }))}
        onBlur={()=>checkField('lastname','incorrectLastName',isNonEmptyString)}
        underlineColorAndroid = {colors.colors.transparent}

            />     
            </View>
            <InputText
            keyboardType='email-address'
            label='Email'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

           // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectEmail?'Email id should be correct':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              email:value.trim(),
              incorrectEmail:false,      
        }))}
        onBlur={()=>checkField('email','incorrectEmail',isEmailValid)}
        underlineColorAndroid = {colors.colors.transparent}


            />
                    <InputText
            keyboardType='email-address'
            label='Confirm Email'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

           // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectConfirmEmail?'ConfirmsEmail should match email':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              confirmEmail:value.trim(),
              incorrectConfirmEmail:false,      
        }))}
        onBlur={()=>checkField('confirmEmail','incorrectConfirmEmail',isEmailValid)}
        underlineColorAndroid = {colors.colors.transparent}

    
           />
           <InputText
            label='Phone Number'
            labelStyle={''}
            autoCorrect={false}
            keyboardType='number-pad'
            containerStyle={styles.containerStyle}

            //containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectPhone?'Phone number should not be blank':''  }
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              phoneNumber:value.trim(),
              incorrectPhone:false,      
        }))}
        onBlur={()=>checkField('phoneNumber','incorrectPhone',isPhoneNumberValid)}
        underlineColorAndroid = {colors.colors.transparent}

    
            
           />
            <InputText
            keyboardType='number-pad'
            label='Mobile'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

           // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectMobile?'Mobile No should not be blank':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              mobile:value.trim(),
              incorrectMobile:false,      
        }))}
        onBlur={()=>checkField('mobile','incorrectMobile',isPhoneNumberValid)}
        underlineColorAndroid = {colors.colors.transparent}

           />
              <InputText
            label='Street Name'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

         //   containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectStreetName?'Street Name should not be blank':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              streetName:value.trim(),
              incorrectStreetName:false,      
        }))}
        onBlur={()=>checkField('streetName','incorrectStreetName',isNonEmptyString)}
        underlineColorAndroid = {colors.colors.transparent}


           />
               <InputText
            label='Building Name'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

           // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectbuildingName?'Building Name should not be blank':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              buildingName:value.trim(),
              incorrectbuildingName:false,      
        }))}
        onBlur={()=>checkField('buildingName','incorrectbuildingName',isNonEmptyString)}
        underlineColorAndroid = {colors.colors.transparent}


           />
               <InputText
            label='City'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={styles.containerStyle}

           // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
            errorMessage={form.incorrectcity?'city Name should not be blank':''}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              city:value.trim(),
              incorrectcity:false,      
        }))}
        onBlur={()=>checkField('city','incorrectcity',isNonEmptyString)}
        underlineColorAndroid = {colors.colors.transparent}


            
           />
            
               <InputText
              keyboardType='number-pad'
               label='Pincode'
               labelStyle={''}
               autoCorrect={false}
               containerStyle={styles.containerStyle}

              // containerStyle={Platform.OS!=='android'? styles.defaultMargin:null}
               errorMessage={form.incorrectPincode?'pincode should not be blank':''}
               onChangeText={value=>setValues(prevState=>({
              ...prevState,
                pincode:value.trim(),
                incorrectPincode:false,      
            }))}
        onBlur={()=>checkField('pincode','incorrectPincode',isNonEmptyString)}
        underlineColorAndroid = {colors.colors.transparent}


           
           />     
            <View style={styles.fieldContainer}>
            
               <TouchableOpacity onPress={countryList} style={{...styles.containerStyle,width:'50%'}}>
               <View style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>              
                   <Text>{countryName}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </View>
                   </TouchableOpacity>
                 
           
           
                   <TouchableOpacity onPress={stateList} style={{...styles.containerStyle,width:'50%'}}>
               <View style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>              
                   <Text>{stateName}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </View>
                   </TouchableOpacity>
               
           

             
          
            </View>
            <View style={{...styles.containerStyle}}>
            <TouchableOpacity onPress={subscriptionList} style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>
                   <Text>{selectedData}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </TouchableOpacity>
                   <Text type='body' style={{color:colors.colors.primary}} onPress={() => {
                                 Linking.openURL('https://ucm-ea-uat-app.azurewebsites.net/Seller/Subscriptions')}}>Click here to know about subscriptions</Text>
 
                   </View>


            <View style={{flexDirection:'row',top:14,alignItems:'center'}}>
              <TouchableOpacity onPress={()=>{
                  if(form.isSelected){
                    setValues(prevState=>({
                      ...prevState,
                        isSelected:false      
                    }))
                  }else{
                    setValues(prevState=>({
                      ...prevState,
                        isSelected:true      
                    }))
                  }
            }}>
                <Icon
                  name={ form.isSelected ? 'check-box' : 'check-box-outline-blank'}
                  size={22}
                  color={colors.colors.primary}
                />
              </TouchableOpacity>
            <Text type='body'>I/We Accept Terms and Conditions</Text>
            </View>
           </View>
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={onSignup}>
              <Text type='subheading' style={{color:colors.colors.white}}>Register</Text>
            </TouchableOpacity>
     

       </KeyboardAvoidingView>
          
        </View>
        </SafeAreaView>
        
  )
}
export default registerScreen;
const styles=StyleSheet.create({
  container:{
    flex:1,
    position:'relative', 
    backgroundColor: colors.colors.white,
    padding:8,
    paddingBottom:60

},

centerView:{
  width:'100%',
  backgroundColor: colors.colors.white,
  //top:'5%',
  padding: 12,
  paddingBottom:20
 // margin:10,
  //alignItems:"flex-start"  

},
headerText:{
  fontSize:22,
   alignSelf:'center',
   padding: 10,
   marginBottom:10,
   color:colors.colors.primary,
   width:'100%',
   textAlign:'center'
  


  
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
fieldContainer:{
 // flex:1,
 // padding:6,
  flexDirection:'row',
  width:'98%',
  alignItems:'center',
  //justifyContent:'space-between'
 // backgroundColor: 'red',
 // alignItems:'flex-start'
 


},
button:{
  backgroundColor: colors.colors.primary,
  alignItems:"center",
  padding: 6,
 // marginTop: 32,
 marginBottom:15,
  position:'absolute',
   bottom:6,
  width:'100%',
 // alignSelf:'center',
  height:40,
  borderRadius:7,
  justifyContent:'center'
 
  
 // marginLeft:8,
 // marginRight:8


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