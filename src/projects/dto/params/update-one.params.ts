import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateOneParams {
    @IsString({
        message: "Invalid project id"
    })
    @IsNotEmpty({
        message: "Invalid project ID"
    })
    @IsUUID("all", {
        message: "Invalid project ID"
    })
    id: string;
}