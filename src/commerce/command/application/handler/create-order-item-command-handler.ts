import { CreateOrderItemCommand } from '../dto/create-order-item.command';
import { PureOrder } from '../../domain/entity/pure-order';

export interface CreateOrderItemCommandHandler {
  execute(command: CreateOrderItemCommand): Promise<PureOrder>;
}
