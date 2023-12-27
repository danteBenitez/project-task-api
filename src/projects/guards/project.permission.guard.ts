import { PermissionGuardMixin } from "src/casl/guards/permission.guard";
import { Project } from "../entities/project.entity";
import { Request } from "express";
import { FindOneOptions } from "typeorm";

export class ProjectPermissionGuard extends PermissionGuardMixin<typeof Project>(Project) {
    async getFindParams(req: Request): Promise<FindOneOptions<typeof Project>> {
        return { where: { project_id: req.params.id } } as FindOneOptions;
    }
}
