import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOneBy: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve atualizar um produto existente', async () => {
    const productId = 1;
    const updateData = { name: 'Novo Produto' };
    const existingProduct = {
      id: productId,
      name: 'Produto Antigo',
      price: 100,
    };

    (repository.findOneBy as jest.Mock).mockResolvedValue(existingProduct);
    (repository.save as jest.Mock).mockResolvedValue({
      ...existingProduct,
      ...updateData,
    });

    const result = await service.update(productId, updateData);

    expect(repository.findOneBy).toHaveBeenCalledWith({ id: productId });
    expect(repository.save).toHaveBeenCalledWith({
      ...existingProduct,
      ...updateData,
    });
    expect(result).toEqual({ ...existingProduct, ...updateData });
  });

  it('deve lançar exceção quando o produto não for encontrado', async () => {
    const productId = 1;
    (repository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(
      service.update(productId, { name: 'Novo Produto' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve retornar todos os produtos', async () => {
    const products = [{ id: 1, name: 'Produto 1', price: 100 }];
    (repository.find as jest.Mock).mockResolvedValue(products);

    const result = await service.findAll();

    expect(result).toEqual(products);
    expect(repository.find).toHaveBeenCalled();
  });

  it('deve criar um novo produto', async () => {
    const productData = { name: 'Produto Novo', price: 100 };
    const savedProduct = { id: 1, ...productData };

    (repository.create as jest.Mock).mockReturnValue(productData);
    (repository.save as jest.Mock).mockResolvedValue(savedProduct);

    const result = await service.create(productData);

    expect(result).toEqual(savedProduct);
    expect(repository.create).toHaveBeenCalledWith(productData);
    expect(repository.save).toHaveBeenCalledWith(productData);
  });
});
