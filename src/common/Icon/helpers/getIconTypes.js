import AntIcon from 'react-native-vector-icons/AntDesign'
import Ionicon from 'react-native-vector-icons/Ionicons'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default type=>{
    switch(type){
        case 'antdesign':
        return AntIcon
        case 'ionicon':
        return Ionicon
        case 'evilicon':
        return EvilIcon
        case 'entypo':
        return Entypo
        case 'font-awesome':
         return FAIcon
         case 'font-awesome-5':
         return FA5Icon
        case 'simple-line-icon':
         return SimpleLineIcon
        case 'feather':
        return FeatherIcon
        case 'materialcommunityicons':
            return MaterialCommunityIcons
        default:
         return MaterialIcon
    }
};

