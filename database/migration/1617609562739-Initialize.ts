import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1617609562739 implements MigrationInterface {
    name = 'Initialize1617609562739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `student` CHANGE `department` `department` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `student` CHANGE `odd_even` `odd_even` int NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `student` CHANGE `odd_even` `odd_even` int NOT NULL");
        await queryRunner.query("ALTER TABLE `student` CHANGE `department` `department` varchar(255) NOT NULL");
    }

}
