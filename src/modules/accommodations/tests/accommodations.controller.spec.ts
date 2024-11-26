import { Test, TestingModule } from '@nestjs/testing';
import { AccommodationsController } from '../accommodations.controller';
import { AccommodationsService } from '../accommodations.service';
import { JwtPayload } from 'src/modules/auth/auth.types';

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
    const payload: JwtPayload = {
      sub: 'user-id-123',
      userEmail: '',
    };

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
    const payload: JwtPayload = {
      sub: 'user-id-123',
      userEmail: '',
    };

    jest
      .spyOn(service, 'toggleWishlistAccommodation')
      .mockResolvedValueOnce(false);

    const response = await controller.toggleWishlistAccommodation(
      accommodationId,
      payload,
    );

    expect(response).toEqual({ message: 'UnWishlisted' });
    expect(service.toggleWishlistAccommodation).toHaveBeenCalledWith({
      accommodationId,
      userId: payload.sub,
    });
  });
});
