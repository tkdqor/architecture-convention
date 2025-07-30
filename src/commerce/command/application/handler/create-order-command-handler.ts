import { CreateOrderCommand } from '../dto/create-order.command';
import { PureOrder } from '../../domain/entity/pure-order';

export interface CreateOrderCommandHandler {
  execute(command: CreateOrderCommand): Promise<PureOrder>;
}
