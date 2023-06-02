import React, { Component, createContext } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext();
export default class AudioProvider extends Component {
    constructor(props){
        super(props);
        this.state = {
            audios: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2)
        };
    }

    permissionAlert = () => {
        Alert.alert('Permission Required', 
            'This app needs permission to read audio files.', [{
             text: 'Allow',
             onPress: () => this.getPermissions() 
        }, {
            text: 'Cancel',
            onPress: () => this.permissionAlert()
        }]);
    }

    getAudios = async() => {
        const {dataProvider, audios} = this.state;
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio'
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        });
        this.setState({...this.state,
            dataProvider: dataProvider.cloneWithRows([...audios, ...media.assets]), 
            audios: [...audios, ...media.assets]
        });
    }

    getPermissions = async() => {
        const permission = await MediaLibrary.getPermissionsAsync();
        
        if(permission.granted) {
            this.getAudios();
        } else {
            if(permission.canAskAgain) {
                const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();

                if(status === 'granted') {
                    this.getAudios();
                } else if(status === 'denied') {
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

    render() {
        if(this.state.permissionError) {
            return <View style={styles.container}>
                <Text style={styles.error}>No Permission Granted.</Text>
            </View>
        } else {
            return <AudioContext.Provider value={{audios: this.state.audios, dataProvider: this.state.dataProvider}}>
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
