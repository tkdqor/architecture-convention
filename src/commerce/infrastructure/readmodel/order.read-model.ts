
import { OrderItemReadModel } from './order-item.read-model';
import { OrderStatusEnum } from '../../domain/entity/order.entity';

export class OrderReadModel {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly status: OrderStatusEnum,
    public readonly totalAmount: number,
    public readonly items: OrderItemReadModel[],
    public readonly itemCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // 리드모델 메서드 예시
  public hasItems(): boolean {
    return this.itemCount > 0;
  }

  public getTotalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public isPaid(): boolean {
    return this.status === OrderStatusEnum.PAID;
  }

  public isRefunded(): boolean {
    return this.status === OrderStatusEnum.REFUNDED;
  }
}
