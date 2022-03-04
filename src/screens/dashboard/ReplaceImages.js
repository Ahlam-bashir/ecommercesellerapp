import React ,{useEffect, useState}from 'react'
import {View,StyleSheet,TouchableOpacity,Image, Platform, ToastAndroid,Alert,FlatList} from 'react-native'

import {Icon,Loader,Text} from '../../common/'
import {launchImageLibrary} from 'react-native-image-picker';
import { DIMENS, TYPOGRAPHY } from '../../constants'
import { colors } from '../../theme'
import { DRAWER_NAVIGATION_ROUTES } from '../../navigation/routes';
import { BASE_URL } from '../../constants/matcher';
import AsyncStorage from '@react-native-community/async-storage'
import {encode} from 'base-64'
import { RNToasty } from 'react-native-toasty';


const ReplaceImages = ({navigation,route}) =>{
    const [loading,setLoading] = useState(false)
     const [disableView,setdisableView] = useState(false)
     const [disableImage,setDisableImages] = useState(false)
     const sellerId= route.params.seller
     const productId=route.params.product
     console.log(route)
     const [uri,setUri] = useState('')
     const [mainImageuri,setmainImageUri]= useState('')
     const [image,setImage] = useState({uri:null})
     const [file,setValues] = useState({
       photo1:{uri:null},
       photo2:{uri:null},
       photo3:{uri:null},
       photo4:{uri:null},
       photo5:{uri:null},
          
         
     })
     const [flag,setflag] = useState(false)
     const [list2,setlist2] = useState([])
     const [list,setlist] = useState([])
     const [file2,setValue] = useState({
       photo1:{uri:''},

     })
    // const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
    useEffect(()=>{
                setLoading(true)
             AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              fetch(BASE_URL+'AllProductImages/'+sellerId+'?productId='+productId, {
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
                  console.log(responseJson);
                  setLoading(false)
                  setdisableView(true)
                  setImage(prev=>({
                    ...prev,
                    uri:responseJson.mainImage
                  })) 
                  setmainImageUri(responseJson.mainImage)
                  let files=[responseJson.allImages]
                  setlist(responseJson.allImages)
                  setlist2(responseJson.allImages)

                     
                  console.log('files'+files)  
                  files.map((value,index)=>{
                      console.log('files2'+value[2])
                       if(value[0]!==undefined){
                        setValues(prev=>({
                          ...prev,
                          photo1:{uri:value[0]},       
                      }))                    
                       }
                       if(value[1]!==undefined){
                        setValues(prev=>({
                          ...prev,
                       photo2:{uri:value[1]},
                          
                      }))
                       }
                       if(value[2]!==undefined){
                        setValues(prev=>({
                          ...prev,
                       photo3:{uri:value[2]},
                          
                      }))
                       }
                       if(value[3]!==undefined){
                        setValues(prev=>({
                          ...prev,
                       photo4:{uri:value[3]},
                          
                      }))
                       }
                       if(value[4]!==undefined){
                         console.log('inside'+value[4])
                        setValues(prev=>({
                          ...prev,
                       photo5:{uri:value[4]},
                          
                      }))
                    }


                  })   
                })
                .catch((error) => {
                  setLoading(false)
                  
                //display error message
                 console.warn(error);
                });
             
     
            })})
      

    },[sellerId,flag])
     const chooseFile = (type,name)=>{
        let options = {
          mediaType: type,
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
        };
        launchImageLibrary(options,(response)=>{
          console.log(response);
    
          if(response.didCancel){
          //  alert('User Cancelled camerapicker')
            return
          }else if(response.errorCode== 'camera_unavailable'){
           // alert('Camera not available on this device')
            return
          }else if(response.errorCode=='permission'){
           // alert('permission not satisfied')
            return
          }else if(response.errorCode=='others'){
          //  alert(response.errorMessage)
            return
          }
          console.log('base64 -> ', response.base64);
          console.log('uri -> ', response.uri);
          console.log('width -> ', response.width);
          console.log('height -> ', response.height);
          console.log('fileSize -> ', response.fileSize);
          console.log('type -> ', response.type);
          setdisableView(true)
          console.log(response)
          console.log('fileName -> ', response.assets.map((assets,index) => {
              console.log(assets)
                 if(name==='photo1' || name===0){
                     setValues(prev=>({
                       ...prev,
                      photo1:assets
                    }))
                                      // list.map((item,index) => index===0?assets.uri:item);
                    
                      
                        uploadImages(name,list[0],assets)
                      
                     
                    
                     
                  }else if(name==='photo2'){
                      if(list[1]!==undefined){
                        setValues(prev=>({
                          ...prev,
                          photo2:assets
                        }))
                        uploadImages(name,list[1],assets)
                      }else{
                        console.warn('no subimage fount')
                      }
                 
                 
                  }else if(name==='photo3' && list[2]!==undefined){
                    setValues(prev=>({
                      ...prev,
                      photo3:assets
                    }))
                    uploadImages(name,list[2],assets)
                  }
                  else if(name==='photo4'){
                    setValues(prev=>({
                      ...prev,
                      photo4:assets
                    }))
                    uploadImages(name,list[3],assets)
                 
                  }else if(name==='photo5'){
                    setValues(prev=>({
                      ...prev,
                      photo5:assets
                    }))
                    uploadImages(file.photo5,list[4],assets)
                 
                  }
                 
                  else if(name==='image'){
                      setImage(assets)
                  //  setValues(prev=>({
                   //   ...prev,
              //        MainImage:assets
                //    }))
                 
                  }

                  setUri(assets.uri)
              //setFilePath(assets)
          }));
         // console.log('file'+filePath)
    
        })
      }
      
      const uploadImages =  (photo,path,assets)=>{
        console.log('assets'+assets.uri)
        console.log('path'+path)
 
           if(path===undefined){
             RNToasty.Error({
               title:'No Image found',
               position:'center'
             })
             
             return

           }
          

      
       //if(photo!==undefined){
        //console.log('phot'+photo.type)
 
//       }
     ///  console.log(photo.uri)
           Alert.alert('Replace','Are you sure you want to Replace this Image?',[
        {
            text:'No',
            onPress:()=>{
                setflag(true)
                return null
            },
        },
        {
            text:'Yes',
            onPress:() =>{
              const data = new FormData();
               if(file.photo1.uri!==list[0] || file.photo2!==list[1]){
                data.append("name", "Techup media");
                data.append("fileToUpload", {
                  name:  assets.fileName,
                  type:  assets.type,
                  uri:   assets.uri,
                }
                );
               
               }
             
            //  console.log('uri2'+photo.uri)
            
               
            
              console.log('urt'+file.photo1.uri)
              setLoading(true)
              AsyncStorage.getAllKeys().then((keyArray) => {
                AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                  let myStorage = {};
                  for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                  }
               fetch(BASE_URL+'ReplaceProductImage?path='+path, {
                    method: 'POST',
                 
                    headers: {
                        'Content-Type': 'multipart/form-data; ',
                        'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
                    
                      },
                     body:data
                })
                .then((response) =>response.json())
                .then((responseJson) => {
                  setLoading(false)
                     if(responseJson.isUploaded===true)
                   { console.log(responseJson)
                    RNToasty.Success({
                      title:responseJson.message,
                      position:'center'
                    })
                    
                       //setDisableImages(true)
          
          
                    }else if(responseJson.isUploaded===false){
                      setLoading(false)
                      console.log(responseJson)
                     
                      RNToasty.Error({
                        title:responseJson.message,
                        position:'center'
                      })
                       setDisableImages(true)
      
                    }
                           //Showing response message coming from server 
                        //  navigation.navigate('ManageProducts')
                         console.log(responseJson);
                        })
                        
                         .catch((error) => {
                           setLoading(false)
                           RNToasty.Error({
                             title:'Something went wrong',
                             position:'center'
                           })
                           
                       
                          //display error message
                             console.warn(error);
                         });
            
          
                })})
           

            }}],{cancelable:false})
      
        
      }
      const uploadMainImage =()=>{
        console.log('mainImage')
        if(Object.keys(image).length===0){
          RNToasty.Warn({
            title: 'Select Image',
            position:'center'
          })
         
           return

         }
         if(image.uri!==mainImageuri){
         const data = new FormData();
         data.append("name", "Techup media");
         data.append("fileToUpload", {
           name:  image.fileName,
           type:  image.type,
           uri:   image.uri,
         }
         );
         console.log(image.type+image.uri+image.fileName)
         setLoading(true)
         AsyncStorage.getAllKeys().then((keyArray) => {
            AsyncStorage.multiGet(keyArray).then((keyValArray) => {
              let myStorage = {};
              for (let keyVal of keyValArray) {
                myStorage[keyVal[0]] = keyVal[1]
              }
              fetch(BASE_URL+'ReplaceMainImage/?sellerId='+sellerId+'&productId='+productId, {
                method: 'POST',
             
                headers: {
                    'Content-Type': 'multipart/form-data; ',
                    'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
                
                  },
                 body:data
            })
            .then((response) =>response.json())
            .then((responseJson) => {
              setLoading(false)
                 if(responseJson.isUploaded===true)
               { console.log(responseJson)
                RNToasty.Success({
                  title:responseJson.message,
                  position:'center'
                })
                
                   //setDisableImages(true)
      
      
                }else if(responseJson.isUploaded===false){
                  setLoading(false)
                  console.log(responseJson)
                  RNToasty.Error({
                    title:responseJson.message,
                    position:'center'
                  })
                 
                   setDisableImages(true)

                }
                       //Showing response message coming from server 
                    //  navigation.navigate('ManageProducts')
                     console.log(responseJson);
                    })
                    
                     .catch((error) => {
                       setLoading(false)
                       ToastAndroid.showWithGravity(
                        error.toString(),
                        ToastAndroid.SHORT, //can be SHORT, LONG
                        ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                      );
                   
                      //display error message
                         console.warn(error);
                     });
        
      
            })})
         }else{
             setDisableImages(true)
         }

      


      }
    

     const deleteImage=(path)=>{
       console.log(path+'path')
         if(path===undefined || path ===null){
           RNToasty.Warn({
             title:'No sub image found',
             position:'center'

           },3000)
          
        
          return

         }
      Alert.alert('Delete','Are you sure you want to Delete this Image?',[
        {
            text:'No',
            onPress:()=>{
                
                return null
            },
        },
        {
            text:'Yes',
            onPress:() =>{
            
               
              
              console.log('urt'+path)
              setLoading(true)
              AsyncStorage.getAllKeys().then((keyArray) => {
                AsyncStorage.multiGet(keyArray).then((keyValArray) => {
                  let myStorage = {};
                  for (let keyVal of keyValArray) {
                    myStorage[keyVal[0]] = keyVal[1]
                  }
                  fetch(BASE_URL+'DeleteProductImage?path='+path, {
                    method: 'DELETE',
                 
                    headers: {
                        
                        'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
                    
                      },
                    
                })
                .then((response) =>response.json())
                .then((responseJson) => {
                  setLoading(false)
                           //Showing response message coming from server 
                        //  navigation.navigate('ManageProducts')
                        RNToasty.Success({
                          title: responseJson.message,position:'center'
                        })
                       
                          setflag(true)
                         console.log(responseJson);
                        })
                        
                         .catch((error) => {
                           setLoading(false)
                           ToastAndroid.showWithGravity(
                            error.toString(),
                            ToastAndroid.SHORT, //can be SHORT, LONG
                            ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                          );
                       
                          //display error message
                             console.warn(error);
                         });
            
          
                })})
           

            }}],{cancelable:false})
      
     
       

     }

