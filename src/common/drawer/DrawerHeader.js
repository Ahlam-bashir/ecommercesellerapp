import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Icon} from '../'
import { colors } from '../../theme';

const DrawerHeader = (props) => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Icon name='navicon' size={24} color={colors.colors.white} type='font-awesome' style={{marginLeft: 10,}}/>
      </TouchableOpacity>
    </View>
  );
};
export default DrawerHeader;