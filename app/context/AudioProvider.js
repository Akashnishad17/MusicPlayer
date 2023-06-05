import React, { Component, createContext } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import { Audio } from 'expo-av';
import { load, move, pause, playNext, resume } from '../config/AudioController';
import { loadAudio, loadCurrentPlayList, loadLastPlayBackPosition, loadPlayList, storeAudio, storeCurrentPlayList, storeLastPlayBackPosition, storePlayList } from '../config/AsyncStorage';
import constants from '../config/constants';

export const AudioContext = createContext();
export default class AudioProvider extends Component {
    constructor(props){
        super(props);

        this.state = {
            audios: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playBack: null,
            sound: null,
            audio: {},
            isPlaying: false,
            audioIndex: -1,
            playBackPosition: null,
            playBackDuration: null,
            audioCount: 0,
            playList: [],
            addToPlayList: null,
            currentPlayList: null,
            currentPlayListIndex: -1
        };
    }

    loadAudio = async() => {
        const audioData = await loadAudio();
        let playList = await loadPlayList();
        const currentPlayListResult = await loadCurrentPlayList();
        const playBackPosition = await loadLastPlayBackPosition();
        let audio, audioIndex;
        let currentPlayList = null, currentPlayListIndex = -1;

        if(audioData === null) {
            audio = this.state.audios[0];
            audioIndex = 0;
        } else {
            audio = audioData.audio;
            audioIndex = audioData.index;
        }

        if(playList == null || playList.length === 0) {
            const defaultPlayList = {
                id: Date.now(),
                title: constants.DefaultPlayList,
                audios: [],
                type: constants.default
            };

            playList = [defaultPlayList];
        }

        if(currentPlayListResult !== null) {
            currentPlayList = currentPlayListResult.playList;
            currentPlayListIndex = currentPlayListResult.playListIndex;
        }

        const playBack = new Audio.Sound();
        let sound = await load(playBack, audio.uri);

        if(playBackPosition) {
            sound = await move(playBack, playBackPosition);
        }

        this.updateState({
            audio, 
            audioIndex, 
            playBack, 
            sound,
            playList,
            currentPlayList,
            currentPlayListIndex,
            playBackPosition,
            playBackDuration: sound.durationMillis
        });

        playBack.setOnPlaybackStatusUpdate(this.setOnPlaybackStatusUpdate);
        storeAudio(audio, audioIndex);
        storePlayList(playList);
    }

    setOnPlaybackStatusUpdate = (playBackStatus) => {
        if(playBackStatus.isLoaded && playBackStatus.isPlaying) {
            this.updateState({
                playBackPosition: playBackStatus.positionMillis,
                playBackDuration: playBackStatus.durationMillis
            });

            storeLastPlayBackPosition(playBackStatus.positionMillis);
        }

        if(playBackStatus.didJustFinish) {
            this.playNextBy(1);
        }
    }

    playNextBy = (shift) => {
        if(this.state.currentPlayList === null) {
            const nextIndex = (this.state.audioIndex + shift + this.state.audioCount) % this.state.audioCount;
            const audio = this.state.audios[nextIndex];
            this.playAudio(audio);
        } else {
            const nextIndex = (this.state.currentPlayListIndex + shift + this.state.currentPlayList.audios.length) % this.state.currentPlayList.audios.length;
            const audio = this.state.currentPlayList.audios[nextIndex];
            this.updateState({currentPlayListIndex: nextIndex});
            this.playAudio(audio);
        }
    }

    playAudio = async(item) => {
        const {playBack, sound, audio, audios} = this.state;

        if(sound.isLoaded) {
            if(audio.id === item.id) {
                const status = sound.isPlaying ? await pause(playBack) : await resume(playBack);

                this.updateState({
                    sound: status, 
                    isPlaying: !sound.isPlaying
                });
            } else {
                const status = await playNext(playBack, item.uri);
                const index = audios.findIndex(({id}) => id === item.id);

                this.updateState({
                    sound: status, 
                    audio: item, 
                    isPlaying: true, 
                    audioIndex: index
                });

                storeAudio(item, index);
            }
        }
    }

