import moment from "moment-timezone"
import { inputObj, optionsType, relatedToType, rruleType } from "./typeDefinitions"
import { isValidInput, isValidTimezone } from "./inputValidations"
import { generateNewUID } from "./helpers"

class VTodoGenerator{

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
    recurrences?: {}
    tz?:string
    enforceStrict?:boolean

    constructor(todoObject: inputObj, options?: optionsType)
    {
        var enforceStrict= (options!=undefined && options!=null && options.strict!=undefined) ?  options.strict : true
        this.enforceStrict= enforceStrict
        if(isValidInput(todoObject, enforceStrict)){
            this.due = todoObject.due!=undefined? todoObject.due: undefined
            this.dtstamp=todoObject.dtstamp!=undefined? todoObject.dtstamp: undefined
            this.uid= todoObject.uid!=undefined? todoObject.uid: undefined
            this.categories = todoObject.categories!=undefined? todoObject.categories: undefined 
            this.completed=todoObject.completed!=undefined? todoObject.completed: undefined 
            this.summary=todoObject.summary
            this.created=todoObject.created!=undefined? todoObject.created: undefined
            this.completion=todoObject.completion!=undefined? todoObject.completion: undefined
            this.status=todoObject.status!=undefined? todoObject.status: undefined
            this.relatedto=todoObject.relatedto!=undefined? todoObject.relatedto: undefined
            this.priority=todoObject.priority!=undefined? todoObject.priority: undefined
            this.priority=todoObject.priority!=undefined? todoObject.priority: undefined
            this.recurrenceid=todoObject.recurrenceid!=undefined? todoObject.recurrenceid: undefined
            this.description=todoObject.description!=undefined? todoObject.description: undefined
            this.start=todoObject.start!=undefined? todoObject.start: undefined
            this.class=todoObject.class!=undefined? todoObject.class: undefined
            this.rrule=todoObject.rrule!=undefined? todoObject.rrule: undefined
            this.geo=todoObject.geo!=undefined? todoObject.geo: undefined
            this.location=todoObject.location!=undefined? todoObject.location: undefined
            this.organizer=todoObject.organizer!=undefined? todoObject.organizer: undefined
            this.sequence=todoObject.sequence!=undefined? todoObject.sequence: undefined
            this.resources=todoObject.resources!=undefined? todoObject.resources: undefined
            this.url=todoObject.url!=undefined? todoObject.url: undefined
            this.recurrences=todoObject.recurrences!=undefined? todoObject.recurrences: undefined
            this.tz=todoObject.tz!=undefined? todoObject.tz: undefined

        

        }else{
            throw new Error("No valid task object provided.")

        }
        /*
        if(todoObject!=null && Object.keys(todoObject).length>0)
        {
            for(const key in todoObject)
            {
                this[key]=todoObject[key]
            }
        }else{
            throw new Error("No valid task object provided.")

        }
        */
    }

    varNotEmpty(variable: any)
    {

        if(variable!=null && variable!=undefined)
        {
            return true
        }else
        {
            return false
        }
    }

