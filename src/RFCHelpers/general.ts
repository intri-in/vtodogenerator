import { attendeeType } from "../typeDefinitions";

export function generateAttendeeLine(attendee: attendeeType){

    if(!attendee){
        throw new Error("Attendee object is empty.")
    }
    if(!attendee.email){
        throw new Error("Attendee email is required.")
    }

    return `ATTENDEE;CN=${attendee.commonName}:mailto:${attendee.email}`
}