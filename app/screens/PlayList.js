import React, { useContext, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import PlayListModal from '../components/PlayListModal';
import color from '../config/color';
import { storePlayList } from '../config/AsyncStorage';
import { AudioContext } from '../context/AudioProvider';

const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const context = useContext(AudioContext);
    const {playList, addToPlayList, updateState} = context;

    const createPlayList = async(name) => {
        const audios = [];

        if(addToPlayList) {
            audios.push(addToPlayList);
        }

        const newList = {
            id: Date.now(),
            title: name,
            audios: audios
        };

        const updatedList = [...playList, newList];
        updateState({
            addToPlayList: null,
            playList: updatedList
        });

        storePlayList(updatedList);
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {playList.length ? playList.map(item => 
                <TouchableOpacity 
                    key={item.id.toString()} 
                    style={styles.banner}>
                    <Text>{item.title}</Text>
                    <Text style={styles.count}>{item.audios.length} Songs</Text>
                </TouchableOpacity>
            ) : null}
            <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={{marginTop: 15}}>
                <Text style={styles.playList}>+ Add New Play List</Text>
            </TouchableOpacity>
            <PlayListModal 
                visible={modalVisible}
                close={() => setModalVisible(false)} 
                submit={() => {}}
                createPlayList={createPlayList}
            />
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
        borderRadius: 5,
        marginBottom: 5
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
