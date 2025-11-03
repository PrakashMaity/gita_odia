# Common Styles Guide

## Overview

`commonStyles` provides a centralized collection of shared style patterns used across the application. This promotes consistency and reduces code duplication.

## Usage

```typescript
import { commonStyles } from '@/constants';

// Use in component
<ThemedView style={commonStyles.screen.container}>
  <ScrollView style={commonStyles.screen.scrollView}>
    {/* content */}
  </ScrollView>
</ThemedView>
```

## Available Style Groups

### Screen Styles (`commonStyles.screen`)
Common screen-level styles:
- `container` - Full screen container with relative positioning
- `scrollView` - Basic scroll view layout
- `scrollContent` - Scroll content with padding
- `scrollContentNoPadding` - Scroll content without horizontal padding

### Card Styles (`commonStyles.card`)
Reusable card components:
- `introCard` - Introduction/summary cards
- `card` - Generic content card
- `contentCard` - Content display card
- `verseCard` - Verse display card with shadows
- `chapterCard` - Chapter list card with enhanced shadows
- `headerCard` - Header section card

### Section Styles (`commonStyles.section`)
Section layout patterns:
- `section` - Section container
- `sectionHeader` - Section header layout
- `sectionHeaderWithPadding` - Section header with horizontal padding
- `sectionIndicator` - Visual indicator bar
- `sectionIndicatorSmall` - Smaller indicator
- `sectionTitle` - Section title
- `sectionTitleBold` - Bold section title

### Text Styles (`commonStyles.text`)
Common text patterns:
- `introText` - Center-aligned introduction text
- `introTitle` - Introduction title
- `centeredText` - Center-aligned text
- `centeredTextWithMargin` - Center-aligned text with bottom margin
- `headerTitle` - Page header title
- `secondaryText` - Secondary text with line height
- `secondaryTextSmall` - Smaller secondary text
- `subtitle` - Subtitle text
- `verseText` - Verse text styling
- `translationText` - Translation text
- `progressText` - Progress indicator text

### List Item Styles (`commonStyles.listItem`)
List layouts:
- `list` - List container with gap
- `listItem` - Individual list item
- `bulletPoint` - Circular bullet point
- `itemText` - List item text
- `stepNumber` - Numbered step indicator

### Layout Styles (`commonStyles.layout`)
Flex layouts:
- `flexRow` - Row layout
- `flexRowCenter` - Centered row layout
- `flexRowSpaceBetween` - Space-between row layout
- `textContainer` - Text container
- `iconContainer` - Icon container with shadow
- `iconContainerSmall` - Small icon container
- `actionButton` - Action button layout
- `headerActions` - Header action buttons
- `chapterContainer` - Chapter list container

### Header Styles (`commonStyles.header`)
Header components:
- `header` - Generic header
- `headerContent` - Header content wrapper
- `headerTitle` - Header title
- `headerSubtitle` - Header subtitle
- `backButton` - Back button layout

### Verse Styles (`commonStyles.verse`)
Verse-specific layouts:
- `verseHeader` - Verse header layout
- `verseNumberContainer` - Verse number wrapper
- `speakerContainer` - Speaker info container
- `speakerName` - Speaker name text
- `verseSection` - Verse section container
- `sectionHeader` - Section header
- `sectionTitle` - Section title
- `languageContainer` - Language text container
- `favoriteContainer` - Favorite button container

## Benefits

1. **Consistency** - Unified styling across the app
2. **Maintainability** - Single source of truth for styles
3. **Performance** - Reused StyleSheet objects
4. **Developer Experience** - Clear, semantic naming
5. **Code Reduction** - Eliminates duplication

## Migration Strategy

When refactoring existing components:

1. Import `commonStyles` from `@/constants`
2. Replace local styles with `commonStyles` equivalents
3. Keep component-specific styles in local `StyleSheet.create`
4. For dynamic styles, combine common styles with inline styles

### Example

**Before:**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  // ... many more styles
});
```

**After:**
```typescript
import { commonStyles } from '@/constants';

// Only define component-specific styles
const styles = StyleSheet.create({
  customStyle: {
    // component-specific styling only
  },
});

// Use commonStyles in JSX
<ThemedView style={commonStyles.screen.container}>
  <ScrollView style={commonStyles.screen.scrollView}>
    {/* content */}
  </ScrollView>
</ThemedView>
```

## Best Practices

1. **Prefer commonStyles** for shared patterns
2. **Keep local styles** for truly unique component styles
3. **Combine dynamically** when common styles need theme-specific props
4. **Don't over-abstract** - keep component-specific styles local
5. **Use descriptive names** when extending common patterns

## Adding New Common Styles

When a pattern appears in 3+ components:
1. Add to appropriate style group in `commonStyles.ts`
2. Use semantic, descriptive names
3. Document in this README
4. Update existing components to use new style

