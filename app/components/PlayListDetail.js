import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import color from '../config/color';
import AudioItem from './AudioItem';
import { AudioContext } from '../context/AudioProvider';
import { storeCurrentPlayList } from '../config/AsyncStorage';
import constants from '../config/constants';
import Option from './Option';
import { AntDesign } from '@expo/vector-icons';

const PlayListDetail = (props) => {
    const {
        playAudio, 
        isPlaying, 
        audio, 
        updateState, 
        removeFromPlayList,
        removePlayList
    } = useContext(AudioContext);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentAudio, setCurrentAudio] = useState({});
    const playList = props.route.params;

    const playListAudio = (item) => {
        const playListIndex = playList.audios.findIndex(({id}) => id === item.id);

        updateState({
            currentPlayList: playList,
            currentPlayListIndex: playListIndex
        });

        showOption(false, {});
        storeCurrentPlayList(playList, playListIndex);
        playAudio(item);
    }

    const showOption = (modalVisible, audio) => {
        setModalVisible(modalVisible);
        setCurrentAudio(audio);
    }

    const remove = () => {
        const index = playList.audios.findIndex((item) => item.id === currentAudio.id);
        playList.audios.splice(index, 1);
        removeFromPlayList(playList.id, index);
        showOption(false, {});
    }

    const deletePlayList = () => {
        removePlayList(playList.id);
        props.navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{playList.title}</Text>
                {playList.type !== constants.default ?
                <AntDesign 
                    name="delete" 
                    size={24} 
                    color={color.ACTIVE_BG} 
                    onPress={() => deletePlayList()}
                /> : null}
            </View>
            <FlatList 
                contentContainerStyle={styles.list}
                data={playList.audios} 
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                    <>
                        <View style={{marginBottom: 10}}>
                            <AudioItem 
                                title={item.filename} 
                                duration={item.duration} 
                                options={() => showOption(true, item)}
                                play={() => playListAudio(item)}
                                isPlaying={isPlaying}
                                active={audio.id === item.id} 
                            />
                        </View>
                        <Option
                            visible={modalVisible} 
                            item={currentAudio}
                            isPlaying={isPlaying && audio.id === currentAudio.id}
                            close={() => showOption(false, {})}
                            play={() => playListAudio(currentAudio)}
                            playList={() => remove()} 
                            option={constants.removeFromPlayList}
                        />
                    </>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    list: {
        padding: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: 'bold',
        color: color.ACTIVE_BG
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        width: '100%'
    }
});

export default PlayListDetail;