import { Amenity } from 'src/modules/accommodations/entities';

export const accommodationAmenities: Pick<Amenity, 'name' | 'description'>[] = [
  {
    name: 'Free WiFi',
    description: 'Complimentary wireless internet access.',
  },
  { name: 'Parking', description: 'On-site vehicle parking available.' },
  {
    name: 'Air Conditioning',
    description: 'Climate control with cooling system.',
  },
  { name: 'Heating', description: 'Indoor heating for colder weather.' },
  {
    name: '24/7 Front Desk',
    description: 'Reception service available round the clock.',
  },
  { name: 'Elevator', description: 'Lift access to all floors.' },
  {
    name: 'Room Service',
    description: 'In-room dining and service options.',
  },
  {
    name: 'Kitchen',
    description: 'Fully equipped kitchen for self-catering.',
  },
  {
    name: 'Coffee Maker',
    description: 'In-room appliance for brewing coffee.',
  },
  { name: 'Breakfast Included', description: 'Complimentary morning meal.' },
  {
    name: 'Swimming Pool',
    description: 'Outdoor or indoor pool for guests.',
  },
  {
    name: 'Gym/Fitness Center',
    description: 'On-site exercise and fitness facilities.',
  },
  { name: 'TV', description: 'In-room television with various channels.' },
  { name: 'Garden', description: 'Outdoor green space for relaxation.' },
  {
    name: 'BBQ Facilities',
    description: 'Outdoor grilling and barbecue area.',
  },
  {
    name: 'Kids Play Area',
    description: 'Playground and activities for children.',
  },
  {
    name: 'Spa Services',
    description: 'On-site massage and beauty treatments.',
  },
  { name: 'Hot Tub', description: 'Jacuzzi or spa bath for relaxation.' },
  {
    name: 'Washing Machine',
    description: 'In-room or on-site laundry machine.',
  },
  {
    name: 'Work Desk',
    description: 'Dedicated space for working or studying.',
  },
  {
    name: 'Printing Services',
    description: 'On-site access to printing and copying.',
  },
  {
    name: 'Conference Room',
    description: 'Meeting space for business events.',
  },
  {
    name: 'Bicycle Rental',
    description: 'Available bicycles for guest rental.',
  },
  { name: 'Car Rental', description: 'On-site vehicle rental services.' },
  {
    name: 'EV Charging Station',
    description: 'Electric vehicle charging points.',
  },
  {
    name: 'Wheelchair Accessible',
    description: 'Facilities adapted for disabled access.',
  },
  { name: 'Balcony', description: 'Private outdoor space attached to room.' },
  { name: 'Ocean View', description: 'Rooms with a view of the sea.' },
  {
    name: 'Mountain View',
    description: 'Rooms with a view of the mountains.',
  },
] as const;
