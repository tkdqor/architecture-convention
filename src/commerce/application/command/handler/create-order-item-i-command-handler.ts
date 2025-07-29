import { CreateOrderItemCommand } from '../dto/create-order-item.command';
import { Order } from '../../../domain/entity/order.entity';

export interface CreateOrderItemICommandHandler {
  execute(command: CreateOrderItemCommand): Promise<Order>;
}
