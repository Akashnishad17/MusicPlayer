import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import color from '../config/color';
import AudioItem from './AudioItem';
import { AudioContext } from '../context/AudioProvider';
import { storeCurrentPlayList } from '../config/AsyncStorage';

const PlayListDetail = (props) => {
    const {playAudio, isPlaying, audio, updateState} = useContext(AudioContext);
    const playList = props.route.params;

    const playListAudio = (item) => {
        const playListIndex = playList.audios.findIndex(({id}) => id === item.id);

        updateState({
            currentPlayList: playList,
            currentPlayListIndex: playListIndex
        });

        storeCurrentPlayList(playList, playListIndex);
        playAudio(item);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{playList.title}</Text>
            <FlatList 
                contentContainerStyle={styles.list}
                data={playList.audios} 
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                    <View style={{marginBottom: 10}}>
                        <AudioItem 
                            title={item.filename} 
                            duration={item.duration} 
                            options={() => {}}
                            play={() => playListAudio(item)}
                            isPlaying={isPlaying}
                            active={audio.id === item.id} 
                        />
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center'
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
    }
});

export default PlayListDetail;