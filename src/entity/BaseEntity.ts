import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @Column({ nullable: true })
    updatedAt: Date;
}
