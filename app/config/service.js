export const convertTime = (minutes) => {
    if(minutes){
        const hr = minutes / 60;
        const minute = parseInt(hr.toString().split('.')[0]);
        const percent = parseInt(hr.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if(minute < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if(minute < 10) {
            return `0${minute}:${sec}`;
        }

        if(sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`;
    }

    return '00:00';
};