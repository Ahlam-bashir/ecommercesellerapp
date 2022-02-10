import React,{useEffect,useState} from 'react'
import {View,StyleSheet, FlatList,TouchableOpacity,Platform,ToastAndroid,ActivityIndicator} from 'react-native'
import { DIMENS } from '../../../constants';
import { Text } from '../../../common';
import { colors } from '../../../theme';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker'
import { BASE_URL } from '../../../constants/matcher';
import { encode } from 'base-64';
import moment from 'moment'


const PaymentDetails =({navigation,route,props})=>{
    const headerTitle= route.params.route.headerTitle
    const header=route.params.route.title
    const [title,setTitle] =useState(route.params.route.headerTitle.replace(' ',''))
    const [indicator,setIndicator]=useState(false)
    const [offset,setoffset] = useState(1)
    const [isListend,setIslistEnd] = useState(false)
    const [date,setDate] =useState(new Date())
    const [fromDate,setFromDate] = useState(new Date())
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [offset2,setOffset2] = useState(1)
    const [data,setData] = useState([])
    const [deliveryCharges,setDeliverycharges] = useState(0)
    //let totalPayment=0
    const [totalPayment,setTotalpayment]=useState(0)
    const [totalDeduction,setTotalDeduction] =useState(null)
    
    useEffect(()=>{
        navigation.setOptions({ title: header});
        
        getPayments()
       // console.log(route.params.route.headerTitle)

    },[navigation,totalPayment])
    const getPayments=()=>{
        console.log(title)
        if (!indicator && !isListend) {
                 
            setIndicator(true)
            AsyncStorage.getAllKeys().then((keyArray) => {
                AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                  let myStorage = {};
                  for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                  }
                  fetch(BASE_URL+title.replace(' ','')+'?page='+offset, {
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
                     console.log(responseJson.data)
                       calculateTotal()
                      if(responseJson.data.length>0){
                        setIndicator(false)
                        setoffset(offset+1)
                        setData([...data,...responseJson.data])  
                       　//calculateTotal()

                      
                      }else{
                        setIndicator(false)
                        setIslistEnd(true)
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
       

    }
    const calculateTotal=()=>{
      let sum;
      let sum2=0;
      for ( sum = 0, index = 0; index < data.length; index++) {  
        sum +=data[index].orderItems.deliveryCharges
        let x=data[index].orderItems.price*data[index].orderItems.quantity;
        let deduction=data[index].percentage/100*x
        let total=x-deduction
        sum2+=total    
      };
      setTotalpayment(sum2)
      setDeliverycharges(sum)
    }
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };
      const onChange = (date) => {
        setFromDate(date)
        getReport()
      };
      const getReport=()=>{
        console.log('to date'+date+'fromdate'+fromDate)
        if (!indicator || !isListend) {
        setIndicator(true)
        AsyncStorage.getAllKeys().then((keyArray) => {
          AsyncStorage.multiGet(keyArray).then((keyValArray) => {
            let myStorage = {};
            for (let keyVal of keyValArray) {
              myStorage[keyVal[0]] = keyVal[1]
            }
            fetch(BASE_URL+title+'?page='+offset2+'&fromDate='+date+'&toDate='+fromDate, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
              },
            })
              .then((response) => response.json())
              .then((responseJson) => {
                console.log(offset2)
                //Showing response message coming from server 
               console.log(responseJson)
                if(responseJson.data.length>0){
                 setIndicator(false)
                 setOffset2(offset2+1)
                 //setData(responseJson.data)
                  setData([...data,...responseJson.data])  
                  calculateTotal()

                
                }else{
                  setIndicator(false)
                  setIslistEnd(true)
                   if(Platform.OS!=='ios'){
                    ToastAndroid.showWithGravity(
                      'No Data Available',
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
                
                   }else{
                     setData([])
                     alert('no Data avalaible')
                     //alert('No Products Found')
                   }
                  

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
      }
      const renderFooter = () => {
        return (
          // Footer View with Loader
          <View style={styles.footer}>
            {indicator ? (
              <ActivityIndicator
                color={colors.colors.primary}
                style={{margin: 15}} />
            ) : null}
          </View>
        );
      };
    
    
    return(
        <View style={styles.main}>
            <View style={styles.header}>
                <Text type='body' style={{color:colors.colors.primary}}>TotalPayment:${totalPayment.toFixed(2)}</Text>
                <Text type='body' style={{color:colors.colors.primary}}>TotalDeliveryCharges:${deliveryCharges.toFixed(2)}</Text>

            </View>
            <View style={styles.container}>
            <Text type='caption' 　style={styles.headingText}>Dated</Text>
            <Text type='caption' 　style={styles.headingText}>Product</Text>
            <Text type='caption' 　style={styles.headingText}>Price</Text>
            <Text type='caption' 　style={styles.headingText}>Quantity</Text>
            <Text　type='caption' 　style={styles.headingText}>UCM Deductions</Text>
            <Text type='caption'　　style={styles.headingText}>Total</Text>
            <Text type='caption'　　style={styles.headingText}>Delivery Charges</Text>
           
            </View>
            <FlatList
            ListFooterComponent={renderFooter}
            onEndReached={getPayments ||　getReport}
            onEndReachedThreshold={0.5}
            data={data}
            keyExtractor={(id,index)=>index.toString()}
            renderItem={({item})=>{
                if(item!=null){
                    let x=parseFloat(item.orderItems.price)*parseFloat(item.orderItems.quantity);
                    let deduction=parseFloat(item.percentage)/100*x
                 
                  
                    return(
                    
                        <View style={{...styles.container,height:50,backgroundColor:colors.colors.white,marginBottom:8}}>
                            <Text type='body' style={{...styles.headingText,fontSize:6,width:40}}>{moment(item.orderItems.dated).format('YYYY-MM-DD')}</Text>
                            <Text type='body' style={{...styles.headingText,fontSize:6,width:50}}>{item.orderItems.Products.name} {' '} OrderId:{item.orderItems.id} {' '}</Text>
                            <Text style={{...styles.headingText,fontSize:8}}>${item.orderItems.price}</Text>
                            <Text style={{...styles.headingText,fontSize:8}}>{item.orderItems.quantity}</Text>
                            <Text style={{...styles.headingText,fontSize:8}}>${deduction.toFixed(2)}</Text>
                            <Text style={{...styles.headingText,fontSize:8}}>${item.orderItems.price * item.orderItems.quantity - deduction}</Text>
                            <Text style={{...styles.headingText,fontSize:8}}>${item.orderItems.deliveryCharges}</Text>
                       
                        </View>
                    )
                }
                
             }}
            />
            <TouchableOpacity >
             
            <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-evenly',position:'absolute',bottom:0,backgroundColor:colors.colors.white}}>
              
            <DatePicker
                style={{width: '50%'}}
                date={date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                //minDate="2016-05-01"
                //maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => setDate(date)}
            />  
            <View style={{width:1,height:30,backgroundColor:colors.colors.gray500,alignSelf:'center'}}/>
            <DatePicker
                androidMode={'default'}
                style={{width: '50%'}}
                date={fromDate}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                //minDate="2016-05-01"
                //maxDate="2016-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(date) => onChange(date)}
            />  
            </View>
            </TouchableOpacity>
        </View>

    )
     


}
PaymentDetails.navigationOptions=navigationData=>{
    console.log(navigationData)

}
export default PaymentDetails
const styles =StyleSheet.create({
    main:{
        flex:1,
        width:DIMENS.common.WINDOW_WIDTH*0.98,
        height:DIMENS.common.WINDOW_HEIGHT,
        padding:2,
        paddingTop:0


    },
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:8,
        //width:DIMENS.common.WINDOW_WIDTH*0.9,
    },
    headingText:{
        width:DIMENS.common.WINDOW_WIDTH*0.14,
        textAlign:'center',
        fontSize:10,
        padding:2,
        height:40,
        

    },
    header:{
        height:DIMENS.common.WINDOW_HEIGHT*0.05,
        backgroundColor:colors.colors.surface,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom:8
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
})