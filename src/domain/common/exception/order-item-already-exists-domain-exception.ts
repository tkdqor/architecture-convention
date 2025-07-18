import { DomainException } from './domain-exception';

export class OrderItemAlreadyExistsDomainException extends DomainException {
  readonly code = 'ORDER_ITEM_ALREADY_EXISTS';
  readonly statusCode = 404;

  constructor(productId: string) {
    super(`order item with id ${productId} already exists`);
  }
}
