import { Order } from '../../../domain/commerce/entity/order.entity';
import { OrderItem } from '../../../domain/commerce/entity/order-item.entity';
import { OrderStatusEnum } from '../../../domain/commerce/commerce.enum';
import {
  OrderGqlObject,
  OrderItemGqlObject,
  OrderStatusGqlEnum,
} from '../graphql/order.graphql';

export class OrderMapper {
  /**
   * Order 엔티티를 OrderGqlObject로 변환
   */
  static toGqlObject(order: Order): OrderGqlObject {
    return new OrderGqlObject({
      id: order.getId(),
      customerId: order.getCustomerId(),
      status: this.mapOrderStatusToGql(order.getStatus()),
      totalAmount: order.getTotalAmount(),
      items: this.toOrderItemGqlObjects(order.getItems()),
    });
  }

  /**
   * OrderItem 엔티티를 OrderItemGqlObject로 변환
   */
  static toOrderItemGqlObject(orderItem: OrderItem): OrderItemGqlObject {
    return new OrderItemGqlObject({
      id: orderItem.getId(),
      productId: orderItem.getProductId(),
      productName: orderItem.getProductName(),
      price: orderItem.getPrice(),
      quantity: orderItem.getQuantity(),
    });
  }

  /**
   * OrderItem 엔티티 배열을 OrderItemGqlObject 배열로 변환
   */
  static toOrderItemGqlObjects(orderItems: OrderItem[]): OrderItemGqlObject[] {
    return orderItems.map((orderItem) => this.toOrderItemGqlObject(orderItem));
  }

  /**
   * 도메인 OrderStatusEnum을 GraphQL OrderStatusGqlEnum으로 변환
   */
  private static mapOrderStatusToGql(
    status: OrderStatusEnum,
  ): OrderStatusGqlEnum {
    switch (status) {
      case OrderStatusEnum.PLACED:
        return OrderStatusGqlEnum.PLACED;
      case OrderStatusEnum.PAID:
        return OrderStatusGqlEnum.PAID;
      case OrderStatusEnum.REFUNDED:
        return OrderStatusGqlEnum.REFUNDED;
      default:
        throw new Error(`Unknown order status: ${status}`);
    }
  }
}
