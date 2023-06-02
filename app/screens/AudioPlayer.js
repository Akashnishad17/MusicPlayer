import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AudioPlayer = () => {
    return (
        <View style={styles.container}>
            <Text>AudioPlayer</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AudioPlayer;
