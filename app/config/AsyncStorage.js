import AsyncStorage from "@react-native-async-storage/async-storage";
import constants from './constants';

const getItem = async(key) => {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
}

const setItem = async(key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storeAudio = async(audio, index) => {
    await setItem(constants.audio, {audio, index});
};

export const loadAudio = async() => {
    return await getItem(constants.audio);
}

export const loadPlayList = async() => {
    return await getItem(constants.playList);
}

export const storePlayList = async(playList) => {
    setItem(constants.playList, playList);
}

export const storeCurrentPlayList = async(playList, playListIndex) => {
    setItem(constants.currentPlayList, {playList, playListIndex});
}

export const loadCurrentPlayList = async() => {
    return await getItem(constants.currentPlayList);
}