export const getDateString = (date: Date): string => {
    const currentDate = new Date();
    if (date.toDateString() === currentDate.toDateString()) {
        const meridiem = date.getHours() >= 12 ? "PM" : "AM";
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
    
        const HH = hours < 10 ? `0${hours}` : `${hours}`;
        const MM = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
        return `${HH}:${MM} ${meridiem}`;
    }
    else {
        return date.toDateString();
    }
}