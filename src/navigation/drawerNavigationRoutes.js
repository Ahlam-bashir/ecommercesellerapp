import React from 'react'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {createStackNavigator} from '@react-navigation/stack'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { colors } from '../theme';
import {DrawerHeader,CustomSideBarMenu} from '../common'
import { NAVIGATION_TO_DASHBOARD_SCREEN } from './routes';
import dashboardScreen from '../screens/dashboard/dashboardScreen';
import ManageProducts from '../screens/dashboard/ManageProducts';
import ManageOrders from '../screens/dashboard/manageOrders/ManageOrders';
import ActiveOrders from '../screens/dashboard/manageOrders/ActiveOrders';
import DeliveredOrders from '../screens/dashboard/manageOrders/DeliveredOrders';
import ReturnedOrders from '../screens/dashboard/manageOrders/ReturnedOrders';
import CancelledOrders from '../screens/dashboard/manageOrders/CancelledOrders';
import ManageCompany from '../screens/dashboard/manageCompany/ManageCompany';
import ManageBankAccount from '../screens/dashboard/manageBankAccounts/ManageBankAccount';
import ManageSales from '../screens/dashboard/manageSales/ManageSales';
import payments from '../screens/dashboard/payments/payments';
import ChangePassword from '../screens/dashboard/changePassword/ChangePassword';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab= createMaterialTopTabNavigator();
const dashboardScreenStack = ({navigation})=>{
    return(
    <Stack.Navigator
    initialRouteName='dashboardScreen' 
    >
    <Stack.Screen
    component={dashboardScreen}
    name='dashboardScreen'
    
    options={{
        headerStyle:{
            backgroundColor:colors.colors.primary,
            borderBottomWidth:0,
            minHeight:30,
        },  
        headerTintColor:colors.colors.white,
        headerTitleStyle:{
            fontFamily:'Poppins-Bold',
            textAlign:'justify',
            fontSize:18,
        },
        
        headerTitle:'Dashboard',
        headerLeft:()=>(
            <DrawerHeader
            navigationProps={navigation}
            />
        )
    }} 
    /> 
  
    </Stack.Navigator>
    )
}
const ManageProductScreenStack = ({navigation,route,props})=>{
   // console.log('props'+props.params)
    return(
    <Stack.Navigator
    initialRouteName='ManageProducts' 
    >
    <Stack.Screen
    component={ManageProducts}
    name='ManageProducts'

    options={{
        headerStyle:{
            backgroundColor:colors.colors.primary,
            borderBottomWidth:0,
            minHeight:30,
        },  
        headerTintColor:colors.colors.white,
        headerTitleStyle:{
            fontFamily:'Poppins-Bold',
            textAlign:'justify',
            fontSize:18,
        },
        
        headerTitle:'Manage Products',
        headerLeft:()=>(
            <DrawerHeader
            navigationProps={navigation}
            />
        )
        
    }} 
   

   
     
    /> 
    
  
    </Stack.Navigator>
    )
}
const ManageCompanyScreenStack = ({navigation,route,props})=>{
  // console.log('props'+props.params)
   return(
   <Stack.Navigator
   initialRouteName='ManageCompany' 
   >
   <Stack.Screen
   component={ManageCompany}
   name='ManageCompany'

   options={{
       headerStyle:{
           backgroundColor:colors.colors.primary,
           borderBottomWidth:0,
           minHeight:30,
       },  
       headerTintColor:colors.colors.white,
       headerTitleStyle:{
           fontFamily:'Poppins-Bold',
           textAlign:'justify',
           fontSize:18,
       },
       
       headerTitle:'Manage Company',
       headerLeft:()=>(
           <DrawerHeader
           navigationProps={navigation}
           />
       )
       
   }} 
  

  
    
   /> 
   
 
   </Stack.Navigator>
   )
}
const ManageBankAccountScreenStack = ({navigation,route,props})=>{
  // console.log('props'+props.params)
   return(
   <Stack.Navigator
   initialRouteName='ManageBankAccount' 
   >
   <Stack.Screen
   component={ManageBankAccount}
   name='ManageBankAccount'

   options={{
       headerStyle:{
           backgroundColor:colors.colors.primary,
           borderBottomWidth:0,
           minHeight:30,
       },  
       headerTintColor:colors.colors.white,
       headerTitleStyle:{
           fontFamily:'Poppins-Bold',
           textAlign:'justify',
           fontSize:18,
       },
       
       headerTitle:'Manage Bank Account',
       headerLeft:()=>(
           <DrawerHeader
           navigationProps={navigation}
           />
       )
       
   }} 
  

  
    
   /> 
   
 
   </Stack.Navigator>
   )
}
const ManageSalesScreenStack = ({navigation,route,props})=>{
    // console.log('props'+props.params)
     return(
     <Stack.Navigator
     initialRouteName='ManageSales' 
     >
     <Stack.Screen
     component={ManageSales}
     name='ManageSales'
  
     options={{
         headerStyle:{
             backgroundColor:colors.colors.primary,
             borderBottomWidth:0,
             minHeight:30,
         },  
         headerTintColor:colors.colors.white,
         headerTitleStyle:{
             fontFamily:'Poppins-Bold',
             textAlign:'justify',
             fontSize:18,
         },
         
         headerTitle:'Manage Sales',
         headerLeft:()=>(
             <DrawerHeader
             navigationProps={navigation}
             />
         )
         
     }} 
    
  
    
      
     /> 
     
   
     </Stack.Navigator>
     )
  }
  const PaymentsScreenStack = ({navigation,route,props})=>{
    // console.log('props'+props.params)
     return(
     <Stack.Navigator
     initialRouteName='payments' 
     >
     <Stack.Screen
     component={payments}
     name='payments'
  
     options={{
         headerStyle:{
             backgroundColor:colors.colors.primary,
             borderBottomWidth:0,
             minHeight:30,
         },  
         headerTintColor:colors.colors.white,
         headerTitleStyle:{
             fontFamily:'Poppins-Bold',
             textAlign:'justify',
             fontSize:18,
         },
         
         headerTitle:'Payments',
         headerLeft:()=>(
             <DrawerHeader
             navigationProps={navigation}
             />
         )
         
     }} 
    
  
    
      
     /> 
     
   
     </Stack.Navigator>
     )
  }
  const ChangePasswordScreenStack = ({navigation,route,props})=>{
    // console.log('props'+props.params)
     return(
     <Stack.Navigator
     initialRouteName='ChnagePassword' 
     >
     <Stack.Screen
     component={ChangePassword}
     name='ChangePassword'
  
     options={{
         headerStyle:{
             backgroundColor:colors.colors.primary,
             borderBottomWidth:0,
             minHeight:30,
         },  
         headerTintColor:colors.colors.white,
         headerTitleStyle:{
             fontFamily:'Poppins-Bold',
             textAlign:'justify',
             fontSize:18,
         },
         
         headerTitle:'Change Password',
         headerLeft:()=>(
             <DrawerHeader
             navigationProps={navigation}
             />
         )
         
     }} 
    
  
    
      
     /> 
     
   
     </Stack.Navigator>
     )
  }
