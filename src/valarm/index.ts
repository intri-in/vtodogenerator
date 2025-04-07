import { generateAttendeeLine } from "../RFCHelpers/general";
import { getISO8601Date } from "../helpers";
import { vAlarm, vAlarmTrigger } from "../typeDefinitions";

const allowedVAlarmActions =["email","display","audio"]

export function parseVAlarmArray(valarms: vAlarm[] | any){
    if(!valarms) return ""
    if(valarms.length==0) return ""
    let fullOutput =""
    for (const i in valarms){
        let toReturn=""
        /**
         * Set Alarm's ACTION field.
         */
        if(!valarms[i].action) {
            throw new Error("Alarm doesn't have mandatory field 'action'. It will be ignored.")
        }
        if(!allowedVAlarmActions.includes(valarms[i].action.toLowerCase())){
            throw new Error(`Invalid value '${valarms[i].action}' for action in alarm. It can only be 'action', 'display', or 'email.'`)
        }
        toReturn += `ACTION:${valarms[i].action.toUpperCase()}\n`

        /**
         * DESCRIPTION is mandatory if action is either 'display' or 'email.'
         */
        if(!valarms[i].description) {
            if(valarms[i].action.toLowerCase()=="display" || valarms[i].action.toLowerCase()=="email")
                throw new Error("Alarm doesn't have mandatory field 'description.'")
        }else{

            toReturn += `DESCRIPTION:${valarms[i].description}\n`
        }

        const trigger = generateTriggerLine(valarms[i].trigger)
        if(!trigger){
            throw new Error(`Invalid value '${valarms[i].trigger}' for trigger in alarm.`)
        }
        toReturn +=`${trigger}\n`

        /**
         * SUMMARY is required if the action is email.
         */

        if(valarms[i].action.toLowerCase()=="email"){
         if(!valarms[i].summary){
            throw new Error("Summary is mandatory if the action is 'email.'")
         }   
        }
        if(valarms[i].summary){
            toReturn += `SUMMARY:${valarms[i].summary}\n`

        }
        /**
         * ATTENDEE is required if trigger is email.
         */

        if(valarms[i].action.toLowerCase()=="email"){
            if(!valarms[i].attendees){
                throw new Error("Attendee array is required if the action is 'email.'")
            }
            if(!Array.isArray(valarms[i].attendees)){
                throw new Error("Attendees field must be an array.")
            }
            if(valarms[i].attendees.length==0){
                throw new Error("Attendees array must be atleast one entry.")
            }
            for(const j in valarms[i].attendees){
                if(!valarms[i].attendees[j]["email"] || !valarms[i].attendees[j]["commonName"]){
                    throw new Error("Attendee must have a commonName and an email. Offending input: "+JSON.stringify(valarms[i].attendees[j]))
                }
                toReturn+=generateAttendeeLine(valarms[i].attendees[j])+"\n"
            }
        }

        // console.log("toReturn", toReturn)
        if(toReturn){
            toReturn =`BEGIN:VALARM\n${toReturn}END:VALARM\n`
        }
        fullOutput += toReturn
    }

    return fullOutput


}

export function generateTriggerLine(trigger: vAlarmTrigger){
    if(!trigger){
        throw new Error(`Invalid value 'null' for trigger in alarm.`)    
    }
    if(!trigger.value){
        throw new Error(`Invalid value 'null' for value in alarm. 'value' must be a number in seconds.`)    

    }
    let toReturn = ""
    if(trigger.isRelated){
        //Trigger is of related type.

        //If it has a relatedto field, it must be either 'start' or 'end'.
        // console.log("trigger.relatedTo", trigger.relatedTo, "HERE")
        if(trigger.relatedTo.toLowerCase()!="end" && trigger.relatedTo.toLowerCase()!="start" ){
            throw new Error(`Invalid value '${trigger.relatedTo}' for relatedTo in alarm's trigger. It can be either 'start' or 'end'.`)    
        }
        const valueInMinutes=parseInt(trigger.value.toString())/60
        if(trigger.relatedTo){

            toReturn=`TRIGGER;RELATED=${trigger.relatedTo.toUpperCase()}:`
        }else{
            toReturn='TRIGGER:'
        }
        const valueString = `PT${Math.abs(valueInMinutes)}M`
        if(valueInMinutes<0){
            toReturn+=`-${valueString}`
        }else{
            toReturn+=`${valueString}`
        }

    }else{
        // Trigger is of DateTime Type.
        toReturn=`TRIGGER:VALUE=DATE-TIME:${getISO8601Date(trigger.value)}`
       
    }

    return toReturn


}