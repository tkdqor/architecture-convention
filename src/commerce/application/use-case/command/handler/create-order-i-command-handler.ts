import { CreateOrderCommand } from '../../../use-case-input/create-order.command';
import { OrderStatusEnum } from '../../../../domain/entity/order.entity';
import { Money } from '../../../../domain/value-object/money';
import { OrderItem } from '../../../../domain/entity/order-item.entity';

export interface CreateOrderICommandHandler {
  execute(command: CreateOrderCommand): Promise<{
    id: string;
    customerId: string;
    status: OrderStatusEnum;
    totalAmount: Money;
    items: OrderItem[];
    createdAt: Date;
  }>;
}
