import React, { useContext } from 'react';
import { FlatList, Modal, StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import constants from '../config/constants';
import color from '../config/color';
import AudioItem from './AudioItem';
import { AudioContext } from '../context/AudioProvider';

const PlayListDetail = ({visible, playList, close}) => {
    const {playAudio, isPlaying, audio} = useContext(AudioContext);

    return (
        <Modal 
            transparent 
            visible={visible}
            animationType='slide'
            onRequestClose={close}>
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
                                play={() => playAudio(item)}
                                isPlaying={isPlaying}
                                active={audio.id === item.id} 
                            />
                        </View>
                    }
                />
            </View>
            <TouchableWithoutFeedback onPress={close}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const {width, height} = Dimensions.get(constants.window);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        maxHeight: height - 150,
        width: width - 15,
        backgroundColor: color.ACTIVE_FONT,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    modalBG: {
        backgroundColor: color.MODAL_BG,
        zIndex: -1
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