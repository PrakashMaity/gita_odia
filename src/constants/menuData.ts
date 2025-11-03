import { getNavigationHandler } from '@/components/home/navigationHandlers';
import i18n from '@/i18n';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';

export interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  iconName: string;
  iconFamily: 'FontAwesome5' | 'FontAwesome6' | 'MaterialIcons' | 'Ionicons';
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
        icon: MaterialIcons,
        iconName: 'favorite',
        iconFamily: 'MaterialIcons',
        description: i18n.t('menu.mangalacharanDesc'),
        action: () => getNavigationHandler({ id: 'mangalacharan' } as MenuItem)(),
      },
      {
        id: 'dhyana',
        title: i18n.t('menu.dhyana'),
        icon: MaterialIcons,
        iconName: 'self-improvement',
        iconFamily: 'MaterialIcons',
        description: i18n.t('menu.dhyanaDesc'),
        action: () => getNavigationHandler({ id: 'dhyana' } as MenuItem)(),
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
  
];
