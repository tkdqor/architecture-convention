import { ApplicationException } from './application-exception';

export class NotFoundOrderApplicationException extends ApplicationException {
  readonly code = 'NOT_FOUND_ORDER';
  readonly statusCode = 404;

  constructor(id: string) {
    super(`order with id ${id} not found`);
  }
}
