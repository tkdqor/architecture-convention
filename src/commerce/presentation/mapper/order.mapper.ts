import { Order, OrderStatusEnum } from '../../domain/entity/order.entity';
import { OrderItem } from '../../domain/entity/order-item.entity';
import { OrderStatusGqlEnum } from '../graphql/order.graphql';
import {
  CreateOrderGqlInput,
  CreateOrderResultObject,
  CreateOrderItemGqlInput,
  CreateOrderItemResultObject,
} from '../graphql/create-order.graphql';
import { OrderReadModel } from '../../infrastructure/readmodel/order.read-model';
import {
  GetOrderDetailGqlPayload,
  GetOrderItemDetailGqlPayload,
} from '../graphql/get-order.graphql';
import { OrderItemReadModel } from '../../infrastructure/readmodel/order-item.read-model';
import { CreateOrderCommand } from '../../application/command/dto/create-order.command';
import { CreateOrderItemCommand } from '../../application/command/dto/create-order-item.command';

export class OrderMapper {
  /**
   * CreateOrderGqlInput을 CreateOrderCommand로 변환
   */
  static toCreateOrderCommand(input: CreateOrderGqlInput): CreateOrderCommand {
    return new CreateOrderCommand({
      customerId: input.customerId,
    });
  }

  /**
   * CreateOrderItemGqlInput을 CreateOrderItemCommand로 변환
   */
  static toCreateOrderItemCommand(
    input: CreateOrderItemGqlInput,
  ): CreateOrderItemCommand {
    return new CreateOrderItemCommand({
      orderId: input.orderId,
    });
  }

  /**
   * Order 엔티티를 CreateOrderResultObject로 변환
   */
  static toCreateOrderResultObject(order: Order): CreateOrderResultObject {
    return new CreateOrderResultObject({
      id: order.id,
      customerId: order.customerId,
      status: this.mapOrderStatusToGql(order.status),
      totalAmount: order.totalAmount.value,
      items: this.toCreateOrderItemResultObjects(order.items),
      message: 'Order created successfully',
      createdAt: new Date(),
    });
  }

  /**
   * OrderItem 엔티티를 CreateOrderItemResultObject로 변환
   */
  static toCreateOrderItemResultObject(
    orderItem: OrderItem,
  ): CreateOrderItemResultObject {
    return new CreateOrderItemResultObject({
      id: orderItem.id,
      productId: orderItem.productId,
      productName: orderItem.productName,
      price: orderItem.price.value,
      quantity: orderItem.quantity,
      message: 'OrderItem created successfully',
      createdAt: new Date(),
    });
  }

  /**
   * OrderItem 엔티티 배열을 CreateOrderItemResultObject 배열로 변환
   */
  static toCreateOrderItemResultObjects(
    orderItems: OrderItem[],
  ): CreateOrderItemResultObject[] {
    return orderItems.map((orderItem) =>
      this.toCreateOrderItemResultObject(orderItem),
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

  /**
   * OrderReadModel를 GetOrderDetailGqlPayload로 변환
   */
  static toGetOrderDetailGqlPayload(
    orderReadModel: OrderReadModel,
  ): GetOrderDetailGqlPayload {
    return new GetOrderDetailGqlPayload({
      id: orderReadModel.id,
      customerId: orderReadModel.customerId,
      status: this.mapOrderStatusToGql(orderReadModel.status),
      totalAmount: orderReadModel.totalAmount,
      items: this.toGetOrderItemDetailGqlPayloads(orderReadModel.items),
    });
  }

  /**
   * OrderItemReadModel을 GetOrderItemDetailGqlPayload로 변환
   */
  static toGetOrderItemDetailGqlPayload(
    orderItemReadModel: OrderItemReadModel,
  ): GetOrderItemDetailGqlPayload {
    return new GetOrderItemDetailGqlPayload({
      id: orderItemReadModel.id,
      orderId: orderItemReadModel.orderId,
      productId: orderItemReadModel.productId,
      price: orderItemReadModel.price,
      quantity: orderItemReadModel.quantity,
      totalAmount: orderItemReadModel.totalAmount,
      createdAt: orderItemReadModel.createdAt,
      updatedAt: orderItemReadModel.updatedAt,
    });
  }

  /**
   * OrderItemReadModel 배열을 GetOrderItemDetailGqlPayload 배열로 변환
   */
  static toGetOrderItemDetailGqlPayloads(
    orderItemReadModels: OrderItemReadModel[],
  ): GetOrderItemDetailGqlPayload[] {
    return orderItemReadModels.map((orderItemReadModel) =>
      this.toGetOrderItemDetailGqlPayload(orderItemReadModel),
    );
  }
}
