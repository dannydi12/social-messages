import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { InstagramService } from './instagram/instagram.service';
import { InstagramController } from './instagram/instagram.controller';
import { OauthController } from './oauth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ConfigModule for environment variables
    HttpModule, // Add HttpModule here
  ],
  controllers: [InstagramController, OauthController],
  providers: [InstagramService],
})
export class AppModule {}
