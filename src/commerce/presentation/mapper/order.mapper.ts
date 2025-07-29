import {
  Order,
  OrderStatusEnum,
} from '../../domain/entity/order.entity';
import { OrderItem } from '../../domain/entity/order-item.entity';
import { OrderStatusGqlEnum } from '../graphql/order.graphql';
import {
  CreateOrderGqlInput,
  CreateOrderGqlPayload,
  CreateOrderItemGqlInput,
  CreateOrderItemGqlPayload,
} from '../graphql/create-order.graphql';
import { OrderReadModel } from '../../infrastructure/readmodel/order.read-model';
import {
  GetOrderDetailGqlPayload,
  GetOrderItemDetailGqlPayload,
} from '../graphql/get-order.graphql';
import { OrderItemReadModel } from '../../infrastructure/readmodel/order-item.read-model';
import { CreateOrderCommand } from '../../application/use-case-input/create-order.command';
import { CreateOrderItemUseCaseInput } from '../../application/use-case-input/create-order-item.use-case-input';
import { Money } from '../../domain/value-object/money';

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
   * CreateOrderItemGqlInput을 CreateOrderItemUseCaseInput으로 변환
   */
  static toCreateOrderItemUseCaseInput(
    input: CreateOrderItemGqlInput,
  ): CreateOrderItemUseCaseInput {
    return new CreateOrderItemUseCaseInput({
      orderId: input.orderId,
    });
  }

  /**
   * Order 엔티티를 CreateOrderGqlPayload로 변환
   */
  static toCreateOrderGqlPayload(response: {
    id: string;
    customerId: string;
    status: OrderStatusEnum;
    totalAmount: Money;
    items: OrderItem[];
    createdAt: Date;
  }): CreateOrderGqlPayload {
    return new CreateOrderGqlPayload({
      id: response.id,
      customerId: response.customerId,
      status: this.mapOrderStatusToGql(response.status),
      totalAmount: response.totalAmount.value,
      items: this.toCreateOrderItemGqlPayloads(response.items),
    });
  }

  /**
   * OrderItem 엔티티를 CreateOrderItemGqlPayload로 변환
   */
  static toCreateOrderItemGqlPayload(
    orderItem: OrderItem,
  ): CreateOrderItemGqlPayload {
    return new CreateOrderItemGqlPayload({
      id: orderItem.id,
      productId: orderItem.productId,
      productName: orderItem.productName,
      price: orderItem.price.value,
      quantity: orderItem.quantity,
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
