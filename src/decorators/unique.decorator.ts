import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EntityManager  } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

interface IsUniqueValidationArguments extends ValidationArguments {
  constraints: [{ entity: EntityClassOrSchema; columnName: string }];
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(
    property: any,
    args: IsUniqueValidationArguments,
  ): Promise<boolean> {
    const { entity, columnName } = args.constraints[0];
    console.log("columnName: ", columnName);
    console.log("constraints: ", args.constraints);
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

interface IsUniqueOptions {
  entity: EntityClassOrSchema;  
  columnName: string;
}

export function IsUnique(
  options: IsUniqueOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    console.log("options: ", options);
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
