import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'stockbuster',
      synchronize: true, // for development purposes only, in production it should be set to false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
