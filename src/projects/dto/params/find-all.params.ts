import { IsString } from "class-validator";

export class FindAllParams {
    @IsString({
        message: "Invalid project name"
    })
    name = "";

    @IsString({
        message: "Invalid project description"
    })
    description = "";
}