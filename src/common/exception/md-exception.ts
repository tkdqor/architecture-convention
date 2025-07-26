import { HttpException, HttpStatus } from '@nestjs/common';

export class MDException extends HttpException {
  extensions: Record<string, any>;

  constructor(
    message: string,
    errorCode?: ErrorCode,
    extensions: Record<string, any> = {},
    status?: HttpStatus,
  ) {
    super(message, status ?? 500);
    this.extensions = {
      ...extensions,
      errorCode: errorCode ?? ErrorCode.UNKNOWN,
    };
  }
}

export enum ErrorCode {
  UNKNOWN = 'UNKNOWN',
}
