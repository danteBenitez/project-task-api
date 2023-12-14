import { IsString, IsUUID } from 'class-validator';

export class FindOneParams {
    @IsString()
    @IsUUID('all', {
        message: "Invalid user ID"
    })
    id: string;
}