import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityTarget, ObjectLiteral} from 'typeorm';
import { EntityType } from 'src/types/entity.type';

interface ExistsArguments<TEntity extends ObjectLiteral> extends ValidationArguments {
  constraints: [{ entity: EntityTarget<ObjectLiteral>; columnName: keyof TEntity }];
}

@ValidatorConstraint({ name: 'Exists', async: true })
@Injectable()
export class ExistsConstraint implements ValidatorConstraintInterface { 
  entity: EntityType;
  columnName: string | number | symbol;

  constructor(private readonly entityManager: EntityManager) {}

  async validate<TEntity extends ObjectLiteral>(
    property: any,
    args: ExistsArguments<TEntity>,
  ): Promise<boolean> {
    console.log("Validating exists constraint");
    const { entity, columnName } = args.constraints[0];
    this.entity = entity;
    this.columnName = columnName;
    const existing = await this.entityManager.getRepository(entity).findOne({
      where: {
        [columnName]: property,
      },
    });
    return !!existing;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const metadata = this.entityManager.getRepository(this.entity).metadata;
    return `${metadata.name} with ${String(this.columnName)} == ${validationArguments.value} does not exist`;
  }
}

interface ExistsOptions<TEntity extends ObjectLiteral> {
  entity: EntityTarget<TEntity>;  
  columnName: keyof TEntity;
}

export function Exists<TEntity extends ObjectLiteral>(
  options: ExistsOptions<TEntity>,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      propertyName,
      target: object.constructor,
      validator: ExistsConstraint,
      async: true,
      constraints: [options],
      options: validationOptions,
    });
  };
}
