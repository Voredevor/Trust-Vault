import { Controller, Get, Headers, Logger, Param, Post, Req } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import type { Request } from 'express';
import { WebhooksService } from './webhooks.service.js';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('nomba')
  async ingestNombaWebhook(
    @Headers() headers: IncomingHttpHeaders,
    @Req() request: RawBodyRequest,
  ) {
    const response = await this.webhooksService.ingestNombaWebhook(
      headers,
      request.body,
      request.rawBody,
    );
    this.logger.log({
      stage: 'Response status returned',
      statusCode: 201,
    });
    return response;
  }

  @Get('debug')
  debug() {
    return this.webhooksService.debug();
  }

  @Get('events')
  findAll() {
    return this.webhooksService.findAll();
  }

  @Get('events/:id')
  findOne(@Param('id') id: string) {
    return this.webhooksService.findOne(id);
  }
}
