import { Controller, Get, Headers, Param, Post, Req } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import type { Request } from 'express';
import { WebhooksService } from './webhooks.service.js';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('nomba')
  ingestNombaWebhook(
    @Headers() headers: IncomingHttpHeaders,
    @Req() request: RawBodyRequest,
  ) {
    return this.webhooksService.ingestNombaWebhook(headers, request.body, request.rawBody);
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
