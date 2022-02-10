import React,{useState,useEffect} from 'react'
import {View,StyleSheet, Modal,TouchableOpacity,Platform,ScrollView, Keyboard} from 'react-native'
import {colors} from '../../theme'
import {Icon,InputText,Text} from '../../common'
import {isNonEmptyString,isEmailValid,isPhoneNumberValid,isNumber} from '../../utils'
import { DIMENS } from '../../constants'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../constants/matcher'
import { encode } from 'base-64'

const UploadImageModal = (props) =>{
    return(
        <Modal
            visible={props.visible}
            animationType='fade'
            transparent={true}
        >
            <View style={styles.main}>
                <View style={styles.pickerContainer}>
                <View styles={styles.header}>
                    <Text style={{alignSelf:'center'}} type='subheading'>Upload image</Text>
                </View>
                <View style={styles.middleView}>
                    <TouchableOpacity onPress={props.launchImage}>
                        <Text>Choose Files</Text>
                    </TouchableOpacity>
                    <View style={styles.divider}/>

                </View>
                <View>
                    <View style={styles.bottom}>
                        <TouchableOpacity style={styles.buttonView}>
                        <Text>Upload</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonView} onPress={props.onCancel}>
                        <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>

            </View>

        </Modal>
    )

}
export default UploadImageModal;
const styles=StyleSheet.create({
    main:{
     
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            backgroundColor:colors.colors.transparent,
            marginLeft: 10,
            marginRight: 10,
    
        },
        pickerContainer:{
            width:'100%',
            height:160,
            backgroundColor: colors.colors.gray200,
            paddingLeft: 10,
            //borderTopLeftRadius: 30,
            //borderTopRightRadius: 30,
            paddingTop:16
            },
        header:{
            alignItems:'center',
            justifyContent:'center',
        },
        divider:{
            height:1,
            width:200,
            backgroundColor:colors.colors.gray400
        },
        bottom:{
            alignItems:'center',
            justifyContent:'flex-end',
            flexDirection:'row',
            margin:8,
            top:16
           // bottom:8
        },
        buttonView:{
            height:30,
            width:80,
            backgroundColor:colors.colors.primary,
            alignItems:'center',
            justifyContent:'center',
            marginHorizontal:2,
            
           // top:8
        },
        middleView:{
            top:16
        }

    
})
