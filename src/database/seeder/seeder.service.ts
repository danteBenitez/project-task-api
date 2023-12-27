import { Injectable, Logger } from "@nestjs/common";
import { Role, Roles, RolesWithId } from "src/auth/entities/role.entity";
import { EntityManager } from "typeorm";

@Injectable()
export class SeederService {
    private logger = new Logger()

    constructor(
        private entityManager: EntityManager,
    ) {}

    /**
     * Apply all seeding operations
     */
    async seed() {
        await this.seedRoles();
    }

    /**
     * Create roles on the database
     */
    async seedRoles() {
        const roles = [
            {
                role_id: RolesWithId[Roles.ADMIN],
                name: Roles.ADMIN,
                description: 'Admin role. Can manage all entities available on the system.',
            },
            {
                role_id: RolesWithId[Roles.USER],
                name: Roles.USER,
                description: 'User role. Can manage only their own projects and tasks.',
            },
        ];

        this.logger.log('Creating roles: ' + JSON.stringify(roles, null, 2));

        const repo = this.entityManager.getRepository(Role);
        const created = roles.map(role => {
            this.logger.debug('Creating role: ' + role.name);
            return repo.create(role);
        });

        await Promise.all(created.map(role => repo.save(role)))
            .catch(this.logger.fatal);
    }
}