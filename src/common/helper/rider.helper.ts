import { Prisma } from '@prisma/client';
import { CreateRiderDto, UpdateRiderDto } from '@/modules/rider/dto';

type LocationMode = 'create' | 'update' | 'upsert';
type LocationResult<T> = { location?: any, baseRider: Omit<T, 'location'> };

export class RiderMapper {
  private static handleLocation<T extends CreateRiderDto | UpdateRiderDto>(
    dto: T,
    mode: LocationMode
  ): LocationResult<T> {
    const { location, ...baseRider } = dto;

    if (!location) {
      return { baseRider };
    }

    const locationData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const locationConfig = {
      create: { create: locationData },
      update: { update: locationData },
      upsert: { upsert: { update: locationData, create: locationData } }
    };

    return { 
      baseRider, 
      location: locationConfig[mode]
    };
  }

  static toCreateInput(dto: CreateRiderDto): Prisma.RiderCreateInput {
    const { baseRider, location } = this.handleLocation(dto, 'create');
    return { ...baseRider, location };
  }

  static toUpdateInput(dto: UpdateRiderDto): Prisma.RiderUpdateInput {
    const { baseRider, location } = this.handleLocation(dto, 'upsert');
    return { ...baseRider, location };
  }
}