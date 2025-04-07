import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'
import { convertToTimeZone, generateNewUID } from "../helpers";

/**
 * In this test we generate a sample todo with a VALARM component, parse it back, and confirm if they match
 */

test('VALARM test', () => {

    const sampleUID = generateNewUID()
    const sampleDue = moment("22/04/2022 23:00", 'D/M/YYYY H:mm')
    const currentTime = moment()
    const sampleValarms = [
        {
            action: "email",
            trigger: {
                isRelated: true,
                value: -300,
                relatedTo: "end"
            },
            description:"test1",
            summary:"Hey There",
            attendees:[{commonName:"test1",email:"test@example.com"},{
                commonName:"test2",email:"test2@example.com"
            }]
        },
        {
            action: "audio",
            trigger: {
                isRelated: false,
                value: moment("22/04/2022 23:00", 'D/M/YYYY H:mm'),
                relatedTo: "end"
            },
            description:"b"
        }
    ]
    let todoData = { 
        // due:moment("22/04/2022").toString(), 
         due:sampleDue.toISOString(),
         summary: "Sample Task", 
         categories: ["InProgress", "Imp!"],  
         status:"COMPLETED",
         dtstamp:currentTime.toISOString(),
         created:currentTime.toISOString(),
         completion:42,
         priority:2,
         description:"Hi!!",
         start: currentTime.toISOString(),
         valarms: sampleValarms

         
 
     }
     
    let todo = new VTodoGenerator(todoData)
    const generatedTodo = todo.generate()
    // console.log(generatedTodo)
    const  parsedData = ical.parseICS(generatedTodo);
    // console.log(parsedData)

    let noofAlarm = 0
    let alarms=[]
    for (let k in parsedData) {
        //expect(parsedData[k]["rrule"]).toBeDefined();
        for(let l in parsedData[k]){
            // console.log(l, parsedData[k][l])

            if(typeof parsedData[k][l] === 'object' && !Array.isArray(parsedData[k][l]) && parsedData[k][l] !== null){

                if(("type" in parsedData[k][l]) && (parsedData[k][l]["type"]=="VALARM")){
                    noofAlarm++
                    // console.log(parsedData[k]["trigger"])
                }
            }
        }

    }

    expect(noofAlarm).toBe(2)

})
