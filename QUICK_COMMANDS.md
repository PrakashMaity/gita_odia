# Quick Commands for Gita Odia App

## 🚀 Building for Production

### Option 1: Using EAS (Recommended)
```bash
# For Odia version
APP_LANG=or eas build --platform android --profile or

# For Bengali version
APP_LANG=bn eas build --platform android --profile bn
```

### Option 2: Using Build Script
```bash
# For Odia (default)
./build-production.sh or

# For Bengali
./build-production.sh bn
```

### Option 3: Local Build (Advanced)
```bash
# Clean and prebuild
APP_LANG=or npx expo prebuild --clean

# Build release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Testing

### Development Testing
```bash
# Start development server for Odia
APP_LANG=or expo start

# Or use npm script
npm run start:or
```

### Test Production Build Locally
```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# View logs
adb logcat | grep -E "ReactNative|Expo|Error|Exception"
```

---

## 📱 EAS Build Management

### Check Build Status
```bash
eas build:list
```

### View Latest Build
```bash
eas build:view
```

### Download Build
```bash
# Download latest build
eas build:download
```

### Cancel Build
```bash
eas build:cancel
```

---

## 🐛 Debugging Production Crashes

### View Device Logs
```bash
# All logs
adb logcat

# Only errors
adb logcat | grep -E "FATAL|AndroidRuntime"

# Only React Native
adb logcat | grep ReactNative

# Save to file
adb logcat > crash_log.txt
```

### Check APK Contents
```bash
# Extract APK
unzip app-release.apk -d apk-contents

# Check assets
ls -R apk-contents/assets

# Check native libs
ls -R apk-contents/lib
```

### View Build Info
```bash
# Check APK size
ls -lh android/app/build/outputs/apk/release/app-release.apk

# Get APK info
aapt dump badging android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔧 Maintenance Commands

### Clean Build
```bash
# Clean all build artifacts
cd android
./gradlew clean
cd ..

# Clean expo cache
expo start --clear

# Clean npm cache
npm cache clean --force

# Clean all
rm -rf node_modules android/build android/app/build
npm install
```

### Update Dependencies
```bash
# Update expo
npx expo install expo@latest

# Update all packages
npx expo install --fix
```

### Reset Project
```bash
npm run reset-project
```

---

## 📊 Version Management

### Current Version (v1.0.2)
- `app.config.js`: version: "1.0.2"
- `android/app/build.gradle`: versionCode: 2, versionName: "1.0.2"

### Increment Version (for next release)
```bash
# Manually edit these files:
# 1. app.config.js - change version: "1.0.3"
# 2. android/app/build.gradle - change versionCode: 3 and versionName: "1.0.3"
```

---

## 🚢 Play Store Submission

### Build AAB for Play Store
```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Sign APK (if needed)
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore debug.keystore \
  app-release-unsigned.apk androiddebugkey
```

### Upload to Play Store
```bash
# Using EAS submit
eas submit --platform android
```

---

## 🧹 Common Issues & Solutions

### Issue: Build fails with "Out of Memory"
```bash
# Increase memory in android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=1024m
```

### Issue: Font not loading
```bash
# Check fonts are in assets
ls -R clients/or/assets/fonts/

# Rebuild
APP_LANG=or npx expo prebuild --clean
```

### Issue: Splash screen stuck
```bash
# The fix is already implemented in app/_layout.tsx
# Ensure you're testing the latest code
```

### Issue: Settings not persisting
```bash
# Clear app data and reinstall
adb shell pm clear com.gita.odia
adb install -r app-release.apk
```

---

## 📖 Documentation

- **Splash Crash Fix**: See `SPLASH_CRASH_FIX.md`
- **Project README**: See `README.md`
- **EAS Build**: https://docs.expo.dev/build/introduction/

---

## 🎯 Pre-Release Checklist

Before uploading to Play Store:

```bash
# 1. Update version numbers
# 2. Clean build
./gradlew clean

# 3. Build production AAB
APP_LANG=or eas build --platform android --profile or

# 4. Test on physical device
# 5. Check crash-free rate
# 6. Submit to Play Store
eas submit --platform android
```

---

**Last Updated**: October 16, 2025

