import {Dimensions} from 'react-native';

// retrieve dimensions of the current screen window, deviceWidth and deviceHeight have now been assigned
const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

// function that receives a percentage value that gives the height percentage
const heightP = percentage => {
    return (percentage * deviceHeight) / 100;
}

const widthP = percentage => {
    return (percentage * deviceWidth) / 100;
}