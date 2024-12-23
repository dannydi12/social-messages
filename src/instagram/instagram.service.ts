import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InstagramService {
  private readonly GRAPH_API_URL = 'https://graph.facebook.com/v17.0';
  private accessToken: string | null = null; // Store access token in memory

  constructor(private readonly httpService: HttpService) {}

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.GRAPH_API_URL}/oauth/access_token`, {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.FB_APP_ID,
            client_secret: process.env.FB_APP_SECRET,
            fb_exchange_token: shortLivedToken,
          },
        }),
      );
      return response.data.access_token;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch access token',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createMediaContainer(
    imageUrl: string,
    caption: string,
  ): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.GRAPH_API_URL}/${process.env.IG_BUSINESS_ID}/media`,
          {
            image_url: imageUrl,
            caption,
          },
          { headers: { Authorization: `Bearer ${this.accessToken}` } },
        ),
      );
      return response.data.id;
    } catch (error) {
      throw new HttpException(
        'Failed to create media container',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async schedulePost(containerId: string, scheduledTime: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.GRAPH_API_URL}/${process.env.IG_BUSINESS_ID}/media_publish`,
          {
            creation_id: containerId,
            published_time: scheduledTime,
          },
          { headers: { Authorization: `Bearer ${this.accessToken}` } },
        ),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to schedule post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
