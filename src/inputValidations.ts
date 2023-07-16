import moment from "moment"
import { inputObj } from "./typeDefinitions"
import VTodoGenerator from "./VTodoGenerator"
import { ErrorMessages } from "./errors"

export function isValidTimezone(timezone: string | undefined): boolean {
    if(timezone== null || timezone==undefined){
        return false
    }
    return !!moment.tz.zone(timezone) 
}

export function isValidInput(todoObject: inputObj, enforceStrict?): boolean{

    if(enforceStrict==false){
        return true
    }
    if(("summary" in todoObject)==false || (("summary" in todoObject) && todoObject.summary.trim()=="")){
      
      if(!('recurrenceid' in todoObject)){
        // Don't require summary in case it is a recurrence object.
        throw new Error("A summary is required for the task.")
      }  
    }

    if(("due" in todoObject) ){
        
        //Check if due is a valid date.
        var parsedDue = moment(todoObject.due)
        if(!parsedDue.isValid()){
            throw new Error("Due date must be in ISO Date format.")
        }
    }

    if("dtstamp" in todoObject ){
        var parsedDate = moment(todoObject.dtstamp)
        if(!parsedDate.isValid()){
            throw new Error("Dtstamp must be in ISO Date format.")
        }

    }
    if("created" in todoObject){
        var parsedDate = moment(todoObject.created)
        if(!parsedDate.isValid()){
            throw new Error("created must be in ISO Date format.")
        }

    }
    if("completion" in todoObject){
        if(todoObject.completion!=undefined){
            if(typeof(todoObject.completion)!="string" && typeof(todoObject.completion)!="number"){
                throw new Error("Completion must be a number of a string.")
            }
            var completionNumber: number = parseInt(todoObject.completion.toString())

            if(completionNumber<0 || completionNumber>100){
                throw new Error("Completion must not be less than 0 or more than 100")
            }

        }else{
            throw new Error("Completion must not be less than 0 or more than 100")

        }
    }


    if("status" in todoObject){
        if(!VTodoGenerator.statusIsValid (todoObject.status)){
            throw new Error("Status is invalid.")
        }
    }
    
    if("relatedto" in todoObject){
        if(todoObject.relatedto==undefined){
            throw new Error("Invalid value for Relatedto.")
        }
        
        if(Array.isArray(todoObject.relatedto)){

            if(todoObject.relatedto.length==0){
                throw new Error("Invalid value of relatedto:"+todoObject.relatedto)
            }
            for(const i in todoObject.relatedto){

                isValidRelatedToObject(todoObject.relatedto[i])
            }
        }else{
            isValidRelatedToObject(todoObject.relatedto)
        }
      
    }

    if("priority" in todoObject){
        isValidPriority(todoObject.priority)

    }

    if("rrule" in todoObject){
        if(!("start" in todoObject))
        {
            throw new Error("start must be specified if rrule is specified.")
        }else{
    
            isValidStartDate(todoObject.start)
        }
        isValidRRule(todoObject.rrule)
    }

    if("geo" in todoObject){
        isValidGeo(todoObject.geo)

    }

    if("location" in todoObject){
        if(todoObject.location==undefined || todoObject.location==null){
            throw new Error(ErrorMessages.invalidLocation)
        }

        if(todoObject.location=="" || todoObject.location.trim()==""){
            throw new Error(ErrorMessages.invalidLocation)

        }
    }

    if("organizer" in todoObject){
        if(todoObject.organizer==undefined || todoObject.organizer==null){
            throw new Error(ErrorMessages.invalidOrganizer)
        }

        if(todoObject.organizer=="" || todoObject.organizer.trim()==""){
            throw new Error(ErrorMessages.invalidOrganizer)

        }
    }

    if("sequence" in todoObject){
        if(todoObject.sequence==undefined || todoObject.sequence==null){
            throw new Error(ErrorMessages.invalidSequence)
        }

        if(todoObject.sequence=="" || todoObject.sequence.toString().trim()==""){
            throw new Error(ErrorMessages.invalidSequence)

        }
    }

    if("url" in todoObject){
        if(todoObject.url==undefined || todoObject.url==null){
            throw new Error(ErrorMessages.invalidURL)
        }

        if(todoObject.url=="" || todoObject.url.toString().trim()==""){
            throw new Error(ErrorMessages.invalidURL)

        }
    }
    return true
}

export function isValidGeo(geo: string | undefined){
    if(geo==null || geo==undefined){
        throw new Error(ErrorMessages.invalidGeo)
    }

   
    var splitGeo=geo.split(';')
    if(!Array.isArray(splitGeo)){
        throw new Error(ErrorMessages.invalidGeo)
    }else{
        if(splitGeo.length==2){
            return true
        }else{
            throw new Error(ErrorMessages.invalidGeo)
        }
    }
}
export function isValidStartDate(start:  string | undefined){
    var parsedDate = moment(start)
    if(!parsedDate.isValid()){
        throw new Error(ErrorMessages.invalidStartDate)
    }


}
export function isValidRelatedToObject(relatedto: any){
    if(relatedto==null || relatedto ==undefined){
        throw new Error("Invalid value for Relatedto.") 
    }

    var type_input = typeof(relatedto)
    if(type_input=="string"){

        if(relatedto!="" && relatedto.trim()!=""){
            return true
        }else{
            throw new Error("Invalid value for Relatedto.") 
        }
    }
    /**
     * Now we assume relatedto is an object, since it is not a string.
     */

    if(!('params' in relatedto)){
        throw new Error("params in related to cannot be undefined:"+relatedto) 
    }else{
        if(!('RELTYPE'in relatedto.params)){

            throw new Error("RELTYPE undefined in relatedto.")
        }else{

            if(!isValidRelType(relatedto.params.RELTYPE)){
                return false
            }
        }
    }

    if(!('val' in relatedto)){
        return false
    }else{
        if(typeof(relatedto.val)!=="string"){
            throw new Error("relatedto.val must be a string. Invalid valuee:"+relatedto.val)
        }else{
            if(relatedto.val=="" || relatedto.val.trim()==""){
                throw new Error("relatedto.val must be a string.")
            }
        }
    }

    return true

}

export function isValidRelType(reltype?: any ){
    if(reltype==null || reltype==undefined ){
        throw new Error("Invalid value for RELTYPE.")
    }

    if(reltype!="CHILD" && reltype!="PARENT" && reltype!="SIBLING"){
        throw new Error("Invalid value for RELTYPE:"+reltype)
    }

    return true
}


export function isValidPriority(priority: any){

    if(priority==null || priority==undefined){
        throw new Error("Priority cannot be undefined.")
    }

    if(typeof(priority)!="string" && typeof(priority)!="number"){
        throw new Error("Priority should either be a number or a string.")
    }

    return true
}

export function isValidRRule(rrule: any){
    if(rrule==null || rrule==undefined){
        throw new Error("Rrule cannot be null or undefined.")
    }

    if(!("FREQ" in rrule)){
        throw new Error("Rrule.FREQ cannot be null or undefined.")

    }
    if(!("INTERVAL" in rrule)){
        throw new Error("Rrule.INTERVAL cannot be null or undefined.")

    }

    if("UNTIL" in rrule){
        var parsedDate = moment(rrule.UNTIL)
        if(!parsedDate.isValid()){
            throw new Error("rrule.UNTIL must be a valid date in ISO Date format.")
        }


    }

    return true


}
