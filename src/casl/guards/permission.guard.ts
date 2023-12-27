import {
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Injectable,
  CanActivate,
  mixin
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CaslAbilityFactory,
  Subjects,
} from '../casl-ability.factory/casl-ability.factory';
import {
  PERMISSION_KEY,
  VerifyAbilityCallback,
} from '../decorators/permission.decorator';
import { EntityManager, EntityTarget, FindOneOptions, ObjectLiteral } from 'typeorm';
import { Request } from 'express';

/**
 * Type for a Subject of actions that's also an entity.
 */
export type EntitySubject = Subjects & EntityTarget<ObjectLiteral>;

/**
 * Extract the object type from a Entity Target
 */
export type EntityTargetType<T extends EntityTarget<ObjectLiteral>> = T extends EntityTarget<infer R> ? R : T;

/**
 * Guard that checks if the user can perform the request.
 * It uses the @RequirePermissions decorator to retrieve
 * the permissions required to perform the request.
 * 
 * @warning This guard requires the user to be present in the request.
 * and the ID of the entity to be present in the request params.
 */
export function PermissionGuardMixin<TSubject extends EntitySubject>(
  subject: TSubject,
) {
  @Injectable()
  class PermissionGuard implements CanActivate {
    logger = new Logger()

    constructor(
      readonly reflector: Reflector,
      readonly abilityFactory: CaslAbilityFactory,
      readonly entityManager: EntityManager,
    ) {}

    /**
     * Method used to retrieve the params to find the entity
     * in the database. The entity is a subject so that any user
     * has certain permission to perform actions with it.
     * 
     * @param {Request} req The request object
     * @returns {Promise<FindOneOptions<TSubject>>} The params to find the entity as
     * specified by the interface. 
     */
    async getFindParams(req: Request): Promise<FindOneOptions<TSubject>> {
      return { where: { id: req.params.id } as any  };
    }

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user) {
        this.logger.error(
          'No user found in request. Consider that the JWT strategy is not enabled or that the guard is misplaced.',
        );
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }

      const verifications = this.reflector.getAllAndOverride<
        VerifyAbilityCallback<EntityTargetType<TSubject>>[]
      >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
      const ability = this.abilityFactory.createForUser(user);

      const repository = this.entityManager.getRepository(subject);
      const retrievedEntity = await repository.findOne(await this.getFindParams(request) as FindOneOptions);

      if (
        !verifications ||
        verifications.every((verify) => verify(ability, retrievedEntity as EntityTargetType<TSubject>))
      ) {
        return true;
      }

      throw new UnauthorizedException(
        'You are not authorized to perform this action',
      );
    }
  }

  return mixin(PermissionGuard);
}
