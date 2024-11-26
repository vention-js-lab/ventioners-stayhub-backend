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
    const payload = { sub: mockUsers[0].id, userEmail: mockUsers[0].email };

    jest
      .spyOn(service, 'toggleWishlistAccommodation')
      .mockResolvedValueOnce(true);

    const response = await controller.toggleWishlistAccommodation(
      accommodationId,
      payload,
    );

    expect(response).toEqual({ message: 'Wishlisted' });
    expect(service.toggleWishlistAccommodation).toHaveBeenCalledWith({
      accommodationId,
      userId: payload.sub,
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
      { sub: user.id, userEmail: user.email },
    );

    expect(response).toEqual({ message: 'UnWishlisted' });
    expect(service.toggleWishlistAccommodation).toHaveBeenCalledWith({
      accommodationId,
      userId: user.id,
    });
  });
});
