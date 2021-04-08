import { Column, Entity, ManyToOne } from 'typeorm';
import BaseEntity from './BaseEntity';
import Task from './Task';

@Entity()
export default class Attachment extends BaseEntity {
    @Column()
    name: string;

    @Column({ type: 'bytea', nullable: true })
    data: Buffer;

    @ManyToOne((type) => Task, (task) => task.attachments)
    task: Task;
}
