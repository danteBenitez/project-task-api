import { Project } from "../entities/project.entity";

export class FindProjectResponse extends Project {
    constructor(project: Project) {
        delete project.author.password;
        super();
        Object.assign(this, project);
    }
}