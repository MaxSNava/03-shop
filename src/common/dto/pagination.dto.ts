import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @ApiProperty({
    default: 10,
    description: 'Cantidad de elementos a mostrar',
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'Pagina a mostrar',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}