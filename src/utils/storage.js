import AsyncStorage from '@react-native-community/async-storage'
import {isNonEmptyString} from './primitiveChecks'
const SELLER_KEY ='sellerId'
const saveValue = async (key,value)=>{
    try{
        if(isNonEmptyString(value))
        {
            await AsyncStorage.setItem(key,value)
        }else{
            await AsyncStorage.removeItem(key)
        }
        return true
    }catch(e){
        return false
    }
};
export const loadValue = async key =>{
    try{
        const value= await AsyncStorage.getItem(key)
        return value
    }catch(e){
        return null
    }
}
export  const saveseller = async user =>{
    saveValue(SELLER_KEY,user)
}
export const loadSeller = async() =>{
          loadValue(SELLER_KEY)
}