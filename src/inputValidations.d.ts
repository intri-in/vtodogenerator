import { inputObj } from "./typeDefinitions";
export declare function isValidTimezone(timezone: string | undefined): boolean;
export declare function isValidInput(todoObject: inputObj): boolean;
export declare function isValidGeo(geo: string | undefined): boolean;
export declare function isValidStartDate(start: string | undefined): void;
export declare function isValidRelatedToObject(relatedto: any): boolean;
export declare function isValidRelType(reltype?: any): boolean;
export declare function isValidPriority(priority: any): boolean;
export declare function isValidRRule(rrule: any): boolean;
