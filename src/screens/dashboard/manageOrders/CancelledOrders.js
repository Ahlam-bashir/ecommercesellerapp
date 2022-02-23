import React,{useState,useEffect} from 'react'
import {View,StyleSheet,FlatList, TouchableOpacity,ToastAndroid,TextInput} from 'react-native';
import {Text,Loader,Icon,ImageComponent} from '../../../common'
import { NAVIGATION_TO_ORDERDETAILS } from '../../../navigation/routes';
import { colors } from '../../../theme';
import {encode} from 'base-64'
import { loadSeller } from '../../utils/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../../constants/matcher';
import { RefreshControl } from 'react-native';
   
   
const CancelledOrders = ({navigation})=>{
    const [loading,setLoading] = useState(false)
    const [searchText,setSearchText] = useState('')
    const [arrayholder,setarrayholder] = useState([])
    const [refreshing, setRefreshing] = useState(true);
   
    const [CancelledOrders,setCancelledOrders] = useState([])
         useEffect(()=>{
            cancelOrders()
            const unsubscribe = navigation.addListener('focus', () => {
            
              cancelOrders()
            });
            return unsubscribe;
      },[])
      
          
         const ViewOrder =(id)=>{
            navigation.navigate(NAVIGATION_TO_ORDERDETAILS,{Id:id})
         }
         const  cancelOrders=()=>{
           
           AsyncStorage.getAllKeys().then((keyArray) => {
             AsyncStorage.multiGet(keyArray).then((keyValArray) => {
               let myStorage = {};
               for (let keyVal of keyValArray) {
                 myStorage[keyVal[0]] = keyVal[1]
               }
               
               fetch(BASE_URL+'CancelledOrders', {
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
                   setRefreshing(false)
                  
                   
                    if(responseJson.length===0){
                       setLoading(false)
                      
                 
                   
                   }
                  else{
                        setLoading(false)
                     setCancelledOrders(responseJson) 
                     setarrayholder(responseJson)                
                   
                     }
                          
                   
                 })
                 .catch((error) => {
                   setLoading(false)
                 //display error message
                 //setLoading(false)
                 ToastAndroid.showWithGravity(
                   error.toString(),
                   ToastAndroid.SHORT, //can be SHORT, LONG
                   ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                 );
             
                  console.warn(error);
                 });
               console.log('CURRENT STORAGE: ', myStorage.email);
             })
           });
      
          }
    
          const searchData=(text)=>{
            const newData= arrayholder.filter(item=>{
              const itemData= item.Products.name.toUpperCase();
              const textData= text.toUpperCase()
              return itemData.indexOf(textData)>-1
            })
            setCancelledOrders(newData)
            setSearchText(text)
    
          }
          const onRefresh = () => {
            //Clear old data of the list
            setCancelledOrders([])
            //Call the Service to get the latest data
         cancelOrders()
          };
    
      return(
          <View style={styles.main}>
              <View>
                  <Loader loading={loading}/>
              </View>
              <View style={{width:'100%',height:50,backgroundColor:colors.colors.gray200,bottom:6,flexDirection:'row',alignItems:'center',borderRadius: 8,}}>
                  <Icon name='search' size={20} color={colors.colors.gray500} style={{padding: 6,}}/>
                  <TextInput  
                  placeholder='Search here...'
                  value={searchText}
                  style={{borderWidth:0,padding:6,width:'100%'}}
                  onChangeText={(text)=>searchData(text)}
                    
                  />
                </View>

         
              <FlatList
                
                data={CancelledOrders}
                keyExtractor={(item,index)=>index.toString()}
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={(itemData)=>{
                    return(
                      <TouchableOpacity onPress={()=>ViewOrder(itemData.item.id)} key={itemData.item.id}>
                      <View style={styles.flatlist}>
                        <View style={{height:100,width:100,padding:4}}>
                        <ImageComponent
                           sellerId={itemData.item.Products.sellerId}
                           productId={itemData.item.Products.id}
                        />
                        </View>
                        <View>
                   <View style={{flexDirection:'row',alignItems:'center'}}>
                     <Text type='caption'  style={styles.width25}>OrderId:</Text>
                     <Text type='body'  style={styles.text}>{itemData.item.Orders.id}</Text>
                     </View>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                
                     <Text type='caption'  style={styles.width25}>Buyer Name:</Text>
                     <Text type='body' style={styles.text}>{itemData.item.User.firstName+ '  '+itemData.item.User.lastName}</Text>
                   
                     </View>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                
                     <Text type='caption'  style={styles.width25}>Product Name:</Text>
                     
                     <Text type='body' style={{...styles.text,width:'60%'}}>{itemData.item.Products.name}</Text>
                    
                     </View>
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                
                     <Text type='caption' style={styles.width25}>Status :</Text>
                     <Text type='body' style={styles.text}>{itemData.item.Orders.status}</Text>
                    
                     </View>
                     </View>
                  {/* <View style={{alignSelf:'flex-end',height:40,width:120,borderBottomLeftRadius:100/2,borderTopLeftRadius:100/2,backgroundColor:colors.colors.primary,alignItems:'center',justifyContent:'center',bottom:8}}>
                            <Text type='body' style={{color:colors.colors.white}}>Ready to Dispatch</Text>
                      </View> */ }
                      </View>
                      </TouchableOpacity>
                    )
                }}             
                 
              />
           
          </View>
      )
   
   
   
   }
   export default CancelledOrders
   const styles=StyleSheet.create({
       main:{
           flex:1,
           margin:10,
   
       },
       flatlist:{
        // height:130,
        width:'100%',
        backgroundColor:colors.colors.white,
        marginBottom:10,
        padding:8,
        alignItems:'flex-start',
        flexDirection:'row'
  
     },
     text:{
       padding:4,
     },
     width25:{
       width:'30%'
     }
   })


