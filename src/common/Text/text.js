import React from 'react'
import { Text as RNText,StyleSheet} from 'react-native'
import PropType from 'prop-types'
import {TYPOGRAPHY} from '../../constants'

const HEADING = 'heading'
const BODY = 'body'
const SUBHEADING='subheading'
const CAPTION='caption'
const propTypes = {
    type:PropType.oneOf([HEADING,SUBHEADING,BODY,CAPTION]),
    bold:PropType.bool,
    style:PropType.oneOfType([PropType.object,PropType.arrayOf(PropType.object)])
};
const defaultProps={
    type:BODY,
    bold:false,
    style:{}
};
const Text = ({type,bold,style,...props})=>{
    return(
        <RNText
         style={StyleSheet.flatten([getTextStyle(type,bold),style])}
         {...props}
        />
    )
}
const getTextStyle=(type,bold)=>{
    let style='';
    switch(type){
        case HEADING:{
            style='headingText'
            break;
        }
        case BODY:{
            style='body'
            break
        }
        case SUBHEADING:{
            style='subheadingText'
            break
        }
        case SUBHEADING:{
            style='caption'
            break
        }
    }
    return TYPOGRAPHY[style]
};
Text.propTypes=propTypes
Text.defaultProps=defaultProps;
export default Text;


