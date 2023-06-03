import React from 'react';
import { Modal, StyleSheet, Text, View, Dimensions, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import color from '../config/color';

export default function PlayListModal({visible}) {
    return (
        <Modal 
            visible={visible}
            animationType='fade'
            transparent>
            <View style={styles.modal}>
                <View style={styles.container}>
                    <TextInput style={styles.input} />
                    <AntDesign 
                        name='check'
                        size={24} 
                        color={color.ACTIVE_FONT}
                        style={styles.icon}
                    />
                </View>
            </View>
        </Modal>
    );
};

const {width} = Dimensions.get('window');

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
        alignItems: 'center',
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
        marginTop: 15
    }
});