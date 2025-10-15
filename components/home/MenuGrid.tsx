import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { MenuItem, getMenuSections } from '@/constants/menuData';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedLanguageText } from '../ui/ThemedLanguageText';

interface MenuGridProps {
  onMenuItemPress?: (item: MenuItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ onMenuItemPress }) => {
  const theme = useThemeColors();
  const menuSections = getMenuSections();

  const renderIcon = (item: MenuItem) => {
    const iconProps = {
      name: item.iconName as any,
      size: SIZES.icon.xl,
      color: theme.icon.primary,
    };

    switch (item.iconFamily) {
      case 'FontAwesome5':
        return <FontAwesome5 {...iconProps} />;
      case 'FontAwesome6':
        return <FontAwesome6 {...iconProps} />;
      case 'MaterialIcons':
        return <MaterialIcons {...iconProps} />;
      case 'Ionicons':
        return <Ionicons {...iconProps} />;
      default:
        return <MaterialIcons {...iconProps} />;
    }
  };

  const handleItemPress = (item: MenuItem) => {
    if (onMenuItemPress) {
      onMenuItemPress(item);
    } else if (item.action) {
      item.action();
    }
  };



  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      style={styles.menuItemContainer}
    >
      <ThemedCard 
        style={[styles.menuItem, { 
          // borderColor: theme.border.primary,
        }]}
        pattern={"mandala"}
        patternOpacity={0.08}
      >
        <ThemedView style={[styles.iconContainer, { 
          backgroundColor: theme.background.tertiary,
        }]}>
          {renderIcon(item)}
        </ThemedView>
        <ThemedView style={styles.textContainer}>
          <ThemedLanguageText 
            variant='primary'
            fontFamily='regional_secondary'
            size='large'
          >
            {item.title}
          </ThemedLanguageText>
          {item.description && (
            <ThemedLanguageText 
              variant='secondary'
              size='medium'
              fontFamily='regional_secondary'
            >
              {item.description}
            </ThemedLanguageText>
          )}
        </ThemedView>
        <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.tertiary }]}>
          <MaterialIcons 
            name="arrow-forward-ios" 
            size={SIZES.icon.xs} 
            color={theme.icon.secondary} 
          />
        </ThemedView>
      </ThemedCard>
    </TouchableOpacity>
  );

  const renderSection = (section: typeof menuSections[0]) => (
    <ThemedView key={section.id} style={styles.section}>
      <ThemedView style={styles.sectionHeader}>
        <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
        <ThemedLanguageText 
          variant='primary'
          size='xl'
          fontFamily='regional_secondary'
        >
          {section.title}
        </ThemedLanguageText>
      </ThemedView>
      <ThemedView style={styles.menuContainer}>
        {section.items.map(renderMenuItem)}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {menuSections.map(renderSection)}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.sm,
  },
  sectionIndicator: {
    width: 5,
    height: 28,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    fontSize: SIZES.xxl,
    fontFamily: 'regional_secondaryItalic',
    flex: 1,
  },
  menuContainer: {
    // gap: SIZES.spacing.md,
  },
  menuItemContainer: {
    // marginBottom: SIZES.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.xl,
    borderWidth: 1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: SIZES.xxl,
    fontFamily: 'regional_secondaryItalic',
    marginBottom: SIZES.spacing.xs,
  },
  menuItemDescription: {
    fontSize: SIZES.md,
    fontFamily: 'regional_primaryRegulaCurve',
  
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
});

export default MenuGrid;
