import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import color from '../config/color';
import { convertTime } from '../config/service';
import constants from '../config/constants';

const renderedPlayPauseIcon = (isPlaying) => {
    if(isPlaying) {
        return <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
    } else {
        return <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
    }
}

export default function AudioItem({title, duration, options, play, isPlaying, active}) {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={play}>
                    <View style={styles.left}>
                        <View style={[styles.thumbnail, {backgroundColor: active ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                            {active ? renderedPlayPauseIcon(isPlaying) : 
                            <Text style={styles.text}>{title[0].toUpperCase()}</Text>}
                        </View>
                        <View style={styles.header}>
                            <Text numberOfLines={1} style={styles.title}>{title}</Text>
                            <Text style={styles.time}>{convertTime(duration)}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.right}>
                    <Entypo 
                        name="dots-three-vertical" 
                        size={20} 
                        color={color.FONT_MEDIUM}
                        onPress={options}
                        style={{padding: 10}} />
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    );
};


const {width, height} = Dimensions.get(constants.window);
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 80
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    right: {
        flexBasis: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT
    },
    header: {
        width: width - 180,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        color: color.FONT
    },
    separator: {
        width: width - 80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    },
    time: {
        fontSize: 14,
        color: color.FONT_LIGHT
    }
});
