import {IsNumber, IsOptional, Min} from "class-validator";
import {Type} from "class-transformer";

export class FindAllEntitiesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset: number;
}
