import { MDException } from './md-exception';

export abstract class ApplicationException extends MDException {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  getLogMessage(): string {
    return `[APPLICATION-EXCEPTION] ${this.code} | ${this.message}`;
  }
}
