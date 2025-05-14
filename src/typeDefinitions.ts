export interface inputObj {
    due?: string
    dtstamp? : string
    uid?: string
    categories?: string[] 
    completed?: string
    summary: string
    created?:string
    completion?:string | number
    status?: string 
    relatedto?: string | relatedToType | relatedToType[]
    priority?: string | number
    recurrenceid?: string 
    description?: string
    start?: string
    class?: string
    rrule?: rruleType
    geo?: string
    location?: string
    organizer?:string
    sequence?:number | string
    resources?: string | string[]
    url?:string
    recurrences?: inputObj[]
    tz?:string
    valarms?: vAlarm[]



}
export interface relatedToType{
    params:{
        RELTYPE: string

    },
    val:string
}
export interface rruleType{
    FREQ: string,
    INTERVAL: string | number,
    UNTIL?: string
    COUNT?: number
}

export interface optionsType{
    strict: boolean
}

export interface vAlarm{
    action: string;
    trigger: vAlarmTrigger;
    description?: string;
    repeat?: vAlarmRepeat;
    summary?:string
    attendees?:attendeeType[]
    simpleMode?:boolean
}
/**
 *
 */
export interface vAlarmTrigger{
    isRelated: boolean;
    value: string | number ;
    relatedTo?: string;
}

export interface vAlarmRepeat{
    repeat: number;
    duration: number;
}

export interface attendeeType{
    commonName: string,
    email:string
}