import { Controller, Get, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';

@Controller('api/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  async getAllResponses() {
    return this.responsesService.getAllResponses();
  }

  @Get('user')
  async getResponsesByUser(@Query('userId') userId: string) {
    return this.responsesService.getResponsesByUser(parseInt(userId));
  }

  @Get('stats')
  async getStats() {
    return this.responsesService.getStats();
  }
}

