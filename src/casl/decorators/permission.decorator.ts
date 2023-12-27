import { SetMetadata } from '@nestjs/common';
import {
  Actions,
  AppAbility,
} from '../casl-ability.factory/casl-ability.factory';
import { EntitySubject, EntityTargetType } from '../guards/permission.guard';
import { ObjectLiteral } from 'typeorm';
import { applyDecorators } from '@nestjs/common/decorators';

export const PERMISSION_KEY = 'permissions';

/**
 * Callback that receives a AppAbility object
 * and returns a boolean indicating if the
 * user can proceed with the request.
 */
export type VerifyAbilityCallback<TSubject extends ObjectLiteral> = (
  ability: AppAbility,
  subject: TSubject,
) => boolean;

export const RequirePermissions = <TSubject extends EntitySubject>(...permissions: VerifyAbilityCallback<EntityTargetType<TSubject>>[]) =>
  SetMetadata(PERMISSION_KEY, permissions);

/**
 * Helper decorator to assert a required permission for a given
 * user, following the ability object associated with such user.
 * 
 */
export const RequireAbility = <TSubject extends EntitySubject>(action: Actions = 'manage') => {
  return applyDecorators(
    RequirePermissions<TSubject>((ability, subject) => {
      return ability.can(action, subject as EntitySubject);
    })
  )
}
