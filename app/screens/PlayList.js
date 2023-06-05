import React, { useContext, useState } from 'react';
import { StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import PlayListModal from '../components/PlayListModal';
import color from '../config/color';
import { storePlayList } from '../config/AsyncStorage';
import { AudioContext } from '../context/AudioProvider';
import constants from '../config/constants';

const PlayList = ({navigation}) => {
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
            audios: audios,
            type: constants.new
        };

        const updatedList = [...playList, newList];
        updateState({
            addToPlayList: null,
            playList: updatedList
        });

        storePlayList(updatedList);
    }

    const banner = (item) => {
        let audioExist = false;

        if(addToPlayList) {
            const updatedList = playList.filter(el => {
                if(el.id === item.id) {
                    for(let audio of el.audios) {
                        if(audio.id == addToPlayList.id) {
                            audioExist = true;
                            return el;
                        }
                    }

                    el.audios = [...el.audios, addToPlayList];
                }

                return el;
            });

            if(audioExist) {
                Alert.alert(constants.musicAlreadyAdded, 
                `${addToPlayList.filename} is already present in the Play List`);
            }

            updateState({
                addToPlayList: null,
                playList: updatedList
            });
    
            storePlayList(updatedList);
        }
        
        if(!audioExist) {
            navigation.navigate(constants.PlayListDetail, item);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {playList.length ? playList.map(item => 
                <TouchableOpacity
                    onPress={() => banner(item)}
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
