import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import {
  CreateRiderDto,
  UpdateRiderDto,
  LocationDto,
  LocationQueryDto,
} from './dto';
import { ApiTags, ApiQuery, ApiParam, ApiOperation } from '@nestjs/swagger';

@ApiTags('riders')
@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rider' })
  create(@Body() createRiderDto: CreateRiderDto) {
    return this.riderService.create(createRiderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all riders' })
  findAll() {
    return this.riderService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for riders near a specific location' })
  @ApiQuery({
    name: 'latitude',
    description: 'Latitude between -90 and 90',
    type: Number,
  })
  @ApiQuery({
    name: 'longitude',
    description: 'Longitude between -180 and 180',
    type: Number,
  })
  searchRiderNearBy(@Query() query: LocationQueryDto) {
    return this.riderService.searchRiderNearBy(query.latitude, query.longitude);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiOperation({ summary: 'Get rider by ID' })
  findOne(@Param('id') id: string) {
    return this.riderService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiOperation({ summary: 'Update rider information' })
  update(@Param('id') id: string, @Body() updateRiderDto: UpdateRiderDto) {
    return this.riderService.update(id, updateRiderDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiOperation({ summary: 'Delete rider' })
  remove(@Param('id') id: string) {
    return this.riderService.remove(id);
  }

  @Get(':id/locations')
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiOperation({ summary: 'Get rider locations' })
  findRiderLocations(@Param('id') id: string) {
    return this.riderService.findRiderLocations(id);
  }

  @Post(':id/locations')
  @ApiParam({ name: 'id', description: 'Rider ID' })
  @ApiOperation({ summary: 'Add rider location' })
  upsertRiderLocation(@Param('id') id: string, @Body() location: LocationDto) {
    return this.riderService.upsertRiderLocation(id, location);
  }
}
