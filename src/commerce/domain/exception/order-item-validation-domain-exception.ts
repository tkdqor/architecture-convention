import { DomainException } from '../../../common/exception/domain-exception';

export class OrderItemValidationDomainException extends DomainException {
  readonly code: string;
  readonly statusCode: number = 400;

  constructor(message: string) {
    super(message);
  }
}
