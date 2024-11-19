import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { AccommodationCategory } from '../entities/category.entity';
import { mockCategories } from './categories.mock';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  // eslint-disable-next-line
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            getAllCategories: jest
              .fn<Promise<AccommodationCategory[]>, []>()
              .mockResolvedValue(mockCategories),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('returns a list of categories', async () => {
      const categories = await controller.getAllCategories();

      expect(categories).toEqual({
        data: mockCategories,
      });
    });
  });
});
