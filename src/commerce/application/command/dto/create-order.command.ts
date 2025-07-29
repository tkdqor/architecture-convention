import { plainToClassWithValidation } from '../../../../common/validation/utils';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateOrderCommand {
  constructor(partial?: Partial<CreateOrderCommand>) {
    if (partial) {
      Object.assign(
        this,
        plainToClassWithValidation(CreateOrderCommand, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @IsString()
  @Expose()
  customerId: string;
}
