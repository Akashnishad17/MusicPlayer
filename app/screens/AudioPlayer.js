import React, { useContext } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import color from '../config/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Player from '../components/Player';
import { AudioContext } from '../context/AudioProvider';
import constants from '../config/constants';
import { convertTime } from '../config/service';
import { move } from '../config/AudioController';

const {width} = Dimensions.get(constants.window);

const AudioPlayer = () => {
    const {
        audioIndex, 
        audioCount, 
        audio, 
        isPlaying, 
        playBackPosition, 
        playBackDuration,
        playAudio,
        playNextBy,
        playBack,
        sound,
        updateState,
        currentPlayList,
        currentPlayListIndex
    } = useContext(AudioContext);

    const calculateSlider = () => playBackPosition && playBackDuration ? playBackPosition / playBackDuration : 0;

    const updateSlider = async(position) => {
        const status = await move(playBack, sound.durationMillis * position);

        updateState({
            sound: status,
            playBackPosition: status.positionMillis
        });
    }

    const getCounter = () => {
        if(currentPlayList === null) {
            return `${audioIndex + 1} / ${audioCount}`;
        } else {
            return `${currentPlayListIndex + 1} / ${currentPlayList.audios.length}`;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text>
                    {currentPlayList ? `Play List - ${currentPlayList.title}` : 'Audios'}    
                </Text>
                <Text>{getCounter()}</Text>
            </View>
            <View style={styles.banner}>
                <MaterialCommunityIcons 
                    name="music-circle" 
                    size={300} 
                    color={isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} 
                />
            </View>
            <View>
                <Text numberOfLines={1} style={styles.title}>{audio.filename}</Text>
                <View style={styles.time}>
                    <Text>{convertTime(playBackPosition / 1000)}</Text>
                    <Text>{convertTime(audio.duration)}</Text>
                </View>
                <Slider 
                    style={styles.slider} 
                    minimumValue={0}
                    maximumValue={1} 
                    value={calculateSlider()}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                    onSlidingComplete={(value) => updateSlider(value)}
                />
                <View style={styles.controller}>
                    <Player 
                        type={constants.PREV}
                        press={() => playNextBy(-1)}
                    />
                    <Player 
                        press={() => playAudio(audio)}
                        style={{marginHorizontal: 25}} 
                        type={isPlaying ? constants.PLAY : constants.PAUSE} 
                    />
                    <Player 
                        press={() => playNextBy(1)}
                        type={constants.NEXT}
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
        flexGrow: 50,
        padding: 15,
        color: color.FONT_LIGHT,
        fontSize: 14
    },
    banner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        color: color.FONT_LIGHT,
        fontWeight: 16,
        paddingTop: 5
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
    },
    time: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    }
});

export default AudioPlayer;
