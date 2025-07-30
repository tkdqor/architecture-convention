import { CreateOrderCommand } from '../dto/create-order.command';
import { Order } from '../../../domain/entity/order.entity';

export interface CreateOrderICommandHandler {
  execute(command: CreateOrderCommand): Promise<Order>;
}
