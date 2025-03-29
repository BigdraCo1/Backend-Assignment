import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/config/database/database.module';
import { RiderModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule, 
    RiderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}