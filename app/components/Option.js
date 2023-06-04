import React from 'react';
import { Modal, StatusBar, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import color from '../config/color';

export default function Option({visible, close, item, play, isPlaying, addPlayList}) {
    return <>
        <StatusBar hidden />
        <Modal animationType='slide' transparent visible={visible}>
            <View style={styles.modal}>
                <Text style={styles.title} numberOfLines={2}>{item.filename}</Text>
                <View style={styles.options}>
                    <TouchableWithoutFeedback onPress={play}>
                        <Text style={styles.option}>{isPlaying ? 'Pause' : 'Play'}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={addPlayList}>
                        <Text style={styles.option}>Add to Play List</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={close}>
                        <Text style={styles.option}>Close</Text>
                    </TouchableWithoutFeedback>              
                </View>
            </View>
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.modalBG} />
            </TouchableWithoutFeedback>  
        </Modal>
    </>
};

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.APP_BG,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1000
    },
    options: {
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBG: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: color.MODAL_BG
    }
});
