import moment from "moment-timezone";

export function generateNewUID()
{
    var crypto = require("crypto");
    var id = crypto.randomBytes(32).toString('hex');
    return id+"@intri"
}

export function convertToTimeZone(date: string, tz:string){

    var convertedTime  = moment.tz(date, tz);
    return convertedTime
}