import React ,{useState,useEffect}from 'react'
import {View,StyleSheet,ScrollView,Platform, Keyboard,TouchableOpacity} from 'react-native'
import {Text,Icon, BankModal,InputText,PickerModal,Loader} from '../../../common'
import { DIMENS } from '../../../constants'
import {colors} from '../../../theme'
import {isNonEmptyString} from '../../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { BASE_URL } from '../../../constants/matcher'
import { encode } from 'base-64'
import Country from '../../../constants/data/country.json'
const ManageBankAccount =({navigation})=>{
  const [modalVisible,setModalVisible] = useState(false)
  const [countryModal,setCountryModal]= useState(false)
  const [items,setItems]=useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([]);
   
  const [loading,setLoading] = useState(false)
  const [bankacc,setBankAcc] =useState(false)
  const [search,setSearch]=useState('')
  
  const [form,setValues] = useState(
    {
      AccountNumber:'',
      incorrectAccountNumber:false,
      ConfirmAccountNumber:'',
      incorrectConfirmAccountNumber:false,
      BankName:'',
      incorrectBankName:false,
      BeneficiaryName:'',
      incorrectBeneficiaryName:false,
      IFSCCode:'',
      incorrectIfscCode:false,
      BranchCode:'',
      incorrectBranchCode:false,
      BranchName:'',
      incorrectBranchName:false,
      SwiftCode:'',
      incorrectSwiftCode:false,
      country:'Select Country',
      incorrectCountry:false,
      countryId:'',
      userId:''
    })
    useEffect(async()=>{
      setLoading(true)
     await AsyncStorage.getAllKeys().then((keyArray) => {
          AsyncStorage.multiGet(keyArray).then((keyValArray) => {
            let myStorage = {};
            for (let keyVal of keyValArray) {
              myStorage[keyVal[0]] = keyVal[1]
            }
            fetch(BASE_URL+'SellerBankAccount?sellerId='+myStorage.sellerId, {
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
                
                setLoading(false)
                if(responseJson.BankAccount!==null){
                    setBankAcc(true)

                    setValues(prev=>({
                        ...prev,
                        AccountNumber:responseJson.BankAccount.accountNumber,
                        ConfirmAccountNumber:responseJson.BankAccount.confirmAccountNumber,
                        BankName:responseJson.BankAccount.bankName,
                        BeneficiaryName:responseJson.BankAccount.beneficiaryName,
                        BranchCode:responseJson.BankAccount.branchCode,
                        BranchName:responseJson.BankAccount.branchName,
                        SwiftCode:responseJson.BankAccount.swiftCode,
                        IFSCCode:responseJson.BankAccount.ifsc,
                        countryId:responseJson.BankAccount.countryId,
                        userId:responseJson.BankAccount.id
                    }))
                }
               // setLoading(false)    
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
        
          })})
     

  },[bankacc])
const checkField=(fieldKey,fieldErrorKey,fieldValidater)=>{
    if(!fieldValidater(form[fieldKey])){
        setValues(prevState=>({
        ...prevState,
        [fieldErrorKey]:true
        }));
        return false;
    }
    return true;

}
  
  const bankModal=()=>{
    setModalVisible(true)
  }
  const checkvalidation=()=>{
    let isValid=true
     isValid=isValid  &&  checkField('AccountNumber','incorrectAccountNumber',isNonEmptyString)
     isValid=isValid  &&  checkField('ConfirmAccountNumber','incorrectConfirmAccountNumber',isNonEmptyString)
     isValid=isValid  &&  checkField('BankName','incorrectBankName',isNonEmptyString)
     isValid=isValid  &&  checkField('BeneficiaryName','incorrectBeneficiaryName',isNonEmptyString)
     isValid=isValid  &&  checkField('IFSCCode','incorrectIfscCode',isNonEmptyString)
     isValid=isValid  &&  checkField('BranchCode','incorrectBranchCode',isNonEmptyString)
     isValid=isValid  &&  checkField('BranchName','incorrectBranchName',isNonEmptyString)
     isValid=isValid  &&  checkField('SwiftCode','incorrectSwiftCode',isNonEmptyString)
      
     return isValid
    }
  const manageBankAccount=()=>{
    Keyboard.dismiss()
    if(!checkvalidation()){
      return
    }
    if(form.countryId==''){
      alert('select country')
      return
    }
    if(form.AccountNumber!==form.ConfirmAccountNumber){
      alert('account number and confirm Account number does not match')
      return
    }
    
    AsyncStorage.getAllKeys().then((keyArray) => {
      AsyncStorage.multiGet(keyArray).then((keyValArray) => {
        let myStorage = {};
        for (let keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1]
        }
        console.log(myStorage.sellerId)
        setLoading(true)
        fetch(BASE_URL+'SellerBankAccount?userId='+myStorage.sellerId, {
          method: 'POST',
          headers:  
           {   
               Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + encode(myStorage.email+':'+myStorage.password),
       },
           body:JSON.stringify(
            {
          
              "userId":myStorage.sellerId,
              "countryId": form.countryId,
              "ifsc": form.IFSCCode,
              "accountNumber": form.AccountNumber,
              "confirmAccountNumber":form.ConfirmAccountNumber,
              "bankName":form.BankName,
              "beneficiaryName":form.BeneficiaryName,
              "branchName":form.BranchName,
              "branchCode":form.BranchCode,
              "swiftCode":form.SwiftCode,
                  
           }
           ),
      })
      .then((response) =>response.json())
      .then((responseJson) => {
                 //Showing response message coming from server 
        console.log(responseJson); 
        setLoading(false)
        if(responseJson.ModelState){
          Object.entries(responseJson.ModelState).forEach(([key, value]) => {
            console.log(`${key}: ${value}`)
            if(Object.entries(value).length!==0){
              if(Platform.OS!=='ios'){
                ToastAndroid.showWithGravity(
                  value.toString()  + ' ' +   'at'  + ' ' +   key,
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
            }
              else{
                alert( value.toString()  + ' ' +   'at'  + ' ' +   key,
                )
                
              }
            }
           
        
        });
        // alert(responseJson.Message)
         //navigation.replace(NAVIGATION_TO_LOGIN_SCREEN)
         }
         else {
          alert(responseJson.Message)
         }    
        })
        .catch((error) => {
          setLoading(false)
        //display error message
        
            console.warn(error);
        });

})})


  }
  const countryList=()=>{
    setCountryModal(true)
    setItems(Country)
    setFilteredDataSource(Country)
    
   // setLoading(false) 
}
const onChange = (item)=>{
  console.log(item)       
  setCountryModal(false)
  if(item.countryName)
  {
    setValues(prev=>({
        ...prev,
        country:item.countryName,
        countryId:item.id
    }))
    

  
}
}
const searchFilterFunction = (text) => {
  // Check if searched text is not blank
  if (text) {
    // Inserted text is not blank
    // Filter the masterDataSource
    // Update FilteredDataSource
    const newData = items.filter(
      function (item) {
        let itemData=''
        let textData=''
       if(item.countryName){

         itemData = item.countryName
          ? item.countryName.toUpperCase()
          : ''.toUpperCase();
         textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
       }
    });
    setItems(newData);
    setSearch(text);
  } else {
    // Inserted text is blank
    // Update FilteredDataSource with masterDataSource
    setItems(filteredDataSource);
    setSearch(text);
  }
};

    return(
      <View style={styles.mainContainer}>
     
        <Loader loading={loading}/>
         {bankacc?
          
          <View style={styles.main}>
          <BankModal
          visible={modalVisible}
          onClose={()=>setModalVisible(false)}
          id={form.userId}

          />   
         
            <View style={styles.container}> 
            <Text type='subheading'>Benificiary name:</Text>
            <Text type='caption'>{form.BeneficiaryName} </Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>IFSC Code</Text>
            <Text type='caption'>{form.IFSCCode}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Account Number</Text>
            <Text type='caption'>{form.AccountNumber}</Text>
            </View> 
            <View style={styles.container}> 
            <Text type='subheading'>Bank Name</Text>
            <Text type='caption'>{form.BankName}</Text>
            </View> 
            <View style={styles.buttonContainer}>
            <Icon
              name='edit'
              size={35}
              color={colors.colors.white}
              onPress={bankModal}
  
            />
      </View>
      </View>
    
      : <View style={styles.main}>
        <ScrollView>
        <PickerModal
                 visible={countryModal}
                 onSelect={(item)=>onChange(item)}
                 item={items}
                 onClose={()=>setCountryModal(false)}
                 searchFilterFunction={(text)=>searchFilterFunction(text)}
                 searchText={search}

             />
         <View style={{flexDirection:'column',width:'100%'}}>
            <InputText
            main={{flex:0}}
            label='Account Number'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                  ...prevState,
                  AccountNumber:value.trim(),
                  incorrectAccountNumber:false
            })
            )}
            containerStyle={styles.containerStyle}
           // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            errorMessage={form.incorrectAccountNumber?'Required Field':''}
            onBlur={()=>checkField('AccountNumber','incorrectAccountNumber',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
             main={{flex:0}}
            label='Confirm Account Number'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                ConfirmAccountNumber:value.trim(),
                incorrectConfirmAccountNumber:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectConfirmAccountNumber?'Required Field':''}
            onBlur={()=>checkField('ConfirmAccountNumber','incorrectConfirmAccountNumber',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
             main={{flex:0}}
            label='Bank Name'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BankName:value.trim(),
                incorrectBankName:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectBankName?'Required Field':''}
            onBlur={()=>checkField('BankName','incorrectBankName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
            label='Beneficiary Name'
            main={{flex:0}}
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BeneficiaryName:value.trim(),
                incorrectBeneficiaryName:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectBeneficiaryName?'Required Field':''}
            onBlur={()=>checkField('BeneficiaryName','incorrectBeneficiaryName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <View style={{flexDirection:'row'}}>
            <InputText
            label='IFSC Code'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                IFSCCode:value.trim(),
                incorrectIfscCode:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectIfscCode?'Required Field':''}
            onBlur={()=>checkField('IFSCCode','incorrectIfscCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
            label='Branch Code'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BranchCode:value.trim(),
                incorrectBranchCode:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectBranchCode?'Required Field':''}
            onBlur={()=>checkField('BranchCode','incorrectBranchCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />

            </View>
            <View style={{flexDirection:'row'}}>
            <InputText
            label='Branch Name'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                BranchName:value.trim(),
                incorrectBranchName:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectBranchName?'Required Field':''}
            onBlur={()=>checkField('BranchName','incorrectBranchName',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />
            <InputText
            label='Swift Code'
            labelStyle={''}
            autoCorrect={false}
            onChangeText={value=>setValues(prevState=>({
                ...prevState,
                SwiftCode:value.trim(),
                incorrectSwiftCode:false
            })
            )}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectSwiftCode?'Required Field':''}
            onBlur={()=>checkField('SwiftCode','incorrectSwiftCode',isNonEmptyString)}
            underlineColorAndroid = {colors.colors.transparent}
            />

            </View>
            <View style={styles.containerStyle}>
               <TouchableOpacity onPress={countryList} >
               <View style={{flexDirection:'row',alignItems:'center',height:40,justifyContent:'space-between'}}>              
                   <Text>{form.country}</Text>
                   <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400}/>
                   </View>
                   </TouchableOpacity>
                 
             </View>
            
           
            </View>
          
            </ScrollView>
            <View style={styles.buttonContainer}>
            <Icon
              name='check'
              size={35}
              color={colors.colors.white}
              onPress={manageBankAccount}

            />
            </View>
            
        </View>
        }  
     
   
    </View>
    )
}
export default ManageBankAccount;
const styles =StyleSheet.create({
  main:{
  flex:1,
    padding:8,
    //height:DIMENS.common.WINDOW_HEIGHT,
  },
  mainContainer:{
    flex:1,
    padding:14,
    backgroundColor:colors.colors.white
  },
  container:{
    flexDirection:'row',
    margin:8,
    alignItems:'center',
    justifyContent:'space-between'
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
      right:20,
      elevation:10,
      alignItems:'center',
      justifyContent:'center',
      bottom:20,
       
    
      
    },
    containerStyle: {
      //flex:1,
      backgroundColor: colors.colors.white,
      height: 40,
      borderRadius: 4,
     // top:12,
      shadowColor: colors.colors.gray500,
      
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 1,
      shadowOpacity: 1.0,
      borderWidth:1,
      margin: 2,
      elevation:2,
      borderColor:colors.colors.primaryLight,
      position:'relative',
      zIndex:1,
      marginBottom:14,
      paddingLeft:4
    },
})