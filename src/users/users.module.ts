import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], // Ajout de Role ici
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Facultatif si utilisé dans d'autres modules
})
export class UsersModule {}
