import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/config/database/database.module';
import { RiderModule } from './modules';

@Module({
  imports: [DatabaseModule, RiderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
