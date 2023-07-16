import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'
import { convertToTimeZone, generateNewUID } from "../helpers";

test('Recurrence test: Must generate the todo', () => {
    var tz = "America/Nome"
    var currentTime = moment().tz(tz) 
    var sampleDue = moment("22/04/2022 23:00", 'D/M/YYYY H:mm').tz(tz)
    var sampleUID = generateNewUID()
    var samplerecurID= generateNewUID()
    var sampleUntil = "2023-04-22"
    var sampleDescription_forRecurrence="Don't drink too much."
    var sampleDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam imperdiet sagittis est,in hendrerit risus imperdiet non. Mauris euismod sodales volutpat. Phasellus pretium faucibus neque, et rutrum ante. Nunc pretium nulla id ante mattis, nec lobortis felis pellentesque. Sed vitae ipsum consectetur ligula sollicitudin bibendum non et orci. Donec condimentum commodo sem vel dignissim. Donec sed est ipsum."    
    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        tz:"America/Nome",
        due:sampleDue.toISOString(),
        summary: "Sample Task", 
        categories: ["InProgress", "Imp!"],  
        status:"COMPLETED",
        dtstamp:currentTime.toISOString(),
        created:currentTime.toISOString(),
        completion:42,
        relatedto:sampleUID,
        priority:2,
        description:sampleDescription,
        start: currentTime.toISOString(),
        class:"PRIVATE",
        rrule:{FREQ: "DAILY", INTERVAL:"2", UNTIL:sampleUntil},
        geo:"3;7",
        location:"Office",
        organizer:"Admin",
        resources:["sdasd","asdasd"],
        url:"https://example.com",
        recurrences:[
            {
                description: sampleDescription_forRecurrence,
                recurrenceid: sampleDue.toISOString()
            }
        ]

        

    }

    var todo = new VTodoGenerator(todoData)
    var generatedTodo = todo.generate()
    //console.log("generatedTodo", generatedTodo,)
    const  parsedData = ical.parseICS(generatedTodo);
    for (let k in parsedData) {
        for(let i in parsedData[k].recurrences){
            expect(parsedData[k].recurrences[i]["description"]).toBe(sampleDescription_forRecurrence)
        }
    }
    
  });
