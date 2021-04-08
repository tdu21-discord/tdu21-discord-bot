import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1617861662803 implements MigrationInterface {
    name = 'initialize1617861662803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `student` ADD `passcode` varchar(4) NULL");
        await queryRunner.query("ALTER TABLE `student` ADD UNIQUE INDEX `IDX_9037c162cbd00890ebba449bcc` (`passcode`)");
        await queryRunner.query("ALTER TABLE `student` ADD `threshold` int NOT NULL DEFAULT '0'");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `student` DROP COLUMN `threshold`");
        await queryRunner.query("ALTER TABLE `student` DROP INDEX `IDX_9037c162cbd00890ebba449bcc`");
        await queryRunner.query("ALTER TABLE `student` DROP COLUMN `passcode`");
    }

}
