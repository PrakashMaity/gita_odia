import { getNavigationHandler } from '@/features/home/navigationHandlers';
import i18n from '@/lib/i18n';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import type { ImageSourcePropType } from 'react-native';

import dhyaanImage from '@/assets/images/Home/menu/dhyaan.png';
import mangalacharanImage from '@/assets/images/Home/menu/mongalacharan.png';
import rudrashaImage from '@/assets/images/rudrasha.png';

export interface MenuItem {
  id: string;
  title: string;
  icon?: React.ComponentType<any>;
  iconName?: string;
  iconFamily?: 'FontAwesome5' | 'FontAwesome6' | 'MaterialIcons' | 'Ionicons';
  image?: ImageSourcePropType;
  description?: string;
  route?: string;
  action?: () => void;
}

export interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export const getMenuSections = (): MenuSection[] => [
  {
    id: 'prayers',
    title: i18n.t('menu.prayers'),
    items: [
      {
        id: 'mangalacharan',
        title: i18n.t('menu.mangalacharan'),
        image: mangalacharanImage,
        description: i18n.t('menu.mangalacharanDesc'),
        action: () => getNavigationHandler({ id: 'mangalacharan' } as MenuItem)(),
      },
      {
        id: 'dhyana',
        title: i18n.t('menu.dhyana'),
        image: dhyaanImage,
        description: i18n.t('menu.dhyanaDesc'),
        action: () => getNavigationHandler({ id: 'dhyana' } as MenuItem)(),
      },
      {
        id: 'mala-japa',
        title: i18n.t('menu.malaJapa'),
        image: rudrashaImage,
        description: i18n.t('menu.malaJapaDesc'),
        action: () => getNavigationHandler({ id: 'mala-japa' } as MenuItem)(),
      },
      {
        id: 'krishna-mantras',
        title: i18n.t('menu.krishnaMantras'),
        icon: MaterialIcons,
        iconName: 'menu-book',
        iconFamily: 'MaterialIcons',
        description: i18n.t('menu.krishnaMantrasDesc'),
        action: () => getNavigationHandler({ id: 'krishna-mantras' } as MenuItem)(),
      },
      {
        id: 'verse-of-the-day',
        title: i18n.t('menu.verseOfTheDay'),
        icon: FontAwesome6,
        iconName: 'quote-left',
        iconFamily: 'FontAwesome6',
        description: i18n.t('menu.verseOfTheDayDesc'),
        action: () => getNavigationHandler({ id: 'verse-of-the-day' } as MenuItem)(),
      },
    ],
  },
  {
    id: 'chapters',
    title: i18n.t('menu.chapters'),
    items: [
      {
        id: 'all-chapters',
        title: i18n.t('menu.allChapters'),
        icon: FontAwesome6,
        iconName: 'book-bookmark',
        iconFamily: 'FontAwesome6',
        description: i18n.t('menu.allChaptersDesc'),
        action: () => getNavigationHandler({ id: 'all-chapters' } as MenuItem)(),
      },
      {
        id: 'all-translations',
        title: i18n.t('menu.translations'),
        icon: FontAwesome6,
        iconName: 'language',
        iconFamily: 'FontAwesome6',
        description: i18n.t('menu.translationsDesc'),
        action: () => getNavigationHandler({ id: 'all-translations' } as MenuItem)(),
      },
     
    ],
  },
  {
    id: 'features',
    title: i18n.t('menu.features'),
    items: [
      {
        id: 'daily-reading',
        title: i18n.t('menu.dailyReading'),
        icon: FontAwesome6,
        iconName: 'chart-line',
        iconFamily: 'FontAwesome6',
        description: i18n.t('menu.dailyReadingDesc'),
        action: () => getNavigationHandler({ id: 'daily-reading' } as MenuItem)(),
      },
      {
        id: 'favorites',
        title: i18n.t('menu.favorites'),
        icon: MaterialIcons,
        iconName: 'favorite',
        iconFamily: 'MaterialIcons',
        description: i18n.t('menu.favoritesDesc'),
        action: () => getNavigationHandler({ id: 'favorites' } as MenuItem)(),
      },
    ],
  },
  {
    id: 'extra',
    title: i18n.t('menu.extra') || 'অতিরিক্ত',
    items: [
      {
        id: 'reading-timer',
        title: i18n.t('menu.readingTimer'),
        icon: MaterialIcons,
        iconName: 'timer',
        iconFamily: 'MaterialIcons',
        description: i18n.t('menu.readingTimerDesc'),
        action: () => getNavigationHandler({ id: 'reading-timer' } as MenuItem)(),
      },
      {
        id: 'all-ekadashi',
        title: i18n.t('menu.allEkadashi'),
        icon: FontAwesome6,
        iconName: 'calendar-days',
        iconFamily: 'FontAwesome6',
        description: i18n.t('menu.allEkadashiDesc'),
        action: () => getNavigationHandler({ id: 'all-ekadashi' } as MenuItem)(),
      },
    ],
  },
  
];
