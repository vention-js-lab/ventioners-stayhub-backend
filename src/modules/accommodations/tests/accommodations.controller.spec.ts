import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsController } from '../accommodations.controller';
import { AccommodationsService } from '../accommodations.service';
import { mockUsers } from 'src/modules/users/test/users.mock';

describe('AccommodationsController', () => {
  let controller: AccommodationsController;
  let service: AccommodationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccommodationsController],
      providers: [
        {
          provide: AccommodationsService,
          useValue: {
            toggleWishlistAccommodation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccommodationsController>(AccommodationsController);
    service = module.get<AccommodationsService>(AccommodationsService);
  });

  it('should like an accommodation and return the correct response', async () => {
    const accommodationId = 'accommodation-id-123';
    const user = mockUsers[0];

    jest
      .spyOn(service, 'toggleWishlistAccommodation')
      .mockResolvedValueOnce(true);

    const response = await controller.toggleWishlistAccommodation(
      accommodationId,
      user,
    );

    expect(response).toEqual({ message: 'InWishlist' });
    expect(service.toggleWishlistAccommodation).toHaveBeenCalledWith({
      accommodationId,
      userId: user.id,
    });
  });

  it('should unlike an accommodation and return the correct response', async () => {
    const accommodationId = 'accommodation-id-123';
    const user = mockUsers[0];

    jest
      .spyOn(service, 'toggleWishlistAccommodation')
      .mockResolvedValueOnce(false);

    const response = await controller.toggleWishlistAccommodation(
      accommodationId,
      user,
    );

    expect(response).toEqual({ message: 'OutOfWishlist' });
    expect(service.toggleWishlistAccommodation).toHaveBeenCalledWith({
      accommodationId,
      userId: user.id,
    });
  });
});
