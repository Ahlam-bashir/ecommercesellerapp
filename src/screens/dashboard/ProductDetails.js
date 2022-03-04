import React, { useEffect, useState } from 'react'
import { View ,TouchableOpacity,StyleSheet, ScrollView,Image,TouchableHighlight,ToastAndroid,Text as TextView,Platform,FlatList,Alert,useWindowDimensions} from 'react-native'
import { DIMENS } from '../../constants'
import {colors} from '../../theme'
import {Loader, Text,Icon} from '../../common'
import {encode} from 'base-64'
import ImageSlider from 'react-native-image-slider'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../constants/matcher';
import RenderHTML from 'react-native-render-html';
import {decode} from 'html-entities';
import { NAVIGATION_TO_REPLACEIMAGES } from '../../navigation/routes'
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import UploadImageModal from '../../common/picker/UploadImageModal'
import VariationUpdateModal from '../../common/picker/VariationUpdateModal'
import ImageZoom from 'react-native-image-pan-zoom';


const ProductDetails=({navigation,route})=>{
   // const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
    const id = route.params.Id
    const [sellerId,setSellerid]= useState('')
    const [loading,setLoading] = useState(false)
    const [product,setProduct]  = useState({})
    const [images,setImages] = useState([])
    const [visibleImageModal,setVisibleImageModal] = useState(false)
    const [variationModal,setVariationModal] = useState(false)
    const [variationId,setVariationId] = useState(null)
    const regex = /(<([^>]+)>)/ig;
    const {width} = useWindowDimensions();

    const  [data,setData] = useState([])
    useEffect(()=>{
      
      setLoading(true)
      AsyncStorage.getAllKeys().then((keyArray) => {
        AsyncStorage.multiGet(keyArray).then((keyValArray) => {
          let myStorage = {};
          for (let keyVal of keyValArray) {
            myStorage[keyVal[0]] = keyVal[1]
          }
          fetch(BASE_URL+'SellerProducts/'+id, {
            method: 'GET',
            headers:  
             {    Accept: 'application/json',
                'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password)
             },
             })
             .then((response) => response.json())
             .then((responseJson) => {
                 setProduct(responseJson)
                 setLoading(false)
                  
      //Showing response message coming from server 
                 console.log(responseJson);
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

                      }else{
                        alert(error.toString())
                      }
                    
  
                     console.warn(error);
                 });
          console.log(myStorage.sellerId)
        })})
       
    },[id])
    useEffect(()=>{
      setLoading(true)
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              console.log(myStorage.sellerId)
              setSellerid(myStorage.sellerId)
              fetch(BASE_URL+'AllProductImages/'+myStorage.sellerId+'?productId='+id, {
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
                  setLoading(false)
                  setImages([responseJson.mainImage,...responseJson.allImages])
                  
                  //images.push(responseJson.mainImage)
                  
                         
                  
                })
                .catch((error) => {
                  setLoading(false)
                //display error message
                if(Platform.OS!=='ios'){
                  ToastAndroid.showWithGravity(
                    error.toString(),
                  ToastAndroid.SHORT, //can be SHORT, LONG
                  ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                );
            
                }else{
                  alert(error.toString())
                }
              
              
                 console.warn(error);
                });
           
        
              console.log('CURRENT STORAGE: ', myStorage.email);
            })
          });
    
        

    },[id])
    useEffect(()=>{
      setLoading(true)
        AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              console.log(myStorage.sellerId)
              setSellerid(myStorage.sellerId)
              fetch(BASE_URL+'ProductVariation?productId='+id, {
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
                  console.log(responseJson.data);
                  setData(responseJson.data)
                  setLoading(false)
                 // setImages([responseJson.mainImage,...responseJson.allImages])
                  
                  //images.push(responseJson.mainImage)
                  
                         
                  
                })
                .catch((error) => {
                  setLoading(false)
                //display error message
                if(Platform.OS!=='ios'){
                  ToastAndroid.showWithGravity(
                    error.toString(),
                  ToastAndroid.SHORT, //can be SHORT, LONG
                  ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                );
            
                }else{
                  alert(error.toString())
                }
              
              
                 console.warn(error);
                });
           
        
              console.log('CURRENT STORAGE: ', myStorage.email);
            })
          });
    
        

    },[id])
    const edit =(varId) =>{
      setVariationModal(true)
      setVariationId(varId)

    }
    
  
    
   return(
       <ScrollView style={{flex:1}}>
       <View style={styles.main}>
       <UploadImageModal
            visible={visibleImageModal}
            onCancel={()=>setVisibleImageModal(false)}
            launchImage={()=>launchImage}
         />
         <VariationUpdateModal
          visible={variationModal}
          onClose={()=>setVariationModal(false)}
          variationId={variationId}

         />
         <Loader loading={loading}/>
        
        <View style={styles.imaigeContainer}>
       

       <ImageSlider
            loopBothSides
            autoPlayWithInterval={6000}
            images={images}
            customSlide={({ index, item, style, width }) => (
                
                // It's important to put style here because it's got offset inside
                <View key={index} style={[style, styles.customSlide]}>
                   <ImageZoom cropWidth={DIMENS.common.WINDOW_WIDTH}
                       cropHeight={DIMENS.common.WINDOW_HEIGHT*1/2}
                       imageWidth={DIMENS.common.WINDOW_WIDTH}
                       pinchToZoom={true}
                       imageHeight={200}>
                           <Image source={{ uri: item }} style={styles.customImage} />
                        
                  
                       
              </ImageZoom>
                 
                
                 
                </View>
                
              )}
              customButtons={(position, move) => (
                <View style={styles.buttons}>
                  {images.map((image, index) => {
                    return (
                      <TouchableHighlight
                        key={index}
                        underlayColor="#ccc"
                        onPress={() => move(index)}
                        style={styles.button}
                      >
                       
                        <View style={position === index ?styles.buttonSelected:{...styles.buttonSelected,backgroundColor:colors.colors.gray200}}/>
                        
                      </TouchableHighlight>
                    );
                  })}
                </View>
              )}
                />
            <View style={{alignSelf:'flex-end',position:'absolute',bottom:8,right:8}}>
          <TouchableOpacity onPress={()=>{navigation.navigate(NAVIGATION_TO_REPLACEIMAGES,{'seller':sellerId,'product':id})
            }}>
          <View style={{height:50,width:50,backgroundColor:colors.colors.primary,alignItems:'center',justifyContent:'center',flexDirection:'row',alignSelf:'flex-end',borderRadius:50*50/2}}>
            <Icon name='edit' size={20} color={colors.colors.white}/>
         
          </View>
          </TouchableOpacity>
        </View>
       
        </View>
        <View style={styles.productContainer}>
          <Text type='subheading' style={styles.text}>Product Specifications</Text>
          <View style={{width:'100%',height:1,backgroundColor:colors.colors.gray300,margin:4}}/>
          <View style={styles.textContainer}>
         <Text type='body'>Product Name: </Text>
         <Text  type='body'> {product.name}</Text>
         </View>
         <View style={styles.textContainer}>
         <Text  type='body'>Price: </Text>
         <Text  type='body'> ${product.price}</Text>
         </View>
         <View style={styles.textContainer}>
         <Text type='body'>Length: </Text>
         <Text type='body'> {product.productLength} cm</Text>
         </View>
         <View style={styles.textContainer}>
         <Text type='body'>Height: </Text>
         <Text type='body'> {product.productHeightThickness} cm</Text>
         </View>
         <View style={styles.textContainer}>
         <Text type='body'>Width: </Text>
         <Text type='body'> {product.productWidth} cm</Text>
         </View>
       
       </View>
        <View style={styles.productContainer}>
        <Text type='subheading' style={styles.text}>Product Description</Text>
          <View style={{width:'100%',height:1,backgroundColor:colors.colors.gray300,margin:4}}/>
          <RenderHTML
                  contentWidth={width}
                  source={{html: decode(product.description)}}
                />
          
        
        </View>
        <View style={styles.productContainer}>
        <Text type='subheading' style={styles.text}>Product Highlights</Text>
          <View style={{width:'100%',height:1,backgroundColor:colors.colors.gray300,margin:4}}/>
          <RenderHTML
                  contentWidth={width}
                  source={{html: decode(product.highlights)}}
                />
          
        
        </View>
        <View style={{...styles.productContainer}}>
        <Text type='subheading' style={styles.text}>Variation Details</Text>
          <View style={{width:'100%',height:1,backgroundColor:colors.colors.gray300,margin:4}}/>
          <View style={{flexDirection:'row',alignItems:'center'}}>
         
          </View>
        
       

        <MenuProvider  style={{flex:1,paddingTop:10}}>
        {data.map((item,key)=>{
         
          return(
            <View key={key}  style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',height:30}}>
        {item.ColorVariation!==null || item.ColorSizeVariation!==null?
        <>
         <Text>{item.ColorVariation.variationValue}</Text>
         <Text>{item.ColorSizeVariation.variationValue}</Text>
         </>
         : <Text>{item.SingleVariation.variationValue}</Text>
        }
         
             
          
            <Menu>
              <MenuTrigger >
                <Icon name='dots-three-vertical' type='entypo'/>
                </MenuTrigger>
              <MenuOptions optionsContainerStyle={{alignItems:'center',alignSelf:'center',height:60}}>
              {item.ColorVariation!==null || item.ColorSizeVariation!==null?
               <MenuOption value="A" text="Upload Image" onSelect={value => navigation.navigate('Variation Images',{'info':item.ColorVariation.variationValue,'sellerId':sellerId,'productId':item.ProductVariation.productId})} />
              :null}
           
                <MenuOption value="C" text="edit"  onSelect={value=>edit(item.ProductVariation.id)}/>
               
            </MenuOptions>
          </Menu>
          
          
       
    
      </View>
            

          )

        })}
          </MenuProvider>
          </View>
      
      
     
       </View>
       </ScrollView>
   )
}
export default ProductDetails
const styles= StyleSheet.create({
    main:{
        //flex:1,
        width:DIMENS.common.WINDOW_WIDTH,
        bottom:2,
       
    },
    imageContainer:{
        backgroundColor:colors.colors.white,
        height:300,
        alignItems:'center',
        justifyContent:'center',
        width:'100%'

    },
    image:{
        width:100,
        height:100,
        resizeMode:"cover",    
    },
    productContainer:{
        width:'100%',
        marginTop:10,
        backgroundColor: colors.colors.white,
        padding:12,

    },buttons: {
        zIndex: 1,
        height: 15,
        marginTop: -25,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      },
      button: {
        margin: 3,
        width: 15,
        height: 15,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
      },  buttonSelected: {
        //opacity: 1,
     //   color: 'red',
        height:6,
        width:20,
        borderRadius:30,
        backgroundColor:colors.colors.primary
      },
      customSlide: {
        backgroundColor:colors.colors.white
      //  width:'100%'
       // alignItems: 'center',
        //justifyContent: 'center',
      },
      customImage: {
        width: '100%',
        height: 300,
        resizeMode:'contain'
      },
      text:{
        fontSize:12,
      },
      textContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:6
      }

})