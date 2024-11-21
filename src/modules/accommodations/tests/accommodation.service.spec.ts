import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsService } from '../accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities';
import { Accommodation } from '../entities';
import { User } from 'src/modules/users/entities/user.entity';

describe('AccommodationsService - toggleLikeAccommodation', () => {
  let service: AccommodationsService;
  let mockWishlistRepo: Partial<Repository<Wishlist>>;
  let mockAccommodationRepo: Partial<Repository<Accommodation>>;
  let mockUserRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    mockWishlistRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({}),
      remove: jest.fn().mockResolvedValue({}),
    };
    mockAccommodationRepo = {
      findOne: jest.fn().mockResolvedValue({}),
    };
    mockUserRepo = {
      findOne: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockWishlistRepo,
        },
        {
          provide: getRepositoryToken(Accommodation),
          useValue: mockAccommodationRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<AccommodationsService>(AccommodationsService);
  });

  describe('toggleLikeAccommodation', () => {
    it('should unlike an accommodation if it is already liked', async () => {
      const payload = { userId: 'user123', accommodationId: 'acc123' };
      (mockWishlistRepo.findOne as jest.Mock).mockResolvedValue({});

      const result = await service.toggleLikeAccommodation(payload);

      expect(mockWishlistRepo.findOne).toHaveBeenCalled();
      expect(mockWishlistRepo.remove).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should like an accommodation if it is not liked', async () => {
      const payload = { userId: 'user123', accommodationId: 'acc123' };
      (mockWishlistRepo.findOne as jest.Mock).mockResolvedValue(null);
      (mockAccommodationRepo.findOne as jest.Mock).mockResolvedValue({});
      (mockUserRepo.findOne as jest.Mock).mockResolvedValue({});

      const result = await service.toggleLikeAccommodation(payload);

      expect(mockWishlistRepo.findOne).toHaveBeenCalled();
      expect(mockWishlistRepo.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });
  });
});
