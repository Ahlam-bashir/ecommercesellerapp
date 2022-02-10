import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer } from '@react-navigation/native'
import React, { useEffect ,useState} from 'react'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {
    NAVIGATION_TO_SPLASH_SCREEN,
    NAVIGATION_TO_LOGIN_SCREEN,
    NAVIGATION_TO_SIGNUP_SCREEN,
    NAVIGATION_TO_DASHBOARD_SCREEN,
    DRAWER_NAVIGATION_ROUTES,
    NAVIGATION_TO_ADDNEWPRODUCTS,
    NAVIGATION_TO_PRODUCTDETAILS,
    NAVIGATION_TO_EDITPRODUCT,
    NAVIGATION_TO_ADDPRODUCTIMAGES,
    NAVIGATION_TO_ORDERDETAILS,
    NAVIGATION_TO_FORGOTPASSWORD,
    NAVIGATION_TO_REPLACEIMAGES,
    NAVIGATION_TO_OTP_VERIFICATION
} 
from './routes'

import { StatusBar } from 'react-native';
import {colors} from '../theme'
import SplashScreen from '../screens/boarding/SplashScreen';
import LoginScreen from '../screens/auth/loginScreen'
import RegisterScreen from '../screens/auth/registerScreen'
import Dashboard from '../screens/dashboard/dashboardScreen'
import drawerNavigationRoutes from './drawerNavigationRoutes'
import addNewProducts from '../screens/dashboard/addNewProducts'
import ProductDetails from '../screens/dashboard/ProductDetails'
import EditProduct from '../screens/dashboard/EditProduct'
import AddProductImages from '../screens/dashboard/AddProductImages'
import ReplaceImages from '../screens/dashboard/ReplaceImages'
import OrderDetails from '../screens/dashboard/manageOrders/OrderDetails'
import forgotPassword from '../screens/auth/forgotPassword'
import AsyncStorage from '@react-native-community/async-storage'
import OtpVerification from '../screens/auth/OtpVerification'
import PaymentDetails from '../screens/dashboard/payments/PaymentDetails'
import addVariation from '../screens/dashboard/addVariation'
import AddGroupVariation from '../screens/dashboard/AddGroupVariation'
import variationImages from '../screens/dashboard/variationImages'

const Stack = createStackNavigator();
const Auth = () => {
    // Stack Navigator for Login and Sign up Screen
    return (
        <Stack.Navigator
        initialRouteName={NAVIGATION_TO_LOGIN_SCREEN}
        screenOptions={{
            headerBackTitleVisible:false
        }}>
          <Stack.Screen
                   name={NAVIGATION_TO_LOGIN_SCREEN}
                   component={LoginScreen}
                   options={{
                      headerShown:false,
                    }}
              />
                 <Stack.Screen
            name={NAVIGATION_TO_SIGNUP_SCREEN}
            component={RegisterScreen}
            options={{
                headerShown:false
            ,
           }}
          />
                 <Stack.Screen
            name={NAVIGATION_TO_FORGOTPASSWORD}
            component={forgotPassword}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}
           
          />
                 <Stack.Screen
            name={NAVIGATION_TO_OTP_VERIFICATION}
            component={OtpVerification}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}
           
          />
          

        
        
      </Stack.Navigator>
    );
  };
const mainNavigator = () =>{
    
    return(
        
        <SafeAreaProvider>
            <StatusBar
            backgroundColor={colors.appbar.statusBarColor}/>
            <NavigationContainer>
                <Stack.Navigator
                   initialRouteName={NAVIGATION_TO_SPLASH_SCREEN}
                   screenOptions={{
                       headerBackTitleVisible:false}}
                >     
                  <Stack.Screen
                    name={NAVIGATION_TO_SPLASH_SCREEN}
                     component={SplashScreen}
                     options={{
                         header:()=>null
                     }}
                    />
            
                          <Stack.Screen
               name={'Auth'}
               component={Auth}
               options={{
                  headerShown:false,
                }}
          />
         
         <Stack.Screen
                 name={DRAWER_NAVIGATION_ROUTES}
                 component={drawerNavigationRoutes}
                options={{
                headerShown:false
                 }}/>  
             <Stack.Screen
            name={NAVIGATION_TO_ADDNEWPRODUCTS}
            component={addNewProducts}
            
            options={{
               
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },


                headerShown:true
                
           }}
          />  
               <Stack.Screen
            name={NAVIGATION_TO_PRODUCTDETAILS}
            component={ProductDetails}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}
          />  
                <Stack.Screen
            name={NAVIGATION_TO_EDITPRODUCT}
            component={EditProduct}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },
                headerShown:true
                
           }} />  
                  <Stack.Screen
            name={NAVIGATION_TO_ADDPRODUCTIMAGES}
            component={AddProductImages}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/>  
                <Stack.Screen
            name={NAVIGATION_TO_ORDERDETAILS}
            component={OrderDetails}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
                  <Stack.Screen
            name={NAVIGATION_TO_REPLACEIMAGES}
            component={ReplaceImages}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
                  <Stack.Screen
            name={'Payment Details'}
            component={PaymentDetails}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
        
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
                   <Stack.Screen
            name={'Add Variation'}
            component={addVariation}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
        
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
                    <Stack.Screen
            name={'Add Group Variation'}
            component={AddGroupVariation}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
        
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
                    <Stack.Screen
            name={'Variation Images'}
            component={variationImages}
            
            options={{
               
                headerStyle:{
                    backgroundColor: colors.colors.primary,

                },
        
                headerTintColor:colors.colors.white,
                headerTitleStyle:{
                    fontFamily:'Poppins-Bold',
                    fontSize:18
                },

                headerShown:true
                
           }}/> 
         
         
         
         
         
               </Stack.Navigator>
            </NavigationContainer>

        </SafeAreaProvider>
    )
}
export default mainNavigator



