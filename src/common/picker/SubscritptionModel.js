import React from 'react'
import {View,Modal,StyleSheet,FlatList,TouchableOpacity} from 'react-native'

import { colors } from '../../theme';
import {Text} from '../'
import { BottomSheet } from 'react-native-btr';
import { Picker } from '@react-native-community/picker';
import Icon from '../Icon/Icon';
import Loader from '../indicator/Loader';
const SubscriptionModal = (props) =>{
    console.log(props.onClose)
    const items = ['Apples','oranges']
    
    return(
        <BottomSheet 
        visible={props.visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={props.onClose}
        //Toggling the visibility state
        onBackdropPress={props.onClose}
       >
        <View style={styles.mainContainer}>
        <View style={styles.pickerContainer}>
        <View style={styles.header}>            
        <View style={{width:60,height:2,backgroundColor:colors.colors.gray500,left:120}}/>
            <TouchableOpacity style={{padding:10}} onPress={props.onClose}>
            <Icon  name='clear' size={20} color={colors.colors.gray500}/>
            </TouchableOpacity>            
        </View>                                
        <FlatList
            data={props.item}
            keyExtractor={(id,index)=>index.toString()}
            renderItem={(itemData)=>{
            console.log(itemData)
                return(
                    <TouchableOpacity onPress={()=>props.onSelect(itemData.item)}>                       
                    <View style={{alignItems:'center',margin:6}}>
                    <Text>{itemData.item.title}</Text>
                    </View>
                    </TouchableOpacity>        
                )
            }}
            />   
    </View>
    </View>
    </BottomSheet>
    )
}
export default SubscriptionModal;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colors.colors.transparent,
        marginLeft: 10,
        marginRight: 10,

    },
    pickerContainer:{
        width:300,
        height:200,
        backgroundColor: colors.colors.gray100,
        paddingLeft: 10,
        paddingTop:16
        },
    header:{
        width:'100%',
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
       
        alignSelf:'center'
             //   backgroundColor:colors.colors.primary
    }

})
