export const load = async(playBack, uri) => {
    try{
        return await playBack.loadAsync(
            {uri}, 
            {shouldPlay: false, progressUpdateIntervalMillis: 1000}
        );
    } catch(error) {
        console.log('Error while loading audio', error.message);
    }
}

export const play = async(playBack, uri) => {
    try{
        return await playBack.loadAsync(
            {uri}, 
            {shouldPlay: true, progressUpdateIntervalMillis: 1000}
        );
    } catch(error) {
        console.log('Error while playing audio', error.message);
    }
}

export const pause = async(playBack) => {
    try{
        return await playBack.setStatusAsync({shouldPlay: false});
    } catch(error) {
        console.log('Error while pausing audio', error.message);
    }
}

export const resume = async(playBack) => {
    try{
        return await playBack.playAsync();
    } catch(error) {
        console.log('Error while resuming audio', error.message);
    }
}

export const playNext = async(playBack, uri) => {
    try{
        await playBack.stopAsync();
        await playBack.unloadAsync();
        return await play(playBack, uri);
    } catch(error) {
        console.log('Error while playing next audio', error.message);
    }
}

export const move = async(playBack, position) => {
    try {
        return await playBack.setPositionAsync(position);
    } catch(error) {
        console.log('Error while setting postion for audio', error.message);
    }
}