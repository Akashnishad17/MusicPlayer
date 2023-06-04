import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import color from '../config/color';
import constants from '../config/constants';

export default function Player(props) {
    const {type, size = 40, iconColor = color.FONT, press, others} = props;
    const getIcon = (type) => {
        switch(type) {
            case constants.PLAY:
                return 'pausecircle';
            case constants.PAUSE:
                return 'playcircleo';
            case constants.NEXT:
                return 'forward';
            case constants.PREV:
                return 'banckward';
        }
    }

    return <AntDesign 
        {...props}
        onPress={press} 
        name={getIcon(type)} 
        size={size} 
        color={iconColor} 
        {...others} 
    />
};