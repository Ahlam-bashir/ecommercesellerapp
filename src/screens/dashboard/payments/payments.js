import React from 'react'
import {View,StyleSheet,TouchableOpacity} from 'react-native'
import { DIMENS } from '../../../constants'
import { Text,Icon } from '../../../common'
import { colors } from '../../../theme'

const payments =({navigation})=>{
    return(
        <View style={styles.main}>
            <TouchableOpacity onPress={()=>navigation.navigate('Payment Details',{route:{'headerTitle':'PendingPayments','title':'Pending Payments'}})}>
            <View style={styles.container}>
            <Text type='subheading' style={{color:colors.colors.white}}>Payments Pending</Text>
            <Icon type='antdesign' name='right' color={colors.colors.white}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Payment Details',{route:{'headerTitle':'InprogressPayments','title':'Payments in progress'}})}>
            <View style={styles.container}>
            <Text type='subheading' style={{color:colors.colors.white}}>Payments in Progress</Text>
            <Icon type='antdesign' name='right' color={colors.colors.white}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Payment Details',{route:{'headerTitle':'CancelledPayments','title':'Cancelled　Payments'}})}>            
            <View style={styles.container}>
            <Text type='subheading' style={{color:colors.colors.white}}>Cancelled Payments</Text>
            <Icon type='antdesign' name='right' color={colors.colors.white}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Payment Details',{route:{'headerTitle':'ReturnedPayments','title':'Returned　Payments'}})}> 
            <View style={styles.container}>
            <Text type='subheading' style={{color:colors.colors.white}}>Returned Payments</Text>
            <Icon type='antdesign' name='right' color={colors.colors.white}/>
            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Payment Details',{route:{'headerTitle':'CompletedPayments','title':'Completed　Payments'}})}>    
            <View style={styles.container}>
            <Text type='subheading' style={{color:colors.colors.white}}>Completed Payments</Text>
            <Icon type='antdesign' name='right' color={colors.colors.white}/>
            </View>
            </TouchableOpacity>
           

        </View>
    )
}
export default payments
const styles =StyleSheet.create({
    main:{
        flex:1,
        height:DIMENS.common.WINDOW_HEIGHT,
        width:DIMENS.common.WINDOW_WIDTH,


    },
    container:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:colors.colors.primary,
        height:DIMENS.common.WINDOW_HEIGHT*0.1,
        padding:10,
       // marginBottom:6,
        marginTop:8

    },
    textStyle:{

    }
})