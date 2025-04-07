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

export function getISO8601Date(date: string | number, skipTime?: boolean){
        let toReturn = ""

        if(date!=null)
        {
            //var dueDateUnix= this.tz==undefined ?  moment(date).unix()*1000 : moment(date).tz(this.tz).unix()*1000;
            var dueDateUnix=moment(date).unix()*1000
            toReturn =  moment(dueDateUnix).format('YYYYMMDD');
            if(skipTime==null || skipTime==false)
            {
                toReturn +=  "T"+moment(dueDateUnix).format('HHmmss');

            }
        }
        else{
            return null
        }
        return toReturn
}