import { plainToClassWithValidation } from '../../../common/utils';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateOrderUseCaseInput {
  constructor(partial?: Partial<CreateOrderUseCaseInput>) {
    if (partial) {
      Object.assign(
        this,
        plainToClassWithValidation(CreateOrderUseCaseInput, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @IsString()
  @Expose()
  customerId: string;
}
