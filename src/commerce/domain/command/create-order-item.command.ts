import { plainToClassWithValidation } from '../../../common/utils';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateOrderItemCommand {
  constructor(partial?: Partial<CreateOrderItemCommand>) {
    if (partial) {
      Object.assign(
        this,
        plainToClassWithValidation(CreateOrderItemCommand, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @IsString()
  @Expose()
  orderId: string;
}
