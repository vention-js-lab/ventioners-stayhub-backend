import { Amenity } from 'src/modules/amenities/entities';

export const accommodationAmenities: Pick<
  Amenity,
  'name' | 'description' | 'name_ru' | 'description_ru'
>[] = [
  {
    name: 'Free WiFi',
    description: 'Complimentary wireless internet access.',
    name_ru: 'Бесплатный Wi-Fi',
    description_ru: 'Бесплатный беспроводной доступ к интернету.',
  },
  {
    name: 'Parking',
    description: 'On-site vehicle parking available.',
    name_ru: 'Парковка',
    description_ru: 'Парковка для автомобилей на территории отеля.',
  },
  {
    name: 'Air Conditioning',
    description: 'Climate control with cooling system.',
    name_ru: 'Кондиционер',
    description_ru: 'Система климат-контроля с охлаждением.',
  },
  {
    name: 'Heating',
    description: 'Indoor heating for colder weather.',
    name_ru: 'Отопление',
    description_ru: 'Внутренняя система отопления для холодной погоды.',
  },
  {
    name: '24/7 Front Desk',
    description: 'Reception service available round the clock.',
    name_ru: 'Круглосуточная стойка регистрации',
    description_ru: 'Служба приема работает круглосуточно.',
  },
  {
    name: 'Elevator',
    description: 'Lift access to all floors.',
    name_ru: 'Лифт',
    description_ru: 'Доступ на все этажи с помощью лифта.',
  },
  {
    name: 'Room Service',
    description: 'In-room dining and service options.',
    name_ru: 'Обслуживание номеров',
    description_ru: 'Питание и услуги непосредственно в номере.',
  },
  {
    name: 'Kitchen',
    description: 'Fully equipped kitchen for self-catering.',
    name_ru: 'Кухня',
    description_ru:
      'Полностью оборудованная кухня для самостоятельного приготовления пищи.',
  },
  {
    name: 'Coffee Maker',
    description: 'In-room appliance for brewing coffee.',
    name_ru: 'Кофеварка',
    description_ru: 'Прибор для приготовления кофе в номере.',
  },
  {
    name: 'Breakfast Included',
    description: 'Complimentary morning meal.',
    name_ru: 'Завтрак включен',
    description_ru: 'Бесплатный утренний завтрак.',
  },
  {
    name: 'Swimming Pool',
    description: 'Outdoor or indoor pool for guests.',
    name_ru: 'Бассейн',
    description_ru: 'Крытый или открытый бассейн для гостей.',
  },
  {
    name: 'Gym/Fitness Center',
    description: 'On-site exercise and fitness facilities.',
    name_ru: 'Тренажерный зал',
    description_ru: 'Спортивные и фитнес-площадки на территории отеля.',
  },
  {
    name: 'TV',
    description: 'In-room television with various channels.',
    name_ru: 'Телевизор',
    description_ru: 'Телевизор в номере с широким выбором каналов.',
  },
  {
    name: 'Garden',
    description: 'Outdoor green space for relaxation.',
    name_ru: 'Сад',
    description_ru: 'Зеленая зона на открытом воздухе для отдыха.',
  },
  {
    name: 'BBQ Facilities',
    description: 'Outdoor grilling and barbecue area.',
    name_ru: 'Зона барбекю',
    description_ru: 'Площадка для приготовления барбекю на открытом воздухе.',
  },
  {
    name: 'Kids Play Area',
    description: 'Playground and activities for children.',
    name_ru: 'Детская площадка',
    description_ru: 'Игровая площадка и развлечения для детей.',
  },
  {
    name: 'Spa Services',
    description: 'On-site massage and beauty treatments.',
    name_ru: 'Спа-услуги',
    description_ru: 'Массаж и косметические процедуры на территории отеля.',
  },
  {
    name: 'Hot Tub',
    description: 'Jacuzzi or spa bath for relaxation.',
    name_ru: 'Джакузи',
    description_ru: 'Гидромассажная ванна для релаксации.',
  },
  {
    name: 'Washing Machine',
    description: 'In-room or on-site laundry machine.',
    name_ru: 'Стиральная машина',
    description_ru: 'Стиральная машина в номере или на территории отеля.',
  },
  {
    name: 'Work Desk',
    description: 'Dedicated space for working or studying.',
    name_ru: 'Рабочий стол',
    description_ru: 'Специально выделенное место для работы или учебы.',
  },
  {
    name: 'Printing Services',
    description: 'On-site access to printing and copying.',
    name_ru: 'Услуги печати',
    description_ru: 'Доступ к печати и копированию на территории отеля.',
  },
  {
    name: 'Conference Room',
    description: 'Meeting space for business events.',
    name_ru: 'Конференц-зал',
    description_ru: 'Помещение для проведения бизнес-мероприятий.',
  },
  {
    name: 'Bicycle Rental',
    description: 'Available bicycles for guest rental.',
    name_ru: 'Прокат велосипедов',
    description_ru: 'Возможность аренды велосипедов для гостей.',
  },
  {
    name: 'Car Rental',
    description: 'On-site vehicle rental services.',
    name_ru: 'Прокат автомобилей',
    description_ru: 'Услуги аренды автомобилей на территории отеля.',
  },
  {
    name: 'EV Charging Station',
    description: 'Electric vehicle charging points.',
    name_ru: 'Зарядная станция для электромобилей',
    description_ru: 'Точки зарядки для электрических транспортных средств.',
  },
  {
    name: 'Wheelchair Accessible',
    description: 'Facilities adapted for disabled access.',
    name_ru: 'Доступно для инвалидов',
    description_ru:
      'Помещения адаптированы для людей с ограниченными возможностями.',
  },
  {
    name: 'Balcony',
    description: 'Private outdoor space attached to room.',
    name_ru: 'Балкон',
    description_ru:
      'Личное пространство на открытом воздухе, примыкающее к номеру.',
  },
  {
    name: 'Ocean View',
    description: 'Rooms with a view of the sea.',
    name_ru: 'Вид на море',
    description_ru: 'Номера с видом на морское побережье.',
  },
  {
    name: 'Mountain View',
    description: 'Rooms with a view of the mountains.',
    name_ru: 'Вид на горы',
    description_ru: 'Номера с видом на горный пейзаж.',
  },
] as const;
