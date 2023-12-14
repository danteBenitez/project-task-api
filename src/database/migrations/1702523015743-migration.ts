import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702523015743 implements MigrationInterface {
    name = 'Migration1702523015743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("project_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "authorUserId" uuid, CONSTRAINT "PK_1a480c5734c5aacb9cef7b1499d" PRIMARY KEY ("project_id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_d67afa825964aa0695ad36dc083" FOREIGN KEY ("authorUserId") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_d67afa825964aa0695ad36dc083"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
