import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'


test('rrule test: Must fail if start is not specified with rrule', () => {
    var sampleUntil = "2023-04-22"

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        rrule:{FREQ: "DAILY", INTERVAL:"2", UNTIL:sampleUntil},
    }
    
    expect(() => new VTodoGenerator(todoData)).toThrowError()
  });

  test('rrule test: Must fail if FREQ is not specified in rrule', () => {
    var sampleUntil = "2023-04-22"

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        start:sampleUntil,
        rrule:{INTERVAL:"2", UNTIL:sampleUntil},
    }
    
    expect(() => new VTodoGenerator(todoData)).toThrowError("Rrule.FREQ cannot be null or undefined.")
  });

  test('rrule test: Must fail if UNTIL is an invalid date', () => {
    var sampleUntil = ""
    var sampleStart = "2023-04-22"

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        rrule:{FREQ:"DAILY",INTERVAL:"2", UNTIL:sampleUntil},
        start: sampleStart
    }
    expect(() => new VTodoGenerator(todoData)).toThrowError("rrule.UNTIL must be a valid date in ISO Date format.")
  });

