# ThemedCard SVG Patterns

This directory contains beautiful SVG background patterns for the ThemedCard component, inspired by [fffuel.co](https://www.fffuel.co/sssvg/).

## Available Patterns

### 1. **Dot Pattern** (`dot`)
- Simple geometric dots arranged in a grid
- Perfect for subtle background texture
- Great for minimal designs

### 2. **Wave Pattern** (`wave`)
- Flowing wave lines with varying opacity
- Creates a sense of movement and fluidity
- Ideal for content related to water, meditation, or flow

### 3. **Hexagon Pattern** (`hexagon`)
- Nested hexagonal shapes
- Modern geometric aesthetic
- Great for tech or structured content

### 4. **Grid Pattern** (`grid`)
- Clean grid lines with center dots
- Professional and organized look
- Perfect for data or structured content

### 5. **Spiral Pattern** (`spiral`)
- Curved spiral shapes
- Creates depth and focus
- Great for spiritual or meditative content

### 6. **Mandala Pattern** (`mandala`)
- Concentric circles with cross patterns
- Sacred geometry inspired
- Perfect for spiritual and religious content

### 7. **Gradient Dot Pattern** (`gradientDot`)
- Dots with radial gradient effects
- Soft and elegant appearance
- Great for premium or luxury content

### 8. **Blob Pattern** (`blob`)
- Organic, flowing shapes
- Natural and fluid appearance
- Perfect for creative or artistic content

### 9. **Sacred Geometry Pattern** (`sacredGeometry`)
- Complex geometric patterns with circles and lines
- Spiritual and mystical appearance
- Ideal for religious or philosophical content

### 10. **Flowing Lines Pattern** (`flowingLines`)
- Multiple flowing curved lines
- Dynamic and energetic
- Great for active or movement-related content

## Usage

```tsx
import { ThemedCard } from '@/components/ui/ThemedCard';

// Basic usage with pattern
<ThemedCard pattern="mandala" patternOpacity={0.15}>
  <Text>Your content here</Text>
</ThemedCard>

// With different variants
<ThemedCard 
  variant="primary" 
  pattern="sacredGeometry" 
  patternOpacity={0.1}
>
  <Text>Sacred content</Text>
</ThemedCard>

// No pattern (default)
<ThemedCard pattern="none">
  <Text>Clean card</Text>
</ThemedCard>
```

## Pattern Properties

- **pattern**: `PatternType` - The pattern to use (or 'none' for no pattern)
- **patternOpacity**: `number` - Opacity of the pattern (0-1, default: 0.1)

## Theme Integration

All patterns automatically adapt to your app's theme:
- **Light Mode**: Uses primary and secondary icon colors
- **Dark Mode**: Uses primary and secondary icon colors
- Patterns respect the current theme's color palette

## Performance

- Patterns are rendered as SVG components
- Optimized for React Native performance
- Patterns are cached and reused efficiently
- Minimal impact on app performance

## Customization

You can easily add new patterns by:
1. Creating a new pattern component in `SvgPatterns.tsx`
2. Adding it to the `patternComponents` object
3. Including it in the `PatternType` union type

## Inspiration

These patterns are inspired by the beautiful SVG patterns available at [fffuel.co](https://www.fffuel.co/sssvg/), adapted specifically for the Bhagavad Gita app's spiritual and cultural aesthetic.
