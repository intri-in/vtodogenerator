import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'
import { RRule } from "rrule";

test('rrule test: Must pass without rrule', () => {
  const todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
    }
  const todo = new VTodoGenerator(todoData)
  const generatedTodo = todo.generate()
  const  parsedData = ical.parseICS(generatedTodo);
  for (let k in parsedData) {
      expect(parsedData[k]["summary"]).toBe(todoData.summary)
  }

})

test('rrule test: Must fail if start is not specified with rrule', () => {
    var sampleUntil = "2023-04-22"

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        rrule:{FREQ: "DAILY", INTERVAL:"2", UNTIL:sampleUntil},
    }
    
    expect(() => new VTodoGenerator(todoData)).toThrowError()
  });

  // test('rrule test: Must fail if FREQ is not specified in rrule', () => {
  //   var sampleUntil = "2023-04-22"

  //   var todoData = { 
  //      // due:moment("22/04/2022").toString(), 
  //       summary: "Relatedto test", 
  //       start:sampleUntil,
  //       rrule:{INTERVAL:"2", UNTIL:sampleUntil},
  //   }
    
  //   expect(() => new VTodoGenerator(todoData)).toThrowError("Rrule.FREQ cannot be null or undefined.")
  // });

  test('rrule test: Must fail if UNTIL is an invalid date', () => {
    let sampleUntil = "asdasd"
    let sampleStart = "2023-04-22"

    let todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        rrule:{FREQ:"DAILY",INTERVAL:"2", UNTIL:sampleUntil},
        start: sampleStart
    }
    expect(() => new VTodoGenerator(todoData)).toThrowError("rrule.UNTIL must be a valid date in ISO Date format.")
  });

  test('rrule test: Must pass for by day recurrence', () => {
    var sampleUntil = ""
    let sampleStart = "2023-04-22"

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        rrule:{FREQ:"WEEKLY", BYWEEKDAY: [0, 1]},
        start: sampleStart
    }
    var todo = new VTodoGenerator(todoData)
    var generatedTodo = todo.generate()
    const  parsedData = ical.parseICS(generatedTodo);
    
    // console.log("generatedTodo", generatedTodo, parsedData)
    for (let k in parsedData) {
      expect(parsedData[k]["summary"]).toBe(todoData.summary)
      const rrule =   parsedData[k]["rrule"]
      expect(rrule.options.byweekday).toBeDefined()
      expect(Array.isArray(rrule.options.byweekday)).toBe(true)
      expect(rrule.options.byweekday.length).toBeGreaterThan(0)
      expect(rrule.options.byweekday[0]).toBe(0)
      expect(rrule.options.byweekday[1]).toBe(1)
      // console.log("parsedData", parsedData[k]["rrule"])
    }
    

  });

  test('rrule test: generic', ()=>{
        let todoData = {
          "due": "",
          "start": "2026-11-06T13:26:55.964Z",
          "summary": "rrule test: generic",
          "completion": "0",
          "completed": "",
          "status": "",
          "uid": "",
          "categories": [],
          "priority": "",
          "relatedto": "",
          "lastmodified": "",
          "description": "",
          "rrule": {
            "FREQ": "WEEKLY",
            "INTERVAL": 1,
            "BYWEEKDAY": [
              0,
              1,
              2,
              3,
              4
            ],
            "UNTIL": null
          },
          "valarms": []
        }
            var todo = new VTodoGenerator(todoData)
            var generatedTodo = todo.generate()
            const  parsedData = ical.parseICS(generatedTodo);
    
            console.log(generatedTodo)

  })