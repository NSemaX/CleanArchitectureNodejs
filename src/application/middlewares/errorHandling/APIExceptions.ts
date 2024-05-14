import createError from 'http-errors';
import { errorMessages } from './errorMessages';
import { HttpStatusCode } from './HttpStatusCodeEnums';
import { APIError } from './BaseError';


export class BadRequestException {
  constructor(message = errorMessages.BadRequest) {
    throw new APIError("error", message,HttpStatusCode.BAD_REQUEST);
  }
}

export class UnauthorizedException {
  constructor(message = errorMessages.Unauthorized) {
    throw new APIError("error", message,HttpStatusCode.UNAUTHORIZED);
  }
}

export class NotFoundException {
  constructor(message = errorMessages.NotFound) {
    throw new APIError("error", message,HttpStatusCode.NOT_FOUND);
  }
}

export class ConflictException {
  constructor(message = errorMessages.Conflict) {
    throw new APIError("error", message,HttpStatusCode.CONFLICT);
  }
}

export class UnprocessableEntityException {
  constructor(message = errorMessages.UnprocessableEntity) {
    throw new APIError("error", message,HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
}

export class TooManyRequestsException {
  constructor(message = errorMessages.TooManyRequests) {
    throw new APIError("error", message,HttpStatusCode.TOO_MANY_REQUESTS);
  }
}

export class InternalServerErrorException {
  constructor(message = errorMessages.InternalServerError) {
    throw new APIError("error", message,HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export class BadGatewayException {
  constructor(message = errorMessages.BadGateway) {
    throw new APIError("error", message,HttpStatusCode.BAD_GATEWAY);
  }
}