    removeFromPlayList = (id, index) => {
        let currentPlayList = this.state.currentPlayList;
        let currentPlayListIndex = this.state.currentPlayListIndex;

        if(this.state.currentPlayList && this.state.currentPlayList.id === id) {
            if(currentPlayListIndex == index) {
                currentPlayList = null;
                currentPlayListIndex = -1;
            } else if(index < currentPlayListIndex) {
                currentPlayListIndex--;
            }
        }

        this.updateState({
            currentPlayList,
            currentPlayListIndex
        });

        storePlayList(this.state.playList);
        storeCurrentPlayList(currentPlayList, currentPlayListIndex);
    }

    removePlayList = (id) => {
        let currentPlayList = this.state.currentPlayList;
        let currentPlayListIndex = this.state.currentPlayListIndex;

        if(currentPlayList && currentPlayList.id === id) {
            currentPlayList = null,
            currentPlayListIndex = -1
        }

        const updatedList = this.state.playList.filter((item) => item.id !== id);
        
        this.updateState({
            currentPlayList,
            currentPlayListIndex,
            playList: updatedList
        });

        storeCurrentPlayList(currentPlayList, currentPlayListIndex);
        storePlayList(updatedList);
    }

    permissionAlert = () => {
        Alert.alert(constants.permissionRequired, constants.pemissionDescription, 
        [{
             text: constants.allow,
             onPress: () => this.getPermissions() 
        }, {
            text: constants.cancel,
            onPress: () => this.permissionAlert()
        }]);
    }

    getAudios = async() => {
        const {dataProvider, audios} = this.state;

        let media = await MediaLibrary.getAssetsAsync({
            mediaType: constants.audio
        });

        media = await MediaLibrary.getAssetsAsync({
            mediaType: constants.audio,
            first: media.totalCount,
        });

        this.setState({...this.state,
            dataProvider: dataProvider.cloneWithRows([...audios, ...media.assets]), 
            audios: [...audios, ...media.assets],
            audioCount: media.totalCount
        });

        this.loadAudio();
    }

    getPermissions = async() => {
        const permission = await MediaLibrary.getPermissionsAsync();
        
        if(permission.granted) {
            this.getAudios();
        } else {
            if(permission.canAskAgain) {
                const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();

                if(status === constants.granted) {
                    this.getAudios();
                } else if(status === constants.denied) {
                    if(canAskAgain) {
                        this.permissionAlert();
                    } else {
                        this.setState({...this.state, permissionError: true});
                    }
                }
            }
        }
    }

    componentDidMount(){
        this.getPermissions();
    }

    updateState = (state = {}) => {
        this.setState({...this.state, ...state});
    }

    render() {
        const {
            audios, 
            dataProvider, 
            permissionError, 
            playBack, 
            sound, 
            audio, 
            isPlaying, 
            audioIndex,
            playBackPosition,
            playBackDuration,
            audioCount,
            playList,
            addToPlayList,
            currentPlayList,
            currentPlayListIndex
        } = this.state;

        if(permissionError) {
            return <View style={styles.container}>
                <Text style={styles.error}>No Permission Granted.</Text>
            </View>
        } else {
            return <AudioContext.Provider 
                value={{
                    audios, 
                    dataProvider, 
                    playBack, 
                    sound, 
                    audio, 
                    isPlaying,
                    audioCount,
                    audioIndex,
                    playBackPosition,
                    playBackDuration,
                    playList,
                    addToPlayList,
                    currentPlayList,
                    currentPlayListIndex,
                    updateState: this.updateState,
                    playAudio: this.playAudio,
                    playNextBy: this.playNextBy,
                    removeFromPlayList: this.removeFromPlayList,
                    removePlayList: this.removePlayList
                }}>
                {this.props.children}
            </AudioContext.Provider>
        }
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    error: {
        fontSize: 25,
        textAlign: 'center',
        color: 'red'
    }
});
