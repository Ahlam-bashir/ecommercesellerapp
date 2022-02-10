import React from 'react'
import {View,Modal,StyleSheet,FlatList,TouchableOpacity} from 'react-native'

import { colors } from '../../theme';
import {Text} from '../'
import { Picker } from '@react-native-community/picker';
import Icon from '../Icon/Icon';
import Loader from '../indicator/Loader';

const Variation =(props)=>{
   return(
       <Modal
       visible={props.visible}
        animationType={'fade'}
        transparent={true}
       >
           <View style={styles.main}>
               <View style={styles.pickerContainer}>
                   <View style={styles.header}>
                     <View style={{width:'80%',alignItems:'center',justifyContent:'center'}}>
                   <Text type='subheading' >Variations</Text> 
                   </View>  
                   <View style={{width:'10%'}}> 
                  <TouchableOpacity onPress={props.onClose} style={{width:40,height:40,borderRadius:40/2,backgroundColor:colors.colors.gray200,alignItems:'center',justifyContent:'center',alignSelf:'flex-end'}} >
                   <Icon  name='clear' size={20} color={colors.colors.black}      />
                   </TouchableOpacity>
                   </View> 
                   </View>
                   <FlatList
                        data={props.item}
                        keyExtractor={(id,index)=>index.toString()}
                        renderItem={(itemData)=>{
                       
                            return(
                                <TouchableOpacity onPress={()=>props.onSelect(itemData.item)}>                       
                                <View style={{alignItems:'center',margin:6}}>
                                <Text type='caption'>{itemData.item.title|| itemData.item.variationValue}</Text>
                                </View>
                                </TouchableOpacity>        
                            )
            }}
            />


               </View>

           </View>


        </Modal>
   )

}
export default Variation;
const styles =StyleSheet.create({
    main:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:colors.colors.transparent,
        marginLeft: 10,
        marginRight: 10,


    },
    pickerContainer:{
        width:'100%',
        height:180,
        backgroundColor: colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:16
        },
        header:{
            width:'100%',
            //justifyContent:'space-between',
            flexDirection:'row',
            alignItems:'center',
            marginBottom:16,
            justifyContent:'center'
           
           
                 //   backgroundColor:colors.colors.primary
        }
    
   
})