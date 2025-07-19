import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/commerce/repository/order.repository';

export class WrongUpdateOrderUseCase {
  constructor(
    private dataSource: DataSource,
    private readonly orderRepository: OrderRepository,
    // private readonly orderItemRepository: OrderItemRepository,
  ) {}

  // 일관성이 깨지는 예시
  async execute() {
    const orderId = 'test';
    const entityManager = this.dataSource.manager;
    const order = await this.orderRepository.getById(entityManager, orderId);
    const orderItem = order.getItems()[0]; // Order 루트를 통하지 않고, 내부 OrderItem에 직접 접근
    // orderItem.quantity = 10; // 직접 수량 변경 (불변식 위반)
    // orderItem.price = 10000; // 직접 가격 변경 (불변식 위반)
    // await orderItemRepository.save(entityManager, orderItem);
    // totalAmount를 업데이트하는 Order의 calculateTotalAmount()가 호출되지 않음
    // Order의 totalAmount와 내부에 있는 OrderItem들의 실제 합계가 다르게 저장됨
  }
}
