import { IsOptional, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Type(() => Number) //string to number
    page?: number;
  
    @IsOptional()
    @Type(() => Number)
    limit?: number;
}
