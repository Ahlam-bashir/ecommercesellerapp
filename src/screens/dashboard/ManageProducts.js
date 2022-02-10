import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import {colors} from '../../theme';
import {Icon, ImageComponent, Loader, Text} from '../../common/';
import {encode} from 'base-64';
import {loadSeller} from '../../utils/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {BASE_URL} from '../../constants/matcher';

const ManageProducts = ({navigation, route}) => {
  // console.log('route'+navigation.params)

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [arrayholder, setarrayholder] = useState([]);
  const [offset, setoffset] = useState(1);
  const [isListend, setIslistEnd] = useState(false);
  const [indicator, setindicator] = useState(false);
  const [sellerId,setSellerId]=useState(null)

  // const BASE_URL='https://ucm-ea-uat-app.azurewebsites.net/api/'
  const [refresh, setRefresh] = useState(false);
  const [productData, setProductData] = useState([]);
  const Viewproduct = id => {
    navigation.navigate('Product Details', {Id: id});
  };
  useEffect(() => {
    manage();

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('indicaor' + !indicator);
      console.log('is' + !isListend);
      console.log(offset);
      manage();
    });
    return unsubscribe;
  }, [refresh, navigation]);
  const manage = async() => {
    console.log('ind' + !indicator);
    console.log('list' + !isListend);
    if (!indicator && !isListend) {
      setindicator(true);
      setLoading(true);

    await  AsyncStorage.getAllKeys().then(keyArray => {
        AsyncStorage.multiGet(keyArray).then(keyValArray => {
          let myStorage = {};
          for (let keyVal of keyValArray) {
            myStorage[keyVal[0]] = keyVal[1];
          }
          setSellerId(myStorage.sellerId)
          console.log(myStorage.sellerId);
          fetch(
            BASE_URL +
              'SellerProducts/?sellerId=' +
              myStorage.sellerId +
              '&page=' +
              offset,
            {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization:
                  'Basic ' + encode(myStorage.email + ':' + myStorage.password),
              },
            },
          )
            .then(response => response.json())
            .then(responseJson => {
              //setLoading(false)
              console.log(responseJson);
              //Showing response message coming from server
            //  console.log(responseJson.length);
              if(responseJson==null){
                setLoading(false);
                setindicator(false);
                alert('no products found' )
                return

              }
              if (responseJson.length > 0) {
                setLoading(false);
                setindicator(false);
                setoffset(offset + 1);
                setProductData([...productData, ...responseJson]);
                setarrayholder([...productData, ...responseJson]);

                console.log(offset);
              } else {
                setLoading(false);
                setindicator(false);
                setIslistEnd(true);
                if (Platform.OS !== 'ios') {
                  ToastAndroid.showWithGravity(
                    'No Products found please add products',
                    ToastAndroid.SHORT, //can be SHORT, LONG
                    ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                  );
                } else {
                  alert('No Products Found');
                }
              }
            })
            .catch(error => {
              //setLoading(false)
              //display error message
              setindicator(false);
              setLoading(false);
              ToastAndroid.showWithGravity(
                error.toString(),
                ToastAndroid.SHORT, //can be SHORT, LONG
                ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
              );

              console.warn(error);
            });
          console.log('CURRENT STORAGE: ', myStorage.email);
        });
      });
    }
  };
  const deleteProduct = id => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'No',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            setLoading(true);
            AsyncStorage.getAllKeys().then(keyArray => {
              AsyncStorage.multiGet(keyArray).then(keyValArray => {
                let myStorage = {};
                for (let keyVal of keyValArray) {
                  myStorage[keyVal[0]] = keyVal[1];
                }
                console.log(myStorage.sellerId);
                fetch(BASE_URL + 'SellerProducts/' + id, {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization:
                      'Basic ' +
                      encode(myStorage.email + ':' + myStorage.password),
                  },
                })
                  .then(response => response.json())
                  .then(responseJson => {
                    setLoading(false);

                    alert(responseJson);
                    setProductData(
                      productData.slice().filter(item => item.id !== id),
                    );
                    //setRefresh(true)

                    //setLoading(false)
                    //Showing response message coming from server
                    console.log(responseJson);
                  })
                  .catch(error => {
                    //setLoading(false)
                    //display error message
                    setLoading(false);
                    ToastAndroid.showWithGravity(
                      error.toString(),
                      ToastAndroid.SHORT, //can be SHORT, LONG
                      ToastAndroid.BOTTOM, //can be TOP, BOTTON, CENTER
                    );

                    console.warn(error);
                  });
                console.log('CURRENT STORAGE: ', myStorage.email);
              }); 
            });
          },
        },
      ],
      {cancelable: false},
    );
  };
  const searchData = text => {
    console.log(text);
    if (text) {
      const newData = arrayholder.filter(item => {
        console.log(item);
        const itemData = item.name.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setProductData(newData);
      setSearchText(text);
    } else {
      setProductData(arrayholder);
      setSearchText(text);
    }
  };
  const renderFooter = () => {
    return (
      // Footer View with Loader
      <View style={styles.footer}>
        {indicator ? (
          <ActivityIndicator
            color={colors.colors.primary}
            style={{margin: 15}}
          />
        ) : null}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View>
        <Loader loading={loading} />
      </View>
      <View
        style={{
          width: '100%',
          height: 50,
          backgroundColor: colors.colors.gray200,
          bottom: 6,
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 8,
        }}>
        <Icon
          name="search"
          size={20}
          color={colors.colors.gray500}
          style={{padding: 6}}
        />
        <TextInput
          placeholder="Search here..."
          value={searchText}
          style={{borderWidth: 0, padding: 6, width: '100%'}}
          onChangeText={text => searchData(text)}
        />
      </View>

      <FlatList
        extraData={refresh}
        onEndReached={manage}
        onEndReachedThreshold={0.5}
        data={productData}
        keyExtractor={(id, index) => index.toString()}
        ListFooterComponent={renderFooter}
        renderItem={itemData => {
          return (
            <TouchableOpacity onPress={() => Viewproduct(itemData.item.id)}>
              <View
                style={{
                  width: '100%',
                 
                  backgroundColor: colors.colors.white,
                  marginBottom: 10,
                  paddingTop: 10,
                  paddingBottom:10
                }}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                
                <View style={{flexDirection: 'row', left: 10,alignItems:'center'}}>
                <View style={{height:100,width:100,padding:4}}>
                   <ImageComponent
                      sellerId={sellerId}
                      productId={itemData.item.id}
                   />
                   </View>
               
                  <View style={{flexDirection: 'column',padding:4}}>
                    <Text type="heading" style={styles.text}>
                      {itemData.item.SKU}
                    </Text>
                    <Text type="body" style={styles.text}>
                      Product name: {itemData.item.name}
                    </Text>
                    <View style={{flexDirection:'row'}}>
                    <Text type="body" style={styles.text}>
                      Price: ${itemData.item.price}  {' '} | 
                    </Text>
                    <Text type="body" style={styles.text}>
                    {'Stock: '}
                    {itemData.item.stockAvailability} Units
                  </Text>
                  </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                   
                   
                  }}>
                 
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Edit Product', {
                        id: itemData.item.id,
                      });
                    }}>
                    <View style={{...styles.iconContainer}}>
                      <Icon name="edit" size={24} color={colors.colors.primary}/>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteProduct(itemData.item.id)}>
                    <View
                      style={{
                        ...styles.iconContainer,
                       
                        margin: 10,
                      }}>
                      <Icon
                        name="delete"
                        size={24}
                        color={colors.colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
               
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Add Variation', {
                        id: itemData.item.id,
                        sku: itemData.item.SKU,
                      })
                    }>
                    <View style={styles.variantContainer}>
                      <Text
                        type="caption"
                        style={{...styles.btnText, fontSize: 10}}>
                        Add Single Variation
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Add Group Variation', {
                        id: itemData.item.id,
                        sku: itemData.item.SKU,
                      })
                    }>
                    <View style={styles.variantContainer}>
                      <Text
                        type="caption"
                        style={{...styles.btnText, fontSize: 10}}>
                        Add Group Variation
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.buttonContainer}>
        <Icon
          name="add"
          size={35}
          onPress={() => navigation.navigate('Add Products')}
          color={colors.colors.white}
        />
      </View>
    </View>
  );
};
ManageProducts.navigationOptions = navData => {
  return {
    headerTitle: 'ManageProducts',
  };
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  buttonContainer: {
    height: 60,
    width: 60,
    backgroundColor: colors.colors.primary,
    bottom: 24,
    borderRadius: 60 / 2,
    position: 'absolute',
    alignSelf: 'flex-end',
    right: 24,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
    padding: 4,
  },
  iconContainer: {
   // height: 40,
   // width: 40,
   // borderRadius: 40 / 2,
    //backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
  variantContainer: {
    height: 30,
    width: 80,
    backgroundColor: colors.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    borderRadius:6
  },
});
export default ManageProducts;