const replace =()=>{
  console.log('hello')
    if(file.photo1.uri!==list[0] || file.photo2.uri!==list[1] || file.photo3!==list[2] || file.photo4.uri!==list[3] ||file.photo5.uri!==list[4]){
     RNToasty.Success({
       title: 'Images replaced sucessfully',
       position:'center'
     })
     
      navigation.navigate('ManageProducts')
         
    }
    else{
      navigation.navigate('ManageProducts')
    }
        
}


    return(
        <View style={styles.main}>
          <View>
           <Loader loading={loading}/>
           </View>
         {!disableImage ?   <View> 
         
            
                 <TouchableOpacity 
               //   onPress={()=>chooseFile('photo','image')}
               >
           <View style={{...styles.ImageContainer,width:'90%'}} >
             {disableView ? 
             <View style={{width:'100%'}}>
             <Image style={{height:130,resizeMode:'cover',width:'100%'}}  source={{uri:(image.uri!==null)? image.uri:null}}/>
             <TouchableOpacity style={{position:'absolute',bottom:2,alignSelf:'flex-end',height:40,width:40,backgroundColor:colors.colors.primary,margin:6,borderRadius:40/2,alignItems:'center',justifyContent:'center',right:3}} onPress={()=>chooseFile('photo','image')}>          
                  <Icon name='edit' size={20} color={colors.colors.white}/>
                  </TouchableOpacity>
            
             </View>
             :
             <View style={{alignItems:'center'}}>
             <Icon
                 name='image'
                 size={25}
                 color={colors.colors.primary}
               />
               <Text>Replace Main Image</Text>    
                          </View>
             }
               
           </View>
           </TouchableOpacity>
           </View>
              : (<View>
                <FlatList
                  data={Object.keys(file)}
                  keyExtractor={(item,index)=>index.toString()}
                  numColumns={2}
                  renderItem={({item})=>{
                      console.log('itemdata')
                      if(file[item].uri!==null){
                        return(   
                        
                          <View style={styles.ImageContainer} >
                {disableView ?
               <>
              <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file[item].uri}}/>
              <View style={styles.replaceContainer}>
              <TouchableOpacity style={styles.replace} onPress={()=>chooseFile('photo',item)}>          
                  <Icon name='edit' size={20} color={colors.colors.primary}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.replace} onPress={()=>deleteImage(file[item].uri)}> 
             <Icon name='delete' size={20} color={colors.colors.primary}/>
             </TouchableOpacity>
             </View>
            </>
             :<Icon
                 name='image'
                 size={25}
                 color={colors.colors.primary}
               />
             }
               
           </View>
                       )
                      }
                   
                  }}
                />
           
           

     </View>
  
              )
}
          
        
  
           <View style={styles.buttonContainer}>
            <Icon
              name={(disableImage)?'check':'arrow-forward'}
              size={35}
              onPress={(disableImage)  ? replace : uploadMainImage}
              color={colors.colors.white}

            />
        </View>
      
        
        </View>
    )


}
export default ReplaceImages;
const styles=StyleSheet.create({
    main:{
        
        flex:1,
        width:DIMENS.common.WINDOW_WIDTH,
        //height:DIMENS.common.WINDOW_HEIGHT,
       // padding:10,
        marginTop:16,
        marginEnd:10,
        
        bottom:24,
       
    },
    headingText:{
    alignSelf:'center',
    },
    container:{
        width:'100%',
        top:24,
    },
    ImageContainer:{
      width:DIMENS.common.WINDOW_WIDTH*0.4,
      height:140,
      margin: 10,
      borderRadius:4,
    //  borderColor:colors.colors.black,
      elevation:1,
      top:2,
      alignItems:'center',
      justifyContent:'center',
      shadowColor:colors.colors.gray500,
     shadowOffset:{
         width:0,
         height:2,
         
     } ,
     borderWidth:1,
     shadowOpacity:5,
     shadowRadius:2,
     overflow:'hidden'
     
     
     
     
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
       bottom:16,
       

      
   },
   replaceContainer:{
     alignSelf:'flex-end',
     flexDirection:'row' ,
     position:'absolute',
     alignItems:'flex-end',
     bottom:10,
     right:6
    },
    replace:{
      height:25,
      width:25,
      borderRadius:25/2,
      backgroundColor:colors.colors.gray300,
      alignItems:'center',
      justifyContent:'center',
      marginRight:6
    }
})
