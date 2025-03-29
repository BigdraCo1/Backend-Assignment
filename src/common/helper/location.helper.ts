import { EARTH_RADIUS, EARTH_KM_PER_DEGREES } from "@/shared/constants";

export class DistanceCalculator {
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
  }
  
  static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static kmToDegrees(km: number, latitude?: number): { latitudeDelta: number, longitudeDelta: number } {
    const latitudeDelta = km / EARTH_KM_PER_DEGREES; 
    const longitudeDelta = latitude !== undefined
      ? km / (EARTH_KM_PER_DEGREES * Math.cos(this.degreesToRadians(latitude)))
      : latitudeDelta;
    
    return { latitudeDelta, longitudeDelta };
  }
}