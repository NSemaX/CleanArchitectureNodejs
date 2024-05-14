import { Request, Response, NextFunction } from 'express';
import { APIError } from './BaseError';
import { errorMessages } from './errorMessages';
import { stack } from 'sequelize/types/utils';



export const exceptionHandler = (
  error: APIError,
  req: Request,
  res: Response,
  _next: NextFunction // we won't be calling next() here
) => {
  const statusCode = error.httpCode || 500;
  const message = error.message || errorMessages.Generic;
  const stack = process.env.NODE_ENV === 'development' ? error.stack : {}
  // logger

  return res.status(statusCode).send({ statusCode, message, stack});
};