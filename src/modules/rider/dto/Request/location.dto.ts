import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class LocationDto {
  @ApiProperty({ example: 37.7749, description: 'Latitude between -90 and 90 degrees' })
  @IsNumber()
  @Min(-90, { message: 'Latitude must be between -90 and 90 degrees' })
  @Max(90, { message: 'Latitude must be between -90 and 90 degrees' })
  latitude: number;

  @ApiProperty({ example: -122.4194, description: 'Longitude between -180 and 180 degrees' })
  @IsNumber()
  @Min(-180, { message: 'Longitude must be between -180 and 180 degrees' })
  @Max(180, { message: 'Longitude must be between -180 and 180 degrees' })
  longitude: number;
}