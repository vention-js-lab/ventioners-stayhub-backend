import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoriesAndAmenitiesSeeder1732278205426
  implements MigrationInterface
{
  name = 'CategoriesAndAmenitiesSeeder1732278205426';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');

    await queryRunner.query(
      `
        INSERT INTO accommodation_category (name)
        VALUES 
        ('Hotels'),
        ('Apartments'),
        ('Villas'),
        ('Wildlife/Safari Lodges'),
        ('Cottages'),
        ('Hostels'),
        ('Resorts'),
        ('Motels'),
        ('Inns'),
        ('Bed and Breakfasts'),
        ('Cabins'),
        ('Treehouses'),
        ('Houseboats'),
        ('Castles'),
        ('Campgrounds'),
        ('Glamping Tents'),
        ('Yurts'),
        ('Chalets'),
        ('Farmhouses'),
        ('Ryokans'),
        ('Cave Hotels'),
        ('Heritage Hotels'),
        ('Overwater Bungalows'),
        ('Desert Camps'),
        ('Ice Hotels');
      `,
    );

    await queryRunner.query(
      `
        INSERT INTO amenity (name, description)
        VALUES 
        ('Free WiFi', 'Complimentary wireless internet access.'),
        ('Parking', 'On-site vehicle parking available.'),
        ('Air Conditioning', 'Climate control with cooling system.'),
        ('Heating', 'Indoor heating for colder weather.'),
        ('24/7 Front Desk', 'Reception service available round the clock.'),
        ('Elevator', 'Lift access to all floors.'),
        ('Room Service', 'In-room dining and service options.'),
        ('Kitchen', 'Fully equipped kitchen for self-catering.'),
        ('Coffee Maker', 'In-room appliance for brewing coffee.'),
        ('Breakfast Included', 'Complimentary morning meal.'),
        ('Swimming Pool', 'Outdoor or indoor pool for guests.'),
        ('Gym/Fitness Center', 'On-site exercise and fitness facilities.'),
        ('TV', 'In-room television with various channels.'),
        ('Garden', 'Outdoor green space for relaxation.'),
        ('BBQ Facilities', 'Outdoor grilling and barbecue area.'),
        ('Kids Play Area', 'Playground and activities for children.'),
        ('Spa Services', 'On-site massage and beauty treatments.'),
        ('Hot Tub', 'Jacuzzi or spa bath for relaxation.'),
        ('Washing Machine', 'In-room or on-site laundry machine.'),
        ('Work Desk', 'Dedicated space for working or studying.'),
        ('Printing Services', 'On-site access to printing and copying.'),
        ('Conference Room', 'Meeting space for business events.'),
        ('Bicycle Rental', 'Available bicycles for guest rental.'),
        ('Car Rental', 'On-site vehicle rental services.'),
        ('EV Charging Station', 'Electric vehicle charging points.'),
        ('Wheelchair Accessible', 'Facilities adapted for disabled access.'),
        ('Balcony', 'Private outdoor space attached to room.'),
        ('Ocean View', 'Rooms with a view of the sea.'),
        ('Mountain View', 'Rooms with a view of the mountains.');
        `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('TRUNCATE TABLE accommodation_amenities CASCADE');
    await queryRunner.query('TRUNCATE TABLE amenity CASCADE');
    await queryRunner.query('TRUNCATE TABLE accommodation_category CASCADE');
  }
}
