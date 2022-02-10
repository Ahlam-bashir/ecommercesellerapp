import { Platform } from 'react-native';
import {colors} from '../theme'
const fontWeightRegular = 'normal';
const fontPoppins='Poppins-Bold';
const fontRegular='Muli-Regular'


export default {
  /**
   * Use the Heading style for card titles.
   */
  headingText: {
    fontFamily:fontPoppins,
    color: colors.colors.gray600,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  subheadingText: {
    fontFamily:fontPoppins,
    color: colors.colors.gray600,
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  body: {
    fontFamily:fontRegular,
    color: colors.colors.gray600,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  caption: {
    fontFamily:fontRegular,
    color: colors.colors.gray600,
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: fontWeightRegular,
  },
  blank:{}
  

  
  

}