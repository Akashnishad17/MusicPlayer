import React, { useState } from 'react';
import { Modal, StyleSheet, View, Dimensions, TextInput, TouchableWithoutFeedback, Text } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import color from '../config/color';
import constants from '../config/constants';

export default function PlayListModal({visible, close, createPlayList}) {
    const [playList, setPlayList] = useState('');

    const submit = () => {
        if(playList.trim()) {
            createPlayList(playList);
        }
        
        setPlayList('');
        close();
    }

    return (
        <Modal 
            visible={visible}
            animationType='fade'
            transparent>
            <View style={styles.modal}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create New Play List</Text>
                    <TextInput 
                        style={styles.input} 
                        value={playList}
                        onChangeText={(text) => setPlayList(text)}
                    />
                    <View style={styles.icons}>
                        <AntDesign 
                            name='check'
                            size={24} 
                            color={color.ACTIVE_FONT}
                            style={styles.icon}
                            onPress={submit}
                        />
                        <Entypo 
                            name='cross'
                            size={24} 
                            color={color.ACTIVE_FONT}
                            style={styles.icon}
                            onPress={close}
                        />
                    </View>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={close}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const {width} = Dimensions.get(constants.window);

const styles = StyleSheet.create({
    input: {
        width: width - 40,
        borderBottomWidth: 1,
        borderBottomColor: color.ACTIVE_BG,
        fontSize: 18,
        paddingVertical: 5
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: width - 20,
        height: 200,
        borderRadius: 10,
        backgroundColor: color.ACTIVE_FONT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        padding: 10,
        backgroundColor: color.ACTIVE_BG,
        borderRadius: 50,
        margin: 15,
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1
    },
    icons: {
        flexDirection: 'row',
    },
    title: {
        color: color.ACTIVE_BG,
        fontSize: 20,
        fontWeight: 'bold'
    }
});