import AsyncStorage from '@react-native-community/async-storage'
import React, { useEffect, useState } from 'react'
import { encode } from 'base-64';

import Snackbar from 'react-native-snackbar-component';

import { View ,StyleSheet, ScrollView, Dimensions,TouchableOpacity} from 'react-native'
import NetInfo from '@react-native-community/netinfo';
import { BASE_URL } from '../../constants/matcher';
import { colors } from '../../theme';
import { DIMENS } from '../../constants';
import { Icon, Loader, Text } from '../../common';
import Moment from 'moment'
import { NAVIGATION_TO_ORDERDETAILS } from '../../navigation/routes';
const dashboardScreen =({navigation})=>{
  const [offline,setOffline] = useState(false)
  const [data,setData] = useState(null)
  const [Username,setUserName]=useState(null)

  const [loading,setLoading] = useState(false)
  const [snackIsVisible, setSnackIsVisible] = useState(false);
 const [distance, setDistance] = useState(40);
 useEffect(()=>{
  NetInfo.addEventListener(state => {
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
    console.log(state.isInternetReachable)
    setOffline(state.isConnected)
  });
     dashboardData()
     const unsubscribe = navigation.addListener('focus', () => {
      dashboardData()
     
  });
  return unsubscribe;

  
},[navigation,offline])
const dashboardData=async ()=>{
 
    console.log('offlie'+offline)
  
    setLoading(true)
  
   await AsyncStorage.getAllKeys().then((keyArray) => {
        AsyncStorage.multiGet(keyArray).then(async(keyValArray) => {
          let myStorage = {};
          for (let keyVal of keyValArray) {
            myStorage[keyVal[0]] = keyVal[1]
          }
         const data=JSON.parse(myStorage.data)
         setUserName(data.firstName  + ' ' +  data.lastName)
       console.log(data.firstName + 'hgjhgh')
        await  fetch(BASE_URL+'SellerDashboard', {
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
               setLoading(false)
               setData(responseJson.data)
              
                                     
              
            })
            .catch((error) => {
              //setLoading(false)
            //display error message
            setLoading(false)
            setSnackIsVisible(true)
          
            
             console.warn(error+'gh');
            });
          
    
    
          console.log('CURRENT STORAGE: ', myStorage.email);
        })
      });


      
 }

 return(
  <ScrollView
  showsVerticalScrollIndicator={false}
   nestedScrollEnabled={true} 
   style={{flex:1,}}
  // refreshControl={()=>dashboardData()}
 
  >
    <Snackbar
          visible={snackIsVisible}
          //SnackBar visibility control
          
          textMessage="Something went wrong"
          
          
         
          containerStyle={{position:'absolute'}}
          
          position='top'
          backgroundColor={colors.colors.primaryLight}
         
          //Text on SnackBar
          actionHandler={() => {
            //function called while clicking on action Text
            dashboardData()
           
            //After handling click making nackBar invisible
            setSnackIsVisible(false);
          }}
          actionText="Try Again"
          //action Text to print on SnackBar
          distanceCallback={(distance) => {
            //Number indicating distance taken up by snackbar
            setDistance(distance);
          }}
          
        />  
        {data==null? <Loader loading={loading}/>:
           <View style={styles.main}>
             <View style={styles.header}>
               <Text type='heading' style={styles.text}>WELCOME,</Text>
               <Text type='caption' style={{...styles.text,marginTop:8,fontSize:14}}>{Username.toUpperCase()}</Text>
           </View>
           <View style={styles.rectangleHeader}>
             <TouchableOpacity onPress={()=>navigation.navigate('ManageProductScreenStack')}>
           <View style={styles.rectangle}>
               <Text type='heading' style={styles.heading}>Total Products</Text>
               <Icon type='antdesign' name='CodeSandbox' size={40} color={colors.colors.primary} style={{alignSelf:'center'}}/>
               <Text type='heading' style={{...styles.heading,fontSize:20}}>{data.totalProducts}</Text>

           </View>
           </TouchableOpacity>
           <View style={styles.rectangle}>
             <TouchableOpacity  onPress={()=>navigation.navigate('ManageOrdersScreenStack')}>
           <View style={styles.rectangle}>
               <Text type='heading' style={styles.heading}>Total Orders</Text>
               <Icon type='antdesign' name='CodeSandbox' size={40} color={colors.colors.primary} style={{alignSelf:'center'}}/>
               <Text type='heading' style={{...styles.heading,fontSize:20}}>{data.totalOrders}</Text>
           </View>  
           </TouchableOpacity>       
           </View>
           </View>
           <View style={{...styles.paymentsContainer,backgroundColor:colors.colors.transparent}}>
           <View style={{width:'100%',alignItems:'center',marginTop:14}}>
           <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Payments</Text>
          
           </View>
           <ScrollView 
           showsHorizontalScrollIndicator={false}
           horizontal={true}>
           <View style={{padding:8,flexDirection:'row'}}>
           <View style={styles.oval}>
           <Text type='subheading' style={{padding:4,marginBottom:10,color:colors.colors.primary,fontSize:14}}>Pending</Text>
           <Text type='caption' style={{textAlign:'center',color:colors.colors.black}}>{(data.pendingPayment!==undefined)? '$'+ data.pendingPayment.toFixed(0):'$0'}</Text>
           </View>
           <View style={styles.oval}>
           <Text type='subheading' style={{padding:4,marginBottom:10,color:colors.colors.primary,fontSize:14}}>Confirmed</Text>
           <Text type='caption' style={{textAlign:'center',color:colors.colors.black}}>{(data.confirmedPayment!==undefined)?'$'+data.confirmedPayment:'$0'}</Text>
           </View>
          
           <View style={styles.oval}>
           <Text type='subheading' style={{padding:4,marginBottom:10,color:colors.colors.primary,fontSize:14}}>Returned</Text>
           <Text type='caption'style={{textAlign:'center',color:colors.colors.black}}>{(data.returnedPayment!==undefined)?'$'+data.returnedPayment:'$0'}</Text>
           </View>
          
           <View style={styles.oval}>
          <Text type='subheading'style={{padding:4,marginBottom:10,color:colors.colors.primary,fontSize:14}}>Cancelled</Text>
           <Text  type='caption' style={{textAlign:'center',color:colors.colors.black}}>{(data.cancelledPayment!==undefined)?'$'+data.cancelledPayment:'$0'}</Text>
           </View>
          
           <View style={styles.oval}>
            <Text type='subheading' style={{padding:4,marginBottom:10,color:colors.colors.primary,fontSize:14}}>Completed</Text>
           <Text  type='caption'    style={{textAlign:'center',color:colors.colors.black}}>{(data.completedPayment!==undefined)?'$'+data.completedPayment:'$0'}</Text>
           </View>
          
          
         </View>
         </ScrollView>
         </View>
         <View style={styles.paymentsContainer}>
         <View style={{height:40,width:'100%',alignItems:'center'}}>
        
         <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Pending Orders</Text>
           </View>
           <View style={{width:'100%',backgroundColor:colors.colors.gray100,padding:8,borderRadius:10,borderWidth:1,borderColor:colors.colors.gray200}}>
         <View style={{flexDirection:'row',justifyContent:"space-between",margin:4,marginBottom:10}}>
              <Text type='subheading' style={{fontSize:12}}>Orders Id</Text>
              <Text type='subheading' style={{fontSize:12}}>Dated</Text>
             </View> 
           {data.pendingOrders.map((items,index)=>( 
         <TouchableOpacity key={index} onPress={()=>navigation.navigate(NAVIGATION_TO_ORDERDETAILS,{Id:items.id})}>  
          <View key={index} style={styles.rowStyle}>
               <View style={{justifyContent:'space-between',flexDirection:'row'}}>  
                     <Text type='body'>UCM-Orders-{items.Orders.id}</Text>
                     <Text type='body'>{Moment(items.Orders.dated).format('DD/MM/YYYY')}</Text>
               </View>
             
               </View>
               </TouchableOpacity>
         ))}
         </View>
        </View>
      
         <View style={styles.paymentsContainer}>
         <View style={{height:40,width:'100%',alignItems:'center'}}>
        
         <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Delivered Orders</Text>
           </View>
           <View style={{width:'100%',backgroundColor:colors.colors.gray100,padding:8,borderRadius:10,borderWidth:1,borderColor:colors.colors.gray200}}>
         <View style={{flexDirection:'row',justifyContent:"space-between",margin:4,marginBottom:10}}>
              <Text type='subheading' style={{fontSize:12}}>Orders Id</Text>
              <Text type='subheading' style={{fontSize:12}}>Dated</Text>
             </View> 
           {data.deliveredOrders.map((items,index)=>( 
         <TouchableOpacity key={index} onPress={()=>navigation.navigate(NAVIGATION_TO_ORDERDETAILS,{Id:items.id})}>  
          <View key={index} style={styles.rowStyle}>
               <View style={{justifyContent:'space-between',flexDirection:'row'}}>  
                     <Text type='body'>UCM-Orders-{items.Orders.id}</Text>
                     <Text type='body'>{Moment(items.Orders.dated).format('DD/MM/YYYY')}</Text>
               </View>
             
               </View>
               </TouchableOpacity>
         ))}
         </View>
        </View>
        <View style={styles.paymentsContainer}>

        <View style={{height:40,width:'100%',alignItems:'center'}}>
        
        <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Cancelled Orders</Text>
        </View>
        <View style={{width:'100%',backgroundColor:colors.colors.gray100,padding:8,borderRadius:10,borderWidth:1,borderColor:colors.colors.gray200}}>
        
         <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:10,margin:4}}>
              <Text type='subheading' style={{fontSize:12}}>Orders Id</Text>
              <Text type='subheading' style={{fontSize:12}}>Dated</Text>
             </View> 
             {data.cancelledOrders.map((items,index)=>(  
                  <TouchableOpacity key={index} onPress={()=>navigation.navigate(NAVIGATION_TO_ORDERDETAILS,{Id:items.id})}>  
       
           <View key={index} style={styles.rowStyle} >
           <View style={{justifyContent:'space-between',flexDirection:'row',alignItems:"center"}}>
   
            
                 <Text type='body'>UCM-Orders-{items.Orders.id}</Text>
                 <Text type='body'>{Moment(items.Orders.dated).format('DD/MM/YYYY')}</Text>        
           </View>
         
           </View>
           </TouchableOpacity>

         ))}
         </View>
      </View>
      <View style={styles.paymentsContainer}>
         <View style={{height:40,width:'100%',alignItems:'center'}}>
        
         <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Returned Orders</Text>
           </View>
           <View style={{width:'100%',backgroundColor:colors.colors.gray100,padding:8,borderRadius:10,borderWidth:1,borderColor:colors.colors.gray200}}>
         <View style={{flexDirection:'row',justifyContent:"space-between",margin:4,marginBottom:10}}>
              <Text type='subheading' style={{fontSize:12}}>Orders Id</Text>
              <Text type='subheading' style={{fontSize:12}}>Dated</Text>
             </View> 
           {data.returnedOrders.map((items,index)=>( 
         <TouchableOpacity key={index} onPress={()=>navigation.navigate(NAVIGATION_TO_ORDERDETAILS,{Id:items.id})}>  
          <View key={index} style={styles.rowStyle}>
               <View style={{justifyContent:'space-between',flexDirection:'row'}}>  
                     <Text type='body'>UCM-Orders-{items.Orders.id}</Text>
                     <Text type='body'>{Moment(items.Orders.dated).format('DD/MM/YYYY')}</Text>
               </View>
             
               </View>
               </TouchableOpacity>
         ))}
         </View>
        </View>
     
      <View style={styles.paymentsContainer}>
         <View style={{height:40,width:'100%',alignItems:'center'}}>
        
        <Text type='heading' style={{...styles.heading,alignSelf:'flex-start',color:colors.colors.primary,fontSize:16}}>Products Awaiting Approval</Text>
           </View>
           <View style={{width:'100%',backgroundColor:colors.colors.gray100,padding:8,borderRadius:10,borderWidth:1,borderColor:colors.colors.gray200}}>
      
           <View style={{flexDirection:'row',justifyContent:"space-between",marginBottom:10,margin:4}}>
              <Text type='subheading' style={{fontSize:12}}>Product Name</Text>
              <Text type='subheading' style={{fontSize:12}}>SKU</Text>
             </View> 
    
            {data.unapprovedProducts.map((items,index)=>( 
                     <TouchableOpacity key={index} onPress={()=>navigation.navigate('Product Details', {Id: items.id})}>  
         
           <View key={index} style={styles.rowStyle}>
           <View style={styles.productContainer}>
                 <Text>{items.name}</Text>
                 <Text>{items.SKU}</Text>
           </View>
          
           </View>
           </TouchableOpacity>

         ))}
      </View>
        </View>
     
       </View>
    }
        
       
        </ScrollView>





          


          
                        
)
  
 
}
export default dashboardScreen;
const styles=StyleSheet.create({
  main:{
    flex:1,
    width:Dimensions.get('window').width,
  //  backgroundColor:colors.colors.gray100
},
header:{   
    width:'100%',
    backgroundColor:colors.colors.primary,
    padding:20,
    height:DIMENS.common.WINDOW_HEIGHT * 1/5
},

text:{
    fontSize:24,
    color:colors.colors.white,
},
rectangleHeader:{
    flexDirection:'row',
    //top:-40,
    alignItems:"center",
    justifyContent:'space-evenly',
    marginTop:-50,
    marginBottom:10
    
   },
rectangle:{
    height:120,
    width:120,
    backgroundColor:colors.colors.white,
    elevation:10,
    borderRadius:120/5,
    shadowOffset:{
      width:3,
      height:0
    },
    shadowColor:colors.colors.gray200,
    shadowRadius:6,
    alignItems:'center',
    justifyContent:'center'
},
heading:{
   alignSelf:'center',
   fontSize:14,
   color:colors.colors.primary,
   padding:6,
},
paymentsContainer:{
  width:'90%',
  elevation:12,
 // backgroundColor:colors.colors.white,
 // paddingLeft:6,
  //paddingRight:6,
  paddingBottom:8,
  alignSelf: 'center',
  marginBottom:8,
},
paymentsheader:{
   height:140,
   width:300,
   justifyContent:'center',
   alignItems:'center'  ,
   elevation:10  ,
   backgroundColor:colors.colors.black,
},
divider:{
  width:'100%',
  height:1,
  backgroundColor:colors.colors.gray300,
  margin: 6,
},
productContainer:{
  flexDirection:'row',
  justifyContent:'space-between'
},
oval:{
  alignItems:'center',
  justifyContent:'center',
  width:DIMENS.common.WINDOW_WIDTH*1/4,
  height:DIMENS.common.WINDOW_HEIGHT*0.12,
  borderRadius:100/6,
  backgroundColor:colors.colors.white,
  marginEnd:6,
  padding:4,
  shadowOffset:{
   width:3,
   height:0
 },
 shadowColor:colors.colors.gray300,
 shadowRadius:6,

 },
 rowStyle:{padding:6,
   marginTop:6,
   paddingTop:14,
   paddingBottom:14,
   backgroundColor:colors.colors.white,
 /*  shadowOffset:{
     width:3,
     height:0
   },
   shadowColor:colors.colors.primary,
   shadowRadius:6,
   shadowOpacity:0.2,*/
   borderRadius:6

 }
    })
