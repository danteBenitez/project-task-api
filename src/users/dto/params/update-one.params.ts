import { Exists } from "src/decorators/exists.decorator";
import { FindOneParams } from "./find-one.params";
import { User } from "src/users/entities/user.entity";

export class UpdateOneParams extends FindOneParams {
    @Exists<User>({
        entity: User,
        columnName: 'user_id'
    })
    id: string;
}