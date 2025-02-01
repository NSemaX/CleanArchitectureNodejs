import { HttpStatusCode } from "./HttpStatusCodeEnums";

class BaseError extends Error {
    httpCode: any;
    isOperational: any;
 
    constructor(name: string, message: string, httpCode: any, stack: string | undefined, isOperational: boolean) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
    
      this.name = name;
      this.message = message;
      this.httpCode = httpCode;
      this.stack = stack;
      this.isOperational = isOperational;
    
      Error.captureStackTrace(this);
    }
   }
   //extend the BaseError
   export class APIError extends BaseError {
    constructor(name: string, message = 'internal server error', httpCode = HttpStatusCode.INTERNAL_SERVER_ERROR, stack= 'internal server error', isOperational = true, ) {
      super(name, message, httpCode, stack ,isOperational);
    }
   }