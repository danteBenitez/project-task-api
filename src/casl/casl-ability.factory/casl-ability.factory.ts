import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, PureAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { Roles } from "src/auth/entities/role.entity";
import { Project } from "src/projects/entities/project.entity";
import { User } from "src/users/entities/user.entity";

/** 
 * The Subjects in the application.
 * Either a User or a resource that it can have
 * access to. 
 * 
 * 'all' is a keyword that represents
 * all subjects.
 */
export type Subjects = InferSubjects<typeof Project | typeof User> | 'all';

/** 
 * Possible actions on the application
 * 
 * 'manage' is a shortcut for specyfing all
 * possible actions on a subject.
 */
export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

/**
 * A ability object for the App: A set of permissions
 * given to certain subjects
 */
export type AppAbility = PureAbility<[Actions, Subjects]>;

/**
 * Class that encapsulates the creation
 * of Ability objects for Subjects.
 * These represent the permissions that
 * a Subject has over a Resource.
 */
@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User) {
        const builder = new AbilityBuilder<AppAbility>(
           Ability as AbilityClass<AppAbility> 
        );
        console.log(user);
        if (user.role.name == Roles.ADMIN) {
            // An admin can do everything
            builder.can('manage', 'all');
        } else {
            // A user can manage its own projects...
            builder.can('manage', Project, { 'author_id': user.user_id });
            // ... and read any public project.
            builder.can('read', Project, { 'public': true });
        }

        return builder.build({
            // Infer the subject type from the constructor of the corresponding
            // class, since we use a entity model for it.
            // Here `item` is any subject.
            detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>
        });
    }
}
