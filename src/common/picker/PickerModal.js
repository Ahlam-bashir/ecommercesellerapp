import React from 'react'
import {View,Modal,StyleSheet,FlatList,TouchableOpacity,TextInput} from 'react-native'

import { colors } from '../../theme';
import {Text} from '../'
import { Picker } from '@react-native-community/picker';
import Icon from '../Icon/Icon';
import { BottomSheet } from 'react-native-btr';
import Loader from '../indicator/Loader';
import { KeyboardAvoidingView } from 'react-native';
const PickerModal = (props) =>{
    console.log(props.onClose)
    const items = ['Apples','oranges']
    const ListHeader = () => {
        //View to set in Header
      
      };
     return(
        <BottomSheet 
        visible={props.visible}
        //setting the visibility state of the bottom shee
        onBackButtonPress={props.onClose}
        //Toggling the visibility state
        onBackdropPress={props.onClose}
        
       >
            <View style={styles.mainContainer} >
            
            <View style={styles.pickerContainer}>
            <View style={styles.header}> 
            <View style={{width:'86%',alignItems:'center'}}>  
            <View style={{width:60,height:2,backgroundColor:colors.colors.gray500,alignSelf:'center'}}/>
            </View>
            <TouchableOpacity style={{width:40,height:40,borderRadius:40/2,backgroundColor:colors.colors.gray200,marginEnd:14,alignItems:'center',justifyContent:'center'}} onPress={props.onClose}>
            <Icon  name='clear' size={25} color={colors.colors.black}        />
            </TouchableOpacity>            
            </View>
          
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
              
               >
                     <View style={styles.headerFooterStyle}
          
          >
            <TextInput
            keyboardType={'default'}
            style={styles.textInputStyle}
            onChangeText={(text) => props.searchFilterFunction(text)}
            value={props.searchText}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
        />
           
          </View>
      
           
            <FlatList
            
           
            
           
               contentContainerStyle={{alignItems:'center'}}
               numColumns={2}        
               data={props.item}
               keyExtractor={(id,index)=>index.toString()}
               renderItem={(itemData)=>{
                   console.log(itemData)
                return(
                    <TouchableOpacity onPress={()=>props.onSelect(itemData.item)}>                       
                    <View style={{alignItems:'center',borderWidth:1,width:120,height:40,justifyContent:'center',margin:10}}>
                    <Text>{itemData.item.countryName || itemData.item.stateName || itemData.item.categoryName || itemData.item.subCategoryName}</Text>
                    </View>
                    </TouchableOpacity>       
                )
               }}
             />  
             </KeyboardAvoidingView> 
        </View>
      
        </View>
        </BottomSheet>
     )
    



}
export default PickerModal;
const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:colors.colors.transparent,
     //   marginLeft: 10,
      //  marginRight: 10,

    },
    pickerContainer:{
        width:'100%',
        height:500,
        backgroundColor: colors.colors.gray100,
        paddingLeft: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop:16
        },
    header:{
        width:'100%',
       // justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:24,
       // alignSelf:'center'
             //   backgroundColor:colors.colors.primary
    },
    headerFooterStyle: {
        width: '90%',
        height: 45,
        backgroundColor: colors.colors.gray200,
        marginStart:10,
        marginEnd:10,
        paddingStart:10,
        borderRadius:6,
        paddingTop:10,
        marginBottom:12
        
      },
      textStyle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        padding: 7,
      },

})
