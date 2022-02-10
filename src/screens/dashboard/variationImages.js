import React ,{useState}from 'react'
import {View,StyleSheet,TouchableOpacity,Image, Platform, ToastAndroid, ScrollView} from 'react-native'

import {Icon,Loader,Text} from '../../common/'
import {launchImageLibrary} from 'react-native-image-picker';
import { DIMENS, TYPOGRAPHY } from '../../constants'
import { colors } from '../../theme'
import { DRAWER_NAVIGATION_ROUTES } from '../../navigation/routes';
import { BASE_URL } from '../../constants/matcher';


const variationImages = ({navigation,route}) =>{
    const [loading,setLoading] = useState(false)
     const [disableView,setdisableView] = useState(false)
     const [disableImage,setDisableImages] = useState(true)
     const sellerId= route.params.sellerId
     const productId=route.params.productId
     const color=route.params.info.split(':')[1]
    
     console.log(color)
     const [uri,setUri] = useState('')
     const [image,setImage] = useState({})
     const [file,setValues] = useState({
       photo1:{},
       photo2:{},
       photo3:{},
       photo4:{},
       photo5:{},
       photo6:{},
      
         
     })
    // const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
 
     const chooseFile =(type,name)=>{
        let options = {
          mediaType: type,
          maxWidth: 300,
          maxHeight: 550,
          quality: 1,
        };
        launchImageLibrary(options,(response)=>{
          console.log(response);
    
          if(response.didCancel){
            alert('User Cancelled camerapicker')
            return
          }else if(response.errorCode== 'camera_unavailable'){
            alert('Camera not available on this device')
            return
          }else if(response.errorCode=='permission'){
            alert('permission not satisfied')
            return
          }else if(response.errorCode=='others'){
            alert(response.errorMessage)
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
                  //alert( assets.uri)
                  if(name==='Photo1'){
                    setValues(prev=>({
                      ...prev,
                      photo1:assets
                    }))
                  }else if(name==='Photo2'){
                    setValues(prev=>({
                      ...prev,
                      photo2:assets
                    }))
                 
                  }else if(name==='Photo3'){
                    setValues(prev=>({
                      ...prev,
                      photo3:assets
                    }))
                 
                  }else if(name==='Photo4'){
                    setValues(prev=>({
                      ...prev,
                      photo4:assets
                    }))
                 
                  }else if(name==='Photo5'){
                    setValues(prev=>({
                      ...prev,
                      photo5:assets
                    }))
                 
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
      const uploadImages =()=>{
           if(Object.keys(file.photo1).length===0){
             if(Platform.OS!=='ios'){
              ToastAndroid.showWithGravity(
                'Atleast upload one sub image',
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
             
             }
             else{
               alert('atleast upload one sub image')
             }
             return

           }
        const fileToUpload = [];
        Object.entries(file).forEach(([key, value]) => {
          console.log(`${key}: ${value} : ${Object.entries(value).length}`)
             if(Object.entries(value).length!==0){
                  fileToUpload.push(value)
             }
          
              
      });
        const data = new FormData();
         
        for(let photo in fileToUpload){
          data.append("name", "Techup media");
          data.append("fileToUpload[]", {
            name:  fileToUpload[photo].fileName,
            type:  fileToUpload[photo].type,
            uri:   fileToUpload[photo].uri,
              
          });
        }
        console.log(data)
        setLoading(true)
        fetch(BASE_URL+'ProductImages/?sellerId='+sellerId+'&productId='+productId+'&variations='+color, {
          method: 'POST',
       
          headers: {
              'Content-Type': 'multipart/form-data; ',
            },
           body:data
      })
      .then((response) =>response.json())
      .then((responseJson) => {
        setLoading(false)
        console.log(responseJson)
           if(responseJson.isUploaded===true)
         { console.log(responseJson)
           alert(responseJson.message)
           navigation.navigate('ManageProducts')


         }else if(responseJson.isUploaded===false){
           setLoading(false)
           if(Platform.OS!=='ios'){
            ToastAndroid.showWithGravity(
              responseJson.message,
              ToastAndroid.SHORT, //can be SHORT, LONG
              ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
            );
          
        }else{
          alert(responseJson.message)
        }
         

         }
                 //Showing response message coming from server 
              //                 console.log(responseJson);
              })
              
               .catch((error) => {
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
               
                //display error message
                   console.warn(error);
               });
  
        
      }
      const uploadMainImage =()=>{
        console.log('mainImage')
        if(Object.keys(image).length===0){
          if(Platform.OS!=='ios'){
            ToastAndroid.showWithGravity(
              ' Select Image',
              ToastAndroid.SHORT, //can be SHORT, LONG
              ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
            );
           
          }else{
            alert('Upload Main Image')
          }
           return

         }
         const data = new FormData();
         data.append("name", "Techup media");
         data.append("fileToUpload", {
           name:  image.fileName,
           type:  image.type,
           uri:   image.uri,
             
         });
         setLoading(true)
         fetch(BASE_URL+'ProductMainImage/?sellerId='+sellerId+'&productId='+productId, {
          method: 'POST',
       
          headers: {
              'Content-Type': 'multipart/form-data; ',
            },
           body:data
      })
      .then((response) =>response.json())
      .then((responseJson) => {
        setLoading(false)
           if(responseJson.isUploaded===true)
         { 
           alert(responseJson.message)
             setDisableImages(true)


          }else if(responseJson.isUploaded===false){
            setLoading(false)
            alert(responseJson.message)
          }
                 //Showing response message coming from server 
              //  navigation.navigate('ManageProducts')
               console.log(responseJson);
              })
              
               .catch((error) => {
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
                
                //display error message
                   console.warn(error);
               });
  


      


      }
    






    return(
      
        <View style={styles.main}>
         {!disableImage ?   <View> 
          <Loader loading={loading}/>
            
                 <TouchableOpacity onPress={()=>chooseFile('photo','image')}>
           <View style={{...styles.ImageContainer,width:'90%'}} >
             {disableView ? <Image style={{height:130,resizeMode:'cover',width:'80%'}}  source={{uri:image.uri}}/>
             :
             <View style={{alignItems:'center'}}>
             <Icon
                 name='image'
                 size={25}
                 color={colors.colors.primary}
               />
               <Text>Select Main Image</Text>    
                          </View>
             }
               
           </View>
           </TouchableOpacity>
           </View>
              : (
                
              <View style={{width:DIMENS.common.WINDOW_WIDTH}}>
                <ScrollView>            
                 <View style={{flexDirection:'row'}}>             
              <TouchableOpacity onPress={()=>chooseFile('photo','Photo1')}>
        <View style={styles.ImageContainer} >
          {disableView ? <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file.photo1.uri}}/>
          :<Icon
              name='image'
              size={25}
              color={colors.colors.primary}
            />
          }
            
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>chooseFile('photo','Photo2')}>
        <View style={styles.ImageContainer} >
          {disableView ? <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file.photo2.uri}}/>
          :<Icon
              name='image'
              size={25}
              color={colors.colors.primary}
            />
          }
            
        </View>
        </TouchableOpacity>
        </View>
           <View style={{flexDirection:'row'}}>             
           <TouchableOpacity onPress={()=>chooseFile('photo','Photo3')}>
     <View style={styles.ImageContainer} >
       {disableView ? <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file.photo3.uri}}/>
       :<Icon
           name='image'
           size={25}
           color={colors.colors.primary}
         />
       }
         
     </View>
     </TouchableOpacity>
     <TouchableOpacity onPress={()=>chooseFile('photo','Photo4')}>
     <View style={styles.ImageContainer} >
       {disableView ? <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file.photo4.uri}}/>
       :<Icon
           name='image'
           size={25}
           color={colors.colors.primary}
         />
       }
         
     </View>
     </TouchableOpacity>
     </View>
     <View style={{flexDirection:'row'}}>             
                 <TouchableOpacity onPress={()=>chooseFile('photo','Photo5')}>
           <View style={styles.ImageContainer} >
             {disableView ? <Image style={{height:130,resizeMode:'cover',width:130}}  source={{uri:file.photo5.uri}}/>
             :<Icon
                 name='image'
                 size={25}
                 color={colors.colors.primary}
               />
             }
               
           </View>
           </TouchableOpacity>
           </View>
           </ScrollView>
 

     </View>
  
              )
}
          
        
  
           <View style={styles.buttonContainer}>
            <Icon
              name={(disableImage)?'check':'arrow-forward'}
              size={35}
              onPress={(disableImage)  ? uploadImages : uploadMainImage}
              color={colors.colors.white}

            />
        </View>
      
        
        </View>
      
    )


}
export default variationImages;
const styles=StyleSheet.create({
    main:{
        
       flex:1,
        width:DIMENS.common.WINDOW_WIDTH,
        //height:DIMENS.common.WINDOW_HEIGHT,
        padding:10,
        marginTop:10,
        
        bottom:20,
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
       

      
   }
})
