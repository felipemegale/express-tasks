import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import Attachment from './Attachment';
import BaseEntity from './BaseEntity';
import User from './User';

@Entity()
export default class Task extends BaseEntity {
    @Column({ length: 50 })
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    complete: boolean;

    @ManyToOne((type) => User, (user) => user.tasks)
    user: User;

    @OneToMany((type) => Attachment, (attachment) => attachment.task)
    attachments: Attachment[];
}
