import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CreateRiderDto {
  @ApiProperty({ example: 'Johny' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Sin' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'example@example.com'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890'})
  @Length(3,15)
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
  
  @ApiProperty({ 
    type: LocationDto,
    required: false,
    description: 'Rider location information'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}