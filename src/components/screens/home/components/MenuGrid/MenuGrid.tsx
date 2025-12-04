import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { MenuItem, getMenuSections } from '@/constants/menuData';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, TouchableOpacity, ViewStyle } from 'react-native';
import { styles } from './MenuGrid.styles';

interface MenuGridProps {
  onMenuItemPress?: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ onMenuItemPress }) => {
  const theme = useThemeColors();
  const menuSections = getMenuSections();
  const layout = useDeviceLayout();
  const isGrid = layout.gridColumns > 1;

  const renderIcon = (item: MenuItem) => {
    if (item.image) {
      return <Image source={item.image} style={styles.menuImage} resizeMode="cover" />;
    }

    if (!item.iconName || !item.iconFamily) {
      return null;
    }

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
      style={[
        styles.menuItemContainer,
        isGrid && styles.menuItemGrid,
        isGrid && {
          width: layout.gridItemWidthPercent as ViewStyle['width'],
          maxWidth: layout.gridItemWidthPercent as ViewStyle['maxWidth'],
        },
      ]}
    >
      <ThemedCard 
        style={styles.menuItem}
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
      <ThemedView
        style={[
          styles.menuContainer,
          isGrid && styles.menuContainerGrid,
        ]}
      >
        {section.items.map(renderMenuItem)}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView
      style={[
        styles.container,
        layout.isTablet ? styles.containerTablet : styles.containerMobile,
      ]}
    >
      {menuSections.map(renderSection)}
    </ThemedView>
  );
};

