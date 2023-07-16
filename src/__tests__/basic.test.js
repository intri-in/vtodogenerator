import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'
import { convertToTimeZone, generateNewUID } from "../helpers";
/**
 * In this test we generate a sample todo, and parse it back to an object, and confirm if they match
 */


test('Basic genenation and parsing test', () => {
    var tz = "America/Nome"
    var currentTime = moment().tz(tz) 
    var sampleDue = moment("22/04/2022 23:00", 'D/M/YYYY H:mm').tz(tz)
    var sampleUID = generateNewUID()
    var samplerecurID= generateNewUID()
    var sampleUntil = "2023-04-22"
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

        

    }
    
    var todo = new VTodoGenerator(todoData)
    var generatedTodo = todo.generate()
    //console.log("generatedTodo", generatedTodo,)
    const  parsedData = ical.parseICS(generatedTodo);
    for (let k in parsedData) {
        //console.log(parsedData[k])
        expect(moment(parsedData[k].due).unix()).toEqual(moment(sampleDue).unix());
        expect(parsedData[k].summary).toEqual("Sample Task");
        expect(parsedData[k].status).toEqual("COMPLETED");
        expect(parsedData[k].categories).toContain("InProgress");
        expect(parsedData[k].categories).toContain("Imp!");
        expect(moment(parsedData[k].dtstamp).unix()).toEqual(moment(currentTime).unix());
        expect(moment(parsedData[k].created).unix()).toEqual(moment(currentTime).unix());
        expect(parsedData[k].completion).toEqual("42");
        expect(parsedData[k]["related-to"]).toEqual(sampleUID);
        expect(parsedData[k]["priority"]).toEqual("2");
        expect(parsedData[k]["description"]).toEqual(sampleDescription);
        expect(moment(parsedData[k].start).unix()).toEqual(moment(currentTime).unix());
        expect(parsedData[k]["class"]).toEqual("PRIVATE");
        expect(parsedData[k]["rrule"]).toBeDefined();
        expect(parsedData[k]["rrule"].options).toBeDefined();
        expect(parsedData[k]["rrule"].options.freq).toBe(3);
        expect(parsedData[k]["rrule"].options.interval).toBe(2);
        expect(moment(parsedData[k]["rrule"].options.until).unix()).toBe(moment(parsedData[k]["rrule"].options.until).unix());
        expect(parsedData[k]["geo"]).toBeDefined();
        expect(parsedData[k]["geo"].lat).toBeDefined();
        expect(parsedData[k]["geo"].lon).toBeDefined();
        expect(parsedData[k]["geo"].lat).toBe(3);
        expect(parsedData[k]["geo"].lon).toBe(7);
        expect(parsedData[k]["location"]).toBe("Office");
        expect(parsedData[k]["organizer"]).toBe("Admin");
        expect(parsedData[k]["url"]).toBe("https://example.com");


    }
  });

  