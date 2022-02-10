import React, { useEffect, useState } from 'react'
import {View,StyleSheet, ScrollView,Platform,TouchableOpacity, Keyboard} from 'react-native'
import {Text,InputText,Icon,PickerModal,Loader} from '../../../common'
import { colors } from '../../../theme'
import {isNonEmptyString} from '../../../utils'
import DocumentPicker from 'react-native-document-picker'
import { DIMENS } from '../../../constants'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../../constants/matcher'
import Country from '../../../constants/data/country.json'
import {encode} from 'base-64'

const ManageCompany =({navigation})=>{
    const [modalVisible,setModalVisible] =useState(false)
    const [items,setItems]=useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [search,setSearch]=useState('')
  
 
    const [loading,setLoading] = useState(false)
    const [company,setCompany] = useState(false)
    const [form,setValues] = useState(
        {
          companyId:'',  
          CompanyName:'',
          incorrectCompanyName:false,
          CompanyPhone:'',
          incorrectCompanyPhone:false,
          StreetName:'',
          incorrectStreetName:false,
          BuildingName:'',
          incorrectBuildingName:false,
          City:'',
          incorrectCity:false,
          Pincode:'',
          incorrectPincode:false,
          State:'Select State',
          incorrectState:false,
          PAN:'',
          incorrectPAN:false,
          country:'Select Country',
          incorrectCountry:false,
          GSTIN:'',
          incorrectGSTIN:false,
          LiscenseNumber:'',
          incorrectLiscenseNumber:false,
          Registrar:'',
          incorrectRegistrar:false,
          file:'',
          incorrectFile:false,
          singleFile:'',
          countryId:null,
          stateId:null,
          address:'',

        })
    useEffect(async()=>{
         setLoading(true)
     await   AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              console.log(myStorage.sellerId)
              fetch(BASE_URL+'SellerCompany?sellerId='+myStorage.sellerId, {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
                },
              })
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson)
                  //Showing response message coming from server 
                  setLoading(false)
                  if(responseJson.message==='ok' && responseJson.Company!==null){
                      setCompany(true)
                    

                      setValues(prev=>({
                          ...prev,
                          CompanyName:responseJson.Company.companyName,
                          CompanyPhone:responseJson.Company.companyPhone,
                          Pincode:responseJson.Company.pincode,
                          PAN:responseJson.Company.pan,
                          GSTIN:responseJson.Company.gstin,
                          LiscenseNumber:responseJson.Company.licenseNumber,
                          Registrar:responseJson.Company.registrar,
                          companyId:responseJson.Company.id,
                          address:responseJson.Company.streetName+responseJson.Company.city,
                          
                          


                      }))
                     

                  }
                  else{
                    setCompany(false)
                    //alert(responseJson.message)
                  }
                 
                  
                 // setLoading(false)
                  
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
          
            })})
       

    },[company])
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
    const selectOneFile = async () => {
        //Opening Document Picker for selection of one file
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
            //There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          //Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          console.log('URI : ' + res.uri);
          console.log('Type : ' + res.type);
          console.log('File Name : ' + res.name);
          console.log('File Size : ' + res.size);
          //Setting the state to show single file attributes
          setValues(prevValue=>({
              ...prevValue,
              singleFile:res
          }))
        } catch (err) {
          //Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            //If user canceled the document selection
            alert('Canceled from single doc picker');
          } else {
            //For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
      };
      const countryList=()=>{
        setModalVisible(true)
        setItems(Country)
        setFilteredDataSource(Country)
       // setLoading(false) 
    }
    const stateList=()=>{
      if(form.countryId===null){
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
      fetch(BASE_URL+'State?country='+form.countryId, {
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
          setItems(responseJson)
          setFilteredDataSource(responseJson)
          
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
          setValues(prev=>({
              ...prev,
              country:item.countryName,
              countryId:item.id
          }))
          setItems([])
          
  
        }else
        {
            setValues(prev=>({
                ...prev,
                State:item.stateName,
                stateId:item.id
            }))
            setItems([])
     }
    }
    const checkvalidation=()=>{
        let isValid=true
         isValid=isValid  &&   checkField('CompanyName','incorrectCompanyName',isNonEmptyString)
         isValid=isValid  &&   checkField('CompanyPhone','incorrectCompanyPhone',isNonEmptyString)
         isValid=isValid  &&   checkField('StreetName','incorrectStreetName',isNonEmptyString)
         isValid=isValid  &&   checkField('BuildingName','incorrectBuildingName',isNonEmptyString)
         isValid=isValid  &&   checkField('City','incorrectCity',isNonEmptyString)
         isValid=isValid  &&   checkField('Pincode','incorrectPincode',isNonEmptyString)
         isValid=isValid  &&   checkField('LiscenseNumber','incorrectLiscenseNumber',isNonEmptyString)
         isValid=isValid  &&   checkField('Registrar','incorrectRegistrar',isNonEmptyString)
          
         return isValid
        }
    const manageCompany=()=>{
        Keyboard.dismiss();
        if(!checkvalidation()){
            return
        }
        if(form.State==='Select State' || form.country==='Select Country'){
            if(Platform.OS!=='ios'){
              ToastAndroid.showWithGravity(
                'Country or state field not selected',
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
         
            }
            else{
              alert('Country or state field is mandatory')
            }
          
            return
          }
          if(form.singleFile.uri===''||form.singleFile.uri===undefined||form.singleFile.uri===null){
              alert('upload liscense file')
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
              fetch(BASE_URL+'SellerCompany', {
                method: 'POST',
                headers:  
                 {   
                     Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
             },
                 body:JSON.stringify(
                  {
                
                    "userId":myStorage.sellerId,
                    "companyName":form.CompanyName,
                    "companyPhone":form.CompanyPhone,
                    "streetName": form.StreetName,
                    "buildingName":form.BuildingName,
                    "city":form.City,
                    "pincode":form.Pincode,
                    "country_id":form.countryId,
                    "state_id":form.stateId,
                    "pan":form.PAN,
                    "gstin":form.GSTIN,
                    "licenseNumber":form.LiscenseNumber,
                    "registrar":form.Registrar,
                    "licenseFilePath":form.singleFile.uri
                    
                 }
                 ),
            })
            .then((response) =>response.json())
            .then((responseJson) => {
                       //Showing response message coming from server 
              console.log(responseJson); 
              setLoading(false)
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
                alert(responseJson.Message)
               }    
              })
              .catch((error) => {
              //display error message
              setLoading(false)
              
                  console.warn(error);
              });
    
    })})
    


    }
    const searchFilterFunction = (text) => {
      // Check if searched text is not blank
      if (text) {
        // Inserted text is not blank
        // Filter the masterDataSource
        // Update FilteredDataSource
        const newData = items.filter(
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
        setItems(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setItems(filteredDataSource);
        setSearch(text);
      }
    };
    
    
    return(
        <ScrollView style={{flex:1}}>
        <View style={styles.main}>
          <Loader loading={loading}/>
            {company?<View style={styles.centerView}>
            <View style={styles.container}> 
            <Text type='subheading'>Company name:</Text>
            <Text type='caption'>{form.CompanyName}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Company Id:</Text>
            <Text type='caption'>{form.companyId}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Verified:</Text>
            <Text type='caption'>YES </Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Registrar:</Text>
            <Text type='caption'>{form.Registrar}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Registered By:</Text>
            <Text type='caption'>MEEE </Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Company Phone:</Text>
            <Text type='caption'>{form.CompanyPhone}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>PAN :</Text>
            <Text type='caption'>{form.PAN}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>GSTIN:</Text>
            <Text type='caption'>{form.GSTIN} </Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Liscense Number:</Text>
            <Text type='caption'>{form.LiscenseNumber} </Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Liscense File:</Text>
            <Text type='caption'>{form.file}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Address:</Text>
            <Text type='caption'>{form.address + form.Pincode}</Text>
            </View> 
        </View>
        :<View style={styles.formContainer}>
            <PickerModal
                 visible={modalVisible}
                 onSelect={(item)=>onChange(item)}
                 item={items}
                 onClose={()=>setModalVisible(false)}
                 searchFilterFunction={(text)=>searchFilterFunction(text)}
                 searchText={search}

             />
            <InputText
                main={{flex:0}}
                label='Company Name'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    CompanyName:value.trim(),
                    incorrectCompanyName:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectCompanyName?'Required Field':''}
                onBlur={()=>checkField('CompanyName','incorrectCompanyName',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
                main={{flex:0}}
                label='Company Phone'
                keyboardType='number-pad'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    CompanyPhone:value.trim(),
                    incorrectCompanyPhone:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectCompanyPhone?'Required Field':''}
                onBlur={()=>checkField('CompanyPhone','incorrectCompanyPhone',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
                main={{flex:0}}
                label='Street Name'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    StreetName:value.trim(),
                    incorrectStreetName:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectStreetName?'Required Field':''}
                onBlur={()=>checkField('StreetName','incorrectStreetName',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='Building Name'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    BuildingName:value.trim(),
                    incorrectBuildingName:false
                })
                )}
                containerStyle={styles.containerStyle}
                //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectBuildingName?'Required Field':''}
                onBlur={()=>checkField('BuildingName','incorrectBuildingName',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='City'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    City:value.trim(),
                    incorrectCity:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectCity?'Required Field':''}
                onBlur={()=>checkField('City','incorrectCity',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='Pincode'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    Pincode:value.trim(),
                    incorrectPincode:false
                })
                )}
                containerStyle={styles.containerStyle}
                //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectPincode?'Required Field':''}
                onBlur={()=>checkField('Pincode','incorrectPincode',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='PAN'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    PAN:value.trim(),
                    incorrectPAN:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectPAN?'Required Field':''}
                onBlur={()=>checkField('PAN','incorrectPAN',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='GSTIN'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    GSTIN:value.trim(),
                    incorrectGSTIN:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectGSTIN?'Optional field':''}
                onBlur={()=>checkField('GSTIN','incorrectGSTIN',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <InputText
                main={{flex:0}}
                label='Liscense Number'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    LiscenseNumber:value.trim(),
                    incorrectLiscenseNumber:false
                })
                )}
                containerStyle={styles.containerStyle}
              //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectLiscenseNumber?'Required Field':''}
                onBlur={()=>checkField('LiscenseNumber','incorrectLiscenseNumber',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
                main={{flex:0}}
                label='Registrar'
                labelStyle={''}
                autoCorrect={false}
                onChangeText={value=>setValues(prevState=>({
                    ...prevState,
                    Registrar:value.trim(),
                    incorrectRegistrar:false
                })
                )}
                containerStyle={styles.containerStyle}
               // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
                errorMessage={form.incorrectRegistrar?'Required Field':''}
                onBlur={()=>checkField('Registrar','incorrectRegistrar',isNonEmptyString)}
                underlineColorAndroid = {colors.colors.transparent}
            />
             <View style={{flexDirection:'row'}}>
               <TouchableOpacity onPress={countryList} style={{...styles.containerStyle,width:'50%',flexDirection:'column'}}>
               <View style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>              
                   <Text>{form.country}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </View>
                   </TouchableOpacity>
                 
            
            
                   <TouchableOpacity onPress={stateList} style={{...styles.containerStyle,width:'50%',flexDirection:'column'}}>
               <View style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>              
                   <Text>{form.State}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </View>
                   </TouchableOpacity>
                  
             
           

             
          
            </View>
            <View style={{width:'50%',height:50,flexDirection:'column',top:8,bottom:12}}>
               <Text>Liscense File</Text>
                   <TouchableOpacity onPress={selectOneFile}>
               <View style={{flexDirection:'row',alignItems:'center',height:40}}>              
                   <Text type='body' style={{padding:6}}>{form.file}</Text>
                   <Text>{form.singleFile.name?form.singleFile.name:'No file Selected'}</Text>
                    </View>
                   </TouchableOpacity>
                   <View style={{height:1,backgroundColor:colors.colors.gray500}}/>
             </View>
             <View style={styles.buttonContainer}>
            <Icon
              name='check'
              size={35}
              color={colors.colors.white}
              onPress={manageCompany}

            />
            </View>

            




        </View>}
        </View>
        </ScrollView>
    )
}
export default ManageCompany;
const styles=StyleSheet.create({
    main:{
      flex:1,
      padding:16,
      backgroundColor:colors.colors.white,
      paddingBottom:32
    

    },
    centerView:{
       // margin:8,
        backgroundColor:colors.colors.white,
        padding:12

    },
    container:{
        flexDirection:'row',
        margin:8,
        alignItems:'center',
        justifyContent:'space-between',
        
    },
    defaultMargin:{
        marginTop:0, 
        borderBottomWidth :1,
        height:30,
        marginBottom:12
        
        },
    formContainer:

    {
        marginBottom:12
       
        //height:DIMENS.common.WINDOW_HEIGHT

        
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
        bottom:0,
         
      
        
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