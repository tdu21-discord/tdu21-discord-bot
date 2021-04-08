import {MigrationInterface, QueryRunner} from "typeorm";

export class initialize1617892871428 implements MigrationInterface {
    name = 'initialize1617892871428'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `student` (`id` int NOT NULL AUTO_INCREMENT, `user_id` varchar(18) NOT NULL, `student_id` varchar(255) NULL, `department` varchar(255) NULL, `odd_even` int NULL, `passcode` varchar(4) NULL, `threshold` int NOT NULL DEFAULT '0', `status` enum ('NEW_JOIN', 'SENT_EMAIL', 'COMPLETE') NOT NULL DEFAULT 'NEW_JOIN', `create_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_0cc43638ebcf41dfab27e62dc0` (`user_id`), UNIQUE INDEX `IDX_be3689991c2cc4b6f4cf39087f` (`student_id`), UNIQUE INDEX `IDX_9037c162cbd00890ebba449bcc` (`passcode`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_9037c162cbd00890ebba449bcc` ON `student`");
        await queryRunner.query("DROP INDEX `IDX_be3689991c2cc4b6f4cf39087f` ON `student`");
        await queryRunner.query("DROP INDEX `IDX_0cc43638ebcf41dfab27e62dc0` ON `student`");
        await queryRunner.query("DROP TABLE `student`");
    }

}
