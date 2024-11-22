import {parse, format, parseISO, isValid } from 'date-fns';
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export function parseWithTimeZone(date : string, format : string, referenceDate : any, timeZone : string) {
    const zonedDate = toZonedTime(referenceDate, timeZone);
    const parsedDate = parse(date, format, zonedDate);
    return fromZonedTime(parsedDate, timeZone);
}
export const validateDateFormat = (date : string, format: string) => {
    if(date && format.length == date.length){
        const value = parse(date, format, new Date());
        if(isValid(value)){
            return value
        }
    }
    return null;
}

export const formatDate = (date: number | Date | string) => {
    if(date){
        if(typeof date === "string"){
            date = parseISO(date);
        }
        date = format(date, 'd MMM yyyy');
        return date
    }
    return "";
};

export const formatDateTime = (date: number | Date | string) => {
    if(date){
        if(typeof date === "string"){
            date = parseISO(date);
        }
        date = format(date, 'd MMM yyyy hh:mm:ss');
        return date
    }
    return "";
};

export function createDateTimeObject(datetimeString : string, formats = [
    'dd/MM/yyyy',
    'dd/MM/yyyy HH,mm,ss',
    'dd.MM.yyyy',
    'dd/MM/yyyy HH:mm:ss',
    'dd/MM/yyyy HH.mm.ss',
    'dd-MM-yyyy HH:mm:ss',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd HH.mm.ss',
    'MM/dd/yyyy hh:mm:ss a XXX',
    'yyyy-MM-dd',
    'dd-MMM-yyyy'
]) {
    for (const format of formats) {
        const dateTime = parse(datetimeString, format, new Date());
        
        if (isValid(dateTime)) {
            return dateTime;  // Return as JavaScript Date object
        }
    }

    return false;  // Return false if none of the formats matched
}

export const convertDates = (data: any, depth: number = 0, maxDepth: number = 10): any => {
if (depth > maxDepth) return data; // Stop recursion if maxDepth is reached

if (Array.isArray(data)) {
    return data.map((item) => convertDates(item, depth + 1));
} else if (typeof data === "object" && data !== null) {
    const newData = { ...data };
    let flag = null;
    try {
    for (const key in newData) {
        flag = {
        key: key,
        current_data: newData[key],
        data: newData
        };

        if (!!newData[key] && typeof newData[key] === "object" && !(newData[key] instanceof Date)) {
        newData[key] = convertDates(newData[key], depth + 1); // Recursive call with increased depth
        } else if (typeof newData[key] === 'string') {
            const dateString = newData[key];

            // Check for the specific "0000-00-00 00:00:00" string
            if (dateString === '0000-00-00 00:00:00') {
            newData[key] = null; // or handle it as you prefer
            } else {
            const date = createDateTimeObject(dateString); // It checks and parses multiple formats
            if (date) {
                newData[key] = date;
            }
            }
        }
    }
    } catch (error) {
    console.warn({
        error,
        data: flag
    });
    }
    return newData;
}
return data;
};
