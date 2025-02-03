import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  /**
   * Create a new product.
   * @param createProductDto The product data to create.
   * @returns The created product.
   */
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  /**
   * Find all products, with their company.
   * @returns An array of products, with their company.
   */
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one product by ID' })
  /**
   * Find one product by ID.
   * @param id The ID of the product to find.
   * @returns The product with the given ID.
   * @throws {NotFoundException} If no product with the given ID is found.
   */
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiBody({ type: UpdateProductDto })
  /**
   * Update a product by ID.
   * @param id The ID of the product to update.
   * @param updateProductDto The product data to update.
   * @returns The updated product.
   * @throws {NotFoundException} If no product with the given ID is found.
   */
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a product by ID' })
  /**
   * Remove a product by ID.
   * @param id The ID of the product to remove.
   * @returns A promise that resolves to void.
   * @throws {NotFoundException} If no product with the given ID is found.
   */
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
