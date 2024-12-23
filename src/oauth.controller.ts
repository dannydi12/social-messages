import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { InstagramService } from './instagram/instagram.service';
import { firstValueFrom } from 'rxjs';

@Controller('oauth')
export class OauthController {
  private readonly REDIRECT_URI = 'http://localhost/oauth/callback';

  constructor(private readonly instagramService: InstagramService) {}

  @Get('authorize')
  authorize(@Res() res: Response) {
    const clientId = process.env.FB_APP_ID;
    const redirectUri = encodeURIComponent(this.REDIRECT_URI);
    const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement&response_type=code`;
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const response =
        await this.instagramService.exchangeForLongLivedToken(code);
      this.instagramService.setAccessToken(response);
      res.send('Access token obtained and stored in memory.');
    } catch (error) {
      res.status(400).send('Failed to exchange code for access token.');
    }
  }
}
