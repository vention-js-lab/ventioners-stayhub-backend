import { AccommodationCategory } from 'src/modules/categories/entities';

export const accommodationCategoriesV2: Pick<
  AccommodationCategory,
  'name' | 'name_ru'
>[] = [
  { name: 'Hotels', name_ru: 'Отели' },
  { name: 'Apartments', name_ru: 'Апартаменты' },
  { name: 'Villas', name_ru: 'Виллы' },
  { name: 'Cottages', name_ru: 'Коттеджи' },
  { name: 'Hostels', name_ru: 'Хостелы' },
  { name: 'Resorts', name_ru: 'Курорты' },
  { name: 'Castles', name_ru: 'Замки' },
  { name: 'Cabins', name_ru: 'Домики' },
  { name: 'Motels', name_ru: 'Мотели' },
  { name: 'Yurts', name_ru: 'Юрты' },
  { name: 'Inns', name_ru: 'Гостиницы' },
  { name: 'Glamping Tents', name_ru: 'Глэмпинг' },
  { name: 'Houseboats', name_ru: 'Плавучие дома' },
  { name: 'Campgrounds', name_ru: 'Кемпинги' },
  { name: 'B&Bs', name_ru: 'Мини-отели' },
  { name: 'Treehouses', name_ru: 'Дома на деревьях' },
  { name: 'Chalets', name_ru: 'Шале' },
  { name: 'Farmhouses', name_ru: 'Фермерские дома' },
  { name: 'Ryokans', name_ru: 'Рёканы' },
  { name: 'Cave Hotels', name_ru: 'Отели в пещерах' },
  { name: 'Heritage Hotels', name_ru: 'Исторические отели' },
  { name: 'Water Bungalows', name_ru: 'Водные бунгало' },
  { name: 'Desert Tents', name_ru: 'Пустынные лагеря' },
  { name: 'Safari Lodges', name_ru: 'Сафари-лоджи' },
  { name: 'Ice Hotels', name_ru: 'Ледяные отели' },
] as const;
