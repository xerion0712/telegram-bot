import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from './telegram.service';
import { Response } from '../entities/response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Response])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}

