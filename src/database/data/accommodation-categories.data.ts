import { AccommodationCategory } from 'src/modules/categories/entities';

export const accommodationCategories: Pick<
  AccommodationCategory,
  'name' | 'name_ru'
>[] = [
  { name: 'Hotels', name_ru: 'Отели' },
  { name: 'Apartments', name_ru: 'Апартаменты' },
  { name: 'Villas', name_ru: 'Виллы' },
  { name: 'Wildlife/Safari Lodges', name_ru: 'Лоджи для сафари' },
  { name: 'Cottages', name_ru: 'Коттеджи' },
  { name: 'Hostels', name_ru: 'Хостелы' },
  { name: 'Resorts', name_ru: 'Курорты' },
  { name: 'Motels', name_ru: 'Мотели' },
  { name: 'Inns', name_ru: 'Гостиницы' },
  { name: 'Bed and Breakfasts', name_ru: 'Мини-отели с завтраком' },
  { name: 'Cabins', name_ru: 'Домики' },
  { name: 'Treehouses', name_ru: 'Дома на деревьях' },
  { name: 'Houseboats', name_ru: 'Плавучие дома' },
  { name: 'Castles', name_ru: 'Замки' },
  { name: 'Campgrounds', name_ru: 'Кемпинги' },
  { name: 'Glamping Tents', name_ru: 'Глэмпинг' },
  { name: 'Yurts', name_ru: 'Юрты' },
  { name: 'Chalets', name_ru: 'Шале' },
  { name: 'Farmhouses', name_ru: 'Фермерские дома' },
  { name: 'Ryokans', name_ru: 'Рёканы' },
  { name: 'Cave Hotels', name_ru: 'Отели в пещерах' },
  { name: 'Heritage Hotels', name_ru: 'Исторические отели' },
  { name: 'Overwater Bungalows', name_ru: 'Бунгало над водой' },
  { name: 'Desert Camps', name_ru: 'Лагеря в пустыне' },
  { name: 'Ice Hotels', name_ru: 'Ледяные отели' },
] as const;
