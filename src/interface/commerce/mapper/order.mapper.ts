import { Order } from '../../../domain/commerce/entity/order.entity';
import { OrderItem } from '../../../domain/commerce/entity/order-item.entity';
import { OrderStatusEnum } from '../../../domain/commerce/commerce.enum';
import { OrderStatusGqlEnum } from '../graphql/order.graphql';
import {
  CreateOrderGqlPayload,
  CreateOrderItemGqlPayload,
} from '../graphql/create-order.graphql';

export class OrderMapper {
  /**
   * Order 엔티티를 CreateOrderGqlPayload로 변환
   */
  static toCreateOrderGqlPayload(order: Order): CreateOrderGqlPayload {
    return new CreateOrderGqlPayload({
      id: order.getId(),
      customerId: order.getCustomerId(),
      status: this.mapOrderStatusToGql(order.getStatus()),
      totalAmount: order.getTotalAmount(),
      items: this.toCreateOrderItemGqlPayloads(order.getItems()),
    });
  }

  /**
   * OrderItem 엔티티를 CreateOrderItemGqlPayload로 변환
   */
  static toCreateOrderItemGqlPayload(
    orderItem: OrderItem,
  ): CreateOrderItemGqlPayload {
    return new CreateOrderItemGqlPayload({
      id: orderItem.getId(),
      productId: orderItem.getProductId(),
      productName: orderItem.getProductName(),
      price: orderItem.getPrice(),
      quantity: orderItem.getQuantity(),
    });
  }

  /**
   * OrderItem 엔티티 배열을 CreateOrderItemGqlPayload 배열로 변환
   */
  static toCreateOrderItemGqlPayloads(
    orderItems: OrderItem[],
  ): CreateOrderItemGqlPayload[] {
    return orderItems.map((orderItem) =>
      this.toCreateOrderItemGqlPayload(orderItem),
    );
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
