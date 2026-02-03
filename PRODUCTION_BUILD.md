# Production Build Commands

## Prerequisites
1. Make sure you have EAS CLI installed globally:
   ```bash
   npm install -g eas-cli
   ```

2. Login to your Expo account:
   ```bash
   eas login
   ```

## Production Build Commands

### Android Production Build
```bash
eas build --platform android --profile production
```

### iOS Production Build
```bash
eas build --platform ios --profile production
```

### Both Platforms (Android + iOS)
```bash
eas build --platform all --profile production
```

## Language-Specific Production Builds

Based on your `eas.json` configuration, you also have language-specific production builds:

### Bengali (bn)
```bash
eas build --platform android --profile bn
```

### Odia (or)
```bash
eas build --platform android --profile or
```

### Hindi (hi)
```bash
eas build --platform android --profile hi
```

### Assamese (as)
```bash
eas build --platform android --profile as
```

## Local Production Build (Alternative)

If you want to build locally without EAS:

### Android (Local)
```bash
# Prebuild first
npm run prebuild:android

# Then build release APK
cd android && ./gradlew assembleRelease

# Or build release AAB
cd android && ./gradlew bundleRelease
```

### iOS (Local)
```bash
# Prebuild first
npm run prebuild:ios

# Then open in Xcode and build from there
open ios/*.xcworkspace
```

## Notes
- Production builds use the `production` profile from `eas.json`
- Android production builds create AAB files (for Play Store)
- Language-specific builds (bn, or, hi, as) create APK files
- Builds are automatically incremented (`autoIncrement: true`)
- Production builds use the `production` update channel
