export const play = async(playBack, uri) => {
    try{
        return await playBack.loadAsync({uri}, {shouldPlay: true});
    } catch(error) {
        console.log('Error while playing audio');
    }
}

export const pause = async(playBack) => {
    try{
        return await playBack.setStatusAsync({shouldPlay: false});
    } catch(error) {
        console.log('Error while pausing audio');
    }
}

export const resume = async(playBack) => {
    try{
        return await playBack.playAsync();
    } catch(error) {
        console.log('Error while resuming audio');
    }
}

export const playNext = async(playBack, uri) => {
    try{
        await playBack.stopAsync();
        await playBack.unloadAsync();
        return await play(playBack, uri);
    } catch(error) {
        console.log('Error while playing next audio');
    }
}