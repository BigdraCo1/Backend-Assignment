import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRiderDto, UpdateRiderDto, LocationDto } from './dto';
import { DatabaseService } from '@/config/database/database.service';
import { RiderMapper, DistanceCalculator } from '@/common/helper';
import { Rider } from '@prisma/client';

@Injectable()
export class RiderService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createRiderDto: CreateRiderDto): Promise<Rider> {
    const data = RiderMapper.toCreateInput(createRiderDto);
    return this.databaseService.rider.create({ data }); 
  }

  async findAll(): Promise<Rider[]> {
    return this.databaseService.rider.findMany({
      include: { location: true },
    });
  }

  async findOne(id: string): Promise<Rider | null> {
    return this.databaseService.rider.findUnique({
      where: { id: id },
      include: { location: true },
    });
  }

  async update(id: string, updateRiderDto: UpdateRiderDto): Promise<Rider | null> { 
    const riderExists = await this.databaseService.rider.findUnique({
      where: { id },
    });
    if (!riderExists) {
      return null;
    }
    const riderData = RiderMapper.toUpdateInput(updateRiderDto);
    return this.databaseService.rider.update({
      where: { id },
      data: riderData,
      include: { location: true },
    });
  }

  async remove(id: string) {
    return this.databaseService.rider.delete({
      where: { id },
    });
  }

  async findRiderLocations(id: string): Promise<LocationDto | null> {
    const rider = await this.databaseService.rider.findUnique({
      where: { id },
      include: { location: true }
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    return rider.location;
  }

  async upsertRiderLocation(id: string, location: LocationDto): Promise<Rider | null> {
    const riderExists = await this.databaseService.rider.findUnique({
      where: { id },
    });
    if (!riderExists) {
      return null;
    }

    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    return this.databaseService.rider.update({
      where: { id },
      data: {
        location: {
          upsert: {
            update: locationData,
            create: locationData,
          },
        },
      },
      include: { location: true },
    });
  }

  async searchRiderNearBy(id: string, latitude: number, longitude: number): Promise<Rider[]> {
    const rider = await this.databaseService.rider.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    const riders = await this.databaseService.rider.findMany({
      where: {
        location: {
          latitude: {
            gte: latitude - 0.1,
            lte: latitude + 0.1,
          },
          longitude: {
            gte: longitude - 0.1,
            lte: longitude + 0.1,
          },
        },
      },
      include: { location: true },
    });

    return riders.filter(r => r.id !== id && DistanceCalculator.calculateDistance(r.location?.latitude, r.location?.longitude, latitude, longitude ) <= 5);
  }
}
