import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Company } from '../companies/entities/company.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Status } from '../status/entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Company, Tag, Status])],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