    generate(skipVCALENDAR=false)
    {
        var dtstamp: string| null=""
        if(this.dtstamp!=null && this.dtstamp!="")
        {
            dtstamp=this.getISO8601Date(this.dtstamp)
        }
        else
        {
            dtstamp = this.getISO8601Date(moment().unix()*1000)

        }
        var categories=""
        var uid= ""
        if(this.uid!=null&&this.uid!="")
        {
            uid=this.uid
        }
        else
        {
            uid=generateNewUID()
        }
        if(this.categories!=null && Array.isArray(this.categories) && this.categories.length>0)
        {
            for (let i =0; i< this.categories.length; i++)
            {
                if(i!==(this.categories.length-1)) 
                {
                    categories+= this.categories[i]+","

                }
                else{
                    categories+= this.categories[i]

                }
            }
        }
        var finalVTODO=""
        if(skipVCALENDAR==null || skipVCALENDAR==undefined || skipVCALENDAR==false)
        {
            finalVTODO+="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//VTODOGENERATOR v1.0.0\n"

        }
        finalVTODO +="BEGIN:VTODO\nUID:"+uid+"\n"
        finalVTODO += !isValidTimezone(this.tz) ? "DTSTAMP:"+dtstamp+"\n" :`DTSTAMP;TZID=${this.tz}:`+dtstamp+"\n"  

        if(this.created!=null && this.created!="")
        {
            finalVTODO += isValidTimezone(this.tz) ?`CREATED;TZID=${this.tz}:`+this.getISO8601Date(this.created)+"\n":"CREATED:"+this.getISO8601Date(this.created)+"\n"
        }  

        if(this.summary!=null && this.summary!=""){
       
            finalVTODO +="SUMMARY:"+this.summary+"\n"
        }  
    
        if(this.due!=null && this.due!="")
        {
            //finalVTODO += !isValidTimezone(this.tz) ? "DUE:"+this.getISO8601Date(this.due)+"\n" : `DUE;TZID=${this.tz}:`+this.getISO8601Date(this.due)+"\n" 
            finalVTODO +="DUE:"+this.getISO8601Date(this.due)+"\n" 
        }


        if(this.completed!=null && this.completed!="")
        {
            finalVTODO += "COMPLETED:"+this.getISO8601Date(moment().unix()*1000)+"\n"

            // The task is completed, so we set the STATUS as COMPLETED.
            // This is required for apps like JTX Boards to recognize that the task has been completed.
            finalVTODO += "STATUS:COMPLETED\n" 

            //finalVTODO +="PERCENT-COMPLETE: 100\n" 
            if(this.completion!=null && this.completion!="")
            {
                finalVTODO +="PERCENT-COMPLETE:"+this.completion+"\n" 
            }

        }else{
            if(this.status!=null&&this.status!=""&& VTodoGenerator.statusIsValid(this.status)){
                finalVTODO +="STATUS:"+this.status.toUpperCase()+"\n" 
    
            }
    
            if(this.completion!=null && this.completion!="")
            {
                finalVTODO +="PERCENT-COMPLETE:"+this.completion+"\n" 
            }
            else
            {
                finalVTODO +="PERCENT-COMPLETE:0\n" 

            }
        }
        if(categories!=null && categories!="")
        {
            finalVTODO += "CATEGORIES:"+categories+"\n"

        }
        if(this.relatedto!=null && this.relatedto!="")
        {
            if(typeof(this.relatedto)=="string")
            {
                finalVTODO +="RELATED-TO:"+this.relatedto+"\n"
            }else
            {
                if(Array.isArray(this.relatedto) )
                {
                    for(const i in this.relatedto)
                    {
                        if(this.varNotEmpty(this.relatedto[i].params) && this.varNotEmpty(this.relatedto[i].params.RELTYPE) && this.varNotEmpty(this.relatedto[i].val)){
                            var relatedOutput="RELATED-TO;RELTYPE="+this.relatedto[i].params.RELTYPE.toString().toUpperCase()+":"+this.relatedto[i].val+"\n"
                            finalVTODO+=relatedOutput
    
                        }
                    }
                }else{
                        var relatedOutput="RELATED-TO;RELTYPE="+this.relatedto.params.RELTYPE.toString().toUpperCase()+":"+this.relatedto.val+"\n"
                        finalVTODO+=relatedOutput
    
                   
                }
            }

        }
        if(this.priority!=null && this.priority!="")
        {
            finalVTODO +="PRIORITY:"+this.priority+"\n"

        }

        if(this.description!=null && this.description!="")
        {
            var description=this.description.replace(/(?:\r\n|\r|\n)/g, '\\n');
  
            finalVTODO +="DESCRIPTION:"+description+"\n"

        }
        if(this.start!=null && this.start!="")
        {
            //finalVTODO +="DTSTART:"+this.getISO8601Date(this.start)+"\n"
            finalVTODO += isValidTimezone(this.tz)? `DTSTART;TZID=${this.tz}:`+this.getISO8601Date(this.start)+"\n": "DTSTART:"+this.getISO8601Date(this.start)+"\n"

        }

        if(this.class!=null && this.class!="" && this.class!=undefined)
        {
            finalVTODO +="CLASS:"+this.class+"\n"

        }

        if(this.geo!=null && this.geo!="" && this.geo!=undefined)
        {
            finalVTODO +="GEO:"+this.geo+"\n"

        }

        /*
        if(this.lastmod!=null && this.lastmod!="" && this.lastmod!=undefined)
        {
            finalVTODO +="LAST-MODIFIED:"+this.lastmod+"\n"

        }else{
            finalVTODO +="LAST-MODIFIED:"+dtstamp+"\n"

        }
        */
        
        //finalVTODO +="LAST-MODIFIED:"+this.getISO8601Date(Date.now())+"\n"
        finalVTODO += isValidTimezone(this.tz) ? `LAST-MODIFIED;TZID=${this.tz}:`+this.getISO8601Date(Date.now())+"\n":"LAST-MODIFIED:"+this.getISO8601Date(Date.now())+"\n"


        if(this.location!=null && this.location!="" && this.location!=undefined)
        {
            finalVTODO +="LOCATION:"+this.location+"\n"

        }
        if(this.organizer!=null && this.organizer!="" && this.organizer!=undefined)
        {
            finalVTODO +="ORGANIZER:"+this.organizer+"\n"

        }

        if(this.sequence!=null && this.sequence!=undefined)
        {
            finalVTODO +="SEQUENCE:"+this.sequence+1+"\n"

        }

        if(this.resources!=null && this.resources!="" && Array.isArray(this.resources) && this.resources.length>0)
        {
            var resourcesOutput="RESOURCES:"

            for(let i=0; i< this.resources.length; i++)
            {

                if(i!==(this.resources.length-1)) 
                {
                    resourcesOutput+= this.resources[i]+","

                }
                else{
                    resourcesOutput+= this.resources[i]

                }


            }
            finalVTODO +=resourcesOutput+"\n"


        }
        if(this.rrule!=null && this.rrule["FREQ"]!="" && this.rrule["FREQ"]!=null && this.rrule["INTERVAL"]!="" && this.rrule.INTERVAL!="" )
        {

            var rruleOutput="RRULE:FREQ="+this.rrule.FREQ+";INTERVAL="+this.rrule.INTERVAL

            if(this.rrule.COUNT!=null )
            {
                rruleOutput+=";COUNT="+this.rrule.COUNT+";"
            }

            if(this.rrule.UNTIL!="" && this.rrule.UNTIL!=null)
            {
                rruleOutput+=";UNTIL="+this.getISO8601Date(this.rrule.UNTIL, true)

            }
            finalVTODO +=rruleOutput+"\n"

        }

        /*

        // Adding attendee info as of now breaks calendar (not the todo, but the entire calendar in Nextcloud client for some reason.)
        // Another reason for skipping is that RFC5545 mentions that attendee must not be included in a todo, but rather in a group calendar object (Section 3.8.4.1).


        if(this.attendee!="" && this.attendee!=null && Array.isArray(this.attendee))
        {
            var attendeeOutput ="ATTENDEE"
            
            for (const i in this.attendee)
            {
                if(i.toUpperCase()!="ROLE")
                {
                    attendeeOutput+=i.toString().toUpperCase()+"="+this.attendee[i]+";"

                }
            }

            finalVTODO +=attendeeOutput+":\n"

        }
        */
        if(this.url!="" && this.url!=null)
        {
            finalVTODO +="URL:"+this.url+"\n"
        }
        if(this.recurrenceid!="" && this.recurrenceid!=null)
        {
            finalVTODO +="RECURRENCE-ID:"+this.getISO8601Date(this.recurrenceid)+"\n"
        }


        finalVTODO +="END:VTODO\n"
        if(this.recurrences!=null)
        {
           
            for(const i in this.recurrences)
            {
                //console.log(this.recurrences[i])
                var newVTODO = new VTodoGenerator(this.recurrences[i], {strict: this.enforceStrict})
                finalVTODO += newVTODO.generate(true)
            }
           

        }

        if(skipVCALENDAR==null || skipVCALENDAR==undefined || skipVCALENDAR==false)
        {
            finalVTODO+="END:VCALENDAR\n"

        }


        return finalVTODO
    }

    getISO8601Date(date: string | number, skipTime?: boolean)
    {
        var toReturn = ""
        var dateinTimezone = date

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

    static getValidStatusValues()
    {
       var validvalues=[ "","NEEDS-ACTION", "COMPLETED", "IN-PROCESS", "CANCELLED"]

       return validvalues
    }

    static statusIsValid(status: string | undefined)
    {
        if(status==undefined){
            return false
        }
        var validStatuses = VTodoGenerator.getValidStatusValues()
        var found = false
        for (let i=0; i<validStatuses.length; i++)
        {
            if(validStatuses[i].toLowerCase()==status.toLowerCase())
            {
                return true
            }
        }

        return found

    }

}

export default VTodoGenerator