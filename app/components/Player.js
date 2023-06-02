import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import color from '../config/color';

export default function Player(props) {
    const {type, size = 40, iconColor = color.FONT, press, others} = props;
    const getIcon = (type) => {
        switch(type) {
            case 'PLAY':
                return 'pausecircle';
            case 'PAUSE':
                return 'playcircleo';
            case 'NEXT':
                return 'forward';
            case 'PREV':
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