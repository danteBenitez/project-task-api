import { User } from '../../users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
} from 'typeorm';

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    project_id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    // A user can create many projects 
    @ManyToOne(() => User, user => user.projects)
    author: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
