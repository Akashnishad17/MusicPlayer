import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons'; 
import color from '../config/color';
import { convertTime } from '../config/service';

export default function AudioItem({title, duration, options}) {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.left}>
                    <View style={styles.thumbnail}>
                        <Text style={styles.text}>{title[0].toUpperCase()}</Text>
                    </View>
                    <View style={styles.header}>
                        <Text numberOfLines={1} style={styles.title}>{title}</Text>
                        <Text style={styles.time}>{convertTime(duration)}</Text>
                    </View>
                </View>
                <View style={styles.right}>
                    <Entypo 
                        name="dots-three-vertical" 
                        size={20} 
                        color={color.FONT_MEDIUM}
                        onPress={options} />
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    );
};


const {width, height} = Dimensions.get('window');
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
        backgroundColor: color.FONT_LIGHT,
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
