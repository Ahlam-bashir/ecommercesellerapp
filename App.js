import 'react-native-gesture-handler'
import React, { useState } from 'react'
import Navigator from './src/navigation/mainNavigator'
import { UserContext } from './src/common/context/userContext'



const App = () =>{
    const [user,setUser] = useState({
          'email':'',
          'password':'',
    })
    return(
       
         <Navigator/>
         
        
    )
}
export default App;