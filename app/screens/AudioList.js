import React, { Component } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioItem from '../components/AudioItem';
import color from '../config/color';
import Option from '../components/Option';
import { Audio } from 'expo-av';
import { pause, play, playNext, resume } from '../config/AudioController';

export default class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props){
        super(props);
        
        this.state = {
            modalVisible: false
        };

        this.audio = {};
    }

    layoutProvider = new LayoutProvider((index) => 'audio', (type, dim) => {
        switch(type) {
            case 'audio':
                dim.width = Dimensions.get('window').width;
                dim.height = 70;
                break;
            default:
                dim.width = 0;
                dim.height = 0;
        }  
    });

    rowRenderer = (type, item, index, extendedState) => {
        const {audio} = this.context;

        return <AudioItem title={item.filename} duration={item.duration} 
            options={() => this.showOption(true, item)}
            play={() => this.playAudio(item)}
            isPlaying={extendedState.isPlaying}
            active={audio.id === item.id} />
    }

    showOption = (visible, audio) => {
        this.audio = audio;
        this.setState({...this.state, modalVisible: visible});
    }

    playAudio = async(item) => {
        this.showOption(false, {});
        const {playBack, sound, audio, updateState} = this.context;

        if(sound === null) {
            const playBack = new Audio.Sound();
            const status = await play(playBack, item.uri);
            return updateState({
                playBack: playBack, 
                sound: status, 
                audio: item,
                isPlaying: true,
            });
        }

        if(sound.isLoaded) {
            if(audio.id === item.id) {
                const status = sound.isPlaying ? await pause(playBack) : await resume(playBack);
                return updateState({sound: status, isPlaying: !sound.isPlaying});
            } else {
                const status = await playNext(playBack, item.uri);
                return updateState({sound: status, audio: item, isPlaying: true});
            }
        }
    }

    render() {
        return <AudioContext.Consumer>
            {({dataProvider, isPlaying}) => {
                return <View style={styles.container}>
                    <RecyclerListView 
                        dataProvider={dataProvider} 
                        layoutProvider={this.layoutProvider} 
                        rowRenderer={this.rowRenderer}
                        extendedState={{isPlaying}} />
                    <Option 
                        visible={this.state.modalVisible} 
                        item={this.audio}
                        close={() => this.showOption(false, {})}
                        play={() => this.playAudio(this.audio)}
                        addPlayList={() => {}} />
                </View>
            }}
        </AudioContext.Consumer>
    };
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: color.APP_BG,
        paddingTop: StatusBar.currentHeight
    }
});