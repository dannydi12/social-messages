import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InstagramService } from './instagram.service';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramService) {}

  @Post('schedule')
  async schedulePost(
    @Body() body: { imageUrl: string; caption: string; scheduledTime: number },
  ) {
    try {
      const containerId = await this.instagramService.createMediaContainer(
        body.imageUrl,
        body.caption,
      );
      return await this.instagramService.schedulePost(
        containerId,
        body.scheduledTime,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
