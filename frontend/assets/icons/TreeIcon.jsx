import * as React from "react"
import Svg, {Path } from "react-native-svg";

const TreeIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#000000" fill="none" {...props}>
    <Path d="M12 22V9" stroke={props.iconColor} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 17H16C18.7614 17 21 14.7614 21 12C21 9.5807 19.2818 7.56271 16.999 7.09982C16.999 4.3384 15 2 12 2C9 2 7.00097 4.3384 7.00097 7.09982C4.71825 7.56271 3 9.5807 3 12C3 14.7614 5.23858 17 8 17H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 15L14.5 12.5" stroke={props.iconColor} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13L9.5 10.5" stroke={props.iconColor} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 22H14"stroke={props.iconColor} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default TreeIcon;