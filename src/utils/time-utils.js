import moment from "moment";


export const convertMinutes = (seconds) => {
    const SECOND_TIME = seconds % 60;
    if (seconds < 60) return `00:${seconds}`;
    return `${(seconds - SECOND_TIME) / 60}:${SECOND_TIME}`;
};


export const formatDate = (date, format) => moment(date).format(format);
