import { Prisma } from '@prisma/client';
import { CreateRiderDto, UpdateRiderDto } from '@/modules/rider/dto';

export class RiderMapper {
  private static handleLocation<T extends CreateRiderDto | UpdateRiderDto>(
    dto: T,
    mode: 'create' | 'update' | 'upsert'
  ): { location?: any, baseRider: Omit<T, 'location'> } {
    const { location, ...baseRider } = dto;

    if (!location) {
      return { baseRider };
    }

    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const locationField = mode === 'create' 
      ? { create: locationData }
      : mode === 'update' 
        ? { update: locationData } 
        : { upsert: { update: locationData, create: locationData } };

    return { 
      baseRider, 
      location: locationField 
    };
  }

  static toCreateInput(dto: CreateRiderDto): Prisma.RiderCreateInput {
    const { baseRider, location } = this.handleLocation(dto, 'create');
    return {
      ...baseRider,
      location,
    };
  }

  static toUpdateInput(dto: UpdateRiderDto): Prisma.RiderUpdateInput {
    const { baseRider, location } = this.handleLocation(dto, 'upsert');
    return {
      ...baseRider,
      location,
    };
  }
}