const ManageOrdersScreenStack = ({navigation})=>{
    // console.log('props'+props.params)
     return(
     <Stack.Navigator
     initialRouteName='ManageOrders'
      screenOptions={{
          headerStyle:{
            backgroundColor:colors.colors.primary,
            borderBottomWidth:0,
            minHeight:30,
        },
        headerTintColor: colors.colors.white,
        headerTitleStyle:{
            fontFamily:'Poppins-Bold',
            textAlign:'justify',
            fontSize:18,
        
        },
        headerTitle:'Manage Orders',
        headerLeft:()=>(
            <DrawerHeader
            navigationProps={navigation}
            />
        )

      }}
     >
     <Stack.Screen
     component={tabStack}
     name='tabStack'

 
    
 
    
      
     /> 
   
     </Stack.Navigator>
     )
 }
 
const tabStack=()=>{
    return(
        <Tab.Navigator 
        initialRouteName='ManageOrders'
        
        tabBarOptions={{
            activeTintColor: colors.colors.white,
            inactiveTintColor: colors.colors.gray200,
        style: {
          backgroundColor: colors.colors.primary,
        },
        labelStyle: {
          textAlign: 'center',
          fontFamily:'Muli-Regular',
          fontSize:8,
          
        },
        indicatorStyle: {
          borderBottomColor: colors.colors.white,
          borderBottomWidth: 2,
        },
        }}
        >
            <Tab.Screen
              name='Active Orders'
              component={ActiveOrders}
              options={{
                tabBarLabel: 'Active Orders',
                // tabBarIcon: ({ color, size }) => (
                //   <MaterialCommunityIcons
                //       name="home"
                //       color={color}
                //       size={size}
                //     />
                // ),
              }} 


            />
             <Tab.Screen
              name='Delivered Orders'
              component={DeliveredOrders}
              options={{
                tabBarLabel: 'Delivered Orders',
                
                // tabBarIcon: ({ color, size }) => (
                //   <MaterialCommunityIcons
                //       name="home"
                //       color={color}
                //       size={size}
                //     />
                // ),
              }} 


            />
             <Tab.Screen
              name='Returned Orders'
              component={ReturnedOrders}
              options={{
                tabBarLabel: 'Returned Orders',
                // tabBarIcon: ({ color, size }) => (
                //   <MaterialCommunityIcons
                //       name="home"
                //       color={color}
                //       size={size}
                //     />
                // ),
              }} 


            />
             <Tab.Screen
              name='Cancelled Orders'
              component={CancelledOrders}
              options={{
                tabBarLabel: 'Cancelled Orders',
                // tabBarIcon: ({ color, size }) => (
                //   <MaterialCommunityIcons
                //       name="home"
                //       color={color}
                //       size={size}
                //     />
                // ),
              }} 


            />



        </Tab.Navigator>

    )
}
const drawerNavigationRoutes=({navigation,route})=>{
    console.log(route.params)
       return(
           <Drawer.Navigator
           
           drawerContentOptions={{
               color:colors.colors.primary,
               itemStyle:{
                   marginVertical:5,
                   color:colors.colors.white,
                   
                },
               labelStyle:{
                   fontFamily:'Muli-Regular',
                   color:colors.colors.white    
               }
           }}
           screenOptions={{
            headerShown:false,
             }}
             drawerType='slide'
             drawerContent={CustomSideBarMenu}
             
             >
                 
                 <Drawer.Screen
                 name='dashboardScreenStack'
                 component={dashboardScreenStack}
                 options={{
                     drawerLabel:'Dashboard'
                 }}
                 />
                   <Drawer.Screen
                   
                
                   name='ManageProductScreenStack'
                   component={ManageProductScreenStack}
                   options={{
                     drawerLabel:'Manage products'
                  }}
                   
                  
                 
                 />
                  <Drawer.Screen
                   
                
                   name='ManageOrdersScreenStack'
                   component={ManageOrdersScreenStack}
                   options={{
                     drawerLabel:'Manage Orders'
                  }}
                   
                  
                 
                 />
                  <Drawer.Screen
                   
                
                   name='ManageCompanyScreenStack'
                   component={ManageCompanyScreenStack}
                   options={{
                     drawerLabel:'Manage Company'
                  }}
                   
                  
                 
                 />
                  <Drawer.Screen
                   
                
                   name='ManageBankAccountScreenStack'
                   component={ManageBankAccountScreenStack}
                   options={{
                     drawerLabel:'Manage Bank Account'
                  }}
                   
                  
                 
                 />
                  <Drawer.Screen
                   
                
                   name='ManageSalesScreenStack'
                   component={ManageSalesScreenStack}
                   options={{
                     drawerLabel:'Manage Sales'
                  }}
                   
                  
                 
                 />
                 <Drawer.Screen
                   
                
                   name='PaymentsScreenStack'
                   component={PaymentsScreenStack}
                   options={{
                     drawerLabel:'Payments'
                  }}
                   
                  
                 
                 />
                  <Drawer.Screen
                   
                
                   name='ChangePasswordScreenStack'
                   component={ChangePasswordScreenStack}
                   options={{
                     drawerLabel:'Change Password'
                  }}
                   
                  
                 
                 />
                
           </Drawer.Navigator>
         

       );
};
export default drawerNavigationRoutes