import { IsNumberString, IsOptional } from "class-validator";

/**
 * DTO for validating query params
 * related to pagination
 */
export class PaginatedDto {
    /**
     * Page number
     */
    @IsOptional()
    @IsNumberString({
        no_symbols: true
    }, {
        message: "Invalid page number"
    })
    page: number;

    /**
     * Page size
     */
    @IsOptional()
    @IsNumberString({
        no_symbols: true
    }, {
        message: "Invalid page size"
    })
    limit: number;
}