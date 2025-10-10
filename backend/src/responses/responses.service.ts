import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from '../entities/response.entity';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {}

  async getAllResponses(): Promise<Response[]> {
    return this.responseRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getResponsesByUser(userId: number): Promise<Response[]> {
    return this.responseRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStats() {
    const totalResponses = await this.responseRepository.count();
    const uniqueUsers = await this.responseRepository
      .createQueryBuilder('response')
      .select('COUNT(DISTINCT response.userId)', 'count')
      .getRawOne();

    return {
      totalResponses,
      uniqueUsers: parseInt(uniqueUsers.count),
    };
  }
}

