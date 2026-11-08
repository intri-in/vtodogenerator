import { Frequency, RRule } from "rrule";
import { rruleType } from "../typeDefinitions";

export function getRRuleFromExternalLib(rrule:rruleType | undefined): string{
    if(!rrule) return ""
    if (!rrule.FREQ) return ""
    const until = rrule.UNTIL ? new Date(rrule.UNTIL): undefined
    const interval = Number(rrule.INTERVAL)
    let rruleInput: RRule =  new RRule({freq: freqNumberFromString(rrule.FREQ), interval: ( !isNaN(interval)) ? interval : undefined, until: until,  byweekday: rrule.BYWEEKDAY, count : rrule.COUNT})
    return rruleInput.toString()

}

function freqNumberFromString(freq: string): number{
    return Frequency[freq]
}