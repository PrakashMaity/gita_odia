import { getNavigationHandler } from '@/components/home/navigationHandlers';
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

export const menuSections: MenuSection[] = [
  {
    id: 'prayers',
    title: 'ପ୍ରାର୍ଥନା ଓ ସ୍ତୋତ୍ର',
    items: [
      {
        id: 'mangalacharan',
        title: 'ମଙ୍ଗଳାଚରଣ',
        icon: MaterialIcons,
        iconName: 'favorite',
        iconFamily: 'MaterialIcons',
        description: 'ଗୀତା ପାଠର ପୂର୍ବରୁ ମଙ୍ଗଳାଚରଣ',
        action: () => getNavigationHandler({ id: 'mangalacharan' } as MenuItem)(),
      },
      {
        id: 'dhyana',
        title: 'ଧ୍ୟାନ',
        icon: MaterialIcons,
        iconName: 'self-improvement',
        iconFamily: 'MaterialIcons',
        description: 'ଧ୍ୟାନ ଓ ଚିନ୍ତନ',
        action: () => getNavigationHandler({ id: 'dhyana' } as MenuItem)(),
      },
    
    ],
  },
  {
    id: 'chapters',
    title: 'ଅଧ୍ୟାୟସମୂହ',
    items: [
      {
        id: 'all-chapters',
        title: 'ସମସ୍ତ ଅଧ୍ୟାୟ',
        icon: FontAwesome6,
        iconName: 'book-bookmark',
        iconFamily: 'FontAwesome6',
        description: 'ସମସ୍ତ ୧୮ଟି ଅଧ୍ୟାୟ',
        action: () => getNavigationHandler({ id: 'all-chapters' } as MenuItem)(),
      },
      {
        id: 'all-translations',
        title: 'ଓଡ଼ିଆ ଅନୁବାଦ',
        icon: FontAwesome6,
        iconName: 'language',
        iconFamily: 'FontAwesome6',
        description: 'ସମସ୍ତ ଅଧ୍ୟାୟର ଓଡ଼ିଆ ଅନୁବାଦ',
        action: () => getNavigationHandler({ id: 'all-translations' } as MenuItem)(),
      },
     
    ],
  },
  {
    id: 'features',
    title: 'ବିଶେଷ ବିଶେଷତା',
    items: [
     
      {
        id: 'favorites',
        title: 'ପ୍ରିୟ ଶ୍ଲୋକ',
        icon: MaterialIcons,
        iconName: 'favorite',
        iconFamily: 'MaterialIcons',
        description: 'ଆପଣଙ୍କର ପ୍ରିୟ ଶ୍ଲୋକସମୂହ',
        action: () => getNavigationHandler({ id: 'favorites' } as MenuItem)(),
      },
      
    ],
  },
  
];
