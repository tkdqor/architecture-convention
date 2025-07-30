import { Money } from '../value-object/money';

/**
 * 순수 도메인 OrderItem 클래스
 * TypeORM 의존성 없이 비즈니스 로직에만 집중
 */
export class PureOrderItem {
  id: string | undefined;
  productId: string;
  productName: string;
  price: Money;
  quantity: number;

  protected constructor(
    productId: string,
    productName: string,
    price: Money,
    quantity: number,
    id?: string,
  ) {
    this.productId = productId;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
    this.id = id;
  }

  static createOrderItem(
    productId: string,
    productName: string,
    price: Money,
    quantity: number,
  ): PureOrderItem {
    if (!productId || productId.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }
    if (!productName || productName.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    return new PureOrderItem(productId, productName, price, quantity);
  }

  // Repository에서 DB 데이터로 복원할 때 사용
  static fromData(
    productId: string,
    productName: string,
    price: Money,
    quantity: number,
    id?: string,
  ): PureOrderItem {
    return new PureOrderItem(productId, productName, price, quantity, id);
  }
}
