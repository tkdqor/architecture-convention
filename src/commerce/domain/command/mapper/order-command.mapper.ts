import { CreateOrderUseCaseInput } from '../../../application/use-case-input/create-order.use-case-input';
import { CreateOrderCommand } from '../create-order.command';
import {
  CreateOrderItemUseCaseInput
} from '../../../application/use-case-input/create-order-item.use-case-input';
import { CreateOrderItemCommand } from '../create-order-item.command';

export class OrderCommandMapper {
  static toCreateOrderCommand(
    ucInput: CreateOrderUseCaseInput,
  ): CreateOrderCommand {
    return new CreateOrderCommand({
      customerId: ucInput.customerId,
    });
  }

  static toCreateOrderItemCommand(
    ucInput: CreateOrderItemUseCaseInput,
  ): CreateOrderItemCommand {
    return new CreateOrderItemCommand({
      orderId: ucInput.orderId,
    });
  }
}
