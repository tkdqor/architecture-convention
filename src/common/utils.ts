import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import { validateSync } from 'class-validator';
import { MDException } from './exception/md-exception';
import { plainToInstance } from 'class-transformer';

export function plainToClassWithValidation<T extends object>(
  classType: new (...args: any[]) => T,
  plainObject: Record<string, any>,
  options?: ClassTransformOptions,
): T {
  const classObject = plainToInstance(classType, plainObject, options);
  const errors = validateSync(classObject);
  if (errors.length > 0) {
    let errorMessage = 'Validation errors:\n';
    errors.forEach((error) => {
      for (const constraint in error.constraints) {
        errorMessage += `Property [ ${error.property} ] has failed the following constraint: ${error.constraints[constraint]}\n`;
      }
    });
    throw new MDException(errorMessage);
  }
  return classObject;
}
