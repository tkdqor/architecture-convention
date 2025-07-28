import { MDException } from '../../../../common/exception/md-exception';

export abstract class DomainException extends MDException {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  getLogMessage(): string {
    return `[DOMAIN-EXCEPTION] ${this.code} | ${this.message}`;
  }
}
