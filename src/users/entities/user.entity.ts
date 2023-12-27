import { Role } from 'src/auth/entities/role.entity';
import { Project } from '../../projects/entities/project.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true
  })
  avatar_url: string;

  // A user can create many projects
  @OneToMany(() => Project, (project) => project.author)
  projects: Project[];

  // A user can have only one role
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: true
  })
  role: Role;

  @JoinColumn({ name: 'role_id', referencedColumnName: 'role_id' })
  role_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
