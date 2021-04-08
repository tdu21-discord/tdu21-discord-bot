import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Status {
    NEW_JOIN = "NEW_JOIN",
    SENT_EMAIL = "SENT_EMAIL",
    COMPLETE = "COMPLETE"
}

@Entity()
export class Student extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
        length: 18,
        unique: true
    })
    user_id: string;

    @Column({
        type: "varchar",
        unique: true
    })
    student_id: string;

    @Column({
        nullable: true
    })
    department: string;

    @Column({
        nullable: true
    })
    odd_even: number;

    @Column({
        type: "varchar",
        nullable: true,
        length: 4,
        unique: true
    })
    passcode: string;

    @Column({
        default: 0
    })
    threshold: number;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.NEW_JOIN
    })
    status: Status;

    @CreateDateColumn({
        name: "create_at"
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at"
    })
    updatedAt: Date;
}