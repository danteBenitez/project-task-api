import { IsString, IsUUID } from 'class-validator';

export class FindOneParams {
    @IsString()
    @IsUUID('all', {
        message: "Invalid project ID"
    })
    id: string;
}