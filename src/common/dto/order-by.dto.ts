import { IsEnum, IsIn, IsString } from "class-validator";

/**
 * DTO to validate query params related
 * to order by queries
 */
export function OrderByDto(entityValues: Array<string>) {
    class OrderByDto {
        @IsString({
            message: "Invalid order by column"
        })
        @IsIn(entityValues, {
            message: `Invalid order by column. Valid values are: ${entityValues.join(", ")}`
        })
        column: keyof typeof entityValues;


        @IsString({
            message: "Invalid order by direction"
        })
        @IsEnum(["ASC", "DESC"], {
            message: "Invalid order by direction. Valid values are: ASC, DESC"
        })
        direction: "ASC" | "DESC";
    }

    return OrderByDto;
}