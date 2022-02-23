import React,{useState,useRef} from 'react'
import {encode} from 'base-64'

import
{
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
  useWindowDimensions
} from 'react-native'
import
 {
    InputText,
    Text,
    Icon,
    PickerModal, 
    Loader
  
} from '../../common'
import 
{ 
DIMENS,
TYPOGRAPHY
}
from '../../constants'
import
{ colors } from '../../theme'
import { RichEditor, RichToolbar,actions,defaultActions } from 'react-native-pell-rich-editor';

import DropDownPicker from 'react-native-dropdown-picker'
import {Picker} from '@react-native-community/picker'
import { useEffect } from 'react'
import { isMinDescritpion, isMinLength, isMinLengthName, isNonEmptyString, isPriceRange, isWidth } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import  Country from '../../constants/data/country.json'
import { BASE_URL } from '../../constants/matcher';
import { NAVIGATION_TO_REPLACEIMAGES } from '../../navigation/routes'
import {decode} from 'html-entities';
import HandmadePercent from '../../common/picker/HandmadePercent'
import RenderHTML from 'react-native-render-html';
import { RNToasty } from 'react-native-toasty'
const height=70
const EditProduct =({navigation,route})=>{
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search,setSearch]=useState('')

  const RichText = useRef(); //reference to the RichEditor component
  const highlightsref = useRef(); //reference to the RichEditor component
  const strikethrough = require("../../assets/images/logoWhite.png"); //icon for strikethrough
  const video = require("../../assets/images/logo_animated.gif"); //icon for Addvideo
 
  const {width} = useWindowDimensions();
    const Id= route.params.id
   // const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
    const [open,setOpen] = useState(false)
    const [disable,setdisable] = useState(false)
    let actionSheet = useRef();
    const [disableS,setdisableS] = useState(false)
    const [items,setItems] = useState([])
    const [modalVisible,setModalVisible] = useState(false)
    const [value, setValue] = useState(null);
    const [form,setValues] = useState({
      productName:"",
      incorrectProductName:false,
      productNameError:'',
      price:'',
      incorrectPrice:false,
      priceError:'',
      taxes:'',
      incorrectTaxes:false,
      taxError:'',
      width:'',
      incorrectwidth:false,
      widthError:'',
      height:'',
      heightError:'',
      incorrectheight:false,
      length:'',
      incorrectLength:false,
      lenghtError:'',
      description:'',
      incorrectDescription:false,
      weight:'',
      weightError:'',
      incorrectweight:false,
      stock:'',
      stockError:'',
      incorrectStock:false,
      categoryId:'',
      categoryName:'',
      discountError:'',
      sku:'',
      countryId:'',
      stateId:'',
      dcountryId:'',
      dstateId:'',
      countryName:'',
      stateName:'',
      dcountryName:'',
      dstateName:'',
      taxIncluded:false,
      deliveryIncluded:false,
      discount:'',
      incorrectDiscount:false,
      highlights:'',
      incorrectHightlights:false,
      highlightsError:'',
      subCategoryId:'',
      subcategoryName:'',
      handmadePercent: 'Handmade %',
      isGITagged: false,
      descriptionError:'',
   
    })
    const [loading,setLoading] = useState(false)
    const [textValue,setTextValue] =useState('Select Category')
    const [data,setData] = useState({})
    const [modalVisible2,setModalVisible2] = useState(false)
    const [list,setList] = useState([])
    useEffect(async()=>{
      setLoading(true)
    await  AsyncStorage.getAllKeys().then((keyArray) => {
        AsyncStorage.multiGet(keyArray).then(async(keyValArray) => {
          let myStorage = {};
          for (let keyVal of keyValArray) {
            myStorage[keyVal[0]] = keyVal[1]
          }
         await fetch(BASE_URL+'SellerProducts/'+Id, {
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
              console.log(JSON.stringify(responseJson));
                  setValues(prev=>({
                    ...prev,
                    sku:responseJson.SKU,
                    productName:responseJson.name,
                    price:JSON.stringify(responseJson.price),
                    taxes:JSON.stringify(responseJson.taxes),
                    width:JSON.stringify(responseJson.productWidth),
                    height:JSON.stringify(responseJson.productHeightThickness),
                    length:JSON.stringify(responseJson.productLength),
                    description: responseJson.description,
              
                    stock:JSON.stringify(responseJson.stockAvailability),
                    weight:JSON.stringify(responseJson.weight),
                    categoryId:JSON.stringify(responseJson.categoryId),
                    countryId:JSON.stringify(responseJson.countryId),
                    stateId:JSON.stringify(responseJson.stateId),
                    dcountryId:JSON.stringify(responseJson.fromCountryId),
                    dstateId:JSON.stringify(responseJson.fromStateId),
                    discount:JSON.stringify(responseJson.discount),
                    highlights:JSON.stringify(responseJson.highlights),
                    subCategoryId:JSON.stringify(responseJson.subCategoryId),
                    handmadePercent:JSON.stringify(responseJson.HandmadePercent),
                    isGITagged:responseJson.IsGITagged
                     
                  }))
                  setLoading(false)
            })
            .catch((error) => {
            //display error message
            setLoading(false)
             console.warn(error);
            });
        
        })})
       
  
     },[Id])
   
    useEffect(()=>{
      
         if(form.countryId!==''){
          var item = Country.find(item => item.id === parseInt(form.countryId));
          console.log('ddffd'+item.countryName)
          setValues(prev=>({
            ...prev,
            countryName:item.countryName,
            countryId:item.id,
            
          }))  
         }
  },[form.countryId])
  useEffect(()=>{
    
       if(form.dcountryId!==''){
        var item = Country.find(item => item.id === parseInt(form.dcountryId));
        console.log('ddffd'+item.countryName)
        setValues(prev=>({
          ...prev,
          dcountryName:item.countryName,
          dcountryId:item.id,
          
        }))  
       }
    
       

},[form.dcountryId])


    const onChange = (item)=>{
      setModalVisible(false)
      if(item.categoryName){
          setValues(prev=>({
            ...prev,
            categoryName:item.categoryName,
            categoryId:item.id
          }))
          setItems([])
      }else if(item.subCategoryName){
        setValues(prev=>({
          ...prev,
          subcategoryName:item.subCategoryName,
          subCategoryId:item.id
        }))
        setItems([])
       
      }
      else if(item.countryName){
       // console.log(item)
           
        setValues(prev=>({
          ...prev,
          countryName:item.countryName,
          countryId:item.id
        }))
          setdisable(false)
          setItems([])
      
        
      }else if(item.stateName){
          console.log(item)
       
        setValues(prev=>({
          ...prev,
          stateName:item.stateName,
          stateId:item.id
        }))
        setdisableS(false) 
        setItems([])
      
       
      }
  
    }
    const onChangeC=(item)=>{
      setModalVisible2(false)
        if(item.countryName){
          setValues(prev=>({
            ...prev,
            dcountryName:item.countryName,
            dcountryId:item.id,
           
           }))
           setdisableS(false)
           setList([])
         
        }
        else if(item.stateName){
          setValues(prev=>({
            ...prev,
            dstateName:item.stateName,
            dstateId:item.id,
           // dcountryId:''
            
          }))
          setList([])
         
        }
  
    }
    const deliveryCountryList=()=>{
      setModalVisible2(true)
      setList(Country)
      setFilteredDataSource(Country)
    }
   
    const checkField=(fieldKey,fieldErrorKey,fieldValidater,error)=>{
      if(!isNonEmptyString(form[fieldKey])){
        setValues(prevState => ({
          ...prevState,
          [fieldErrorKey]: true,
          [error]:'Mandatory field'
        }));
        return false;
        
       }  
      
       switch(fieldValidater)
       {
         case isMinLengthName:
           
           if (!fieldValidater(form[fieldKey])) {
            setValues(prevState => ({
              ...prevState,
              [fieldErrorKey]: true,
              [error]:'Minimun  3  characters'
            }));
            return false;
          }
          return true
          case isPriceRange:{
            if (fieldValidater(form[fieldKey])) {
              setValues(prevState => ({
                ...prevState,
                [fieldErrorKey]: true,
                [error]:'out of Range'
              }));
              return false;
            }
            return true
  
          }
          case isWidth:{
            if (fieldValidater(form[fieldKey])) {
              setValues(prevState => ({
                ...prevState,
                [fieldErrorKey]: true,
                [error]:'out of Range'
              }));
              return false;
            }
            return true
  
          }
          case isMinDescritpion:{
            if (fieldValidater(form[fieldKey])) {
              setValues(prevState => ({
                ...prevState,
                [fieldErrorKey]: true,
                [error]:'Minimun  30  characters'
              }));
              return false;
            }
            return true
  
          }
          case isNonEmptyString:{
            if (!fieldValidater(form[fieldKey])) {
              setValues(prevState => ({
                ...prevState,
                [fieldErrorKey]: true,
                [error]:'mandatory field'
              }));
              return false;
            }
            return true
  
          }
        
          
  
        }   
    
  
    }
    const checkvalidation=()=>{
      let isValid = true;
    isValid =  isValid   && checkField('productName', 'incorrectProductName', isNonEmptyString,'productNameError');
     isValid =  isValid  &&  checkField('productName','incorrectProductName',isMinLengthName,'productNameError')
     isValid =  isValid  && checkField('price', 'incorrectPrice', isNonEmptyString,'priceError');
      isValid =  isValid  && checkField('price', 'incorrectPrice', isPriceRange,'priceError');
    
       
      isValid = isValid && checkField('discount', 'incorrectDiscount', isNonEmptyString);
      isValid =isValid &&
        checkField('highlights', 'incorrectHightlights', isNonEmptyString,'highlightsError');
        isValid =
       isValid &&
        checkField('highlights', 'incorrectHightlights', isMinDescritpion,'highlightsError');
   
      isValid =
        isValid && checkField('width', 'incorrectwidth', isNonEmptyString,'widthError');
        isValid=isValid && checkField('width','incorrectwidth',isWidth,'widthError')  
              
      isValid =
        isValid && checkField('height', 'incorrectheight', isNonEmptyString,'heightError');
        isValid=isValid && checkField('width','incorrectwidth',isWidth,'heightError') 
      isValid =
       isValid && checkField('length', 'incorrectLength', isNonEmptyString,'lenghtError');
        isValid =
        isValid && checkField('length', 'incorrectLength', isWidth,'lenghtError');
      isValid =
       isValid &&
        checkField('description', 'incorrectDescription', isNonEmptyString,'descriptionError');
        isValid =
        isValid &&
        checkField('description', 'incorrectDescription', isMinDescritpion,'descriptionError');
    
     isValid =
       isValid && checkField('weight', 'incorrectweight', isNonEmptyString);
      isValid =
        isValid && checkField('stock', 'incorrectStock', isNonEmptyString);
   if (!form.taxIncluded) {
        isValid =
          isValid && checkField('taxes', 'incorrectTaxes', isNonEmptyString);
      }
  
      return isValid;
    
  /*    let isValid=true

       isValid=isValid  &&   checkField('productName','incorrectProductName',isNonEmptyString)
       isValid=isValid  &&   checkField('price','incorrectPrice',isNonEmptyString)
       isValid=isValid  &&   checkField('taxes','incorrectTaxes',isNonEmptyString)
       isValid=isValid  &&   checkField('width','incorrectwidth',isNonEmptyString)
       isValid=isValid  &&   checkField('height','incorrectheight',isNonEmptyString)
       isValid=isValid  &&   checkField('length','incorrectLength',isNonEmptyString)
       isValid=isValid  &&   checkField('description','incorrectDescription',isNonEmptyString)
       isValid=isValid  &&   checkField('weight','incorrectweight',isNonEmptyString)
       isValid=isValid  &&   checkField('stock','incorrectStock',isNonEmptyString)
       isValid=isValid &&   checkField('discount','incorrectDiscount',isNonEmptyString)
       isValid=isValid &&   checkField('highlights','incorrectHightlights',isNonEmptyString)
     
       if(!form.taxIncluded){
        isValid=isValid  &&   checkField('taxes','incorrectTaxes',isNonEmptyString)
       }
    
       return isValid*/
      }
    
    useEffect(()=>{
         console.log('id'+form.categoryId)
               AsyncStorage.getAllKeys().then((keyArray) => {
          AsyncStorage.multiGet(keyArray).then((keyValArray) => {
            let myStorage = {};
            for (let keyVal of keyValArray) {
              myStorage[keyVal[0]] = keyVal[1]
            }
            fetch(BASE_URL+'SellerCategories/'+form.categoryId, {
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
                console.log(responseJson.categoryName);
                 setValues(prev=>({
                   ...prev,
                   categoryName:responseJson.categoryName
                 }))         
              })
              .catch((error) => {
                
              //display error message
               console.warn(error);
              });
           

          })})
    
           
    },[form.categoryId])
    useEffect(()=>{
      console.log('id'+form.categoryId)
            AsyncStorage.getAllKeys().then((keyArray) => {
       AsyncStorage.multiGet(keyArray).then((keyValArray) => {
         let myStorage = {};
         for (let keyVal of keyValArray) {
           myStorage[keyVal[0]] = keyVal[1]
         }
         fetch(BASE_URL+'SellerSubCategories/'+form.subCategoryId, {
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
             console.log(responseJson.categoryName);
              setValues(prev=>({
                ...prev,
                subcategoryName:responseJson.subCategoryName
              }))         
           })
           .catch((error) => {
             
           //display error message
            console.warn(error);
           });
        

       })})
 
        
 },[form.categoryId])

    useEffect(()=>{
      console.log('staet'+form.stateId   +  form.dstateId)
        if(form.stateId!==''){  
          fetch(BASE_URL+'State/'+form.stateId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //setLoading(false)
            //Showing response message coming from server 
            console.log(responseJson);  
            setValues(prev=>({
              ...prev,
                stateName:responseJson.stateName,
                stateId:responseJson.id
            }))       
          })
          .catch((error) => {
            //setLoading(false)
          //display error message
           console.warn(error);
          });
      }
        if(form.dstateId!==''){
          fetch(BASE_URL+'State/'+form.dstateId, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((responseJson) => {
              //setLoading(false)
              //Showing response message coming from server 
              console.log(responseJson);  
              setValues(prev=>({
                ...prev,
                  dstateName:responseJson.stateName,
                  dstateId:responseJson.id
              }))       
            })
            .catch((error) => {
              //setLoading(false)
            //display error message
             console.warn(error);
            });
      
        }
      },[form.dstateId])
    const categoryList = ()=>{
      setModalVisible(true);
        fetch(BASE_URL+'Categories/', {
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
            
       
           })
           .catch((error) => {
             
           //display error message
            console.warn(error);
           });
    }
    const subCategoryList = ()=>{
      setModalVisible(true);
        fetch(BASE_URL+'SubCategories?category='+form.categoryId, {
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
    const countryList = ()=>{
      setModalVisible(true);
      setItems(Country)
      setFilteredDataSource(Country)
   }
   const stateList = ()=>{
    if(form.countryId===''){
      if(Platform.OS!=='ios'){
        ToastAndroid.showWithGravity(
          'Please Select Country of Origin first',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
       
      }else{
        alert( 'Please Select Country of Origin first',)
      }
         return
    }
 setModalVisible(true)
// setLoading(true)
fetch(BASE_URL+'State?country='+form.countryId, {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((responseJson) => {
      setItems(responseJson)
      setFilteredDataSource(responseJson)
    //setLoading(false)
    //Showing response message coming from server 
    console.log(responseJson);
           
    
  })
  .catch((error) => {
    //setLoading(false)
  //display error message
   console.warn(error);
  });

}
const deliverystateList = ()=>{
  let id=''
if(form.dcountryId===''){
  if(Platform.OS!=='ios'){
    ToastAndroid.showWithGravity(
      'Please Select Delivery from Country first',
      ToastAndroid.SHORT, //can be SHORT, LONG
      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
    );
    
  }else{
    alert('Please Select Delivery from Country first')
  }
    return
}
setModalVisible2(true)

// setLoading(true)
fetch(BASE_URL+'State?country='+form.dcountryId, {
method: 'GET',
headers: {
Accept: 'application/json',
'Content-Type': 'application/json',
},
})
.then((response) => response.json())
.then((responseJson) => {
 setList(responseJson)
 setFilteredDataSource(responseJson)
//setLoading(false)
//Showing response message coming from server 
console.log(responseJson);
      

})
.catch((error) => {
//setLoading(false)
//display error message
console.warn(error);
});
}
const updateProduct = () => {
   Keyboard.dismiss()
   if(!checkvalidation()){
     console.log('inide')
    return
  }
 // if(!form.productName.match(/^[0-9a-z]+$/) || !form.highlights.match(/^[0-9a-z]+$/)){
  //  ToastAndroid.showWithGravity(
   //   'Invalid Characters Entered',
  //    ToastAndroid.SHORT, //can be SHORT, LONG
 //     ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
  //  );
//         return
 // }

    
    console.log(Id)
    setLoading(true)
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        let myStorage = {};
        for (let keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1]
        }
        fetch(BASE_URL+'SellerProducts/'+Id, {
          method: 'PUT',
          headers:  
           {   
               Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
            },
           body:JSON.stringify(
            {
              "id": Id,
              "name": form.productName,
              "price": form.price,
              "sellerId":myStorage.sellerId,
              "subCategoryId": form.subCategoryId,
              "productLength": form.length,
              "productWidth": form.width,
              "productHeightThickness": form.height,
              "weight": form.weight,
              "state_id": form.stateId,
              "country_id": form.countryId,
              "SKU": form.sku,
              "stockAvailability": form.stock,
              "description": form.description,
              "highlights": form.highlights.replace(/\"/g,""),
              "country_from_id" :form.dcountryId,
              "state_from_id": form.dstateId,
              "isAllowed": true,
              "isDeleted": false,
              "taxIncluded": form.taxIncluded,
              "deliveryIncluded":form.deliveryIncluded,
              IsGITagged: form.isGITagged,
              HandmadePercent: form.handmadePercent,
           

          }
           ),
      })
      .then((response) =>response.json())
      .then((responseJson) => {
                 //Showing response message coming from server 
               console.log(responseJson);
               if(responseJson.Message){
                 setLoading(false)
                
                Object.entries(responseJson.ModelState).forEach(([key, value]) => {
                  console.log(`${key}: ${value}`)
                  RNToasty.Warn({
                    title: value.toString()  + ' ' +   'at'  + ' ' +   key,
                    position:'center'
                  })
                 
                  
                  
              });
             
            
               //alert(responseJson)
                
                }
                else{
                  setLoading(false)
                  RNToasty.Success({
                    title:responseJson,
                    position:'center'
                  },5000)
              //    setLoading(false)
             
              navigation.navigate('ManageProducts')
              }
              
                // console.log(navigation)
              })
               .catch((error) => {
                 setLoading(false)
                //display error message
                   console.warn(error);
               });    
  
        
      })})
}
const showActionSheet = () => {
  //To show the Bottom ActionSheet
  actionSheet.current.show();
};
function editorInitializedCallback() {
  RichText.current?.registerToolbar(function (items) {
    // items contain all the actions that are currently active
    console.log(
      "Toolbar click, selected items (insert end callback):",
      items
    );
  });
}

// Callback after height change
function handleHeightChange(height) {
  console.log("editor height change:", height);
  height=70
}

function onPressAddImage() {
  // you can easily add images from your gallery
  RichText.current?.insertImage(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
  );
}

function insertVideo() {
  // you can easily add videos from your gallery
  RichText.current?.insertVideo(
    "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4"
  );
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
        if (item.categoryName){
          itemData = item.categoryName
          ? item.categoryName.toUpperCase()
          : ''.toUpperCase();
         textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
       
        }
        else if (item.subCategoryName){
          itemData = item.subCategoryName
          ? item.subCategoryName.toUpperCase()
          : ''.toUpperCase();
         textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
       

        }
      else if(item.countryName){

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
const searchFilterFunctionC = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = list.filter(
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
    setList(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setList(filteredDataSource);
    setSearch(text);
  }
};





    return(
      <View style={styles.main}>
          <Loader loading={loading}/>
        <PickerModal
             visible={modalVisible}
             onSelect={(item)=>onChange(item)}
             item={items}
             onClose={()=>setModalVisible(false)}
             searchFilterFunction={(text)=>searchFilterFunction(text)}
             searchText={search}
  
         />
             <PickerModal
             visible={modalVisible2}
             onSelect={(item)=>onChangeC(item)}
             item={list}
             onClose={()=>setModalVisible2(false)}
             searchFilterFunction={(text)=>searchFilterFunctionC(text)}
             searchText={search}
   
         />
          <KeyboardAvoidingView  enabled
     behavior={Platform.OS === "ios" ? "padding" : null}
     keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >  
        <ScrollView 
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor:colors.colors.white
          
       }}
        >

        <View style={{flex:1,marginBottom:30}}>
        
       
           <View style={{...styles.container, flexDirection: 'row', top: 12}}>
          <TouchableOpacity  onPress={categoryList} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.categoryName}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={subCategoryList}
           // disabled={subCategoryDisable}
            style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.subcategoryName}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
          </TouchableOpacity>

          {/* <View style={styles.divider}/>*/}
        </View>

    
    
           <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Product Name'
             labelStyle={''}
             maxLength={100}
             autoCorrect={false}
           // placeholder={'Product Name'}
           // placeholderTextColor={colors.colors.gray400}
            value={form.productName}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              productName:value.trim(),
              incorrectProductName:false
        })
        )}
        underlineColorAndroid = {colors.colors.transparent}

       
     
        errorMessage={form.incorrectProductName?form.productNameError:""}
        onBlur={()=>{checkField('productName','incorrectProductName',isNonEmptyString,
        'productNameError'
        )
        checkField(
          'productName',
          'incorrectProductName',
          isMinLengthName,
          'productNameError'
        )
      }}
  // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
          />
          <InputText
            value={form.sku}
          //  placeholder={'SKU'}
           // placeholderTextColor={colors.colors.gray400}
             label='SKU'
             labelStyle={''}
             autoCorrect={false}
            containerStyle={{}}
            underlineColorAndroid={colors.colors.transparent}
            containerStyle={styles.containerStyle}
            disabled={true}
            //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
          />
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Price($)'
             labelStyle={''}
           //  placeholder={'Price($)'}
            //placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={{}}
            keyboardType="number-pad"
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                price: value.trim(),
                incorrectPrice: false,
              }))
            }
            value={form.price}
            underlineColorAndroid={colors.colors.transparent}
            // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectPrice ? form.priceError : ''}
            onBlur={() =>{
              checkField('price','incorrectPrice',isNonEmptyString,'priceError')
              checkField('price','incorrectPrice',isPriceRange,'priceError')                    
            }            
            }
          
          
          />
          <InputText
             value={(form.taxIncluded) ? 0:form.taxes}
          //  placeholder={'Taxes'}
           // placeholderTextColor={colors.colors.gray400}
            label='Taxes'
            labelStyle={''}
            autoCorrect={false}
            containerStyle={{}}
            disabled={form.taxIncluded}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                taxes: value.trim(),
                incorrectTaxes: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectTaxes ? 'MandatoryField' : ''}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            keyboardType="number-pad"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            top: 12,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if(form.deliveryIncluded){
                  setValues(prevState=>({
                    ...prevState,
                         
                      deliveryIncluded:false     
                  }))
                }else{
                  setValues(prevState=>({
                    ...prevState,
                         
                      deliveryIncluded:true     
                  }))
                
                }
              }}>
              <Icon
                 name={ form.deliveryIncluded ? 'check-box' : 'check-box-outline-blank'}
                
                size={22}
                color={colors.colors.primary}
              />
            </TouchableOpacity>
            <Text type="body">Inclusive of Delivery</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (form.taxIncluded) {
                  setValues(prevState => ({
                    ...prevState,
                    taxIncluded: false,
                  }));
                } else {
                  setValues(prevState => ({
                    ...prevState,

                    taxIncluded: true,
                  }));
                }
              }}>
              <Icon
                   name={ form.taxIncluded ? 'check-box' : 'check-box-outline-blank'}
              
                size={22}
                color={colors.colors.primary}
              />
            </TouchableOpacity>
            <Text type="body">Inclusive of taxes</Text>
          </View>
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Width(InCm)'
             labelStyle={''}
            // placeholder={'Width(InCm)'}
           // placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            keyboardType="number-pad"
            value={form.width}
            onChangeText={value=>setValues(prevState=>({
             ...prevState,
             width:value.trim(),
             incorrectwidth:false
       })
       )}
       underlineColorAndroid = {colors.colors.primary}

       errorMessage={form.incorrectwidth ? form.widthError : ''}
       onBlur={() =>{
        checkField('width','incorrectwidth',isNonEmptyString,'widthError')  
        checkField('width','incorrectwidth',isWidth,'widthError')  
        
      }
      }
    
           
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
         
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
           
          />
          <InputText
             label='Height(In Cm)'
             labelStyle={''}
           //  placeholder={'Height(In Cm)'}
          //  placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            value={form.height}
            keyboardType="number-pad"
            onChangeText={value=>setValues(prevState=>({
             ...prevState,
             height:value.trim(),
             incorrectheight:false
       })
       )}
       underlineColorAndroid = {colors.colors.transparent}

       errorMessage={form.incorrectheight ?form.heightError : ''}
       onBlur={() =>
        {
        checkField('height','incorrectheight',isNonEmptyString,'heightError')
        checkField('height','incorrectheight',isWidth,'heightError')  
       
        }
      }
    
            //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
          />
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Length(In Cm)'
             labelStyle={''}
             placeholder={'Length(In Cm)'}
            keyboardType="number-pad"
            placeholderTextColor={colors.colors.gray400}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            value={form.length}
                 onChangeText={value=>setValues(prevState=>({
                  ...prevState,
                  length:value.trim(),
                  incorrectLength:false
            })
            )}
            underlineColorAndroid = {colors.colors.transparent}

            errorMessage={form.incorrectLength ? form.lenghtError : ''}
            onBlur={() =>{
              checkField('length', 'incorrectLength', isNonEmptyString,'lenghtError')
              checkField('length', 'incorrectLength', isWidth,'lenghtError')
            
             
            }
              
            }
          
          />
          <InputText
             label='Discount(%)'
             labelStyle={''}
             placeholder={'Discount(%)'}
            placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            value={form.discount}
                
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              discount:value.trim(),
              incorrectDiscount:false
        })
        )}
        errorMessage={form.incorrectDiscount?form.discountError:""}
        onBlur={()=>{
          checkField('discount', 'incorrectDiscount', isNonEmptyString,'discountError')
              if(form.discount!==''&& form.discount>=90){
            setValues(prevState => ({
              ...prevState,
              incorrectDiscount: true,
              discountError:'out of range'
            }));

          
        }
        }}
  keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Stock'
             labelStyle={''}
          //   placeholder={'Stock'}
           // placeholderTextColor={colors.colors.gray400}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            value={form.stock}
            onChangeText={value=>setValues(prevState=>({
             ...prevState,
             stock:value.trim(),
             incorrectStock:false
       })
       )}
       underlineColorAndroid = {colors.colors.transparent}

       errorMessage={form.incorrectStock?'MandatoryField':""}
       onBlur={()=>checkField('stock','incorrectStock',isNonEmptyString)}

   
          />
          <InputText
              label='Weight'
              labelStyle={''}
           //   placeholder={'Weight'}
            //placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            value={form.weight}
                 onChangeText={value=>setValues(prevState=>({
                  ...prevState,
                  weight:value.trim(),
                  incorrectweight:false
            })
            )}
            underlineColorAndroid = {colors.colors.transparent}

            errorMessage={form.incorrectweight?'MandatoryField':""}
            onBlur={()=>checkField('weight','incorrectweight',isNonEmptyString)}
    
          
          />
        </View>
        <View style={{...styles.container,borderWidth:1,borderColor:colors.colors.primaryLight,marginTop:4,borderRadius:4}}>
     
     <RichEditor
     initialContentHTML={decode(form.description)}
     onBlur={() =>{
      checkField(
        'description',
        'incorrectDescription',
        isNonEmptyString,
        'descriptionError'

      )
      checkField(
        'description',
        'incorrectDescription',
        isMinDescritpion,
        'descriptionError'
        
      )
    }}
     disabled={false}
    containerStyle={styles.rich}
     ref={RichText}
    // style={styles.containerStyle}
     placeholder={"Write Description here"}
     onChange={value =>
       setValues(prevState => ({
         ...prevState,
         description: value.trim(),
         incorrectDescription: false,
       }))}
     editorInitializedCallback={editorInitializedCallback}
     onHeightChange={handleHeightChange}
   />
    <RichToolbar
     style={[styles.richBar]}
     editor={RichText}
     disabled={false}
     iconTint={colors.colors.primary}
     selectedIconTint={colors.colors.black}
     disabledIconTint={colors.colors.disabled}
    // onPressAddImage={onPressAddImage}
     iconSize={20}
     actions={[
       "insertVideo",
       ...defaultActions,
       actions.setStrikethrough,
       actions.heading1,
     ]}
     // map icons for self made actions
     iconMap={{
       [actions.heading1]: ({ tintColor }) => (
         <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
       ),
       [actions.setStrikethrough]: strikethrough,
     //  ["insertVideo"]: video,
     }}
    // insertVideo={insertVideo}
   />
  {form.incorrectDescription && (
      <Text type='body' style={styles.error}>{form.descriptionError}</Text>
   )}
  
   {/*
      <InputText
         label='Description(min 30chars)'
         labelStyle={''}
      //   placeholder={'Description(min 30chars)'}
       //  placeholderTextColor={colors.colors.gray400}
         containerStyle={{...styles.containerStyle,height:70}}
         // containerStyle={Platform.OS!=='android' ? {...styles.defaultMargin}:{minWidth:'100%',alignSelf:'flex-start'}}
         multiline={true}
         numberOfLines={4}
         onChangeText={value =>
           setValues(prevState => ({
             ...prevState,
             description: value.trim(),
             incorrectDescription: false,
           }))
         }
         underlineColorAndroid={colors.colors.transparent}
         errorMessage={form.incorrectDescription ? 'MandatoryField' : ''}
         onBlur={() =>
           checkField(
             'description',
             'incorrectDescription',
             isNonEmptyString,
           )
         }
       />
   */} 
     </View>
     <View style={{...styles.container,borderWidth:1,borderColor:colors.colors.primaryLight,marginTop:4,borderRadius: 4,}}>
     <RichEditor
      initialContentHTML={decode(form.highlights)}
   
      onBlur={() =>{
        checkField('highlights', 'incorrectHightlights', isNonEmptyString,'highlightsError')
        checkField('highlights', 'incorrectHightlights', isMinDescritpion,'highlightsError')
      
      }
      }
  disabled={false}
    containerStyle={styles.rich}
     ref={highlightsref}
    // style={styles.containerStyle}
     placeholder={"Write Highlights here"}
     onChange={value =>
       setValues(prevState => ({
         ...prevState,
         highlights: value.trim(),
         incorrectHightlights: false,
       }))
     }
     editorInitializedCallback={editorInitializedCallback}
     onHeightChange={handleHeightChange}
   />
    <RichToolbar
     style={[styles.richBar]}
     editor={highlightsref}
     disabled={false}
     iconTint={colors.colors.primary}
     selectedIconTint={colors.colors.black}
     disabledIconTint={colors.colors.disabled}
    // onPressAddImage={onPressAddImage}
     iconSize={20}
     actions={[
       "insertVideo",
       ...defaultActions,
       actions.setStrikethrough,
       actions.heading1,
     ]}
     // map icons for self made actions
     iconMap={{
       [actions.heading1]: ({ tintColor }) => (
         <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
       ),
       [actions.setStrikethrough]: strikethrough,
     //  ["insertVideo"]: video,
     }}
    // insertVideo={insertVideo}
   />
  {form.incorrectHightlights && (
      <Text type='body' style={styles.error}>{form.highlightsError}</Text>
   )}
  {/*
   <InputText
           label='Hightlights(min 30chars)'
      //   placeholder={'Hightlights(min 30chars)'}
       //  placeholderTextColor={colors.colors.gray400}
         labelStyle={''}
         // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin}:{minWidth:'100%',alignSelf:'flex-start'}}
         containerStyle={{...styles.containerStyle,height:70}}
         multiline={true}
         
         numberOfLines={4}
         onChangeText={value =>
           setValues(prevState => ({
             ...prevState,
             highlights: value.trim(),
             incorrectHightlights: false,
           }))
         }
         underlineColorAndroid={colors.colors.transparent}
         errorMessage={form.incorrectHightlights ? 'MandatoryField' : ''}
         onBlur={() =>
           checkField('highlights', 'incorrectHightlights', isNonEmptyString)
         }
       />
  */}
      
     </View>

     
      

        
       
        
       
        <View style={{...styles.container, flexDirection: 'row'}}>
          <TouchableOpacity onPress={countryList}style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
             <Text>{form.countryName}</Text>
             <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />

            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={stateList} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.stateName}</Text>
              <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
             </View>
             </TouchableOpacity>
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>
        <View style={{...styles.container, flexDirection: 'row'}}>

          <TouchableOpacity onPress={deliveryCountryList} disabled={disable} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
            <Text>{form.dcountryName}</Text>
 <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />

            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={deliverystateList} disabled={disableS} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
            <Text>{form.dstateName}</Text>
 <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
 </View>
             </TouchableOpacity>
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>

       <View style={{...styles.container, flexDirection: 'row'}}>
          <TouchableOpacity onPress={showActionSheet} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.handmadePercent}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
          </TouchableOpacity>
          
         <TouchableOpacity onPress={()=>{
  if(form.isGITagged){
    setValues(prevState=>({
      ...prevState,
      isGITagged:false     
    }))
  }else{
    setValues(prevState=>({
      ...prevState,
       
        isGITagged:true     
    }))
  
  }
}}
style={{alignItems:'center',justifyContent:'center'}}
>
   <View
              style={{
               // ...styles.containerStyle,
                flexDirection: 'row',
                //justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
<Icon
  name={ form.isGITagged? 'check-box' : 'check-box-outline-blank'}
  size={22}
  color={colors.colors.primary}
/>
<Text type='body'>Is GITagged</Text>
</View>
</TouchableOpacity>


          
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>

    
      
       
      
        
          
    </View> 
    </ScrollView>  
  </KeyboardAvoidingView>
            <HandmadePercent
          actionSheet={actionSheet}
          showActionSheet={showActionSheet}
          onClick={percent =>
            setValues(prevState => ({
              ...prevState,
              handmadePercent: percent,
            }))
          }
        />
         <TouchableOpacity style={styles.buttonContainer}  onPress={updateProduct}>
    <View >
            <Icon
              name='check'
              size={35}
            
              color={colors.colors.white}

            />
            </View>
            </TouchableOpacity>

    </View> 
  )

}
export default EditProduct
const styles = StyleSheet.create({
    main:{
        
      flex: 1,
      width: DIMENS.common.WINDOW_WIDTH,
      //height:DIMENS.common.WINDOW_HEIGHT,
     
      padding: 10,
      //top:0,
     // marginTop: 10,
      backgroundColor: colors.colors.white,
    },
    headingText:{
    alignSelf:'center',
    },
    container:{
        width:'100%',
        top:24,
    },
    ImageContainer:{
        height:120,
        margin: 10,
        borderRadius:3,
        borderColor:colors.colors.white,
        elevation:1,
        alignItems:'center',
        justifyContent:'center'
    },
    dropdownContainer:{
        width:'100%',
        flexDirection:"row",
        justifyContent:'space-between',
        height:36,
        alignItems:'center',

    },
    divider:
    {
    width:'100%',
    height:1,
    backgroundColor:colors.colors.primary
},

subheadingText:
{    
     fontSize:10,
     paddingTop: 12
},
buttonContainer:{
    height: 60,
    width: 60,
    backgroundColor: colors.colors.primary,
    borderRadius: 60 / 2,
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 24,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 16,
   

  
},
defaultMargin:{
  marginTop:0, 
  borderBottomWidth :1,
  height:30,
  marginBottom:12
},
containerStyle: {
  //flex:1,
  backgroundColor: colors.colors.white,
  height: 40,
  borderRadius: 4,
  shadowColor: colors.colors.gray500,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 2,
  shadowOpacity: 1.2,
   borderWidth:1,
  margin: 4,
  elevation:2,
  borderColor:colors.colors.primaryLight
},
rich: {
  // height:60,
   minHeight: 80,
   flex: 1,
   borderWidth: 1,
   borderColor:colors.colors.primaryLight,
   borderRadius: 4,
   shadowColor: colors.colors.gray500,
   shadowOffset: {
     width: 0,
     height: 1,
   },
   shadowRadius: 1,
   shadowOpacity: 1.0,
   elevation:2
  
 },
 richBar: {
   height: 40,
   backgroundColor: "#F5FCFF",
   marginTop:2,
  
   
 },
 error: {
   color:colors.colors.error,
  
   alignSelf: 'flex-end',
   fontSize:10,
   
   paddingTop:2,
  
 
   
   

   
 },
})

