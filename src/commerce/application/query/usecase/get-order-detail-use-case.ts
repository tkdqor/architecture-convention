import { OrderReadModel } from '../../../infrastructure/readmodel/order.read-model';

export interface GetOrderDetailUseCase {
  execute(): Promise<OrderReadModel>;
}
