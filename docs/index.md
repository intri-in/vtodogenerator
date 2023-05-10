# Introduction

VTODOGenerator is a library to generate VTODO compatible with [RFC5545](https://www.rfc-editor.org/rfc/rfc5545).

# Installation

Install via npm:

```
npm i vtodogenerator --save
```

# Requirements
VTODOGenerator requires momentjs.

You can install it via:

```
npm i moment --save
```


# Usage

Import the library.

```
import VTodoGenerator from "vtodogenerator";
```

Define task object.

```
var todoData = { 
    due: "22/04/2022", 
    summary: "Sample Task", 
    categories: "InProgress",  
}
```
Initialise class instance, and generate todo.

```
var todo = new VTodoGenerator(todoData)
console.log(todo.generate())

//Sample Output

BEGIN:VCALENDAR
BEGIN:VTODO
UID:46asdjkasdbasdbasda4sd56asdasdn26321132
DTSTAMP:2023-04-20T22:00
SUMMARY:Sample Task
CATEGORIES:InProgress
DUE:2023-04-22T000000
END:VTODO
END:VCALENDAR
```

# Guide


## Supported Fields

As of now, VTODOGenerator supports the following fields:

|  Name| Type| Description  |   RFC5545 Field Equivalent |
|---|---|---|---|
| dtstamp | string|Time stamp for creation of the TODO. If not supplied, current time will be used. |  DTSTAMP|
| summary | string|Summary of the task. | SUMMARY|
| due | string|Due date and time of the task. | DUE|
| completed| string|Date and time of completion of task  | COMPLETED|
| completion| string|How much the task has progressed in percentage.| PERCENT-COMPLETE|
| status| string|Current status of the task. Only allowed values are:  "NEEDS-ACTION", "COMPLETED", "IN-PROCESS", and "CANCELLED".| STATUS|
| categories| Array of strings|Category/Labels of tasks. Can be an array of multiple value.| CATEGORIES|
| relatedto| Array of Objects/string. <br />  <br />  See [relevant section](#related-to) for more details. |Defines the relation of this task with others in the CalDAV account. | RELATED-TO|
| priority| string/integer |Priority of the task, usually denoted by a number (with 1 being highest, and 9 being the lowest)| PRIORITY|
| description| string |Description of the task.| DESCRIPTION|
| start| string |Start date and time of the task| DTSTART|
| class| string |Classification of the task, eg. PUBLIC/PRIVATE.| CLASS|
| geo| string |Geographical information related to task, in the format of LATITUDE;LONGITUDE| GEO|
| location| string |Location of the task.| LOCATION|
| organizer| string |Organiser of the calendar event.| ORGANIZER|
| sequence| string |Revision sequence number of the task. Must be a number.| SEQUENCE|
| resources| Array of string |Resources/equipment required for the task.| RESOURCES|
| rrule| Object. <br /> <br />See [relevant](#rrule) section for more details. |Recurrence rule for the task.| RRULE|
| url| string |Any URL associated with the task.| URL|
| recurrences| Array of Object|An array of series of task objects, in case of recurring tasks. See [relevant](#recurrences) section.| |
| recurrenceid| string |Recurrence ID of the task. This is used to identify tasks in a recurrence set. See [relevant](#recurrences) section.|RECURRENCE-ID |

## Fields

### relatedto

relatedto defines the relation of tasks with other tasks in the CalDAV account.

This field can be either string:

```
relatedto: "uid-of-another-task-in-caldav-account"
```
or it must be an array of object of the following syntax:

```
{
    params:
    {
            RELTYPE: "CHILD",
    }
    val: "uid-of-another-task-1"
}
```
```RELTYPE``` defines the type of relationship with other task. Value could be either CHILD, PARENT, or SIBLING.

```val``` must contain the UID of related task.

So for this example, our new task will be have a CHILD task with UID *uid-of-another-task-1*.

A task can have multiple relationships. In the following example, our new task will have a child *uid-of-another-task-1* and will have a parent with a UID *uid-of-another-task-2*:
```
related to:[
    {
        params:{
            RELTYPE: "CHILD",
        }
        val: "uid-of-another-task-1"
    },
    {
        params:{
            RELTYPE: "PARENT",
        }
        val: "uid-of-another-task-2"
    }
]
```
### RRULE

rrule defines the recurrence of the task, and it is valuable for generating repeating tasks.

If you specifiy rrule, **start** must also be specified in the task object.

rrule must be an object of the format:

```
rrule: {
    FREQ: string , //eg. DAILY/WEEKLY/MONTHLY
    INTERVAL: string/number,
    UNTIL: date of format recognised by moment.
}
```
```FREQ``` defines the frequency of recurrence. Possible values are: "SECONDLY" / "MINUTELY" / "HOURLY" / "DAILY"/ "WEEKLY" / "MONTHLY" / "YEARLY"

```INTERVAL``` defines the interval of the recurrence. 

```UNTIL``` defines the date and time till which the recurrence rule must be followed.

**Examples**


```
// The following will create a task that is repeated daily, starting from April 03, 2023 until Jan 03, 2024.

...
start: 03/04/2023,
rrule: {
    FREQ: DAILY
    INTERVAL: 1,
    UNTIL: 03/01/2024
}
...

// The following will create a task that is repeated weekly, starting from June 01, 2021 until forever.

...
start: 01/06/2021,
rrule: {
    FREQ: WEEKLY
    INTERVAL: 1,
}
...

```

### Recurrences

Recurrences holds other tasks in a recurring series.

Take an example of a task that you define as:

```
var todoData = { 
    uid: "primary-task-uid" 
    summary: "Sample Task", 
    categories: "InProgress",  
    start: 03/04/2023,
    rrule: {
    FREQ: DAILY
    INTERVAL: 1,
    UNTIL: 03/01/2024
    }

}
```

This task will be repeated daily, until Jan 03, 2024, starting from April 03, 2023.

Let's say you want to edit an instance of this series (eg. the task that will occur on Dec 31, 2023), you will need to define this task as:

```
var todoData = { 
    uid: "primary-task-uid" 
    summary: "Sample Task", 
    categories: "InProgress",  
    start: 03/04/2023,
    rrule: {
    FREQ: DAILY
    INTERVAL: 1,
    UNTIL: 03/01/2024,
    },
    recurrence:[
        {
            description: "Don't drink too much",
            recurrenceid: "20231231T000000"
        }
    ]
    }

}
```

On Dec 31, 2023, the task instance will show up with the description "Don't drink too much".


## Functions

## generate(skipVCALENDAR)

Generates the VTODO.

**Parameters**

| name| Type | Required| Description|
|---|---|---|---|
|skipVCALENDAR| boolean| No | Skip the "BEGIN:VCALENDAR" part in the generated todo.|  