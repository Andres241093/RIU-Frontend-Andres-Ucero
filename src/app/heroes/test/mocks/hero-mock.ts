import { Hero } from '../../interfaces/hero.interface';

export const HEROES_MOCK: Hero[] = [
  { id: 1, name: '', universe: 'Marvel' },
  { id: 2, name: 'Spider-Man', universe: 'marvel' },
  { id: 3, name: 'Iron Man', universe: 'Marvel', power: [] },
  {
    id: 4,
    name: 'Thor Odinson Odinson Odinson Odinson Odinson',
    universe: ' Marvel ',
  },
  { id: 5, name: 'Deadpool', universe: 'Marvel', power: [''] },
  { id: 6, name: 'Hulk', universe: '', power: ['Super Strength'] },
  { id: 7, name: 'Batman', universe: 'DC' },
  { id: 8, name: 'Batman', universe: 'DC' },
  { id: 9, name: 'Rorschach', universe: 'Watchmen', power: undefined },
  { id: 10, name: 'Levi', universe: 'Attack on Titan', power: [''] },
  {
    id: 11,
    name: 'Saitama',
    universe: 'One Punch Man',
    power: ['One Punch KO'],
  },
  { id: 12, name: '1234', universe: 'Numbers', power: ['Test Power'] },
  { id: 13, name: '!@#$%^&*()', universe: 'Symbols' },
  {
    id: 14,
    name: 'LongNameLongNameLongNameLongNameLongNameLongNameLongNameLongNameLongName',
    universe: 'DC',
  },
  { id: 15, name: 'Green Lantern', universe: 'dc' },
  {
    id: 16,
    name: 'Aquaman',
    universe: 'DC',
    power: ['Underwater Breathing', '', null],
  },
  { id: 17, name: 'Góku', universe: 'Dragon Ball', power: ['Super Saiyan'] },
  { id: 18, name: 'Vegeta', universe: 'Dragon Ball' },
  { id: 19, name: 'Kakashi Hatake', universe: 'Naruto', power: ['Copy Ninja'] },
  { id: 20, name: 'Jiraiya', universe: 'Naruto', power: [] },
];

export const HEROES_RESPONSE_MOCK = {
  items: HEROES_MOCK,
  total: HEROES_MOCK.length,
};
