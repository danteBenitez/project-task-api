import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703047117501 implements MigrationInterface {
    name = 'Migration1703047117501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "logo_url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "logo_url" SET NOT NULL`);
    }

}
