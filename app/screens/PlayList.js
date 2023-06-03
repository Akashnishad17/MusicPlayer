import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import PlayListModal from '../components/PlayListModal';
import color from '../config/color';

const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.banner}>
                <Text>My Favorite</Text>
                <Text style={styles.count}>0 Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => {setModalVisible(true)}}
                style={{marginTop: 15}}>
                <Text style={styles.playList}>+ Add New Play List</Text>
            </TouchableOpacity>

            <PlayListModal visible={modalVisible} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
    count: {
        marginTop: 3,
        opacity: 0.5,
        fontSize: 14
    },
    banner: {
        padding: 5,
        backgroundColor: color.MODAL_BG,
        borderRadius: 5
    },
    playList: {
        color: color.ACTIVE_BG,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5
    }
});

export default PlayList;
