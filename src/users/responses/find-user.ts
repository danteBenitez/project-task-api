import { Exclude } from 'class-transformer';

export class FindUserResponse {
    user_id: string;
    name: string;
    email: string;

    @Exclude()
    password: string;

    avatar_url: string;
    created_at: Date;
    updated_at: Date;

    constructor(partial: Partial<FindUserResponse>) {
        Object.assign(this, partial);
    }
}