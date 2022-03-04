import React, { useEffect,useState } from 'react'
import {View,StyleSheet, ScrollView,Image} from 'react-native';
import { colors } from '../../../theme';
import {Text,Loader} from '../../../common'
import {DIMENS} from '../../../constants/'
import {encode} from 'base-64'
import { loadSeller } from '../../utils/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../../constants/matcher';
import Country from '../../../constants/data/country.json'
import ImageZoom from 'react-native-image-pan-zoom';


const OrderDetails = ({navigation,route})=>{
      const orderId=route.params.Id
      const [loading,setLoading] = useState(false)
      const [data,setData]= useState({})
      const [quant,setQuant] = useState('')
      const [products,setProducts] = useState({})
      const [image,setImage] = useState()
      const [userAddress,setUserAddress] = useState({})
      const [user,setUser] = useState({})
      const [value,setValues] = useState({
        countryId:'',
        countryName:'',
        stateId:'',
        stateName:''
      })
      useEffect(()=>{
        setLoading(true)
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              
              fetch(BASE_URL+'SellerOrderDetails/'+orderId, {
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
                  console.log(responseJson);
                  setImage(responseJson.mainImage)
                  setQuant(responseJson.data.quantity)
                  setProducts(responseJson.data.Products)
                  setData(responseJson.data.Orders)
                  setUserAddress(responseJson.data.UserAddress)
                  setUser(responseJson.data.User)
                  setValues(prev=>({
                    ...prev,
                    countryId:user.countryId,
                    stateId:user.stateId

                  }))

                  setLoading(false)
           //       setOrders(responseJson)
                  
               //     if(responseJson===null){
                 //     setLoading(false)
                //      ToastAndroid.showWithGravity(
              //          'No Products found please add products',
              //          ToastAndroid.SHORT, //can be SHORT, LONG
                     //   ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              //        );
                  
                //    }
                  //  else{
                    //   setLoading(false)
                      // setProductData(responseJson)                 
                  
                    //}
                         
                  
                })
                .catch((error) => {
                  setLoading(false)
                //display error message
                //setLoading(false)
                //ToastAndroid.showWithGravity(
                //  error.toString(),
                 // ToastAndroid.SHORT, //can be SHORT, LONG
                  //ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              //  );
            
                 console.warn(error);
                });
              console.log('CURRENT STORAGE: ', myStorage.email);
            })
          });
     
          
      },[orderId])
      useEffect(()=>{
        console.log(user.countryId)
        if(user.countryId!==undefined){
          var item = Country.find(item => item.id === parseInt(user.countryId));
          console.log('ddffd'+item.countryName)
         setValues(prev=>({
            ...prev,
            countryName:item.countryName,
          }))

        }
      },[user.countryId])
      useEffect(()=>{
          if(user.stateId!==undefined){
            fetch(BASE_URL+'State/'+user.stateId, {
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
           }))       
              })
              .catch((error) => {
                //setLoading(false)
              //display error message
               console.warn(error);
              });

          }

      },[user.stateId])

        


   return(
       <ScrollView style={{flex:1}}>
           <Loader loading={loading}/>
           <View style={styles.main}>
         <View style={styles.orderContainer}>
         <ImageZoom cropWidth={DIMENS.common.WINDOW_WIDTH}
                       cropHeight={DIMENS.common.WINDOW_HEIGHT*1/2}
                       imageWidth={DIMENS.common.WINDOW_WIDTH}
                       imageHeight={200}>
        <Image  source={{uri:image}} style={{width:DIMENS.common.WINDOW_WIDTH,resizeMode:'contain',height:240}}/>
        </ImageZoom>
             <View style={{flexDirection:'column',marginTop:8,padding:6,backgroundColor:colors.colors.white}}>
             <Text type='subheading' style={{color:colors.colors.primary}}>Order Details</Text>
             <View style={styles.divider}/>
         
            <View>
           <Text type='subheading'> {(typeof(products)!=='undefined')?products.name:''}</Text>
          <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
           <Text type='caption' style={styles.text}>Quantity</Text>
           <Text type='body'  style={styles.text}>{(typeof(quant)!=='')?quant:''}</Text>
        
           </View> 
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
           <Text type='caption' style={styles.text}>payment Mode</Text>
           <Text  type='body'  style={styles.text}>{(typeof(data)!=='undefined')?data.paymentMode:''}</Text>
          
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
           <Text type='caption' style={styles.text}>price</Text>
           <Text  type='body'  style={styles.text}>${(typeof(products)!=='undefined')?products.price:''}</Text>
          
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
          <Text type='caption' style={styles.text}>SKU</Text>
           <Text type='body'  style={styles.text}> {(typeof(products)!=='undefined')?products.SKU:''} </Text>
        
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
         <Text type='caption' style={styles.text}>Order Date</Text>
           <Text type='body' style={styles.text}>{(typeof(data)!=='undefined')?new Date(data.dated).toLocaleDateString():''}</Text>
         
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
         <Text type='caption' style={styles.text}>Shipping fee </Text>
           <Text  type='body' style={styles.text}>${(typeof(data)!=='undefined')?data.shippingCharges:''}</Text>
          
           </View>
          </View>
           </View>
       
       </View>
             <View style={styles.shipContainer}>
           <Text type='subheading' style={{color:colors.colors.primary}}>Shipping Details</Text>
          
           <View style={styles.divider}/>
           <Text type='body' style={styles.text}>Shipping Address: {'\n'}{(typeof(userAddress)!=='undefined')?userAddress.addressLine1 +' '+ userAddress.addressLine2 + ' '+ value.countryName +'  '+ value.stateName:''}</Text>
          
           
       </View>
       <View style={styles.buyercontainer}>
       <Text type='subheading' style={{color:colors.colors.primary}}>Buyer Details</Text>
           <View style={styles.divider}/>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
         <Text type='caption' style={styles.text}>Buyer Name:</Text>
           <Text type='body' style={styles.text}>{(typeof(user)!=='undefined')?user.firstName + user.lastName:''}</Text>
          
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
             <Text type='caption'  style={styles.text}>Phone No.:</Text>
           <Text type='body' style={styles.text}>{(typeof(user)!=='undefined')?user.phoneNumber:''}</Text>
          
           </View>
           <View style={{alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
         <Text type='caption'  style={styles.text}>Pincode:</Text>
           <Text type='body'  style={styles.text}>{(typeof(user)!=='undefined')?user.pincode:''}</Text>

           </View>
          


       </View>
       </View>
       </ScrollView>
   )



}
export default OrderDetails
const styles=StyleSheet.create({
    main:{
        flex:1,
      //  height:DIMENS.common.WINDOW_HEIGHT
        

    },
    orderContainer:{
        width:'100%',
       // height:'40%',
      //  backgroundColor:colors.colors.white,
        marginBottom:8,
       // flexDirection:'row',
       // alignItems:'center'


    },
    shipContainer:{
        width:'100%',
      //  height:'25%',
        backgroundColor:colors.colors.white,
        marginBottom:8,
        padding:8

    },
    buyercontainer:{
        width:'100%',
      //  height:'25%',
        backgroundColor:colors.colors.white,
        padding:8,
       // marginBottom:6

    },
    text:{
        padding:6       
    },
    divider:{
        width:'100%',
        height:1,
        backgroundColor:colors.colors.gray300,
        top:6,
        marginBottom:14,
           }
    
})