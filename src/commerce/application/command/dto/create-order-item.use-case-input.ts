import { plainToClassWithValidation } from '../../../../common/utils';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateOrderItemUseCaseInput {
  constructor(partial?: Partial<CreateOrderItemUseCaseInput>) {
    if (partial) {
      Object.assign(
        this,
        plainToClassWithValidation(CreateOrderItemUseCaseInput, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @IsString()
  @Expose()
  orderId: string;
}
