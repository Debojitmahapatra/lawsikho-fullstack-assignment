import mongoose from "mongoose";

//checking validation
export const isValid = function (value) {
    if(value === "") {return false}
    if( typeof value === 'undefined' || value === null) { return false; }
    if( typeof value    === 'string' && value.trim().length === 0) { return false; } 
    return true;}

export const isValidObjectId = function (value) {
    return mongoose.isValidObjectId(value);
}

export const isValidRequestBody = function (body) {
   return body && Object.keys(body).length > 0;
}

export const validString = function (value) {  
    if (typeof value === 'string' && value.trim().length === 0) { return false; }
    return true;
}