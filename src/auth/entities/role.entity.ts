import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const Roles = {
    USER: 'user',
    ADMIN: 'admin'
} as const;

export const RolesWithId = {
    [Roles.USER]: 'd4d3d3ff-396b-4023-b87d-80be9a578bc1', 
    [Roles.ADMIN]: 'cc05122e-e843-4cb7-b848-dd5b62f23c4f'
} as const;

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    // Users can have a role
    @OneToMany(() => User, user => user.role)
    users: User[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}