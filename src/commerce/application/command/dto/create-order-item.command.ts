import { plainToClassWithValidation } from '../../../../common/validation/utils';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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
