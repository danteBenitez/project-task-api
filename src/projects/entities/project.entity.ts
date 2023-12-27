import { User } from '../../users/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
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
    @JoinColumn({ name: 'author_id' })
    author: User;

    author_id: string;

    @Column({
        nullable: true
    })
    logo_url: string;

    @Column({
        default: false,
        type: 'boolean'
    })
    public: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
