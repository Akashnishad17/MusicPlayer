import React, { Component, createContext } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import { Audio } from 'expo-av';
import { load, pause, playNext, resume } from '../config/AudioController';
import { loadAudio, loadPlayList, storeAudio } from '../config/AsyncStorage';
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
            addToPlayList: null
        };
    }

    loadAudio = async() => {
        const audioData = await loadAudio();
        let playList = await loadPlayList();
        let audio, audioIndex;

        if(audioData === null) {
            audio = this.state.audios[0];
            audioIndex = 0;
        } else {
            audio = audioData.audio;
            audioIndex = audioData.index;
        }

        if(playList == null) {
            const defaultPlayList = {
                id: Date.now(),
                title: 'My Favorite',
                audios: []
            };

            playList = [defaultPlayList];
        }

        const playBack = new Audio.Sound();
        const sound = await load(playBack, audio.uri);

        this.updateState({
            audio, 
            audioIndex, 
            playBack, 
            sound,
            playList
        });

        playBack.setOnPlaybackStatusUpdate(this.setOnPlaybackStatusUpdate);
        storeAudio(audio, audioIndex);
    }

    setOnPlaybackStatusUpdate = (playBackStatus) => {
        if(playBackStatus.isLoaded && playBackStatus.isPlaying) {
            this.updateState({
                playBackPosition: playBackStatus.positionMillis,
                playBackDuration: playBackStatus.durationMillis
            });
        }

        if(playBackStatus.didJustFinish) {
            this.playNextBy(1);
        }
    }

    playNextBy = (shift) => {
        const nextIndex = (this.state.audioIndex + shift + this.state.audioCount) % this.state.audioCount;
        const audio = this.state.audios[nextIndex];
        this.playAudio(audio);
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
                const index = audios.indexOf(item);

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
            addToPlayList
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
                    updateState: this.updateState,
                    playAudio: this.playAudio,
                    playNextBy: this.playNextBy
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
