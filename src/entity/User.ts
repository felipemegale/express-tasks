import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from './BaseEntity';
import Task from './Task';

@Entity()
export default class User extends BaseEntity {
    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    avatar: string;

    @OneToMany((type) => Task, (task) => task.user)
    tasks: Task[];
}
