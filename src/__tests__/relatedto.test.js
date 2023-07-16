import VTodoGenerator from "../VTodoGenerator";
import ical from 'ical'
import moment from 'moment'
import { generateNewUID } from "../helpers";




test('Relatedto test: Must fail if relatedto is an empty string', () => {
    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        relatedto: "",
        
    }
    
    expect(() => new VTodoGenerator(todoData)).toThrowError()
  });
  
  test('Relatedto test: Must fail if relatedto.params.RELTYPE is an invalid value', () => {
    var sampleUID = generateNewUID()
    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        relatedto: {
            params:
            {
                    RELTYPE: "FRIEND",
            },
            val: sampleUID
        }
        
    }
    
    expect(() => new VTodoGenerator(todoData)).toThrowError()
  });


  test('Relatedto test: simple object test', () => {
    var sampleUID = generateNewUID()

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        relatedto: {
            params:
            {
                    RELTYPE: "CHILD",
            },
            val: sampleUID
        },
        
    }

    var todo = new VTodoGenerator(todoData)
    var generatedTodo = todo.generate()
    const  parsedData = ical.parseICS(generatedTodo);
    for (let k in parsedData) {
        expect(parsedData[k]["related-to"].params).toBeDefined()
        expect(parsedData[k]["related-to"].params.RELTYPE).toBeDefined()
        expect(parsedData[k]["related-to"].params.RELTYPE).toBe("CHILD")
        expect(parsedData[k]["related-to"].val).toBe(sampleUID)


    }
  });


  test('Relatedto test: Array type test', () => {
    var sampleUID = generateNewUID()
    var sampleUID1 = generateNewUID()
    var sampleUID2 = generateNewUID()

    var todoData = { 
       // due:moment("22/04/2022").toString(), 
        summary: "Relatedto test", 
        uid: sampleUID,
        relatedto: [{
            params:
            {
                    RELTYPE: "CHILD",
            },
            val: sampleUID1
        },
        {
            params:
            {
                    RELTYPE: "SIBLING",
            },
            val: sampleUID2
        }],
        
    }

    var todo = new VTodoGenerator(todoData)
    var generatedTodo = todo.generate()
    const  parsedData = ical.parseICS(generatedTodo);
    for (let k in parsedData) {

        expect(Array.isArray(parsedData[k]["related-to"])).toBe(true)
        expect(parsedData[k]["related-to"].length).toBe(2)

        //First item
        expect(parsedData[k]["related-to"][0].params).toBeDefined()
        expect(parsedData[k]["related-to"][0].params.RELTYPE).toBeDefined()
        expect(parsedData[k]["related-to"][0].params.RELTYPE).toBe("CHILD")
        expect(parsedData[k]["related-to"][0].val).toBe(sampleUID1)

        //Second item
        expect(parsedData[k]["related-to"][1].params).toBeDefined()
        expect(parsedData[k]["related-to"][1].params.RELTYPE).toBeDefined()
        expect(parsedData[k]["related-to"][1].params.RELTYPE).toBe("SIBLING")
        expect(parsedData[k]["related-to"][1].val).toBe(sampleUID2)


    }
  });

  