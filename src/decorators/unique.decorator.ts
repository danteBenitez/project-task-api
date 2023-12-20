import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, ObjectLiteral  } from 'typeorm';

interface IsUniqueValidationArguments<TEntity extends ObjectLiteral> extends ValidationArguments {
  constraints: [{ entity: EntityTarget<ObjectLiteral>; columnName: keyof TEntity }];
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate<TEntity extends ObjectLiteral>(
    property: any,
    args: IsUniqueValidationArguments<TEntity>,
  ): Promise<boolean> {
    console.log("Validating unique constraint");
    const { entity, columnName } = args.constraints[0];
    const existing = await this.entityManager.getRepository(entity).findOne({
      where: {
        [columnName]: property,
      },
    });
    return !existing;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must be unique`;
  }
}

interface IsUniqueOptions<TEntity extends ObjectLiteral> {
  entity: EntityTarget<TEntity>;  
  columnName: keyof TEntity;
}

export function IsUnique<TEntity extends ObjectLiteral>(
  options: IsUniqueOptions<TEntity>,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      propertyName,
      target: object.constructor,
      validator: IsUniqueConstraint,
      async: true,
      constraints: [options],
      options: validationOptions,
    });
  };
}
