import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsService } from '../accommodations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities';
import { Accommodation } from '../entities';
import { User } from 'src/modules/users/entities/user.entity';

describe('AccommodationsService - toggleLikeAccommodation', () => {
  let service: AccommodationsService;
  let mockAccommodationLikeRepo: Partial<Repository<Wishlist>>;
  let mockAccommodationRepo: Partial<Repository<Accommodation>>;
  let mockUserRepo: Partial<Repository<User>>;

  beforeEach(async () => {
    mockAccommodationLikeRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    mockAccommodationRepo = {
      findOne: jest.fn(),
    };
    mockUserRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccommodationsService,
        {
          provide: getRepositoryToken(Wishlist),
          useValue: mockAccommodationLikeRepo,
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

  it('should unlike an accommodation if it is already liked', async () => {
    const payload = { userId: 'user123', accommodationId: 'acc123' };
    (mockAccommodationLikeRepo.findOne as jest.Mock).mockResolvedValue({});

    const result = await service.toggleLikeAccommodation(payload);

    expect(mockAccommodationLikeRepo.findOne).toHaveBeenCalled();
    expect(mockAccommodationLikeRepo.remove).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should like an accommodation if it is not liked', async () => {
    const payload = { userId: 'user123', accommodationId: 'acc123' };
    (mockAccommodationLikeRepo.findOne as jest.Mock).mockResolvedValue(null);
    (mockAccommodationRepo.findOne as jest.Mock).mockResolvedValue({});
    (mockUserRepo.findOne as jest.Mock).mockResolvedValue({});

    const result = await service.toggleLikeAccommodation(payload);

    expect(mockAccommodationLikeRepo.findOne).toHaveBeenCalled();
    expect(mockAccommodationLikeRepo.save).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
