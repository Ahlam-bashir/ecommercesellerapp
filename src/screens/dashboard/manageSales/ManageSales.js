import React,{useEffect,useState} from 'react'
import {View,StyleSheet, FlatList,Platform} from 'react-native'
import { DIMENS } from '../../../constants';
import { Text,Loader } from '../../../common';
import { colors } from '../../../theme';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '../../../constants/matcher';
import { encode } from 'base-64';
import Moment from 'moment'
const ManageSales =({navigation})=>{
    const [sales,setSales] = useState([])
    const [loading,setLoading] = useState(false)
    useEffect(()=>{
     
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              setLoading(true)
              fetch(BASE_URL+'MyTransactions', {
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
                    setLoading(false)
                    if(responseJson.length>0){
                    setSales(responseJson)
                    }else{
                      alert('No data found')
                    }

                  //Showing response message coming from server 
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
  

    },[])
    return(
        <View style={styles.main}>
         
            <View style={styles.container}>
            <Loader loading ={loading}/>
            <Text type='caption' 　style={styles.headingText}>Transaction ID</Text>
            <Text type='caption' 　style={styles.headingText}>Amount</Text>
            <Text type='caption' 　style={styles.headingText}>Balance</Text>
            <Text　type='caption' 　style={styles.headingText}>Transaction Details</Text>
            <Text type='caption'　　style={styles.headingText}>Dated</Text>
            </View>
            <FlatList
            data={sales}
            keyExtractor={(id,index)=>index.toString()}
            renderItem={(itemData)=>{
                 return(
                     <View style={{...styles.container,height:30,backgroundColor:colors.colors.white,marginBottom:8,padding:2}}>
                         <Text type='body' style={{...styles.headingText,fontSize:8}}>{itemData.item.transactionId}</Text>
                         <Text style={styles.headingText}>{itemData.item.amount}</Text>
                         <Text style={styles.headingText}>{itemData.item.balance}</Text>
                         <Text style={styles.headingText}>{itemData.item.details}</Text>
                         <Text style={{...styles.headingText,fontSize:8}}>{Moment(itemData.item.dated).format('YYYY-MM-DD')}</Text>
                    
                     </View>
                 )
             }}
            />

        </View>
    )
}
export default ManageSales;
const styles=StyleSheet.create({
    main:{
        flex:1,
        width:DIMENS.common.WINDOW_WIDTH,
        height:DIMENS.common.WINDOW_HEIGHT,
        padding:8


    },
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:8
    },
    headingText:{
        width:DIMENS.common.WINDOW_WIDTH*1/5,
        textAlign:'center',
        fontSize:10,
        padding:2
        //height:40,
        

    }
})