import React, { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import color from '../config/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Player from '../components/Player';
import { AudioContext } from '../context/AudioProvider';
import { pause, resume } from '../config/AudioController';

const {width} = Dimensions.get('window');

const AudioPlayer = () => {
    const {
        audioIndex, 
        audioCount, 
        audio, 
        isPlaying, 
        playBackPosition, 
        playBackDuration,
        playAudio,
        playNextBy
    } = useContext(AudioContext);

    const calculateSlider = () => playBackPosition && playBackDuration ? playBackPosition / playBackDuration : 0;

    return (
        <View style={styles.container}>
            <Text style={styles.count}>{`${audioIndex + 1} / ${audioCount}`}</Text>
            <View style={styles.banner}>
                <MaterialCommunityIcons 
                    name="music-circle" 
                    size={300} 
                    color={isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} 
                />
            </View>
            <View style={styles.player}>
                <Text numberOfLines={1} style={styles.title}>{audio.filename}</Text>
                <Slider 
                    style={styles.slider} 
                    minimumValue={0}
                    maximumValue={1} 
                    value={calculateSlider()}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                />
                <View style={styles.controller}>
                    <Player 
                        type='PREV' 
                        press={() => playNextBy(-1)}
                    />
                    <Player 
                        press={() => playAudio(audio)}
                        style={{marginHorizontal: 25}} 
                        type={isPlaying ? 'PLAY' : 'PAUSE'} 
                    />
                    <Player 
                        press={() => playNextBy(1)}
                        type='NEXT' 
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    count: {
        textAlign: 'right',
        padding: 15,
        color: color.FONT_LIGHT,
        fontSize: 14
    },
    banner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    player: {

    },
    title: {
        fontSize: 16,
        color: color.FONT,
        padding: 15
    },
    slider: {
        width: width, 
        height: 40
    },
    controller: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        paddingBottom: 20
    }
});

export default AudioPlayer;
