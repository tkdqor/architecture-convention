import { PureOrder } from '../../domain/entity/pure-order';
import { PureOrderItem } from '../../domain/entity/pure-order-item';
import { Money } from '../../domain/value-object/money';
import { PaymentCardInfo } from '../../domain/value-object/payment-card-info';
import { OrderTypeOrmEntity } from '../entity/order.typeorm-entity';
import { OrderItemTypeOrmEntity } from '../entity/order-item.typeorm-entity';

/**
 * 도메인 Order ↔ TypeORM OrderTypeOrmEntity 변환 매퍼
 */
export class OrderMapper {
  /**
   * 도메인 객체 → TypeORM 엔티티 변환
   */
  static toTypeOrmEntity(domain: PureOrder): OrderTypeOrmEntity {
    const entity = new OrderTypeOrmEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.customerId = domain.customerId;
    entity.status = domain.status;
    entity.totalAmount = domain.totalAmount.value;

    // PaymentCardInfo가 있는 경우 플랫하게 저장
    if (domain.paymentCardInfo) {
      entity.cardNumber = domain.paymentCardInfo.cardNumber;
      entity.cardHolder = domain.paymentCardInfo.cardHolder;
      entity.cardExpiry = domain.paymentCardInfo.expiry;
      entity.cardCvc = domain.paymentCardInfo.cvc;
    }

    // OrderItem들 변환
    entity.items = Array.from(domain.items).map((item) =>
      OrderItemMapper.toTypeOrmEntity(item, entity),
    );
    return entity;
  }

  /**
   * TypeORM 엔티티 → 도메인 객체 변환
   */
  static toDomain(entity: OrderTypeOrmEntity): PureOrder {
    // OrderItem들 변환
    const orderItems = entity.items.map((item) =>
      OrderItemMapper.toDomain(item),
    );
    // PaymentCardInfo 복원
    let paymentCardInfo: PaymentCardInfo | undefined;
    if (
      entity.cardNumber &&
      entity.cardHolder &&
      entity.cardExpiry &&
      entity.cardCvc
    ) {
      paymentCardInfo = PaymentCardInfo.createPaymentCardInfo(
        entity.cardNumber,
        entity.cardHolder,
        entity.cardExpiry,
        entity.cardCvc,
      );
    }

    // 도메인 객체 복원
    return PureOrder.fromData(
      entity.customerId,
      orderItems,
      entity.status,
      Money.createMoney(entity.totalAmount),
      paymentCardInfo,
      entity.id,
    );
  }
}

/**
 * 도메인 OrderItem ↔ TypeORM OrderItemTypeOrmEntity 변환 매퍼
 */
export class OrderItemMapper {
  /**
   * 도메인 객체 → TypeORM 엔티티 변환
   */
  static toTypeOrmEntity(
    domain: PureOrderItem,
    orderEntity: OrderTypeOrmEntity,
  ): OrderItemTypeOrmEntity {
    const entity = new OrderItemTypeOrmEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.productId = domain.productId;
    entity.productName = domain.productName;
    entity.price = domain.price.value;
    entity.quantity = domain.quantity;
    entity.order = orderEntity;
    entity.orderId = orderEntity.id;
    return entity;
  }

  /**
   * TypeORM 엔티티 → 도메인 객체 변환
   */
  static toDomain(entity: OrderItemTypeOrmEntity): PureOrderItem {
    return PureOrderItem.fromData(
      entity.productId,
      entity.productName,
      Money.createMoney(entity.price),
      entity.quantity,
      entity.id,
    );
  }
}
