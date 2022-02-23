import React,{useState} from 'react'
import {View,StyleSheet,Platform,TouchableOpacity, Keyboard, ScrollView} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { Text,Icon,InputText,Loader, VariationPicker } from '../../common'
import { DIMENS, TYPOGRAPHY } from '../../constants'
import { isNonEmptyString, isPriceRange } from '../../utils'
import { colors } from '../../theme'
import { BASE_URL } from '../../constants/matcher'
import AsyncStorage from '@react-native-community/async-storage'
import { encode } from 'base-64'
import {launchImageLibrary} from 'react-native-image-picker';
import { set } from 'react-native-reanimated'
import { RNToasty } from 'react-native-toasty'

const AddGroupVariation =({navigation,route})=>{
    console.log(route.params)
    const [Loading,setLoading] = useState(false)
    const [sku,setsku]=useState(route.params.sku)
    const id=route.params.id
    const [value,setValue]=useState('Select Size')
    const [colorId,setColorId] = useState(null)
    const [sizeId,setSizeId] = useState(null)
    const [sizeVisible,setSizeVisible] = useState(false)
   const [List,setList]= useState([])
    const [form,setform]= useState({
        price:'',
        incorrectPrice:false,
        priceError:'',
        stock:'',
        incorrectStock:false,
        extraInfo:'',
        file:'Choose File',
        incorrectFile:false,
        singleFile:'',
          
    }
        
    )
    const [text,setText] = useState('Select Color')
    const [visible,setVisible]=useState(false)
   
                 
    
    const onChange=(item)=>{
        setVisible(false)
            setText(item.variationValue)
            setColorId(item.variationId)
            setsku(sku+'-'+item.variationValue.toUpperCase())

       
            
            
        
        

    }
    const onSizeChange=(item)=>{
        setSizeVisible(false)
            setValue(item.variationValue)
            setSizeId(item.variationId)
            setsku(sku+'-'+item.variationValue.toUpperCase())

       
            
            
        
        

    }
    const variationValueList=(type)=>{
        if(type==='Color'){
            setVisible(true)
        }else{
            setSizeVisible(true)
        }
       
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              fetch(BASE_URL+'VariationsGroup?type='+type, {
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
                  setList(responseJson.data) 
                                         
                  
                })
                .catch((error) => {
                  //setLoading(false)
                //display error message
                setLoading(false)
                if(Platform.OS!=='ios'){
                  ToastAndroid.showWithGravity(
                    error.toString(),
                    ToastAndroid.SHORT, //can be SHORT, LONG
                    ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                  );
              
                }
                else{
                  alert(error.toString())
                }
                
                 console.warn(error);
                });
              
        
        
              console.log('CURRENT STORAGE: ', myStorage.email);
            })
          });
    

    }
    const checkField=(fieldKey,fieldErrorKey,fieldValidater)=>{
      if(!fieldValidater(form[fieldKey])){
           setform(prevState=>({
             ...prevState,
             [fieldErrorKey]:true
           }));
           return false;
      }
      return true;
  
    }
    const checkValidation=()=>{
      let isValid=true
      isValid=isValid  &&   checkField('price','incorrectPrice',isNonEmptyString)
      isValid=isValid  &&   checkField('stock','incorrectStock',isNonEmptyString)
       return isValid
    }  
    const Variation =()=>{
        Keyboard.dismiss()
        if(!checkValidation()){
          return
        }
        if(value==='Select Size' || text==='Select Color'){
          alert('Select variation')
          return

        }

       
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              setLoading(true)
            
              fetch(BASE_URL+'VariationsGroup?productId='+id, {
                method: 'POST',
                headers:  
                 {   
                    
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                     'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
             },
                 body:JSON.stringify({
                    "variationColorId":colorId,
                    "variationSizeId":sizeId,
                    "productId":id,
                    "stock":form.stock,
                    "price":form.price,
                    "SKU":sku,
                    "extraInfo":"" /* Optional */
                 }),
            })
            .then((response) =>response.json())
            .then((responseJson) => {
              setLoading(false)
                       //Showing response message coming from server 
              console.log(responseJson);
              RNToasty.Success({
                title:responseJson.extra,
                position:'center'
              })
              
              
              })
              .catch((error) => {
              //display error message
              setLoading(false)
              if(Platform.OS!=='ios'){
                ToastAndroid.showWithGravity(
                  error.toString(),
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
    
              }
              else{
                alert(error.toString())
              }
            
                  console.warn(error);
              });
    
    })})
    
       

    }
    return(
      <View>
        <ScrollView>
          <Loader loading = {Loading}/>
        <View style={styles.main}>
            <VariationPicker 
              visible={visible}
              onClose={()=>setVisible(false)}
              item={List}
              onSelect={(item)=>onChange(item)}
            />
             <VariationPicker 
              visible={sizeVisible}
              onClose={()=>setSizeVisible(false)}
              item={List}
              onSelect={(item)=>onSizeChange(item)}
            />
           
            
        <TouchableOpacity  onPress={()=>variationValueList('Color')} style={styles.containerStyle}>
        <View style={{widht:'100%',flexDirection:"row",justifyContent:'space-between',height:36,alignItems:'center',}}>
          <Text>{text}</Text>
           <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
        </View>
        </TouchableOpacity>
        
       
     <TouchableOpacity onPress={()=>variationValueList('Size')} style={styles.containerStyle}>
        <View style={{widht:'100%',flexDirection:"row",justifyContent:'space-between',height:36,alignItems:'center',}}>
          <Text>{value}</Text>
           <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
        </View>
        </TouchableOpacity>
        
      
    <InputText
                main={{flex:0}}
                label='Price($)'
                labelStyle={''}
                autoCorrect={false}
                containerStyle={styles.containerStyle}
                keyboardType='number-pad'
                onChangeText={value=>setform(prevState=>({
                  ...prevState,
                  price:value.trim(),
                  incorrectPrice:false
            })
            )}
            underlineColorAndroid = {colors.colors.transparent}

         
            errorMessage={form.incorrectPrice?form.priceError:""}
            onBlur={()=>{
              if(!isNonEmptyString(form.price)){
                setform(prevState=>({
                  ...prevState,
                  priceError:'mandatory field',
                 
                  incorrectPrice:true
            }))
          }else if(isNonEmptyString(form.price) && isPriceRange(form.price)){
            setform(prevState=>({
              ...prevState,
              priceError:'out of range',
             
              incorrectPrice:true

          }))

              
            }}}
    
           // onBlur={()=>checkField('price','incorrectPrice',isNonEmptyString)}
    
         
            />
             <InputText
                main={{flex:0}}   
                label='Stock'
                labelStyle={''}
                autoCorrect={false}
                containerStyle={styles.containerStyle}
                keyboardType='number-pad'
                onChangeText={value=>setform(prevState=>({
                  ...prevState,
                  stock:value.trim(),
                  incorrectStock:false
            })
            )}
            underlineColorAndroid = {colors.colors.transparent}

          
            errorMessage={form.incorrectStock?'MandatoryField':""}
            onBlur={()=>checkField('stock','incorrectStock',isNonEmptyString)}
    
         
            />
             <InputText  
                value={sku}
                label='SKU'
                labelStyle={''}
                autoCorrect={false}
                containerStyle={styles.containerStyle}
                underlineColorAndroid = {colors.colors.transparent}
                main={{flex:0}}
                disabled={true}
             
               
            />
            
        
        
        


         
        </View>
        </ScrollView>
        <TouchableOpacity style={styles.buttonContainer}   onPress={Variation}>
            <Icon
              name='check'
              size={24}
            
              color={colors.colors.white}

            />
        </TouchableOpacity>
      
        </View>
    )
}
export default AddGroupVariation;
const styles =StyleSheet.create({
    main:{
        flex:1,
        height:DIMENS.common.WINDOW_HEIGHT,
        width:DIMENS.common.WINDOW_WIDTH,
        padding:6,
        backgroundColor:colors.colors.white
    },
    defaultMargin:{
        marginTop:0, 
        borderBottomWidth :1,
        height:30,
        marginBottom:12
      },
      buttonContainer:{
        height:60,
         width:60,
         backgroundColor:colors.colors.primary,
         borderRadius:60/2,
         position:"absolute",
         alignSelf:'flex-end',
         right:24,
         elevation:10,
         alignItems:'center',
         justifyContent:'center',
         bottom:24,
         
  
        
     },
     divider:
     {
     width:'100%',
     height:1,
     backgroundColor:colors.colors.primary
 },
 containerStyle: {
  //flex:1,
  backgroundColor: colors.colors.white,
  height: 40,
  borderRadius: 4,
  shadowColor: colors.colors.gray500,
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowRadius: 1,
  shadowOpacity: 1.0,
  borderWidth:1,
  margin: 4,
  elevation:2,
  borderColor:colors.colors.primaryLight,
  position:'relative',
  zIndex:1,
  paddingLeft:4,
  marginBottom:14
},

})
