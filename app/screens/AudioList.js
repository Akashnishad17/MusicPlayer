import React, { Component } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioItem from '../components/AudioItem';
import color from '../config/color';
import Option from '../components/Option';

export default class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props){
        super(props);
        
        this.state = {
            modalVisible: false,
            audio: {}
        };
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
        const {audioIndex, playAudio} = this.context;

        return <AudioItem title={item.filename} duration={item.duration} 
            options={() => this.showOption(true, item)}
            play={() => playAudio(item)}
            isPlaying={extendedState.isPlaying}
            active={audioIndex === index} />
    }

    showOption = (modalVisible, audio) => {
        this.setState({...this.state, modalVisible, audio});
    }

    playAudio = () => {
        this.context.playAudio(this.state.audio);
        this.showOption(false, {});
    }

    addPlayList = () => {
        this.props.navigation.navigate('Play List');
    }

    render() {
        return <AudioContext.Consumer>
            {({dataProvider, isPlaying, audio}) => {
                return <View style={styles.container}>
                    <RecyclerListView 
                        dataProvider={dataProvider} 
                        layoutProvider={this.layoutProvider} 
                        rowRenderer={this.rowRenderer}
                        extendedState={{isPlaying}} />
                    <Option 
                        visible={this.state.modalVisible} 
                        item={this.state.audio}
                        isPlaying={isPlaying && this.state.audio.id == audio.id}
                        close={() => this.showOption(false, {})}
                        play={() => this.playAudio()}
                        addPlayList={() => this.addPlayList()} />
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