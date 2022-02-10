import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Image,
  Keyboard,
  ToastAndroid,
  KeyboardAvoidingView
} from 'react-native';
import {InputText, Text, Icon, PickerModal, Loader} from '../../common';
import {DIMENS, SPACING, TYPOGRAPHY} from '../../constants';
import {colors} from '../../theme';
import DropDownPicker from 'react-native-dropdown-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {encode} from 'base-64';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from '../../common/context/userContext';
import {isNonEmptyString} from '../../utils';
import Country from '../../constants/data/country.json';
import {BASE_URL} from '../../constants/matcher';
import HandmadePercent from '../../common/picker/HandmadePercent';
import { RichEditor, RichToolbar,actions,defaultActions } from 'react-native-pell-rich-editor';
const height=70
const addNewProducts = ({navigation}) => {
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [search,setSearch]=useState('')

 
  const RichText = useRef(); //reference to the RichEditor component
  const highlightsref = useRef(); //reference to the RichEditor component
  const strikethrough = require("../../assets/images/logoWhite.png"); //icon for strikethrough
  const video = require("../../assets/images/logo_animated.gif"); //icon for Addvideo
  const [article, setArticle] = useState("");
  const [disableView, setdiableView] = useState(false);
  const input =useRef()
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  let actionSheet = useRef();
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [subCategoryDisable, setsubCategoryDisable] = useState(true);
  const [form, setValues] = useState({
    productName: '',
    incorrectProductName: false,
    price: '',
    incorrectPrice: false,
    taxes: '',
    incorrectTaxes: false,
    width: '',
    incorrectwidth: false,
    height: '',
    incorrectheight: false,
    length: '',
    incorrectLength: false,
    description: '',
    incorrectDescription: false,
    weight: '',
    incorrectweight: false,
    stock: '',
    incorrectStock: false,
    countryId: '',
    stateId: '',
    dcountryId: '',
    dstateId: '',
    countryName: '--Country--',
    stateName: '--State--',
    dcountryName: '--Delivery from Country--',
    dstateName: '--Delivery from State--',
    isSelected: false,
    taxIncluded: false,
    deliveryIncluded: false,
    discount: '',
    incorrectDiscount: false,
    highlights: '',
    incorrectHightlights: false,
    handmadePercent: 'Handmade %',
    isGITagged: false,
    incorrectCategory: false,
    incorrectSubCategory: false,

  });
  const [modalVisible2, setModalVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [sku, setsku] = useState('');
  const [data, setData] = useState([]);
  const [textValue, setTextValue] = useState('Select Category');
  const [subCategory, setSubCategory] = useState('Select sub Category');

  const [disable, setdisable] = useState(false);
  const [disableS, setdisableS] = useState(true);
  const [disableSO, setdisableSO] = useState(true);

  const [uri, setUri] = useState('');
  //  const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
  useEffect(() => {
    fetch(BASE_URL + 'SKU', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Showing response message coming from server
        console.log(responseJson.status);
        setsku(responseJson.status);
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
        //display error message
        console.warn(error);
      });
  }, [sku]);
  const checkField = (fieldKey, fieldErrorKey, fieldValidater) => {
    console.log('blur')
    if (!fieldValidater(form[fieldKey])) {
      setValues(prevState => ({
        ...prevState,
        [fieldErrorKey]: true,
      }));
      return false;
    }
    return true;
  };
  const categoryList = () => {
    setModalVisible(true);
    fetch(BASE_URL + 'Categories/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Showing response message coming from server
        console.log(responseJson);
        setItems(responseJson);
        setFilteredDataSource(responseJson)
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
        //display error message
        console.warn(error);
      });
      
  };
  const countryList = () => {
    setModalVisible(true);
    setItems(Country);
    setFilteredDataSource(Country)
  };
  const deliveryCountryList = () => {
    setModalVisible2(true);
    setData(Country);
    setFilteredDataSource(Country)
  };
  const stateList = () => {
    let id = '';
    if (form.countryId === '') {
      ToastAndroid.showWithGravity(
        'Please Select Country of Origin first',
        ToastAndroid.SHORT, //can be SHORT, LONG
        ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
      );
      return;
    }
    setModalVisible(true);
    // setLoading(true)
    fetch(BASE_URL + 'State?country=' + form.countryId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setItems(responseJson);
        setFilteredDataSource(responseJson)
        //setLoading(false)
        //Showing response message coming from server
        console.log(responseJson);
      })
      .catch(error => {
        //setLoading(false)
        //display error message
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );

        console.warn(error);
      });
  };
  const deliverystateList = () => {
    let id = '';
    if (form.dcountryId === '') {
      ToastAndroid.showWithGravity(
        'Please Select Delivery from Country first',
        ToastAndroid.SHORT, //can be SHORT, LONG
        ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
      );
      return;
    }
    setModalVisible2(true);

    // setLoading(true)
    fetch(BASE_URL + 'State?country=' + form.dcountryId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setData(responseJson);
        setFilteredDataSource(responseJson)
        //setLoading(false)
        //Showing response message coming from server
        console.log(responseJson);
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );

        //setLoading(false)
        //display error message
        console.warn(error);
      });
  };
  const subCategoryList = () => {
    setModalVisible(true);
    fetch(BASE_URL + 'SubCategories?category=' + categoryId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        //Showing response message coming from server
        console.log(responseJson);
        setItems(responseJson);
        setFilteredDataSource(responseJson)
      })
      .catch(error => {
        ToastAndroid.showWithGravity(
          error.toString(),
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );

        //display error message
        console.warn(error);
      });
  };
  const onChange = item => {
    setModalVisible(false);
    if (item.categoryName) {
      setTextValue(item.categoryName);
      setCategoryId(item.id);
      setsubCategoryDisable(false);
      setItems([])
    } else if (item.subCategoryName) {
      setSubCategory(item.subCategoryName);
      setSubCategoryId(item.id);
      setItems([])
    } else if (item.countryName) {
      // console.log(item)

      setValues(prev => ({
        ...prev,
        countryName: item.countryName,
        countryId: item.id,
      }));

      setdisable(false);
      setdisableSO(false);
      setItems([])
    } else {
      console.log(item);

      setValues(prev => ({
        ...prev,
        stateName: item.stateName,
        stateId: item.id,
      }));
      setItems([])
      // setdisableSO(true)
      //setdisableS(false)
    }

    console.log(item);
  };
  const onChangeC = item => {
    setModalVisible2(false);
    if (item.countryName) {
      setValues(prev => ({
        ...prev,
        dcountryName: item.countryName,
        dcountryId: item.id,
      }));
      setdisableS(false);
      setData([])
    } else if (item.stateName) {
      setValues(prev => ({
        ...prev,
        dstateName: item.stateName,
        dstateId: item.id,
        // dcountryId:''
      }));
      setData([])
    }
  };
  const checkvalidation = () => {
    let isValid = true;
    isValid =
      isValid &&
      checkField('productName', 'incorrectProductName', isNonEmptyString);
    isValid =
      isValid && checkField('price', 'incorrectPrice', isNonEmptyString);
    isValid =
      isValid && checkField('discount', 'incorrectDiscount', isNonEmptyString);
    isValid =
      isValid &&
      checkField('highlights', 'incorrectHightlights', isNonEmptyString);
    isValid =
      isValid && checkField('width', 'incorrectwidth', isNonEmptyString);
    isValid =
      isValid && checkField('height', 'incorrectheight', isNonEmptyString);
    isValid =
      isValid && checkField('length', 'incorrectLength', isNonEmptyString);
    isValid =
      isValid &&
      checkField('description', 'incorrectDescription', isNonEmptyString);
    isValid =
      isValid && checkField('weight', 'incorrectweight', isNonEmptyString);
    isValid =
      isValid && checkField('stock', 'incorrectStock', isNonEmptyString);
    if (!form.taxIncluded) {
      isValid =
        isValid && checkField('taxes', 'incorrectTaxes', isNonEmptyString);
    }

    return isValid;
  };
  const addProduct = () => {
    Keyboard.dismiss();
    if (!checkvalidation()) {
      return;
    }
    if (
      form.countryName === '--Country--' ||
      form.stateName === '--State--'||
      form.dcountryName === '--Delivery from Country--' ||
      form.dstateName === '---Delivery from State--' ||
      subCategory === 'Select sub Category' ||
      textValue === 'Select Category' ||
      form.handmadePercent === 'Handmade %'
    ) {
      if (Platform.OS !== 'ios') {
        ToastAndroid.showWithGravity(
          'All fields are mandatory',
          ToastAndroid.SHORT, //can be SHORT, LONG
          ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
        );
      } else {
        alert('All fields are mandatory');
      }
      return;
    }
    //    if( !form.description.match(/^[0-9a-z]+$/) || !form.highlights.match(/^[0-9a-z]+$/)){
    //      ToastAndroid.showWithGravity(
    //       'Invalid Characters Entered',
    //       ToastAndroid.SHORT, //can be SHORT, LONG
    //         ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
    //      );
    //          return
    //  }
    setLoading(true);
    AsyncStorage.getAllKeys().then(keyArray => {
      AsyncStorage.multiGet(keyArray).then(keyValArray => {
        let myStorage = {};
        for (let keyVal of keyValArray) {
          myStorage[keyVal[0]] = keyVal[1];
        }
        fetch(BASE_URL + 'SellerProducts/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization:
              'Basic ' + encode(myStorage.email + ':' + myStorage.password),
          },
          body: JSON.stringify({
            name: form.productName,
            price: form.price,
            sellerId: myStorage.sellerId,
            discount: form.discount.toString(),
            subCategoryId: subCategoryId.toString(),
            productLength: form.length,
            productWidth: form.width,
            productHeightThickness: form.height,
            weight: form.weight,
            state_id: form.stateId,
            country_id: form.countryId,
            SKU: sku.toString(),
            stockAvailability: form.stock,
            description: form.description,
            highlights: form.highlights.toString(),
            country_from_id: form.dcountryId,
            state_from_id: form.dstateId,
            taxIncluded: form.taxIncluded,
            deliveryIncluded: form.deliveryIncluded,
            IsGITagged: form.isGITagged,
            HandmadePercent: form.handmadePercent,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            //Showing response message coming from server
            console.log(responseJson);
            setLoading(false);
            if (responseJson.status) {
              if (Platform.OS !== 'ios') {
                ToastAndroid.showWithGravity(
                  responseJson.status,
                  ToastAndroid.SHORT, //can be SHORT, LONG
                  ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                );
              } else {
                alert(responseJson.status);
              }

              navigation.navigate('Add product Images', {
                seller: responseJson.data.sellerId,
                product: responseJson.data.id,
              });
            } else {
              setLoading(false);
              Object.entries(responseJson.ModelState).forEach(
                ([key, value]) => {
                  console.log(`${key}: ${value}`);
                  if (Platform.OS !== 'ios') {
                    ToastAndroid.showWithGravity(
                      value.toString() + ' ' + 'at' + ' ' + key,
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );
                  } else {
                    alert(value.toString() + ' ' + 'at' + ' ' + key);
                  }
                },
              );

              //  ToastAndroid.showWithGravity(
              //         responseJson.Message,
              //       ToastAndroid.SHORT, //can be SHORT, LONG
              //      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              //   );
            }
          })
          .catch(error => {
            //display error message
            setLoading(false);
            if (Platform.OS !== 'ios') {
              ToastAndroid.showWithGravity(
                error.toString(),
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );
            } else {
              alert(error.toString());
            }

            console.warn(error);
          });
      });
    });

    //   AsyncStorage.getItem('sellerId').then((id) =>
    // {

    //})
  };
  const showActionSheet = () => {
    //To show the Bottom ActionSheet
    actionSheet.current.show();
  };
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
          if (item.categoryName){
            itemData = item.categoryName
            ? item.categoryName.toUpperCase()
            : ''.toUpperCase();
           textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
         
          }
          else if (item.subCategoryName){
            itemData = item.subCategoryName
            ? item.subCategoryName.toUpperCase()
            : ''.toUpperCase();
           textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
         

          }
        else if(item.countryName){
  
           itemData = item.countryName
            ? item.countryName.toUpperCase()
            : ''.toUpperCase();
           textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
         }else{
           itemData = item.stateName
          ? item.stateName.toUpperCase()
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
  const searchFilterFunctionC = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = data.filter(
        function (item) {
          let itemData=''
          let textData=''
         
         
         if(item.countryName){
  
           itemData = item.countryName
            ? item.countryName.toUpperCase()
            : ''.toUpperCase();
           textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
         }else{
           itemData = item.stateName
          ? item.stateName.toUpperCase()
          : ''.toUpperCase();
        textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
  
         }
      });
      setData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setData(filteredDataSource);
      setSearch(text);
    }
  };
  
  
  function editorInitializedCallback() {
    RichText.current?.registerToolbar(function (items) {
      // items contain all the actions that are currently active
      console.log(
        "Toolbar click, selected items (insert end callback):",
        items
      );
    });
  }

  // Callback after height change
  function handleHeightChange(height) {
    console.log("editor height change:", height);
    height=70
  }

  function onPressAddImage() {
    // you can easily add images from your gallery
    RichText.current?.insertImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
    );
  }

  function insertVideo() {
    // you can easily add videos from your gallery
    RichText.current?.insertVideo(
      "https://mdn.github.io/learning-area/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4"
    );
  }
  return (
    <View style={styles.main}>
      
    <KeyboardAvoidingView  enabled
     behavior={Platform.OS === "ios" ? "padding" : null}
     keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >  
    <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    style={{
     backgroundColor:colors.colors.white
     
  }}
    // contentContainerStyle={{ flexGrow: 1 }}
    >
        <Loader loading={loading} />
        <PickerModal
          visible={modalVisible}
          onSelect={item => onChange(item)}
          item={items}
          onClose={() => { 
            
            setModalVisible(false)}
           }
           searchFilterFunction={(text)=>searchFilterFunction(text)}
           searchText={search}


        />
        <PickerModal
          visible={modalVisible2}
          onSelect={item => onChangeC(item)}
          item={data}
          onClose={() => setModalVisible2(false)}
          searchFilterFunction={(text)=>searchFilterFunctionC(text)}
          searchText={search}

        />
      
      <View style={{
        flex:1,
        paddingBottom:40
       
    }
    }>
    
       
        <View style={{...styles.container, flexDirection: 'row', top: 12}}>
          <TouchableOpacity onPress={categoryList} style={{width: '50%'}}
          onBlur={() =>
           console.warn('hggghg')
          }
          >
            <View
             ref={input}
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{textValue}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
            {form.incorrectCategory?<Text>hjhj</Text>:null}
           
          </TouchableOpacity>

          <TouchableOpacity
            onPress={subCategoryList}
            disabled={subCategoryDisable}
            style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{subCategory}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
          </TouchableOpacity>

          {/* <View style={styles.divider}/>*/}
        </View>

        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
              label='Product Name'
             labelStyle={''}
            autoCorrect={false}
          //  placeholder={'Product Name'}
            placeholderTextColor={colors.colors.gray400}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                productName: value.trim(),
                incorrectProductName: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            errorMessage={form.incorrectProductName ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField(
                'productName',
                'incorrectProductName',
                isNonEmptyString,
              )
            }
            // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
          />
          <InputText
            value={sku}
           // placeholder={'SKU'}
           // placeholderTextColor={colors.colors.gray400}
             label='SKU'
             labelStyle={''}
             autoCorrect={false}
            containerStyle={{}}
            underlineColorAndroid={colors.colors.transparent}
            containerStyle={styles.containerStyle}
            disabled={true}
            //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
          />
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Price($)'
             labelStyle={''}
         //    placeholder={'Price($)'}
          //  placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={{}}
            keyboardType="number-pad"
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                price: value.trim(),
                incorrectPrice: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectPrice ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('price', 'incorrectPrice', isNonEmptyString)
            }
          />
          <InputText
            value={form.taxIncluded ? '0' : form.taxes}
          //  placeholder={'Taxes'}
           // placeholderTextColor={colors.colors.gray400}
             label='Taxes'
             labelStyle={''}
            autoCorrect={false}
            containerStyle={{}}
            disabled={form.taxIncluded}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                taxes: value.trim(),
                incorrectTaxes: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectTaxes ? 'MandatoryField' : ''}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            keyboardType="number-pad"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            top: 12,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (form.deliveryIncluded) {
                  setValues(prevState => ({
                    ...prevState,

                    deliveryIncluded: false,
                  }));
                } else {
                  setValues(prevState => ({
                    ...prevState,

                    deliveryIncluded: true,
                  }));
                }
              }}>
              <Icon
                name={
                  form.deliveryIncluded
                    ? 'check-box'
                    : 'check-box-outline-blank'
                }
                size={22}
                color={colors.colors.primary}
              />
            </TouchableOpacity>
            <Text type="body">Inclusive of Delivery</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                if (form.taxIncluded) {
                  setValues(prevState => ({
                    ...prevState,
                    taxIncluded: false,
                  }));
                } else {
                  setValues(prevState => ({
                    ...prevState,

                    taxIncluded: true,
                  }));
                }
              }}>
              <Icon
                name={
                  form.taxIncluded ? 'check-box' : 'check-box-outline-blank'
                }
                size={22}
                color={colors.colors.primary}
              />
            </TouchableOpacity>
            <Text type="body">Inclusive of taxes</Text>
          </View>
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Width(InCm)'
             labelStyle={''}
         //    placeholder={'Width(InCm)'}
          //  placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            keyboardType="number-pad"
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                width: value.trim(),
                incorrectwidth: false,
              }))
            }
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            errorMessage={form.incorrectwidth ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('width', 'incorrectwidth', isNonEmptyString)
            }
            underlineColorAndroid={colors.colors.transparent}
          />
          <InputText
             label='Height(In Cm)'
             labelStyle={''}
         //    placeholder={'Height(In Cm)'}
          //  placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            //containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                height: value.trim(),
                incorrectheight: false,
              }))
            }
            errorMessage={form.incorrectheight ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('height', 'incorrectheight', isNonEmptyString)
            }
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
        </View>

        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Length(In Cm)'
             labelStyle={''}
          //   placeholder={'Length(In Cm)'}
           // placeholderTextColor={colors.colors.gray400}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                length: value.trim(),
                incorrectLength: false,
              }))
            }
            errorMessage={form.incorrectLength ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('length', 'incorrectLength', isNonEmptyString)
            }
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
          <InputText
             label='Discount(%)'
             labelStyle={''}
         //    placeholder={'Discount(%)'}
          //  placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                discount: value.trim(),
                incorrectDiscount: false,
              }))
            }
            errorMessage={form.incorrectDiscount ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('discount', 'incorrectDiscount', isNonEmptyString)
            }
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
        </View>
        <View style={{...styles.container, flexDirection: 'row', height: 60}}>
          <InputText
             label='Stock'
             labelStyle={''}
     //        placeholder={'Stock'}
      //      placeholderTextColor={colors.colors.gray400}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}
            containerStyle={styles.containerStyle}
            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              stock:value.trim(),
              incorrectStock:false
        })
        )}
        errorMessage={form.incorrectStock?'MandatoryField':""}
        onBlur={()=>checkField('stock','incorrectStock',isNonEmptyString)}
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
          <InputText
             label='Weight'
             labelStyle={''}
       //      placeholder={'Weight'}
        //    placeholderTextColor={colors.colors.gray400}
            autoCorrect={false}
            containerStyle={styles.containerStyle}
            //  containerStyle={Platform.OS!=='android'? {...styles.defaultMargin,marginRight:6}:null}

            onChangeText={value=>setValues(prevState=>({
              ...prevState,
              weight:value.trim(),
              incorrectweight:false
        })
        )}
          errorMessage={form.incorrectweight?'MandatoryField':""}
          onBlur={()=>checkField('weight','incorrectweight',isNonEmptyString)}
       
            keyboardType="number-pad"
            underlineColorAndroid={colors.colors.transparent}
          />
        </View>
     
        <View style={{...styles.container,borderWidth:1,borderColor:colors.colors.primaryLight,marginTop:4,borderRadius:4}}>
     
        <RichEditor
        onBlur={() =>
          checkField(
            'description',
            'incorrectDescription',
            isNonEmptyString,
          )}
        disabled={false}
       containerStyle={styles.rich}
        ref={RichText}
       // style={styles.containerStyle}
        placeholder={"Write Description here"}
        onChange={value =>
          setValues(prevState => ({
            ...prevState,
            description: value.trim(),
            incorrectDescription: false,
          }))}
        editorInitializedCallback={editorInitializedCallback}
        onHeightChange={handleHeightChange}
      />
       <RichToolbar
        style={[styles.richBar]}
        editor={RichText}
        disabled={false}
        iconTint={colors.colors.primary}
        selectedIconTint={colors.colors.black}
        disabledIconTint={colors.colors.disabled}
      //  onPressAddImage={onPressAddImage}
        iconSize={20}
        actions={[
          "insertVideo",
          ...defaultActions,
          actions.setStrikethrough,
          actions.heading1,
        ]}
        // map icons for self made actions
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
          ),
          [actions.setStrikethrough]: strikethrough,
         // ["insertVideo"]: video,
        }}
        //insertVideo={insertVideo}
      />
     {form.incorrectDescription && (
         <Text type='body' style={styles.error}>{'Mandatory field'}</Text>
      )}
     
      {/*
         <InputText
            label='Description(min 30chars)'
            labelStyle={''}
         //   placeholder={'Description(min 30chars)'}
          //  placeholderTextColor={colors.colors.gray400}
            containerStyle={{...styles.containerStyle,height:70}}
            // containerStyle={Platform.OS!=='android' ? {...styles.defaultMargin}:{minWidth:'100%',alignSelf:'flex-start'}}
            multiline={true}
            numberOfLines={4}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                description: value.trim(),
                incorrectDescription: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            errorMessage={form.incorrectDescription ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField(
                'description',
                'incorrectDescription',
                isNonEmptyString,
              )
            }
          />
      */} 
        </View>
        <View style={{...styles.container,borderWidth:1,borderColor:colors.colors.primaryLight,marginTop:4,borderRadius: 4,}}>
        <RichEditor
      
          onBlur={() =>
            checkField('highlights', 'incorrectHightlights', isNonEmptyString)
          }
        disabled={false}
       containerStyle={styles.rich}
        ref={highlightsref}
       // style={styles.containerStyle}
        placeholder={"Write Highlights here"}
        onChange={value =>
          setValues(prevState => ({
            ...prevState,
            highlights: value.trim(),
            incorrectHightlights: false,
          }))
        }
        editorInitializedCallback={editorInitializedCallback}
        onHeightChange={handleHeightChange}
      />
       <RichToolbar
        style={[styles.richBar]}
        editor={highlightsref}
        disabled={false}
        iconTint={colors.colors.primary}
        selectedIconTint={colors.colors.black}
        disabledIconTint={colors.colors.disabled}
       // onPressAddImage={onPressAddImage}
        iconSize={20}
        actions={[
          "insertVideo",
          ...defaultActions,
          actions.setStrikethrough,
          actions.heading1,
        ]}
        // map icons for self made actions
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={[styles.tib, { color: tintColor }]}>H1</Text>
          ),
          [actions.setStrikethrough]: strikethrough,
         // ["insertVideo"]: video,
        }}
       // insertVideo={insertVideo}
      />
     {form.incorrectHightlights && (
         <Text type='body' style={styles.error}>{'Mandatory field'}</Text>
      )}
     {/*
      <InputText
              label='Hightlights(min 30chars)'
         //   placeholder={'Hightlights(min 30chars)'}
          //  placeholderTextColor={colors.colors.gray400}
            labelStyle={''}
            // containerStyle={Platform.OS!=='android'? {...styles.defaultMargin}:{minWidth:'100%',alignSelf:'flex-start'}}
            containerStyle={{...styles.containerStyle,height:70}}
            multiline={true}
            
            numberOfLines={4}
            onChangeText={value =>
              setValues(prevState => ({
                ...prevState,
                highlights: value.trim(),
                incorrectHightlights: false,
              }))
            }
            underlineColorAndroid={colors.colors.transparent}
            errorMessage={form.incorrectHightlights ? 'MandatoryField' : ''}
            onBlur={() =>
              checkField('highlights', 'incorrectHightlights', isNonEmptyString)
            }
          />
     */}
         
        </View>
        <View style={{...styles.container, flexDirection: 'row',marginTop:16}}>
          <TouchableOpacity onPress={countryList}style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
             <Text>{form.countryName}</Text>
             <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />

            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={stateList} disabled={disableSO} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.stateName}</Text>
              <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
             </View>
             </TouchableOpacity>
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>
        <View style={{...styles.container, flexDirection: 'row'}}>
          <TouchableOpacity onPress={deliveryCountryList} disabled={disable} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
            <Text>{form.dcountryName}</Text>
 <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />

            </View>
          </TouchableOpacity>
          <TouchableOpacity  onPress={deliverystateList} disabled={disableS} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
            <Text>{form.dstateName}</Text>
 <Icon name='arrow-drop-down' size={25} color={colors.colors.gray400} />
 </View>
             </TouchableOpacity>
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>

       
        

        <View style={{...styles.container, flexDirection: 'row'}}>
          <TouchableOpacity onPress={showActionSheet} style={{width: '50%'}}>
            <View
              style={{
                ...styles.containerStyle,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
              <Text>{form.handmadePercent}</Text>
              <Icon
                name="arrow-drop-down"
                size={25}
                color={colors.colors.gray400}
              />
            </View>
          </TouchableOpacity>
          
         <TouchableOpacity onPress={()=>{
  if(form.isGITagged){
    setValues(prevState=>({
      ...prevState,
      isGITagged:false     
    }))
  }else{
    setValues(prevState=>({
      ...prevState,
       
        isGITagged:true     
    }))
  
  }
}}
style={{alignItems:'center',justifyContent:'center'}}
>
   <View
              style={{
               // ...styles.containerStyle,
                flexDirection: 'row',
                //justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 4,
              }}>
<Icon
  name={ form.isGITagged? 'check-box' : 'check-box-outline-blank'}
  size={22}
  color={colors.colors.primary}
/>
<Text type='body'>Is GITagged</Text>
</View>
</TouchableOpacity>


          
        

         

         
          {/* <View style={styles.divider}/>*/}
        </View>

    
      </View>
  
    </ScrollView>
    </KeyboardAvoidingView>
    <HandmadePercent
          actionSheet={actionSheet}
          showActionSheet={showActionSheet}
          onClick={percent =>
            setValues(prevState => ({
              ...prevState,
              handmadePercent: percent,
            }))
          }
        />
    <View style={styles.buttonContainer}>
 <Icon
   name='arrow-forward'
   size={24}
   onPress={addProduct}
   color={colors.colors.white}

 />
</View>
  </View>
  );
};
export default addNewProducts;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: DIMENS.common.WINDOW_WIDTH,
    //height:DIMENS.common.WINDOW_HEIGHT,
   
    padding: 10,
    //top:0,
   // marginTop: 10,
    backgroundColor: colors.colors.white,
   
    //height:'100%'
   // marginBottom:40
   
  },
  headingText: {
    alignSelf: 'center',
  },
  container: {
    width: '100%',
    top: 24,
  },
  ImageContainer: {
    height: 120,
    margin: 10,
    borderRadius: 3,
    borderColor: colors.colors.white,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 60,
    width: 60,
    backgroundColor: colors.colors.primary,
    borderRadius: 60 / 2,
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 24,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 16,
  },
  defaultMargin: {
    marginTop: 0,
    borderBottomWidth: 1,
    height: 30,
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.colors.primary,
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
    zIndex:1
  },
  editor: {
  //  backgroundColor: "black",
   // borderColor: "black",
    borderWidth: 1,
  },
  rich: {
   // height:60,
    minHeight: height,
    flex: 1,
    borderWidth: 1,
    borderColor:colors.colors.primaryLight,
    borderRadius: 4,
    shadowColor: colors.colors.gray500,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1,
    shadowOpacity: 1.0,
    elevation:2
   
  },
  richBar: {
    height: 40,
    backgroundColor: "#F5FCFF",
    marginTop:30,
   
    
  },
  error: {
    color:colors.colors.error,
   
    alignSelf: 'flex-end',
    fontSize:10,
    
    paddingTop:2,
   
  
    
    

    
  },
  
 
});
