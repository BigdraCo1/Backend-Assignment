import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRiderDto, UpdateRiderDto, LocationDto } from './dto';
import { DatabaseService } from '@/config/database/database.service';
import { RiderMapper, DistanceCalculator } from '@/common/helper';
import { Rider, Location } from '@prisma/client';

@Injectable()
export class RiderService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createRiderDto: CreateRiderDto): Promise<Rider> {
    const data = RiderMapper.toCreateInput(createRiderDto);
    return this.databaseService.rider.create({
      data,
      include: { location: true },
    });
  }

  async findAll(): Promise<Rider[]> {
    return this.databaseService.rider.findMany({
      include: { location: true },
    });
  }

  async findOne(id: string): Promise<Rider> {
    const rider = await this.databaseService.rider.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    return rider;
  }

  async update(id: string, updateRiderDto: UpdateRiderDto): Promise<Rider> {
    await this.validateRiderExists(id);

    return this.databaseService.rider.update({
      where: { id },
      data: RiderMapper.toUpdateInput(updateRiderDto),
      include: { location: true },
    });
  }

  async remove(id: string): Promise<Rider> {
    await this.validateRiderExists(id);

    return this.databaseService.rider.delete({
      where: { id },
    });
  }

  async findRiderLocations(id: string): Promise<Location | null> {
    const rider = await this.databaseService.rider.findUnique({
      where: { id },
      include: { location: true },
    });

    if (!rider) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }

    if (!rider.location) {
      throw new NotFoundException(`Location not found for rider with ID ${id}`);
    }

    return rider.location;
  }

  async upsertRiderLocation(id: string, location: LocationDto): Promise<Rider> {
    await this.validateRiderExists(id);

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

  async searchRiderNearBy(
    latitude: number,
    longitude: number,
    searchRadius = 5,
  ): Promise<Rider[]> {
    const { latitudeDelta, longitudeDelta } = DistanceCalculator.kmToDegrees(
      searchRadius,
      latitude,
    );

    const riders = await this.databaseService.rider.findMany({
      where: {
        location: {
          latitude: {
            gte: latitude - latitudeDelta,
            lte: latitude + latitudeDelta,
          },
          longitude: {
            gte: longitude - longitudeDelta,
            lte: longitude + longitudeDelta,
          },
        },
      },
      include: { location: true },
    });

    return riders.filter(
      (rider) =>
        rider.location &&
        DistanceCalculator.calculateDistance(
          latitude,
          longitude,
          rider.location.latitude,
          rider.location.longitude,
        ) <= searchRadius,
    );
  }

  private async validateRiderExists(id: string): Promise<void> {
    const riderExists = await this.databaseService.rider.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!riderExists) {
      throw new NotFoundException(`Rider with ID ${id} not found`);
    }
  }
}
