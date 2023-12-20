import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703041206178 implements MigrationInterface {
    name = 'Migration1703041206178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_d67afa825964aa0695ad36dc083"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "authorUserId" TO "author_id"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "author_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7b6d0ef34b4fe57ce02c7403ce2" FOREIGN KEY ("author_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7b6d0ef34b4fe57ce02c7403ce2"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "author_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "author_id" TO "authorUserId"`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_d67afa825964aa0695ad36dc083" FOREIGN KEY ("authorUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
