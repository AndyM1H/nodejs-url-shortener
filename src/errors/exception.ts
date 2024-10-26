import HttpStatusCodes from "./status-codes";

export class BaseHttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class NotFoundException extends BaseHttpException {
  constructor(message: string) {
    super(HttpStatusCodes.NOT_FOUND, message);
    this.name = "NotFoundException";
  }
}

export class BadRequestException extends BaseHttpException {
  constructor(message: string) {
    super(HttpStatusCodes.BAD_REQUEST, message);
    this.name = "BadRequestException";
  }
}
