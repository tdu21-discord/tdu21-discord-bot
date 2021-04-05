import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum Status {
    NEW_JOIN = "NEW_JOIN",
    SENT_EMAIL = "SENT_EMAIL",
    COMPLETE = "COMPLETE"
}

@Entity()
export class Student {
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

    @Column()
    department: string;

    @Column()
    odd_even: number;

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